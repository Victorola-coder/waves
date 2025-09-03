import { prisma } from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "overview"; // overview, recent, top, recommendations
    const limit = parseInt(searchParams.get("limit") || "20");
    const period = searchParams.get("period") || "7day"; // 7day, 1month, 3month, 6month, 12month, overall

    // Get user's Last.fm connection
    const lastfmConnection = await prisma.connection.findFirst({
      where: {
        userId: user.id,
        provider: "lastfm",
      },
    });

    if (!lastfmConnection) {
      return NextResponse.json(
        { error: "Last.fm not connected" },
        { status: 400 }
      );
    }

    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

    if (!LASTFM_API_KEY) {
      return NextResponse.json(
        { error: "Last.fm API not configured" },
        { status: 500 }
      );
    }

    let lastfmData: any = {};

    switch (type) {
      case "overview":
        // Get user overview (recent tracks, top artists, etc.)
        const [recentTracks, topArtists, topTracks] = await Promise.all([
          fetchLastfmData("user.getrecenttracks", {
            user: lastfmConnection.refreshToken,
            limit: 5,
          }),
          fetchLastfmData("user.gettopartists", {
            user: lastfmConnection.refreshToken,
            period,
            limit: 5,
          }),
          fetchLastfmData("user.gettoptracks", {
            user: lastfmConnection.refreshToken,
            period,
            limit: 5,
          }),
        ]);

        lastfmData = {
          recentTracks: recentTracks.recenttracks?.track || [],
          topArtists: topArtists.topartists?.artist || [],
          topTracks: topTracks.toptracks?.track || [],
        };
        break;

      case "recent":
        // Get recent tracks
        const recentResponse = await fetchLastfmData("user.getrecenttracks", {
          user: lastfmConnection.refreshToken,
          limit,
        });
        lastfmData = {
          recentTracks: recentResponse.recenttracks?.track || [],
          total: recentResponse.recenttracks?.["@attr"]?.total || 0,
        };
        break;

      case "top":
        const topType = searchParams.get("topType") || "artists"; // artists, tracks, albums
        const topResponse = await fetchLastfmData(`user.gettop${topType}`, {
          user: lastfmConnection.refreshToken,
          period,
          limit,
        });
        lastfmData = {
          [`top${topType.charAt(0).toUpperCase() + topType.slice(1)}`]:
            topResponse[`top${topType}`]?.[topType] || [],
          period,
          total: topResponse[`top${topType}`]?.["@attr"]?.total || 0,
        };
        break;

      case "recommendations":
        // Get personalized recommendations based on user's listening history
        const recommendationsResponse = await fetchLastfmData(
          "user.getrecommendations",
          {
            user: lastfmConnection.refreshToken,
            limit,
          }
        );
        lastfmData = {
          recommendations: recommendationsResponse.recommendations?.track || [],
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      type,
      user: lastfmConnection.refreshToken, // username
      data: lastfmData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Last.fm user data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to fetch data from Last.fm API
async function fetchLastfmData(method: string, params: Record<string, any>) {
  const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

  const queryParams = new URLSearchParams({
    method,
    api_key: LASTFM_API_KEY!,
    format: "json",
    ...params,
  });

  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.status}`);
  }

  return response.json();
}

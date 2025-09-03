import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's Spotify connection
    const spotifyConnection = await prisma.connection.findFirst({
      where: {
        userId: user.id,
        provider: "spotify"
      }
    });

    if (!spotifyConnection) {
      return NextResponse.json(
        { error: "Spotify not connected" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (spotifyConnection.expiresAt && spotifyConnection.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Spotify token expired. Please reconnect." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "track";
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    if (!query) {
      return NextResponse.json(
        { error: "Search query required" },
        { status: 400 }
      );
    }

    // Search Spotify
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          "Authorization": `Bearer ${spotifyConnection.accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format tracks for our app
    const tracks = data.tracks?.items?.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      duration: track.duration_ms,
      uri: track.uri,
      popularity: track.popularity,
      explicit: track.explicit
    })) || [];

    return NextResponse.json({
      tracks,
      total: data.tracks?.total || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
      query
    });

  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

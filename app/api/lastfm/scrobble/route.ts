import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      artist,
      track,
      album,
      timestamp = Math.floor(Date.now() / 1000),
      duration,
    } = body;

    if (!artist || !track) {
      return NextResponse.json(
        { error: "Artist and track are required" },
        { status: 400 }
      );
    }

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

    // Check if user has scrobble permission
    const userScopes = lastfmConnection.scopes.split(",").map((s) => s.trim());
    if (!userScopes.includes("scrobble")) {
      return NextResponse.json(
        { error: "Insufficient Last.fm permissions. Scrobble scope required." },
        { status: 400 }
      );
    }

    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
    const LASTFM_SECRET = process.env.LASTFM_SECRET;

    if (!LASTFM_API_KEY || !LASTFM_SECRET) {
      return NextResponse.json(
        { error: "Last.fm API not configured" },
        { status: 500 }
      );
    }

    // Create the scrobble request to Last.fm
    const scrobbleData = new URLSearchParams({
      method: "track.scrobble",
      api_key: LASTFM_API_KEY,
      sk: lastfmConnection.accessToken, // Session key
      artist: artist,
      track: track,
      timestamp: timestamp.toString(),
      format: "json",
    });

    // Add optional fields
    if (album) {
      scrobbleData.append("album", album);
    }
    if (duration) {
      scrobbleData.append("duration", duration.toString());
    }

    // Send scrobble to Last.fm
    const scrobbleResponse = await fetch("https://ws.audioscrobbler.com/2.0/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: scrobbleData,
    });

    if (!scrobbleResponse.ok) {
      throw new Error(`Last.fm scrobble failed: ${scrobbleResponse.status}`);
    }

    const scrobbleResult = await scrobbleResponse.json();

    if (scrobbleResult.error) {
      return NextResponse.json(
        { error: `Last.fm scrobble error: ${scrobbleResult.message}` },
        { status: 400 }
      );
    }

    // Store the scrobble in our database for tracking
    const trackRecord = await prisma.track.upsert({
      where: {
        provider_providerTrackId: {
          provider: "lastfm",
          providerTrackId: `${artist}-${track}`,
        },
      },
      update: {},
      create: {
        provider: "lastfm",
        providerTrackId: `${artist}-${track}`,
        title: track,
        artist: artist,
        album: album || null,
        durationMs: duration ? duration * 1000 : 0,
        artworkUrl: null,
      },
    });

    // Create a scrobble record (you might want to add a Scrobble model to your schema)
    // For now, we'll just return success

    return NextResponse.json({
      message: "Track scrobbled successfully",
      scrobble: {
        artist,
        track,
        album,
        timestamp,
        duration,
        lastfmResponse: scrobbleResult,
      },
    });
  } catch (error) {
    console.error("Last.fm scrobble error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

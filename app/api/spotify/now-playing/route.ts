import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
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

    // Get user's Spotify connection
    const spotifyConnection = await prisma.connection.findFirst({
      where: {
        userId: user.id,
        provider: "spotify",
      },
    });

    if (!spotifyConnection) {
      return NextResponse.json(
        { error: "Spotify not connected" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (
      spotifyConnection.expiresAt &&
      spotifyConnection.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Spotify token expired. Please reconnect." },
        { status: 400 }
      );
    }

    // Check if user has required scopes (scopes is stored as comma-separated string)
    const requiredScopes = ["user-read-playback-state"];
    const userScopes = spotifyConnection.scopes
      .split(",")
      .map((s: string) => s.trim());
    const hasRequiredScopes = requiredScopes.every((scope) =>
      userScopes.includes(scope)
    );

    if (!hasRequiredScopes) {
      return NextResponse.json(
        {
          error:
            "Insufficient Spotify permissions. Please reconnect with required scopes.",
        },
        { status: 400 }
      );
    }

    // Get current playback from Spotify
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${spotifyConnection.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 204) {
        // No content - user not playing anything
        return NextResponse.json({
          isPlaying: false,
          message: "No track currently playing",
        });
      }

      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.item) {
      return NextResponse.json({
        isPlaying: false,
        message: "No track currently playing",
      });
    }

    const track = {
      id: data.item.id,
      name: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url,
      duration: data.item.duration_ms,
      progress: data.progress_ms,
      isPlaying: data.is_playing,
      uri: data.item.uri,
    };

    return NextResponse.json({
      isPlaying: true,
      track,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get now playing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

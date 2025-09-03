import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { randomUUID } from "crypto";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

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

    // Generate Spotify OAuth URL
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "playlist-read-private",
      "playlist-read-collaborative",
      "streaming",
    ];

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: SPOTIFY_REDIRECT_URI,
      scope: scopes.join(" "),
      state: user.id, // Pass user ID in state for security
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Spotify auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code required" },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Spotify token error:", tokenData);
      return NextResponse.json(
        { error: "Failed to get Spotify access token" },
        { status: 400 }
      );
    }

    // Get user profile from Spotify
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profileData = await profileResponse.json();

    // Upsert connection without unique composite key by manual find/update
    const existing = await prisma.connection.findFirst({
      where: {
        userId: user.id,
        provider: "spotify" as any,
      },
    });

    let connection;
    if (existing) {
      connection = await prisma.connection.update({
        where: { id: existing.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken:
            tokenData.refresh_token ?? existing.refreshToken ?? null,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          scopes: [
            "user-read-private",
            "user-read-email",
            "user-read-playback-state",
          ],
        },
      });
    } else {
      connection = await prisma.connection.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          provider: "spotify" as any,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token ?? null,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          scopes: [
            "user-read-private",
            "user-read-email",
            "user-read-playback-state",
          ],
        },
      });
    }

    return NextResponse.json({
      message: "Spotify connected successfully",
      connection: {
        id: connection.id,
        provider: connection.provider,
        scopes: connection.scopes,
        expiresAt: connection.expiresAt,
      },
    });
  } catch (error) {
    console.error("Spotify callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

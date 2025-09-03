import { randomUUID } from "crypto";
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

    // Generate Last.fm OAuth URL
    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
    const LASTFM_SECRET = process.env.LASTFM_SECRET;
    const LASTFM_CALLBACK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/lastfm/callback`;

    if (!LASTFM_API_KEY || !LASTFM_SECRET) {
      return NextResponse.json(
        { error: "Last.fm API not configured" },
        { status: 500 }
      );
    }

    // Generate a unique token for this auth session
    const authToken = randomUUID();

    // Store the auth token temporarily (in a real app, you'd use Redis or similar)
    // For now, we'll use the callback approach

    const authUrl = `https://www.last.fm/api/auth?api_key=${LASTFM_API_KEY}&cb=${encodeURIComponent(
      LASTFM_CALLBACK_URL
    )}`;

    return NextResponse.json({
      authUrl,
      message: "Redirect user to this URL to authorize Last.fm",
    });
  } catch (error) {
    console.error("Last.fm auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Handle Last.fm OAuth callback
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
    const { token: lastfmToken } = body;

    if (!lastfmToken) {
      return NextResponse.json(
        { error: "Last.fm token required" },
        { status: 400 }
      );
    }

    // Get Last.fm session using the token
    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
    const LASTFM_SECRET = process.env.LASTFM_SECRET;

    if (!LASTFM_API_KEY || !LASTFM_SECRET) {
      return NextResponse.json(
        { error: "Last.fm API not configured" },
        { status: 500 }
      );
    }

    // Get session info from Last.fm
    const sessionResponse = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${LASTFM_API_KEY}&token=${lastfmToken}&format=json`
    );

    if (!sessionResponse.ok) {
      throw new Error("Failed to get Last.fm session");
    }

    const sessionData = await sessionResponse.json();

    if (sessionData.error) {
      return NextResponse.json(
        { error: `Last.fm error: ${sessionData.message}` },
        { status: 400 }
      );
    }

    const {
      session: { key: sessionKey, name: username },
    } = sessionData;

    // Store or update Last.fm connection
    const existingConnection = await prisma.connection.findFirst({
      where: {
        userId: user.id,
        provider: "lastfm",
      },
    });

    let connection;
    if (existingConnection) {
      connection = await prisma.connection.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: sessionKey,
          refreshToken: username, // Store username as refresh token for Last.fm
          expiresAt: null, // Last.fm sessions don't expire
          scopes: "scrobble,read,user-read-private",
        },
      });
    } else {
      connection = await prisma.connection.create({
        data: {
          userId: user.id,
          provider: "lastfm",
          accessToken: sessionKey,
          refreshToken: username,
          expiresAt: null,
          scopes: "scrobble,read,user-read-private",
        },
      });
    }

    return NextResponse.json({
      message: "Last.fm connected successfully",
      connection: {
        id: connection.id,
        provider: connection.provider,
        username: username,
        scopes: connection.scopes,
      },
    });
  } catch (error) {
    console.error("Last.fm callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

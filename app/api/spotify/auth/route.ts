import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { randomUUID } from "crypto";
import { hashPassword } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

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
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/auth`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Spotify
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to get user info from Spotify");
    }

    const spotifyUser = await userResponse.json();

    // Find or create user in our database
    let user = await prisma.user.findFirst({
      where: {
        connections: {
          some: {
            provider: "spotify",
          },
        },
      },
    });

    if (!user) {
      // Create new user with a generated password hash
      const generatedPassword = randomUUID(); // Generate a random password
      const passwordHash = await hashPassword(generatedPassword);

      user = await prisma.user.create({
        data: {
          email: spotifyUser.email,
          passwordHash: passwordHash,
          displayName: spotifyUser.display_name,
          avatarUrl: spotifyUser.images?.[0]?.url,
        },
      });
    }

    // Store or update Spotify connection
    // For SQLite, we'll use a simple approach without composite unique constraints
    const existingConnection = await prisma.connection.findFirst({
      where: {
        userId: user.id,
        provider: "spotify",
      },
    });

    let connection;
    if (existingConnection) {
      connection = await prisma.connection.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          scopes: "user-read-private,user-read-email,user-read-playback-state",
        },
      });
    } else {
      connection = await prisma.connection.create({
        data: {
          userId: user.id,
          provider: "spotify",
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          scopes: "user-read-private,user-read-email,user-read-playback-state",
        },
      });
    }

    // Generate JWT token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Redirect to dashboard with token
    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.searchParams.set("token", token);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Spotify auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

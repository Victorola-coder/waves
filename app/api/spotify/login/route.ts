import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/auth`;

  if (
    !clientId ||
    !process.env.SPOTIFY_CLIENT_SECRET ||
    !process.env.NEXT_PUBLIC_APP_URL
  ) {
    return NextResponse.json(
      { error: "Spotify OAuth not configured. Missing env vars." },
      { status: 500 }
    );
  }

  const scope = [
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "streaming",
  ].join(" ");

  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scope);

  return NextResponse.redirect(authorizeUrl.toString());
}

import { NextRequest, NextResponse } from "next/server";
import { spotifyApi } from "@/app/lib/spotify";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/spotify?error=${error}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/spotify?error=no_code`
      );
    }

    try {
      // Exchange authorization code for access tokens
      const data = await spotifyApi.authorizationCodeGrant(code);

      const { access_token, refresh_token, expires_in, token_type } = data.body;

      // Set the access token on the Spotify API instance
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      // Get user profile from Spotify
      const me = await spotifyApi.getMe();
      const spotifyUserId = me.body.id;

      // Store tokens securely in spotify_tokens table
      // Note: In a real app, you'd need to get the current user context
      // For now, we'll redirect to a page where the user can complete the connection

      // The tokens will be stored when the user calls the /connect endpoint
      // This ensures we have the proper user context and authentication

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/spotify?success=true&spotify_id=${spotifyUserId}&access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`
      );
    } catch (tokenError) {
      console.error("Token exchange error:", tokenError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/spotify?error=token_exchange_failed`
      );
    }
  } catch (error) {
    console.error("Spotify callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/spotify?error=callback_failed`
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { spotifyApi } from "@/app/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user's refresh token from database
    const { data: spotifyTokens, error: tokenError } = await supabase
      .from("spotify_tokens")
      .select("refresh_token")
      .eq("user_id", user.id)
      .single();

    if (tokenError || !spotifyTokens) {
      return NextResponse.json(
        { error: "No Spotify tokens found" },
        { status: 404 }
      );
    }

    // Set the refresh token on the Spotify API instance
    spotifyApi.setRefreshToken(spotifyTokens.refresh_token);

    try {
      // Refresh the access token
      const data = await spotifyApi.refreshAccessToken();
      
      const {
        access_token,
        expires_in,
      } = data.body;

      // Update the stored tokens
      const { error: updateError } = await supabase
        .from("spotify_tokens")
        .update({
          access_token: access_token,
          expires_in: expires_in,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update tokens" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Token refreshed successfully",
        access_token: access_token,
        expires_in: expires_in,
      });

    } catch (refreshError) {
      console.error("Token refresh error:", refreshError);
      
      // If refresh fails, user needs to re-authenticate
      return NextResponse.json(
        { error: "Token refresh failed, re-authentication required" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

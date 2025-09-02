import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { spotify_id, access_token, refresh_token, expires_in } =
      await request.json();

    // Validate input
    if (!spotify_id || !access_token || !refresh_token) {
      return NextResponse.json(
        { error: "Missing required Spotify data" },
        { status: 400 }
      );
    }

    // Get authenticated user
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Update user's Spotify ID in the database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        spotify_id: spotify_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user profile" },
        { status: 500 }
      );
    }

    // Store tokens securely in spotify_tokens table
    const { error: tokenError } = await supabase.from("spotify_tokens").upsert({
      user_id: user.id,
      access_token: access_token,
      refresh_token: refresh_token,
      expires_in: expires_in,
      updated_at: new Date().toISOString(),
    });

    if (tokenError) {
      return NextResponse.json(
        { error: "Failed to store Spotify tokens" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Spotify account connected successfully",
      spotify_id: spotify_id,
    });
  } catch (error) {
    console.error("Connect Spotify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

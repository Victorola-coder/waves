import { NextRequest, NextResponse } from "next/server";
import { spotifyApi } from "@/app/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "track";
    const limit = searchParams.get("limit") || "20";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // For now, return a message that user needs to connect Spotify
    // In a real app, you'd check if user has connected Spotify and use their token
    return NextResponse.json({
      message: "Spotify connection required for music search",
      tracks: [],
      total: 0,
    });

    // TODO: Implement actual Spotify search when user has connected their account
    // const searchResults = await spotifyApi.search(query, [type as any], {
    //   limit: parseInt(limit),
    // })
    // ... rest of the search logic
  } catch (error) {
    console.error("Music search error:", error);
    return NextResponse.json(
      { error: "Failed to search music" },
      { status: 500 }
    );
  }
}

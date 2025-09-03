import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "track"; // track, artist, album
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    if (!query) {
      return NextResponse.json(
        { error: "Search query required" },
        { status: 400 }
      );
    }

    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

    if (!LASTFM_API_KEY) {
      return NextResponse.json(
        { error: "Last.fm API not configured" },
        { status: 500 }
      );
    }

    // Search Last.fm based on type
    let searchMethod: string;
    let resultKey: string;

    switch (type) {
      case "track":
        searchMethod = "track.search";
        resultKey = "results.trackmatches.track";
        break;
      case "artist":
        searchMethod = "artist.search";
        resultKey = "results.artistmatches.artist";
        break;
      case "album":
        searchMethod = "album.search";
        resultKey = "results.albummatches.album";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid search type" },
          { status: 400 }
        );
    }

    const lastfmQueryParams = new URLSearchParams();
    lastfmQueryParams.append("method", searchMethod);
    lastfmQueryParams.append("api_key", LASTFM_API_KEY);
    lastfmQueryParams.append("limit", limit.toString());
    lastfmQueryParams.append("page", page.toString());
    lastfmQueryParams.append("format", "json");

    // Add type-specific parameters
    if (type === "track") {
      lastfmQueryParams.append("track", query);
    } else if (type === "artist") {
      lastfmQueryParams.append("artist", query);
    } else if (type === "album") {
      lastfmQueryParams.append("album", query);
    }

    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?${lastfmQueryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Last.fm search error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: `Last.fm error: ${data.message}` },
        { status: 400 }
      );
    }

    // Extract results based on type
    const results = getNestedValue(data, resultKey) || [];
    const totalResults =
      getNestedValue(data, "results.opensearch:totalResults") || "0";
    const itemsPerPage =
      getNestedValue(data, "results.opensearch:itemsPerPage") || "0";

    // Format results for consistency
    const formattedResults = results.map((item: any) => {
      switch (type) {
        case "track":
          return {
            id: item.mbid || item.name + "-" + item.artist,
            title: item.name,
            artist: item.artist,
            album: item.album || null,
            duration: null, // Last.fm doesn't provide duration in search
            artworkUrl: item.image?.[2]?.["#text"] || null, // Medium size image
            url: item.url,
            listeners: item.listeners,
            match: item.match,
          };
        case "artist":
          return {
            id: item.mbid || item.name,
            name: item.name,
            listeners: item.listeners,
            artworkUrl: item.image?.[2]?.["#text"] || null,
            url: item.url,
            match: item.match,
          };
        case "album":
          return {
            id: item.mbid || item.name + "-" + item.artist,
            title: item.name,
            artist: item.artist,
            artworkUrl: item.image?.[2]?.["#text"] || null,
            url: item.url,
            match: item.match,
          };
        default:
          return item;
      }
    });

    return NextResponse.json({
      query,
      type,
      results: formattedResults,
      pagination: {
        page,
        limit,
        total: parseInt(totalResults),
        itemsPerPage: parseInt(itemsPerPage),
        totalPages: Math.ceil(parseInt(totalResults) / limit),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Last.fm search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to get nested object values safely
function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

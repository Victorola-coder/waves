import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const isPrivate = searchParams.get("private");

    // Build query
    let query = supabase
      .from("listening_rooms")
      .select(
        `
        *,
        host:users!listening_rooms_host_id_fkey(username, avatar_url),
        participants:room_participants(count)
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (isPrivate !== null) {
      query = query.eq("is_private", isPrivate === "true");
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: rooms, error, count } = await query;

    if (error) {
      console.error("List rooms error:", error);
      return NextResponse.json(
        { error: "Failed to fetch rooms" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      rooms: rooms || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("List rooms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

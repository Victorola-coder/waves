import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { room_id } = await request.json();

    // Validate input
    if (!room_id) {
      return NextResponse.json(
        { error: "Room ID is required" },
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

    // Check if room exists and is not full
    const { data: room, error: roomError } = await supabase
      .from("listening_rooms")
      .select("*")
      .eq("id", room_id)
      .single();

    if (roomError || !room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is already in the room
    const { data: existingParticipant } = await supabase
      .from("room_participants")
      .select("*")
      .eq("room_id", room_id)
      .eq("user_id", user.id)
      .single();

    if (existingParticipant) {
      return NextResponse.json({ error: "Already in room" }, { status: 409 });
    }

    // Check if room is full
    const { count: participantCount } = await supabase
      .from("room_participants")
      .select("*", { count: "exact", head: true })
      .eq("room_id", room_id)
      .eq("is_active", true);

    if (participantCount && participantCount >= room.max_participants) {
      return NextResponse.json({ error: "Room is full" }, { status: 409 });
    }

    // Join room
    const { error: joinError } = await supabase
      .from("room_participants")
      .insert({
        room_id,
        user_id: user.id,
        role: "listener",
        joined_at: new Date().toISOString(),
        is_active: true,
      });

    if (joinError) {
      return NextResponse.json(
        { error: "Failed to join room" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Joined room successfully",
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        current_track_id: room.current_track_id,
        is_playing: room.is_playing,
      },
    });
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

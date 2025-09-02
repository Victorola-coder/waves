import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;

    // Get room details with host and participant info
    const { data: room, error: roomError } = await supabase
      .from("listening_rooms")
      .select(
        `
        *,
        host:users!listening_rooms_host_id_fkey(
          id,
          username,
          avatar_url,
          is_verified
        ),
        participants:room_participants(
          id,
          user_id,
          role,
          joined_at,
          is_active,
          user:users(
            id,
            username,
            avatar_url,
            is_verified
          )
        )
      `
      )
      .eq("id", roomId)
      .single();

    if (roomError || !room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Get current track info if playing
    let currentTrack = null;
    if (room.current_track_id) {
      const { data: track } = await supabase
        .from("music_tracks")
        .select("*")
        .eq("id", room.current_track_id)
        .single();
      currentTrack = track;
    }

    // Get recent messages
    const { data: messages } = await supabase
      .from("room_messages")
      .select(
        `
        *,
        user:users(username, avatar_url)
      `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      room: {
        ...room,
        current_track: currentTrack,
        recent_messages: messages || [],
        participant_count:
          room.participants?.filter((p: any) => p.is_active).length || 0,
      },
    });
  } catch (error) {
    console.error("Get room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;
    const { name, description, max_participants, is_private } =
      await request.json();

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

    // Check if user is the host
    const { data: room } = await supabase
      .from("listening_rooms")
      .select("host_id")
      .eq("id", roomId)
      .single();

    if (!room || room.host_id !== user.id) {
      return NextResponse.json(
        { error: "Only the host can modify this room" },
        { status: 403 }
      );
    }

    // Update room
    const { data: updatedRoom, error: updateError } = await supabase
      .from("listening_rooms")
      .update({
        name,
        description,
        max_participants,
        is_private,
        updated_at: new Date().toISOString(),
      })
      .eq("id", roomId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update room" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Update room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;

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

    // Check if user is the host
    const { data: room } = await supabase
      .from("listening_rooms")
      .select("host_id")
      .eq("id", roomId)
      .single();

    if (!room || room.host_id !== user.id) {
      return NextResponse.json(
        { error: "Only the host can delete this room" },
        { status: 403 }
      );
    }

    // Delete room (cascades to participants, messages, etc.)
    const { error: deleteError } = await supabase
      .from("listening_rooms")
      .delete()
      .eq("id", roomId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete room" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

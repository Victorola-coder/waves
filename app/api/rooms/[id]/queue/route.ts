import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;

    // Get room queue with track details
    const { data: queue, error } = await supabase
      .from("room_queue")
      .select(`
        *,
        track:music_tracks(*),
        added_by:users(username, avatar_url)
      `)
      .eq("room_id", roomId)
      .order("position", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch queue" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      queue: queue || [],
    });
  } catch (error) {
    console.error("Get queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;
    const { track_id } = await request.json();

    if (!track_id) {
      return NextResponse.json(
        { error: "Track ID is required" },
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

    // Check if user is in the room
    const { data: participant } = await supabase
      .from("room_participants")
      .select("id")
      .eq("room_id", roomId)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "You must be in the room to add tracks" },
        { status: 403 }
      );
    }

    // Get the next position in queue
    const { data: lastTrack } = await supabase
      .from("room_queue")
      .select("position")
      .eq("room_id", roomId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (lastTrack?.position || 0) + 1;

    // Add track to queue
    const { data: queueItem, error: addError } = await supabase
      .from("room_queue")
      .insert({
        room_id: roomId,
        track_id,
        position: nextPosition,
        added_by: user.id,
        added_at: new Date().toISOString(),
      })
      .select(`
        *,
        track:music_tracks(*),
        added_by:users(username, avatar_url)
      `)
      .single();

    if (addError) {
      return NextResponse.json(
        { error: "Failed to add track to queue" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Track added to queue",
      queue_item: queueItem,
    });
  } catch (error) {
    console.error("Add to queue error:", error);
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
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("track_id");

    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
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

    // Check if user is the host or added the track
    const { data: queueItem } = await supabase
      .from("room_queue")
      .select("added_by")
      .eq("id", trackId)
      .single();

    if (!queueItem) {
      return NextResponse.json(
        { error: "Track not found in queue" },
        { status: 404 }
      );
    }

    // Check if user is host
    const { data: room } = await supabase
      .from("listening_rooms")
      .select("host_id")
      .eq("id", roomId)
      .single();

    const isHost = room?.host_id === user.id;
    const isTrackOwner = queueItem.added_by === user.id;

    if (!isHost && !isTrackOwner) {
      return NextResponse.json(
        { error: "You can only remove tracks you added" },
        { status: 403 }
      );
    }

    // Remove track from queue
    const { error: deleteError } = await supabase
      .from("room_queue")
      .delete()
      .eq("id", trackId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to remove track from queue" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Track removed from queue",
    });
  } catch (error) {
    console.error("Remove from queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

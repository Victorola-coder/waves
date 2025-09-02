import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(
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

    // Check if user is in the room
    const { data: participant } = await supabase
      .from("room_participants")
      .select("id, role")
      .eq("room_id", roomId)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "You are not in this room" },
        { status: 400 }
      );
    }

    // If user is the host, they cannot leave (must delete room instead)
    if (participant.role === "host") {
      return NextResponse.json(
        { error: "Host cannot leave room. Delete the room instead." },
        { status: 400 }
      );
    }

    // Mark user as left
    const { error: leaveError } = await supabase
      .from("room_participants")
      .update({
        is_active: false,
        left_at: new Date().toISOString(),
      })
      .eq("id", participant.id);

    if (leaveError) {
      return NextResponse.json(
        { error: "Failed to leave room" },
        { status: 500 }
      );
    }

    // Add system message about user leaving
    await supabase.from("room_messages").insert({
      room_id: roomId,
      user_id: user.id,
      content: "left the room",
      message_type: "system",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Successfully left the room",
    });
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

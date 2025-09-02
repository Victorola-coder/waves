import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { room_id } = await request.json();

    if (!room_id) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Resolve user (dev header or Supabase auth)
    let userId: string | null = null;
    const devUserId = request.headers.get("x-user-id");
    if (process.env.NODE_ENV !== "production" && devUserId) {
      userId = devUserId;
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: `${userId}@dev.local`,
          username: `dev_${userId.substring(0, 6)}`,
        },
      });
    } else {
      const authHeader = request.headers.get("authorization");
      if (!authHeader)
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: authError } = await supabase.auth.getUser(
        token
      );
      const user = userData?.user;
      if (authError || !user)
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      userId = user.id;
      await prisma.user.upsert({
        where: { id: userId },
        update: { email: user.email ?? undefined },
        create: {
          id: userId,
          email: user.email || `${userId}@user.local`,
          username:
            user.email?.split("@")[0] || `user_${userId.substring(0, 6)}`,
        },
      });
    }

    // Room exists?
    const room = await prisma.listeningRoom.findUnique({
      where: { id: room_id },
    });
    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    // Already participant?
    const existing = await prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId: room_id, userId } },
    });
    if (existing)
      return NextResponse.json({ error: "Already in room" }, { status: 409 });

    // Count active participants
    const activeCount = await prisma.roomParticipant.count({
      where: { roomId: room_id, isActive: true },
    });
    if (activeCount >= room.capacity)
      return NextResponse.json({ error: "Room is full" }, { status: 409 });

    // Join as GUEST
    await prisma.roomParticipant.create({
      data: { roomId: room_id, userId, role: "GUEST", isActive: true },
    });

    return NextResponse.json({
      message: "Joined room successfully",
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        current_track_id: room.currentTrackId,
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

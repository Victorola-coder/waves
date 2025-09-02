import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { supabase } from "@/app/lib/supabase";

async function resolveUserId(request: NextRequest): Promise<string | null> {
  const devUserId = request.headers.get("x-user-id");
  if (process.env.NODE_ENV !== "production" && devUserId) {
    await prisma.user.upsert({
      where: { id: devUserId },
      update: {},
      create: {
        id: devUserId,
        email: `${devUserId}@dev.local`,
        username: `dev_${devUserId.substring(0, 6)}`,
      },
    });
    return devUserId;
  }
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await supabase.auth.getUser(token);
  const user = userData?.user;
  if (!user) return null;
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email ?? undefined },
    create: {
      id: user.id,
      email: user.email || `${user.id}@user.local`,
      username: user.email?.split("@")[0] || `user_${user.id.substring(0, 6)}`,
    },
  });
  return user.id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;

    const room = await prisma.listeningRoom.findUnique({
      where: { id: roomId },
      include: {
        host: { select: { id: true, username: true, avatarUrl: true } },
        participants: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
      },
    });
    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    // recent messages
    const messages = await prisma.message.findMany({
      where: { roomId },
      include: { user: { select: { username: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      room: {
        ...room,
        current_track: room.currentTrackId
          ? await prisma.track.findUnique({
              where: { id: room.currentTrackId },
            })
          : null,
        recent_messages: messages,
        participant_count: room.participants.filter((p) => p.isActive).length,
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

    const userId = await resolveUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const room = await prisma.listeningRoom.findUnique({
      where: { id: roomId },
      select: { hostId: true },
    });
    if (!room || room.hostId !== userId) {
      return NextResponse.json(
        { error: "Only the host can modify this room" },
        { status: 403 }
      );
    }

    const updated = await prisma.listeningRoom.update({
      where: { id: roomId },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        capacity:
          typeof max_participants === "number" ? max_participants : undefined,
        isPrivate: typeof is_private === "boolean" ? is_private : undefined,
      },
    });

    return NextResponse.json({
      message: "Room updated successfully",
      room: updated,
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

    const userId = await resolveUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const room = await prisma.listeningRoom.findUnique({
      where: { id: roomId },
      select: { hostId: true },
    });
    if (!room || room.hostId !== userId) {
      return NextResponse.json(
        { error: "Only the host can delete this room" },
        { status: 403 }
      );
    }

    await prisma.listeningRoom.delete({ where: { id: roomId } });

    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

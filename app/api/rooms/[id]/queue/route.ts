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
    const queue = await prisma.roomQueue.findMany({
      where: { roomId },
      orderBy: { position: "asc" },
      include: {
        track: true,
        addedBy: { select: { username: true, avatarUrl: true } },
      },
    });
    return NextResponse.json({ queue });
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

    if (!track_id)
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );

    const userId = await resolveUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    // Must be active participant
    const isParticipant = await prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId, userId } },
      select: { id: true, isActive: true },
    });
    if (!isParticipant || !isParticipant.isActive)
      return NextResponse.json(
        { error: "You must be in the room to add tracks" },
        { status: 403 }
      );

    const last = await prisma.roomQueue.findFirst({
      where: { roomId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const nextPosition = (last?.position || 0) + 1;

    // Track must exist; for now we trust client-provided track_id
    const queueItem = await prisma.roomQueue.create({
      data: {
        roomId,
        trackId: track_id,
        position: nextPosition,
        addedById: userId,
      },
      include: {
        track: true,
        addedBy: { select: { username: true, avatarUrl: true } },
      },
    });

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
    if (!trackId)
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );

    const userId = await resolveUserId(request);
    if (!userId)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const queueItem = await prisma.roomQueue.findUnique({
      where: { id: trackId },
      select: { addedById: true, roomId: true },
    });
    if (!queueItem || queueItem.roomId !== roomId)
      return NextResponse.json(
        { error: "Track not found in queue" },
        { status: 404 }
      );

    const room = await prisma.listeningRoom.findUnique({
      where: { id: roomId },
      select: { hostId: true },
    });
    const isHost = room?.hostId === userId;
    const isTrackOwner = queueItem.addedById === userId;
    if (!isHost && !isTrackOwner)
      return NextResponse.json(
        { error: "You can only remove tracks you added" },
        { status: 403 }
      );

    await prisma.roomQueue.delete({ where: { id: trackId } });

    return NextResponse.json({ message: "Track removed from queue" });
  } catch (error) {
    console.error("Remove from queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

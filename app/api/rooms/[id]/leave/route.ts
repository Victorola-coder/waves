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

export async function POST(
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

    const participant = await prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!participant || !participant.isActive) {
      return NextResponse.json(
        { error: "You are not in this room" },
        { status: 400 }
      );
    }

    if (participant.role === "HOST") {
      return NextResponse.json(
        { error: "Host cannot leave room. Delete the room instead." },
        { status: 400 }
      );
    }

    await prisma.roomParticipant.update({
      where: { roomId_userId: { roomId, userId } },
      data: { isActive: false, leftAt: new Date() },
    });

    await prisma.message.create({
      data: { roomId, userId, type: "SYSTEM", content: "left the room" },
    });

    return NextResponse.json({ message: "Successfully left the room" });
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

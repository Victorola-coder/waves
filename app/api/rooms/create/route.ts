import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name: string | undefined = body?.name;
    const description: string | undefined = body?.description ?? undefined;
    const is_private: boolean = Boolean(body?.is_private ?? false);
    const max_participants: number | undefined = body?.max_participants;

    if (!name) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // Dev bypass: allow X-User-Id when not in production
    const devUserId = request.headers.get("x-user-id");
    let userId: string | null = null;
    if (process.env.NODE_ENV !== "production" && devUserId) {
      userId = devUserId;
      // Ensure a user exists for this id
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
      // Auth via Supabase token
      const authHeader = request.headers.get("authorization");
      if (!authHeader) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: authError } = await supabase.auth.getUser(
        token
      );
      const user = userData?.user;
      if (authError || !user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      userId = user.id;
      // Ensure user exists in our DB
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: user.email ?? undefined,
        },
        create: {
          id: userId,
          email: user.email || `${userId}@user.local`,
          username:
            user.user_metadata?.user_name ||
            user.email?.split("@")[0] ||
            `user_${userId.substring(0, 6)}`,
        },
      });
    }

    // Create room with Prisma
    const room = await prisma.listeningRoom.create({
      data: {
        name,
        description,
        hostId: userId!,
        isPrivate: is_private,
        capacity: typeof max_participants === "number" ? max_participants : 50,
      },
    });

    // Add host as participant
    await prisma.roomParticipant.create({
      data: {
        roomId: room.id,
        userId: userId!,
        role: "HOST",
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Room created successfully",
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        host_id: room.hostId,
        max_participants: room.capacity,
        is_private: room.isPrivate,
        created_at: room.createdAt,
      },
    });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

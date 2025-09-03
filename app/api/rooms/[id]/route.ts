import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const roomId = id;
    const userId = decoded.userId;

    // Get room with all related data
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        host: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        queue: {
          include: {
            track: {
              select: {
                id: true,
                title: true,
                artist: true,
                album: true,
                durationMs: true,
                artworkUrl: true,
              },
            },
            addedBy: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
          orderBy: { position: "asc" },
        },
        _count: {
          select: {
            members: true,
            queue: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is a member of this room
    const isMember = room.members.some((member) => member.userId === userId);
    if (!isMember && room.isPrivate) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Format the response
    const formattedRoom = {
      id: room.id,
      name: room.name,
      isPrivate: room.isPrivate,
      status: room.status,
      host: {
        id: room.host.id,
        displayName: room.host.displayName || "Unknown User",
        avatarUrl: room.host.avatarUrl,
      },
      members: room.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        username: member.user.displayName || "Unknown User",
        avatar: member.user.avatarUrl || "/api/placeholder/40/40",
        role: member.role,
        isOnline: true, // TODO: Implement real-time online status
        isSpeaking: false, // TODO: Implement voice activity detection
      })),
      queue: room.queue.map((item) => ({
        id: item.id,
        title: item.track.title,
        artist: item.track.artist,
        album: item.track.album || "Unknown Album",
        duration: formatDuration(item.track.durationMs),
        artworkUrl: item.track.artworkUrl || "/api/placeholder/64/64",
        addedBy: item.addedBy.displayName || "Unknown User",
        position: item.position,
      })),
      memberCount: room._count.members,
      queueCount: room._count.queue,
      createdAt: room.createdAt,
    };

    return NextResponse.json({ room: formattedRoom });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Join room
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId: decoded.userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Already a member of this room" },
        { status: 400 }
      );
    }

    // Join room
    const member = await prisma.roomMember.create({
      data: {
        roomId: id,
        userId: decoded.userId,
        role: "listener",
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Leave room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member
    const member = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId: decoded.userId,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Not a member of this room" },
        { status: 400 }
      );
    }

    // Check if user is the host
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (room?.hostId === decoded.userId) {
      return NextResponse.json(
        {
          error:
            "Host cannot leave room. Transfer ownership or delete room instead.",
        },
        { status: 400 }
      );
    }

    // Leave room
    await prisma.roomMember.update({
      where: {
        id: member.id,
      },
      data: {
        leftAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Left room successfully" });
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

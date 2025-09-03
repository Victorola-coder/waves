import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { randomUUID } from "crypto";

// Get room details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
              }
            }
          }
        },
        queue: {
          include: {
            track: true,
            addedBy: {
              select: {
                id: true,
                displayName: true,
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        _count: {
          select: {
            members: true,
            queue: true,
          }
        }
      }
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(room);

  } catch (error) {
    console.error("Get room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id }
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId: user.id
        }
      }
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
        id: randomUUID(),
        roomId: id,
        userId: user.id,
        role: "listener",
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a member
    const member = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId: user.id
        }
      }
    });

    if (!member) {
      return NextResponse.json(
        { error: "Not a member of this room" },
        { status: 400 }
      );
    }

    // Check if user is the host
    const room = await prisma.room.findUnique({
      where: { id }
    });

    if (room?.hostId === user.id) {
      return NextResponse.json(
        { error: "Host cannot leave room. Transfer ownership or delete room instead." },
        { status: 400 }
      );
    }

    // Leave room
    await prisma.roomMember.update({
      where: {
        id: member.id
      },
      data: {
        leftAt: new Date()
      }
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

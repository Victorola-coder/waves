import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

// Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        connections: {
          select: {
            id: true,
            provider: true,
            scopes: true,
            expiresAt: true,
          }
        },
        rooms: {
          where: {
            status: "active"
          },
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            rooms: true,
            memberships: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { email, ...safeUser } = user;

    return NextResponse.json(safeUser);

  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(
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
    const currentUser = await getUserFromToken(token);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Users can only update their own profile
    if (currentUser.id !== id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { displayName, avatarUrl } = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        displayName,
        avatarUrl,
      },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Update user error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

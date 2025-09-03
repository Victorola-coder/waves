import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // all, following, followers, suggestions

    let friendsData: any[] = [];

    switch (type) {
      case "following":
        // Mock data for now - would come from Follow table
        friendsData = await getMockFollowing(user.id);
        break;
      
      case "followers":
        friendsData = await getMockFollowers(user.id);
        break;
      
      case "suggestions":
        friendsData = await getMockSuggestions(user.id);
        break;
      
      default:
        // Return all friends
        const following = await getMockFollowing(user.id);
        const followers = await getMockFollowers(user.id);
        friendsData = [...following, ...followers];
        break;
    }

    return NextResponse.json({
      friends: friendsData,
      type,
      total: friendsData.length
    });

  } catch (error) {
    console.error("Friends error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Follow a user
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID required" },
        { status: 400 }
      );
    }

    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    // In real app, this would check a Follow table
    const isAlreadyFollowing = false; // Mock for now

    if (isAlreadyFollowing) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // In real app, this would create a Follow record
    // For now, return success
    return NextResponse.json({
      message: "Followed successfully",
      following: true
    });

  } catch (error) {
    console.error("Follow user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Unfollow a user
export async function DELETE(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID required" },
        { status: 400 }
      );
    }

    // In real app, this would delete a Follow record
    // For now, return success
    return NextResponse.json({
      message: "Unfollowed successfully",
      following: false
    });

  } catch (error) {
    console.error("Unfollow user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock functions for now
async function getMockFollowing(userId: string) {
  const users = await prisma.user.findMany({
    take: 10,
    where: {
      id: { not: userId }
    },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    }
  });

  return users.map(user => ({
    id: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    status: "online", // Mock status
    lastSeen: new Date().toISOString(),
    mutualFriends: Math.floor(Math.random() * 5) + 1
  }));
}

async function getMockFollowers(userId: string) {
  const users = await prisma.user.findMany({
    take: 8,
    where: {
      id: { not: userId }
    },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    }
  });

  return users.map(user => ({
    id: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    status: "online", // Mock status
    lastSeen: new Date().toISOString(),
    mutualFriends: Math.floor(Math.random() * 3) + 1
  }));
}

async function getMockSuggestions(userId: string) {
  const users = await prisma.user.findMany({
    take: 15,
    where: {
      id: { not: userId }
    },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    }
  });

  return users.map(user => ({
    id: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    mutualFriends: Math.floor(Math.random() * 8) + 1,
    reason: "You have mutual friends" // Mock reason
  }));
}

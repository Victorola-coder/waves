import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { verifyToken } from "../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.userId;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // all, following, followers, suggestions

    let friendsData: any[] = [];

    switch (type) {
      case "following":
        friendsData = await getFollowing(userId);
        break;

      case "followers":
        friendsData = await getFollowers(userId);
        break;

      case "suggestions":
        friendsData = await getSuggestions(userId);
        break;

      default:
        // Return all friends
        const following = await getFollowing(userId);
        const followers = await getFollowers(userId);
        friendsData = [...following, ...followers];
        break;
    }

    return NextResponse.json({
      friends: friendsData,
      type,
      total: friendsData.length,
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = decoded.userId;
    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID required" },
        { status: 400 }
      );
    }

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingConnection = await prisma.socialConnection.findFirst({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // Create the follow relationship
    await prisma.socialConnection.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
        status: "accepted",
      },
    });

    return NextResponse.json({
      message: "Followed successfully",
      following: true,
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = decoded.userId;
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID required" },
        { status: 400 }
      );
    }

    // Delete the follow relationship
    await prisma.socialConnection.deleteMany({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    return NextResponse.json({
      message: "Unfollowed successfully",
      following: false,
    });
  } catch (error) {
    console.error("Unfollow user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Real functions using SocialConnection model
async function getFollowing(userId: string) {
  const connections = await prisma.socialConnection.findMany({
    where: {
      followerId: userId,
      status: "accepted",
    },
    include: {
      following: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  });

  return connections.map((conn) => ({
    id: conn.following.id,
    displayName: conn.following.displayName || "Anonymous User",
    avatarUrl: conn.following.avatarUrl,
    status: "online", // Could be enhanced with real status tracking
    lastSeen: new Date().toISOString(),
    followedAt: conn.createdAt.toISOString(),
    mutualFriends: 0, // Could be calculated with additional queries
  }));
}

async function getFollowers(userId: string) {
  const connections = await prisma.socialConnection.findMany({
    where: {
      followingId: userId,
      status: "accepted",
    },
    include: {
      follower: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  });

  return connections.map((conn) => ({
    id: conn.follower.id,
    displayName: conn.follower.displayName || "Anonymous User",
    avatarUrl: conn.follower.avatarUrl,
    status: "online", // Could be enhanced with real status tracking
    lastSeen: new Date().toISOString(),
    followedAt: conn.createdAt.toISOString(),
    mutualFriends: 0, // Could be calculated with additional queries
  }));
}

async function getSuggestions(userId: string) {
  // Get users who are not already followed by the current user
  const followingIds = await prisma.socialConnection.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIdSet = new Set(followingIds.map((f) => f.followingId));
  followingIdSet.add(userId); // Exclude self

  const users = await prisma.user.findMany({
    take: 15,
    where: {
      id: { notIn: Array.from(followingIdSet) },
    },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  return users.map((user) => ({
    id: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    mutualFriends: 0, // Could be calculated with additional queries
    reason: "Suggested for you",
  }));
}

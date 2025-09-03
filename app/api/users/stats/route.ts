import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export async function GET(request: NextRequest) {
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

    const userId = decoded.userId;

    // Get user stats
    const [totalRooms, totalMemberships, recentActivity] = await Promise.all([
      // Total rooms created
      prisma.room.count({
        where: { hostId: userId },
      }),

      // Total room memberships
      prisma.roomMember.count({
        where: { userId },
      }),

      // Recent activity (last 10 activities)
      prisma.roomMember.findMany({
        where: { userId },
        include: {
          room: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
        },
        orderBy: { joinedAt: "desc" },
        take: 10,
      }),
    ]);

    // Calculate level and XP (simple formula)
    const baseXP = totalRooms * 100 + totalMemberships * 50;
    const level = Math.floor(baseXP / 1000) + 1;
    const currentLevelXP = baseXP % 1000;
    const nextLevelXP = 1000;

    // Format recent activity
    const formattedActivity = recentActivity.map(
      (membership: any, index: number) => ({
        type: "joined_room",
        title: membership.room.name,
        time: getTimeAgo(membership.joinedAt),
        icon: "Users",
        roomId: membership.room.id,
      })
    );

    const stats = {
      totalRooms,
      totalMemberships,
      totalAchievements: 0, // No achievements model yet
      followers: 0, // No social connections model yet
      following: 0, // No social connections model yet
      level,
      xp: currentLevelXP,
      nextLevelXp: nextLevelXP,
      recentActivity: formattedActivity,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

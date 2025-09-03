import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { verifyToken } from "../../lib/auth";

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

    // Get user stats for achievement calculations
    const [
      totalRooms,
      totalMemberships,
      totalTime,
      totalConnections,
      joinDate
    ] = await Promise.all([
      // Total rooms hosted
      prisma.room.count({
        where: { hostId: userId }
      }),
      
      // Total room memberships
      prisma.roomMember.count({
        where: { userId }
      }),
      
      // Total time estimate (using memberships as proxy)
      prisma.roomMember.count({
        where: { userId }
      }),
      
      // Total music platform connections
      prisma.connection.count({
        where: { userId }
      }),
      
      // User join date
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true }
      })
    ]);

    // Calculate achievements based on user stats
    const achievements = [
      // Listening achievements
      {
        id: "1",
        code: "FIRST_LISTEN",
        name: "First Steps",
        description: "Listen to your first track",
        icon: "🎵",
        category: "listening",
        threshold: 1,
        progress: Math.min(totalMemberships, 1),
        isUnlocked: totalMemberships >= 1,
        unlockedAt: totalMemberships >= 1 ? joinDate?.createdAt : undefined,
        rarity: "common" as const,
        xpReward: 10,
      },
      {
        id: "2",
        code: "MUSIC_EXPLORER",
        name: "Music Explorer",
        description: "Listen to 100 different tracks",
        icon: "🔍",
        category: "listening",
        threshold: 100,
        progress: Math.min(totalMemberships, 100),
        isUnlocked: totalMemberships >= 100,
        unlockedAt: totalMemberships >= 100 ? joinDate?.createdAt : undefined,
        rarity: "rare" as const,
        xpReward: 50,
      },
      {
        id: "3",
        code: "MUSIC_MASTER",
        name: "Music Master",
        description: "Listen to 1000 different tracks",
        icon: "🎭",
        category: "listening",
        threshold: 1000,
        progress: Math.min(totalMemberships, 1000),
        isUnlocked: totalMemberships >= 1000,
        unlockedAt: totalMemberships >= 1000 ? joinDate?.createdAt : undefined,
        rarity: "epic" as const,
        xpReward: 200,
      },
      
      // Social achievements
      {
        id: "4",
        code: "FIRST_ROOM",
        name: "Room Creator",
        description: "Create your first listening room",
        icon: "🏠",
        category: "social",
        threshold: 1,
        progress: Math.min(totalRooms, 1),
        isUnlocked: totalRooms >= 1,
        unlockedAt: totalRooms >= 1 ? joinDate?.createdAt : undefined,
        rarity: "common" as const,
        xpReward: 25,
      },
      {
        id: "5",
        code: "ROOM_HOST",
        name: "Room Host",
        description: "Create 10 listening rooms",
        icon: "👑",
        category: "social",
        threshold: 10,
        progress: Math.min(totalRooms, 10),
        isUnlocked: totalRooms >= 10,
        unlockedAt: totalRooms >= 10 ? joinDate?.createdAt : undefined,
        rarity: "rare" as const,
        xpReward: 100,
      },
      {
        id: "6",
        code: "SOCIAL_BUTTERFLY",
        name: "Social Butterfly",
        description: "Join 50 different rooms",
        icon: "🦋",
        category: "social",
        threshold: 50,
        progress: Math.min(totalMemberships, 50),
        isUnlocked: totalMemberships >= 50,
        unlockedAt: totalMemberships >= 50 ? joinDate?.createdAt : undefined,
        rarity: "epic" as const,
        xpReward: 150,
      },
      
      // Hosting achievements
      {
        id: "7",
        code: "HOST_MASTER",
        name: "Host Master",
        description: "Host 25 listening rooms",
        icon: "🎪",
        category: "hosting",
        threshold: 25,
        progress: Math.min(totalRooms, 25),
        isUnlocked: totalRooms >= 25,
        unlockedAt: totalRooms >= 25 ? joinDate?.createdAt : undefined,
        rarity: "epic" as const,
        xpReward: 300,
      },
      {
        id: "8",
        code: "LEGENDARY_HOST",
        name: "Legendary Host",
        description: "Host 100 listening rooms",
        icon: "🌟",
        category: "hosting",
        threshold: 100,
        progress: Math.min(totalRooms, 100),
        isUnlocked: totalRooms >= 100,
        unlockedAt: totalRooms >= 100 ? joinDate?.createdAt : undefined,
        rarity: "legendary" as const,
        xpReward: 500,
      },
      
      // Time achievements
      {
        id: "9",
        code: "FIRST_WEEK",
        name: "Week Warrior",
        description: "Use the platform for 7 days",
        icon: "📅",
        category: "time",
        threshold: 7,
        progress: Math.min(Math.floor((Date.now() - (joinDate?.createdAt?.getTime() || 0)) / (1000 * 60 * 60 * 24)), 7),
        isUnlocked: (Date.now() - (joinDate?.createdAt?.getTime() || 0)) >= (7 * 24 * 60 * 60 * 1000),
        unlockedAt: (Date.now() - (joinDate?.createdAt?.getTime() || 0)) >= (7 * 24 * 60 * 60 * 1000) ? joinDate?.createdAt : undefined,
        rarity: "common" as const,
        xpReward: 15,
      },
      {
        id: "10",
        code: "MONTH_MASTER",
        name: "Month Master",
        description: "Use the platform for 30 days",
        icon: "📆",
        category: "time",
        threshold: 30,
        progress: Math.min(Math.floor((Date.now() - (joinDate?.createdAt?.getTime() || 0)) / (1000 * 60 * 60 * 24)), 30),
        isUnlocked: (Date.now() - (joinDate?.createdAt?.getTime() || 0)) >= (30 * 24 * 60 * 60 * 1000),
        unlockedAt: (Date.now() - (joinDate?.createdAt?.getTime() || 0)) >= (30 * 24 * 60 * 60 * 1000) ? joinDate?.createdAt : undefined,
        rarity: "rare" as const,
        xpReward: 75,
      },
      
      // Connection achievements
      {
        id: "11",
        code: "FIRST_CONNECTION",
        name: "Platform Pioneer",
        description: "Connect your first music platform",
        icon: "🔗",
        category: "listening",
        threshold: 1,
        progress: Math.min(totalConnections, 1),
        isUnlocked: totalConnections >= 1,
        unlockedAt: totalConnections >= 1 ? joinDate?.createdAt : undefined,
        rarity: "common" as const,
        xpReward: 20,
      },
      {
        id: "12",
        code: "PLATFORM_MASTER",
        name: "Platform Master",
        description: "Connect all available music platforms",
        icon: "🎯",
        category: "listening",
        threshold: 3,
        progress: Math.min(totalConnections, 3),
        isUnlocked: totalConnections >= 3,
        unlockedAt: totalConnections >= 3 ? joinDate?.createdAt : undefined,
        rarity: "epic" as const,
        xpReward: 250,
      },
    ];

    // Calculate total stats
    const totalAchievements = achievements.filter(a => a.isUnlocked).length;
    const totalXP = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0);
    const completionRate = Math.round((totalAchievements / achievements.length) * 100);

    return NextResponse.json({
      achievements,
      stats: {
        total: achievements.length,
        unlocked: totalAchievements,
        locked: achievements.length - totalAchievements,
        completionRate,
        totalXP,
      }
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

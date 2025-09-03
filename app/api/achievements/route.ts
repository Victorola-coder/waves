import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";

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

    // Mock achievements data for now
    // In a real app, this would come from a proper achievements system
    const achievements = [
      {
        id: "1",
        name: "First Steps",
        description: "Create your first listening room",
        icon: "🎵",
        category: "rooms",
        rarity: "common",
        progress: 100,
        completed: true,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        name: "Social Butterfly",
        description: "Join 5 different rooms",
        icon: "🦋",
        category: "social",
        rarity: "uncommon",
        progress: 60,
        completed: false,
        target: 5,
        current: 3
      },
      {
        id: "3",
        name: "Music Explorer",
        description: "Listen to 100 different tracks",
        icon: "🔍",
        category: "listening",
        rarity: "rare",
        progress: 45,
        completed: false,
        target: 100,
        current: 45
      },
      {
        id: "4",
        name: "Party Host",
        description: "Host 10 listening parties",
        icon: "🎉",
        category: "rooms",
        rarity: "epic",
        progress: 20,
        completed: false,
        target: 10,
        current: 2
      },
      {
        id: "5",
        name: "Spotify Master",
        description: "Connect your Spotify account",
        icon: "🎧",
        category: "connections",
        rarity: "common",
        progress: 100,
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "6",
        name: "Night Owl",
        description: "Listen to music after midnight",
        icon: "🦉",
        category: "listening",
        rarity: "uncommon",
        progress: 0,
        completed: false,
        target: 1,
        current: 0
      },
      {
        id: "7",
        name: "Genre Hopper",
        description: "Listen to 5 different music genres",
        icon: "🎭",
        category: "listening",
        rarity: "rare",
        progress: 80,
        completed: false,
        target: 5,
        current: 4
      },
      {
        id: "8",
        name: "Early Bird",
        description: "Listen to music before 8 AM",
        icon: "🌅",
        category: "listening",
        rarity: "uncommon",
        progress: 0,
        completed: false,
        target: 1,
        current: 0
      }
    ];

    // Calculate user stats
    const userStats = {
      totalAchievements: achievements.filter(a => a.completed).length,
      totalPossible: achievements.length,
      completionRate: Math.round((achievements.filter(a => a.completed).length / achievements.length) * 100),
      recentAchievements: achievements.filter(a => a.completed).slice(0, 3),
      nextAchievements: achievements.filter(a => !a.completed).sort((a, b) => b.progress - a.progress).slice(0, 3)
    };

    return NextResponse.json({
      achievements,
      userStats,
      categories: ["rooms", "social", "listening", "connections"],
      rarities: ["common", "uncommon", "rare", "epic", "legendary"]
    });

  } catch (error) {
    console.error("Achievements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

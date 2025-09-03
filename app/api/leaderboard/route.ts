import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week"; // week, month, year, all
    const category = searchParams.get("category") || "listening_time"; // listening_time, rooms_created, achievements
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Calculate date range based on period
    let startDate: Date | undefined;
    if (period !== "all") {
      const now = new Date();
      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    let leaderboardData: any[] = [];

    switch (category) {
      case "listening_time":
        // Mock data for now - in real app, this would come from listening sessions
        leaderboardData = await getMockListeningTimeLeaderboard(limit, offset);
        break;

      case "rooms_created":
        leaderboardData = await getRoomsCreatedLeaderboard(
          startDate,
          limit,
          offset
        );
        break;

      case "achievements":
        leaderboardData = await getAchievementsLeaderboard(
          startDate,
          limit,
          offset
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      leaderboard: leaderboardData,
      period,
      category,
      limit,
      offset,
      total: leaderboardData.length,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock function for listening time (replace with real data)
async function getMockListeningTimeLeaderboard(limit: number, offset: number) {
  const users = await prisma.user.findMany({
    take: limit,
    skip: offset,
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user, index) => ({
    rank: offset + index + 1,
    userId: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    score: Math.floor(Math.random() * 1000) + 100, // Mock listening time in minutes
    metric: "minutes",
  }));
}

// Real function for rooms created
async function getRoomsCreatedLeaderboard(
  startDate: Date | undefined,
  limit: number,
  offset: number
) {
  const whereClause = startDate
    ? {
        createdAt: {
          gte: startDate,
        },
      }
    : {};

  const users = await prisma.user.findMany({
    where: whereClause,
    take: limit,
    skip: offset,
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      _count: {
        select: {
          rooms: true,
        },
      },
    },
    orderBy: {
      rooms: {
        _count: "desc",
      },
    },
  });

  return users.map((user, index) => ({
    rank: offset + index + 1,
    userId: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    score: user._count.rooms,
    metric: "rooms",
  }));
}

// Real function for achievements
async function getAchievementsLeaderboard(
  startDate: Date | undefined,
  limit: number,
  offset: number
) {
  // This would require an achievements table in the future
  // For now, return mock data
  const users = await prisma.user.findMany({
    take: limit,
    skip: offset,
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user, index) => ({
    rank: offset + index + 1,
    userId: user.id,
    displayName: user.displayName || "Anonymous User",
    avatarUrl: user.avatarUrl,
    score: Math.floor(Math.random() * 20) + 1, // Mock achievement count
    metric: "achievements",
  }));
}

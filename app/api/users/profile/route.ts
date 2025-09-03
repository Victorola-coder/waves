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

    // Get comprehensive user profile data
    const [
      user,
      totalRooms,
      totalMemberships,
      totalAchievements,
      followers,
      following,
      recentRooms,
      connections,
    ] = await Promise.all([
      // Basic user info
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),

      // Total rooms hosted
      prisma.room.count({
        where: { hostId: userId },
      }),

      // Total room memberships
      prisma.roomMember.count({
        where: { userId },
      }),

      // Total achievements (placeholder for now)
      0,

      // Followers count (placeholder for now)
      0,

      // Following count (placeholder for now)
      0,

      // Recent rooms (last 5)
      prisma.room.findMany({
        where: { hostId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true,
          _count: {
            select: { members: true },
          },
        },
      }),

      // Music provider connections
      prisma.connection.findMany({
        where: { userId },
        select: {
          id: true,
          provider: true,
          scopes: true,
          createdAt: true,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate level and XP
    const baseXP =
      totalRooms * 100 + totalMemberships * 50 + totalAchievements * 200;
    const level = Math.floor(baseXP / 1000) + 1;
    const currentLevelXP = baseXP % 1000;
    const nextLevelXP = 1000;

    // Format recent rooms
    const formattedRecentRooms = recentRooms.map((room) => ({
      id: room.id,
      name: room.name,
      memberCount: room._count.members,
      createdAt: room.createdAt,
    }));

    // Format connections
    const formattedConnections = connections.map((conn) => ({
      id: conn.id,
      provider: conn.provider,
      providerName: getProviderDisplayName(conn.provider),
      providerIcon: getProviderIcon(conn.provider),
      isConnected: true,
      lastSync: conn.createdAt.toISOString(),
      scopes: conn.scopes,
    }));

    // Add default connections for providers not yet connected
    const allProviders: ("spotify" | "lastfm" | "google")[] = [
      "spotify",
      "lastfm",
      "google",
    ];
    const connectedProviders = connections.map((c) => c.provider);

    allProviders.forEach((provider) => {
      if (!connectedProviders.includes(provider)) {
        formattedConnections.push({
          id: `default-${provider}`,
          provider,
          providerName: getProviderDisplayName(provider),
          providerIcon: getProviderIcon(provider),
          isConnected: false,
          lastSync: "",
          scopes: "",
        });
      }
    });

    const profile = {
      id: user.id,
      username: user.displayName || "Unknown User",
      displayName: user.displayName || "Unknown User",
      bio: "Music enthusiast and room host. Love discovering new artists and sharing music with friends. 🎵", // TODO: Add bio field to user model
      email: user.email,
      avatar: user.avatarUrl || "/api/placeholder/120/120",
      country: "United States", // TODO: Add country field to user model
      level,
      xp: currentLevelXP,
      nextLevelXp: nextLevelXP,
      totalListens: totalMemberships, // Using memberships as proxy for listens
      totalTimeMs: totalMemberships * 1800000, // 30 min per session estimate
      achievements: totalAchievements,
      followers,
      following,
      roomsHosted: totalRooms,
      joinDate: user.createdAt,
      recentRooms: formattedRecentRooms,
      connections: formattedConnections,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

function getProviderDisplayName(provider: string): string {
  switch (provider) {
    case "spotify":
      return "Spotify";
    case "lastfm":
      return "Last.fm";
    case "google":
      return "YouTube Music";
    default:
      return provider;
  }
}

function getProviderIcon(provider: string): string {
  switch (provider) {
    case "spotify":
      return "🎧";
    case "lastfm":
      return "📊";
    case "google":
      return "▶️";
    default:
      return "🔗";
  }
}

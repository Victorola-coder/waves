"use client";

import {
  Music,
  Users,
  Trophy,
  Star,
  TrendingUp,
  Clock,
  Play,
  Plus,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, Input } from "@/app/components/ui";
import { NavHeader } from "@/app/components/atom";
import { useAuth } from "@/app/hooks/use-auth";
import { useRooms } from "@/app/hooks/use-rooms";
import { useLeaderboard } from "@/app/hooks/use-leaderboard";
import { useAchievements } from "@/app/hooks/use-achievements";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, logout } = useAuth();
  const { rooms, loading: roomsLoading, createRoom } = useRooms();
  const { data: leaderboardData } = useLeaderboard("rooms_created", "week");
  const { data: achievementsData } = useAchievements();

  // Mock user stats (in real app, this would come from API)
  const userStats = {
    totalListens: 1247,
    totalTime: "89h 32m",
    level: 23,
    xp: 1840,
    nextLevelXp: 2000,
    achievements: achievementsData?.userStats.totalAchievements || 0,
    followers: 89,
    following: 156,
  };

  const recentActivity = [
    {
      type: "joined_room",
      title: "Chill Vibes",
      time: "2 min ago",
      icon: Users,
    },
    {
      type: "unlocked_achievement",
      title: "Music Explorer",
      time: "1 hour ago",
      icon: Trophy,
    },
    {
      type: "listened_to_track",
      title: "Blinding Lights",
      time: "3 hours ago",
      icon: Music,
    },
    {
      type: "hosted_room",
      title: "Late Night Jams",
      time: "1 day ago",
      icon: Star,
    },
  ];

  const quickActions = [
    {
      title: "Create Room",
      icon: Plus,
      action: "create-room",
      color: "primary",
    },
    {
      title: "Join Room",
      icon: Users,
      action: "join-room",
      color: "secondary",
    },
    {
      title: "Find Friends",
      icon: Search,
      action: "find-friends",
      color: "accent",
    },
    {
      title: "View Leaderboard",
      icon: TrendingUp,
      action: "leaderboard",
      color: "neutral",
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create-room":
        router.push("/rooms/create");
        break;
      case "join-room":
        router.push("/rooms");
        break;
      case "find-friends":
        router.push("/profile");
        break;
      case "leaderboard":
        router.push("/leaderboard");
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🌊</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-4">
            Welcome to Waves
          </h1>
          <p className="text-neutral-400 mb-6">Please sign in to continue</p>
          <Button variant="primary" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Navigation Header */}
      <NavHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome back, {user.displayName || "Music Explorer"}! 🎵
          </h1>
          <p className="text-light/60 text-lg">
            Ready to discover new music with friends?
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light/40 w-5 h-5" />
            <Input
              placeholder="Search rooms, friends, or music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral/60 border-neutral-400/30"
            />
          </div>
        </motion.div>

        {/* User Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Total Listens</p>
                    <p className="text-3xl font-bold text-white">
                      {userStats.totalListens.toLocaleString()}
                    </p>
                  </div>
                  <Music className="w-8 h-8 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Listening Time</p>
                    <p className="text-3xl font-bold text-white">
                      {userStats.totalTime}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Level</p>
                    <p className="text-3xl font-bold text-white">
                      {userStats.level}
                    </p>
                    <p className="text-sm text-neutral-400">
                      {userStats.xp}/{userStats.nextLevelXp} XP
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-neutral/20 to-neutral/10 border-neutral/30">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Achievements</p>
                    <p className="text-3xl font-bold text-white">
                      {userStats.achievements}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-neutral-300" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={action.action}
                className="cursor-pointer group"
                onClick={() => handleQuickAction(action.action)}
              >
                <Card className="bg-neutral-800/50 border-neutral-600/30 hover:border-primary/50 transition-all duration-300">
                  <div className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-${action.color} to-${action.color}/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-medium">{action.title}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & Social Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h2>
            <Card className="bg-neutral-800/50 border-neutral-600/30">
              <div className="p-6">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-3 border-b border-neutral-700/30 last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-neutral-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-sm text-neutral-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Social Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Social Stats
            </h2>
            <Card className="bg-neutral-800/50 border-neutral-600/30">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Followers</span>
                  <span className="text-white font-semibold">
                    {userStats.followers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Following</span>
                  <span className="text-white font-semibold">
                    {userStats.following}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Rooms Hosted</span>
                  <span className="text-white font-semibold">
                    {rooms.filter((room) => room.host.id === user.id).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Total Parties</span>
                  <span className="text-white font-semibold">
                    {rooms.length}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Current Listening Session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Currently Listening
          </h2>
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">
                    Not currently listening
                  </h3>
                  <p className="text-neutral-400">
                    Start a room or join one to begin your music journey!
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                  onClick={() => router.push("/rooms/create")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Listening
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

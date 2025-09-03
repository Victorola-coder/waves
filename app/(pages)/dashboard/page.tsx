"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { Button, Card, Input } from "../../components/ui";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const userStats = {
    totalListens: 1247,
    totalTime: "89h 32m",
    level: 23,
    xp: 1840,
    nextLevelXp: 2000,
    achievements: 12,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Waves Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <Input
                  placeholder="Search rooms, friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 w-64"
                />
              </div>
              <Button
                variant="default"
                size="default"
                className="text-neutral-400 hover:text-white bg-gradient-to-r from-primary to-secondary"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="primary"
                size="default"
                className="text-neutral-400 hover:text-white bg-gradient-to-r from-primary to-secondary"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
              <Card
                key={action.action}
                className="bg-neutral-800/50 border-neutral-600/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-${action.color} to-${action.color}/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-medium">{action.title}</p>
                </div>
              </Card>
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
                  <span className="text-white font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Total Parties</span>
                  <span className="text-white font-semibold">156</span>
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
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
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

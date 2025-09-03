"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Music,
  Users,
  Clock,
  Target,
  CheckCircle,
  Lock,
  TrendingUp,
  Award,
  Crown,
  Heart,
  Zap,
} from "lucide-react";
import { Card } from "../components/ui";

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  threshold: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
}

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"progress" | "rarity" | "recent">(
    "progress"
  );

  const categories = [
    { value: "all", label: "All", icon: Trophy, color: "text-primary" },
    {
      value: "listening",
      label: "Listening",
      icon: Music,
      color: "text-green-500",
    },
    { value: "social", label: "Social", icon: Users, color: "text-blue-500" },
    {
      value: "hosting",
      label: "Hosting",
      icon: Crown,
      color: "text-purple-500",
    },
    { value: "time", label: "Time", icon: Clock, color: "text-yellow-500" },
  ];

  const rarityColors = {
    common: "text-green-400",
    rare: "text-blue-400",
    epic: "text-purple-400",
    legendary: "text-yellow-400",
  };

  const rarityIcons = {
    common: Star,
    rare: Award,
    epic: Zap,
    legendary: Heart,
  };

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: "1",
      code: "FIRST_LISTEN",
      name: "First Steps",
      description: "Listen to your first track",
      icon: "🎵",
      category: "listening",
      threshold: 1,
      progress: 1,
      isUnlocked: true,
      unlockedAt: new Date("2024-01-15"),
      rarity: "common",
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
      progress: 87,
      isUnlocked: false,
      rarity: "rare",
      xpReward: 50,
    },
    {
      id: "3",
      code: "SOCIAL_BUTTERFLY",
      name: "Social Butterfly",
      description: "Join 50 different rooms",
      icon: "🦋",
      category: "social",
      threshold: 50,
      progress: 32,
      isUnlocked: false,
      rarity: "epic",
      xpReward: 100,
    },
    {
      id: "4",
      code: "ROOM_MASTER",
      name: "Room Master",
      description: "Host 25 rooms",
      icon: "👑",
      category: "hosting",
      threshold: 25,
      progress: 18,
      isUnlocked: false,
      rarity: "epic",
      xpReward: 150,
    },
    {
      id: "5",
      code: "TIME_WARRIOR",
      name: "Time Warrior",
      description: "Listen for 100 hours total",
      icon: "⏰",
      category: "time",
      threshold: 100,
      progress: 89,
      isUnlocked: false,
      rarity: "rare",
      xpReward: 75,
    },
    {
      id: "6",
      code: "MUSIC_ADDICT",
      name: "Music Addict",
      description: "Listen for 24 hours in a single day",
      icon: "🔥",
      category: "listening",
      threshold: 24,
      progress: 18,
      isUnlocked: false,
      rarity: "legendary",
      xpReward: 500,
    },
    {
      id: "7",
      code: "FRIENDLY_HOST",
      name: "Friendly Host",
      description: "Have 10 people in a single room",
      icon: "🤝",
      category: "hosting",
      threshold: 10,
      progress: 10,
      isUnlocked: true,
      unlockedAt: new Date("2024-01-20"),
      rarity: "rare",
      xpReward: 100,
    },
    {
      id: "8",
      code: "WEEKEND_WARRIOR",
      name: "Weekend Warrior",
      description: "Listen every day for a week",
      icon: "📅",
      category: "time",
      threshold: 7,
      progress: 7,
      isUnlocked: true,
      unlockedAt: new Date("2024-01-22"),
      rarity: "common",
      xpReward: 25,
    },
  ];

  const filteredAchievements = achievements.filter(
    (achievement) =>
      selectedCategory === "all" || achievement.category === selectedCategory
  );

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === "progress") {
      return b.progress - a.progress;
    } else if (sortBy === "rarity") {
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    } else {
      return (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0);
    }
  });

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalXP = achievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);
  const completionRate = Math.round(
    (unlockedCount / achievements.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Achievements</h1>
            <p className="text-neutral-400 text-lg">
              Unlock your musical potential
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-2">Unlocked</h3>
                <p className="text-3xl font-bold text-primary">
                  {unlockedCount}
                </p>
                <p className="text-sm text-neutral-400">
                  of {achievements.length}
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-white font-semibold mb-2">Completion</h3>
                <p className="text-3xl font-bold text-secondary">
                  {completionRate}%
                </p>
                <p className="text-sm text-neutral-400">Complete</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">Total XP</h3>
                <p className="text-3xl font-bold text-accent">{totalXP}</p>
                <p className="text-sm text-neutral-400">Earned</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-neutral/20 to-neutral/10 border-neutral/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-neutral/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-neutral-300" />
                </div>
                <h3 className="text-white font-semibold mb-2">Next Goal</h3>
                <p className="text-2xl font-bold text-neutral-300">87/100</p>
                <p className="text-sm text-neutral-400">Music Explorer</p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-neutral-800/50 border-neutral-600/30">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`p-2 px-4 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 ${
                          selectedCategory === category.value
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        <category.icon
                          className={`w-4 h-4 ${category.color}`}
                        />
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "progress", label: "Progress", icon: Target },
                      { value: "rarity", label: "Rarity", icon: Star },
                      { value: "recent", label: "Recent", icon: Clock },
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => setSortBy(sort.value as any)}
                        className={`p-2 px-4 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 ${
                          sortBy === sort.value
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        <sort.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {sort.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`h-full transition-all duration-300 ${
                    achievement.isUnlocked
                      ? "bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-400/50"
                      : "bg-neutral-800/50 border-neutral-600/30 hover:border-neutral-500/50"
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 text-4xl flex items-center justify-center">
                        {achievement.icon}
                      </div>
                      <div className="flex items-center space-x-2">
                        {achievement.isUnlocked ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Lock className="w-6 h-6 text-neutral-500" />
                        )}
                        <div
                          className={`flex items-center space-x-1 ${
                            rarityColors[achievement.rarity]
                          }`}
                        >
                          {React.createElement(
                            rarityIcons[achievement.rarity],
                            { className: "w-4 h-4" }
                          )}
                          <span className="text-xs font-medium uppercase">
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {achievement.name}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-3">
                        {achievement.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-neutral-400 mb-1">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.threshold}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              achievement.isUnlocked
                                ? "bg-green-500"
                                : "bg-gradient-to-r from-primary to-secondary"
                            }`}
                            style={{
                              width: `${Math.min(
                                (achievement.progress / achievement.threshold) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* XP Reward */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-400">
                          XP Reward:
                        </span>
                        <span className="text-sm font-semibold text-yellow-500">
                          +{achievement.xpReward}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    {achievement.isUnlocked && achievement.unlockedAt && (
                      <div className="pt-4 border-t border-neutral-700/30">
                        <p className="text-xs text-neutral-500 text-center">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {sortedAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-neutral-800 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-neutral-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No achievements found
            </h3>
            <p className="text-neutral-400">
              Try adjusting your filters or categories
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

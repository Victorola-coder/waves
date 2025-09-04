"use client";

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
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, EmptyState } from "@/app/components/ui";
import { useAuth } from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";

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
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
}

interface AchievementStats {
  total: number;
  unlocked: number;
  locked: number;
  completionRate: number;
  totalXP: number;
}

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"progress" | "rarity" | "recent">(
    "progress"
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();

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

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/achievements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch achievements");
        }

        const data = await response.json();
        setAchievements(data.achievements);
        setStats(data.stats);
      } catch (err: any) {
        setError(err.message || "Failed to fetch achievements");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // Filter achievements by category
  const filteredAchievements = achievements.filter(
    (achievement) =>
      selectedCategory === "all" || achievement.category === selectedCategory
  );

  // Sort achievements
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return b.progress - a.progress;
      case "rarity":
        const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      case "recent":
        if (a.isUnlocked && b.isUnlocked) {
          return (
            new Date(b.unlockedAt || "").getTime() -
            new Date(a.unlockedAt || "").getTime()
          );
        }
        return a.isUnlocked ? -1 : 1;
      default:
        return 0;
    }
  });

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading achievements...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <EmptyState
            icon={Trophy}
            title="Failed to Load Achievements"
            description={error}
            actionLabel="Go Back to Dashboard"
            onAction={() => router.push("/dashboard")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Achievements</h1>
        <p className="text-neutral-400 text-lg">
          Unlock your musical potential
        </p>
      </div>
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
                {stats?.unlocked || 0}
              </p>
              <p className="text-sm text-neutral-400">of {stats?.total || 0}</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Completion</h3>
              <p className="text-3xl font-bold text-secondary">
                {stats?.completionRate || 0}%
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
              <p className="text-3xl font-bold text-accent">
                {stats?.totalXP || 0}
              </p>
              <p className="text-sm text-neutral-400">Earned</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-neutral/20 to-neutral/10 border-neutral/30">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-neutral/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neutral-300" />
              </div>
              <h3 className="text-white font-semibold mb-2">Next Goal</h3>
              <p className="text-2xl font-bold text-neutral-300">
                {achievements.find(
                  (a) => a.isUnlocked && a.progress < a.threshold
                )?.progress || 0}
                /
                {achievements.find(
                  (a) => a.isUnlocked && a.progress < a.threshold
                )?.threshold || 0}
              </p>
              <p className="text-sm text-neutral-400">
                {achievements.find(
                  (a) => a.isUnlocked && a.progress < a.threshold
                )?.name || "No next goal"}
              </p>
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
                      <category.icon className={`w-4 h-4 ${category.color}`} />
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
                      <span className="text-sm font-medium">{sort.label}</span>
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
                        {React.createElement(rarityIcons[achievement.rarity], {
                          className: "w-4 h-4",
                        })}
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
                        Unlocked{" "}
                        {new Date(
                          achievement.unlockedAt || ""
                        ).toLocaleDateString()}
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
  );
}

"use client";

import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Clock,
  Calendar,
  Users,
  Music,
  Star,
  Award,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, EmptyState } from "@/app/components/ui";
import { useLeaderboard } from "@/app/hooks/use-leaderboard";

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year" | "all">("week");
  const [selectedCategory, setSelectedCategory] = useState<"listening_time" | "rooms_created" | "achievements">("rooms_created");

  const { data, loading, error } = useLeaderboard(selectedCategory, selectedPeriod);

  const periods = [
    { value: "week" as const, label: "This Week", icon: Calendar },
    { value: "month" as const, label: "This Month", icon: Calendar },
    { value: "year" as const, label: "This Year", icon: Calendar },
    { value: "all" as const, label: "All Time", icon: Trophy },
  ];

  const categories = [
    {
      value: "listening_time" as const,
      label: "Listening Time",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      value: "rooms_created" as const,
      label: "Rooms Created",
      icon: Users,
      color: "text-purple-500",
    },
    {
      value: "achievements" as const,
      label: "Achievements",
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  const leaderboardData = data?.leaderboard || [];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getChangeIcon = (change: "up" | "down" | "same") => {
    if (change === "up")
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change === "down")
      return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  const getScoreDisplay = (score: number) => {
    if (selectedCategory === "listening_time") {
      const hours = Math.floor(score / 60);
      const mins = score % 60;
      return `${hours}h ${mins}m`;
    }
    return score;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-neutral-400 text-lg">
          Compete with music lovers worldwide
        </p>
      </div>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-neutral-800/50 border-neutral-600/30">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Time Period
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setSelectedPeriod(period.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                        selectedPeriod === period.value
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      <period.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {period.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
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
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-neutral-800/50 border-neutral-600/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {periods.find((p) => p.value === selectedPeriod)?.label}{" "}
                Leaderboard
              </h2>
              {loading && (
                <div className="flex items-center space-x-2 text-sm text-neutral-400">
                  <span>Loading…</span>
                </div>
              )}
            </div>

            {/* Top 3 Podium */}
            {leaderboardData.length >= 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {leaderboardData.slice(0, 3).map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`text-center p-6 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-yellow-500/30"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/30"
                        : "bg-gradient-to-br from-amber-600/20 to-orange-700/20 border-amber-600/30"
                    } border-2`}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-700 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {entry.username}
                    </h3>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {getScoreDisplay(entry.score)}
                    </p>
                    <div className="text-sm text-neutral-400 space-y-1">
                      <p>Level {entry.level}</p>
                      <p>{entry.totalListens} listens</p>
                      <p>{entry.achievements} achievements</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mb-8">
                <EmptyState
                  icon={Trophy}
                  title="Not Enough Data for Podium"
                  description="We need at least 3 participants to show the top performers."
                  variant="compact"
                />
              </div>
            )}

            {/* Full Leaderboard */}
            {error ? (
              <EmptyState
                icon={Trophy}
                title="Failed to Load Leaderboard"
                description={error}
              />
            ) : leaderboardData.length > 0 ? (
              <div className="space-y-3">
                {leaderboardData.map((entry: any, index: number) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-neutral-700/30 transition-colors duration-200"
                  >
                    {/* Rank */}
                    <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {entry.rank}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-neutral-700 overflow-hidden">
                        {entry.avatarUrl ? (
                          <img
                            src={entry.avatarUrl}
                            alt={entry.displayName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {entry.displayName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-neutral-400" />
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {getScoreDisplay(entry.score)}
                      </p>
                      <div className="flex items-center justify-end space-x-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Trophy}
                title="No Leaderboard Data"
                description="Start listening to music and creating rooms to appear on the leaderboard!"
                variant="compact"
              />
            )}
          </div>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Total Participants
              </h3>
              <p className="text-3xl font-bold text-primary">2,847</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Total Listens</h3>
              <p className="text-3xl font-bold text-secondary">1.2M+</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Achievements Unlocked
              </h3>
              <p className="text-3xl font-bold text-accent">45.2K</p>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

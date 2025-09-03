"use client";

import { useState, useEffect } from "react";
import apiClient from "../lib/api-client";

interface UserStats {
  totalRooms: number;
  totalMemberships: number;
  totalAchievements: number;
  followers: number;
  following: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  recentActivity: Array<{
    type: string;
    title: string;
    time: string;
    icon: string;
    roomId: string;
  }>;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/users/stats");
      setStats(response.data.stats);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch user stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
}

"use client";

import { useState, useEffect } from "react";
import apiClient from "../lib/api-client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  target?: number;
  current?: number;
}

interface UserStats {
  totalAchievements: number;
  totalPossible: number;
  completionRate: number;
  recentAchievements: Achievement[];
  nextAchievements: Achievement[];
}

interface AchievementsData {
  achievements: Achievement[];
  userStats: UserStats;
  categories: string[];
  rarities: string[];
}

export function useAchievements() {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/achievements");
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return {
    data,
    loading,
    error,
    fetchAchievements,
  };
}

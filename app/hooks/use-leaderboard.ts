"use client";

import { useState, useEffect } from 'react';
import apiClient from '../lib/api-client';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  metric: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  period: string;
  category: string;
  total: number;
}

export function useLeaderboard(
  category: 'listening_time' | 'rooms_created' | 'achievements' = 'rooms_created',
  period: 'week' | 'month' | 'year' | 'all' = 'week'
) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/leaderboard?category=${category}&period=${period}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [category, period]);

  return {
    data,
    loading,
    error,
    fetchLeaderboard,
  };
}

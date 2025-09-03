"use client";

import { useState, useEffect } from "react";
import apiClient from "../lib/api-client";

interface RecentRoom {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
}

interface Connection {
  id: string;
  provider: string;
  providerName: string;
  providerIcon: string;
  isConnected: boolean;
  lastSync?: string;
  scopes: string;
}

interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  email: string;
  avatar: string;
  country: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  totalListens: number;
  totalTimeMs: number;
  achievements: number;
  followers: number;
  following: number;
  roomsHosted: number;
  joinDate: string;
  recentRooms: RecentRoom[];
  connections: Connection[];
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/users/profile");
      setProfile(response.data.profile);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      setError(null);
      const response = await apiClient.put(`/api/users/${profile?.id}`, data);
      setProfile(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}

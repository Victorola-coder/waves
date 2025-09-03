"use client";

import { useState, useEffect } from "react";
import apiClient from "../lib/api-client";

interface RoomMember {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  role: "host" | "moderator" | "listener";
  isOnline: boolean;
  isSpeaking: boolean;
}

interface QueueItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  artworkUrl: string;
  addedBy: string;
  position: number;
}

interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  status: "idle" | "active" | "ended";
  host: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  members: RoomMember[];
  queue: QueueItem[];
  memberCount: number;
  queueCount: number;
  createdAt: string;
}

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/rooms/${roomId}`);
      setRoom(response.data.room);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch room");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    try {
      setError(null);
      await apiClient.post(`/api/rooms/${roomId}`);
      await fetchRoom(); // Refresh room data
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to join room");
      throw err;
    }
  };

  const leaveRoom = async () => {
    try {
      setError(null);
      await apiClient.delete(`/api/rooms/${roomId}`);
      // Redirect to dashboard after leaving
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to leave room");
      throw err;
    }
  };

  const addToQueue = async (trackData: {
    title: string;
    artist: string;
    album?: string;
    durationMs: number;
    artworkUrl?: string;
  }) => {
    try {
      setError(null);
      await apiClient.post(`/api/rooms/${roomId}/queue`, trackData);
      await fetchRoom(); // Refresh room data
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add track to queue");
      throw err;
    }
  };

  const removeFromQueue = async (queueItemId: string) => {
    try {
      setError(null);
      await apiClient.delete(`/api/rooms/${roomId}/queue/${queueItemId}`);
      await fetchRoom(); // Refresh room data
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to remove track from queue"
      );
      throw err;
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  return {
    room,
    loading,
    error,
    fetchRoom,
    joinRoom,
    leaveRoom,
    addToQueue,
    removeFromQueue,
  };
}

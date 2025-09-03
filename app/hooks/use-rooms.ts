"use client";

import { useState, useEffect } from 'react';
import apiClient from '../lib/api-client';

interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  status: 'idle' | 'active' | 'ended';
  host: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  members: Array<{
    id: string;
    role: 'host' | 'mod' | 'listener';
    user: {
      id: string;
      displayName: string;
      avatarUrl: string | null;
    };
  }>;
  _count: {
    members: number;
    queue: number;
  };
  createdAt: string;
}

interface CreateRoomData {
  name: string;
  isPrivate: boolean;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/rooms');
      setRooms(response.data.rooms);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (data: CreateRoomData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/api/rooms', data);
      await fetchRooms(); // Refresh rooms list
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create room');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      setError(null);
      const response = await apiClient.post(`/api/rooms/${roomId}`);
      await fetchRooms(); // Refresh rooms list
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join room');
      throw err;
    }
  };

  const leaveRoom = async (roomId: string) => {
    try {
      setError(null);
      await apiClient.delete(`/api/rooms/${roomId}`);
      await fetchRooms(); // Refresh rooms list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to leave room');
      throw err;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    joinRoom,
    leaveRoom,
  };
}

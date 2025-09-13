"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./use-auth";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    if (!token || !user) {
      console.log("No token or user available for WebSocket connection");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    try {
      // For now, we'll simulate a WebSocket connection
      // In production, you'd connect to a real WebSocket server
      console.log(
        "WebSocket connection simulated - real-time features coming soon!"
      );

      // Simulate connection success
      setTimeout(() => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        options.onConnect?.();
      }, 100);
    } catch (err) {
      console.error("Error creating WebSocket connection:", err);
      setError("Failed to create WebSocket connection");
    }
  }, [user, options]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    // For now, just log the message since we don't have a real WebSocket server
    console.log("WebSocket message (simulated):", message);
  }, []);

  // Auto-connect when user is available
  useEffect(() => {
    if (options.autoConnect !== false && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect, options.autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
  };
}

// Room-specific WebSocket hook
export function useRoomWebSocket(roomId: string) {
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomMembers, setRoomMembers] = useState<any[]>([]);

  const { sendMessage } = useWebSocket({
    onMessage: (message) => {
      switch (message.type) {
        case "room_message":
          if (message.roomId === roomId) {
            setRoomMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                username: message.userId,
                content: message.message,
                timestamp: new Date(message.timestamp),
                type: "message",
              },
            ]);
          }
          break;

        case "track_playing":
          if (message.roomId === roomId) {
            setCurrentTrack(message.track);
            setIsPlaying(true);
          }
          break;

        case "track_paused":
          if (message.roomId === roomId) {
            setIsPlaying(false);
          }
          break;

        case "track_skipped":
          if (message.roomId === roomId) {
            // Handle track skip
            console.log("Track skipped by", message.userId);
          }
          break;

        case "user_joined":
          if (message.roomId === roomId) {
            setRoomMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                username: "system",
                content: `User joined the room`,
                timestamp: new Date(message.timestamp),
                type: "system",
              },
            ]);
          }
          break;

        case "user_left":
          if (message.roomId === roomId) {
            setRoomMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                username: "system",
                content: `User left the room`,
                timestamp: new Date(message.timestamp),
                type: "system",
              },
            ]);
          }
          break;
      }
    },
  });

  const joinRoom = useCallback(() => {
    sendMessage({
      type: "join_room",
      roomId,
    });
  }, [sendMessage, roomId]);

  const leaveRoom = useCallback(() => {
    sendMessage({
      type: "leave_room",
      roomId,
    });
  }, [sendMessage, roomId]);

  const sendRoomMessage = useCallback(
    (message: string) => {
      sendMessage({
        type: "room_message",
        roomId,
        message,
      });
    },
    [sendMessage, roomId]
  );

  const playTrack = useCallback(
    (track: any) => {
      sendMessage({
        type: "play_track",
        roomId,
        track,
      });
    },
    [sendMessage, roomId]
  );

  const pauseTrack = useCallback(() => {
    sendMessage({
      type: "pause_track",
      roomId,
    });
  }, [sendMessage, roomId]);

  const skipTrack = useCallback(() => {
    sendMessage({
      type: "skip_track",
      roomId,
    });
  }, [sendMessage, roomId]);

  return {
    roomMessages,
    currentTrack,
    isPlaying,
    roomMembers,
    joinRoom,
    leaveRoom,
    sendRoomMessage,
    playTrack,
    pauseTrack,
    skipTrack,
  };
}

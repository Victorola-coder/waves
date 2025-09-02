import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface RoomMessage {
  type: "chat" | "music_update" | "user_join" | "user_leave";
  userId: string;
  username: string;
  content?: string;
  timestamp: string;
}

export interface MusicUpdate {
  trackId: string;
  position: number;
  isPlaying: boolean;
  trackInfo?: {
    title: string;
    artist: string;
    album: string;
    albumArt: string;
  };
}

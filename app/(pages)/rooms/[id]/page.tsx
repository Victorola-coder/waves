"use client";

import {
  Music,
  Users,
  MessageSquare,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Plus,
  Heart,
  Share2,
  MoreVertical,
  ArrowLeft,
  List,
  Mic,
  MicOff,
  Headphones,
  Crown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Input, EmptyState } from "@/app/components/ui";
import { useRoom } from "@/app/hooks/use-room";
import { useAuth } from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MusicPlayer from "@/app/components/music-player";
import { useRoomWebSocket } from "@/app/hooks/use-websocket";

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  type: "message" | "system";
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoomClient roomId={id} />;
}

function RoomClient({ roomId }: { roomId: string }) {
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"queue" | "members" | "chat">(
    "queue"
  );
  const [volume, setVolume] = useState(80);

  const { user } = useAuth();
  const router = useRouter();
  const {
    room,
    loading,
    error,
    joinRoom,
    leaveRoom,
    addToQueue,
    removeFromQueue,
  } = useRoom(roomId);

  // WebSocket functionality
  const {
    roomMessages,
    currentTrack,
    isPlaying,
    roomMembers,
    joinRoom: wsJoinRoom,
    leaveRoom: wsLeaveRoom,
    sendRoomMessage,
    playTrack,
    pauseTrack,
    skipTrack,
  } = useRoomWebSocket(roomId);

  // Auto-join room when component mounts
  useEffect(() => {
    if (roomId && user) {
      joinRoom().catch((err) => {
        console.error("Failed to join room:", err);
        toast.error("Failed to join room");
      });
      // Also join via WebSocket
      wsJoinRoom();
    }
  }, [roomId, user, joinRoom, wsJoinRoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsLeaveRoom();
    };
  }, [wsLeaveRoom]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendRoomMessage(newMessage);
      setNewMessage("");
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      // For now, just pause since we don't have a track to play
      pauseTrack();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading room...</p>
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
            icon={Music}
            title="Failed to Load Room"
            description={error}
            actionLabel="Go Back to Dashboard"
            onAction={() => router.push("/dashboard")}
          />
        </div>
      </div>
    );
  }

  // Show room not found
  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <EmptyState
            icon={Music}
            title="Room Not Found"
            description="The room you're looking for doesn't exist or you don't have access to it."
            actionLabel="Go Back to Dashboard"
            onAction={() => router.push("/dashboard")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button
              variant="secondary"
              size="sm"
              className="text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{room.name}</h1>
            <p className="text-sm text-neutral-400">
              {room.memberCount} members •{" "}
              {room.isPrivate ? "Private" : "Public"} Room
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="border-neutral-600 text-neutral-300 hover:border-primary hover:text-primary"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Invite
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="border-neutral-600 text-neutral-300 hover:border-primary hover:text-primary"
            onClick={leaveRoom}
          >
            Leave Room
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Music Player */}
        <div className="lg:col-span-2">
          <MusicPlayer
            currentTrack={
              currentTrack
                ? {
                    id: currentTrack.id || "1",
                    name: currentTrack.title || "No track playing",
                    artist: currentTrack.artist || "Unknown Artist",
                    album: currentTrack.album || "Unknown Album",
                    duration: currentTrack.duration || 180,
                    imageUrl: currentTrack.artworkUrl || "",
                    previewUrl: currentTrack.previewUrl,
                    isPlaying: isPlaying,
                  }
                : null
            }
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onSkipNext={() => {
              skipTrack();
              toast.info("Skipped to next track!");
            }}
            onSkipPrevious={() => {
              // TODO: Implement skip previous functionality
              toast.info("Skip previous functionality coming soon!");
            }}
            onVolumeChange={(vol) => setVolume(vol)}
            onLike={() => {
              // TODO: Implement like functionality
              toast.info("Like functionality coming soon!");
            }}
            onShare={() => {
              // TODO: Implement share functionality
              toast.info("Share functionality coming soon!");
            }}
            className="mb-6"
          />

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
              <Plus className="w-4 h-4 mr-2" />
              Add to Queue
            </Button>
            <Button
              variant="secondary"
              className="border-neutral-600 text-neutral-300 hover:border-primary hover:text-primary"
            >
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-neutral-800/50 rounded-lg p-1">
            {[
              { id: "queue", label: "Queue", icon: List },
              { id: "members", label: "Members", icon: Users },
              { id: "chat", label: "Chat", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "queue" && (
              <motion.div
                key="queue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-neutral-800/50 border-neutral-600/30">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Queue ({room.queue.length})
                    </h3>
                    {room.queue.length > 0 ? (
                      <div className="space-y-3">
                        {room.queue.map((track, index) => (
                          <div
                            key={track.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-700/30"
                          >
                            <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                              <Music className="w-5 h-5 text-neutral-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">
                                {track.title}
                              </p>
                              <p className="text-sm text-neutral-400 truncate">
                                {track.artist}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-neutral-400">
                                {track.duration}
                              </p>
                              <p className="text-xs text-neutral-500">
                                +{track.addedBy}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Music}
                        title="Queue is Empty"
                        description="Add some tracks to get the party started!"
                        variant="compact"
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-neutral-800/50 border-neutral-600/30">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Members ({room.members.length})
                    </h3>
                    {room.members.length > 0 ? (
                      <div className="space-y-3">
                        {room.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-700/30"
                          >
                            <div className="relative">
                              <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                                <img
                                  src={member.avatar}
                                  alt={member.username}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-800 ${
                                  member.isOnline
                                    ? "bg-green-500"
                                    : "bg-neutral-500"
                                }`}
                              />
                              {member.isSpeaking && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-white font-medium truncate">
                                  {member.username}
                                </p>
                                {member.role === "host" && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                                {member.role === "moderator" && (
                                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                    MOD
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {member.isSpeaking ? (
                                  <Mic className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Headphones className="w-3 h-3 text-neutral-400" />
                                )}
                                <span className="text-xs text-neutral-400">
                                  {member.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Users}
                        title="No Members"
                        description="This room is empty. Invite some friends!"
                        variant="compact"
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-neutral-800/50 border-neutral-600/30">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Chat
                    </h3>

                    {/* Messages */}
                    <div className="h-64 overflow-y-auto space-y-3 mb-4">
                      {roomMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`${
                            message.type === "system"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {message.type === "system" ? (
                            <p className="text-xs text-neutral-500 bg-neutral-700/50 px-2 py-1 rounded">
                              {message.content}
                            </p>
                          ) : (
                            <div>
                              <span className="text-sm font-medium text-primary">
                                {message.username}
                              </span>
                              <span className="text-sm text-neutral-400 ml-2">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              <p className="text-white text-sm">
                                {message.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewMessage(e.target.value)
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-neutral-800/50 border-neutral-600/30">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Members ({room.members.length})
                    </h3>
                    {room.members.length > 0 ? (
                      <div className="space-y-3">
                        {room.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-700/30"
                          >
                            <div className="relative">
                              <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                                <img
                                  src={member.avatar}
                                  alt={member.username}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-800 ${
                                  member.isOnline
                                    ? "bg-green-500"
                                    : "bg-neutral-500"
                                }`}
                              />
                              {member.isSpeaking && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-white font-medium truncate">
                                  {member.username}
                                </p>
                                {member.role === "host" && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                                {member.role === "moderator" && (
                                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                    MOD
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {member.isSpeaking ? (
                                  <Mic className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Headphones className="w-3 h-3 text-neutral-400" />
                                )}
                                <span className="text-xs text-neutral-400">
                                  {member.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Users}
                        title="No Members"
                        description="This room is empty. Invite some friends!"
                        variant="compact"
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-neutral-800/50 border-neutral-600/30">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Chat
                    </h3>

                    {/* Messages */}
                    <div className="h-64 overflow-y-auto space-y-3 mb-4">
                      {roomMessages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`${
                            message.type === "system"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {message.type === "system" ? (
                            <p className="text-xs text-neutral-500 bg-neutral-700/50 px-2 py-1 rounded">
                              {message.content}
                            </p>
                          ) : (
                            <div>
                              <span className="text-sm font-medium text-primary">
                                {message.username}
                              </span>
                              <span className="text-sm text-neutral-400 ml-2">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              <p className="text-white text-sm">
                                {message.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Music,
  Clock,
  Trophy,
  Users,
  Settings,
  Edit,
  Camera,
  Youtube,
  Headphones,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import TextArea from "../components/ui/textArea";

interface ListeningSession {
  id: string;
  trackTitle: string;
  artist: string;
  album: string;
  duration: string;
  listenedAt: Date;
  source: "room" | "solo";
  roomName?: string;
}

interface Connection {
  id: string;
  provider: string;
  providerName: string;
  providerIcon: any;
  isConnected: boolean;
  lastSync?: Date;
  username?: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "connections" | "settings"
  >("overview");

  const handleInputChange = (field: string, value: string) => {
    // Handle input changes here
    console.log(field, value);
  };

  const userProfile = {
    username: "musicmaster",
    displayName: "Alex Chen",
    bio: "Music enthusiast and room host. Love discovering new artists and sharing music with friends. 🎵",
    email: "alex@example.com",
    avatar: "/api/placeholder/120/120",
    country: "United States",
    level: 23,
    xp: 1840,
    nextLevelXp: 2000,
    totalListens: 1247,
    totalTimeMs: 321600000, // 89h 20m in milliseconds
    achievements: 12,
    followers: 89,
    following: 156,
    roomsHosted: 24,
    joinDate: new Date("2023-06-15"),
  };

  const recentSessions: ListeningSession[] = [
    {
      id: "1",
      trackTitle: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      listenedAt: new Date("2024-01-25T20:30:00"),
      source: "room",
      roomName: "Chill Vibes",
    },
    {
      id: "2",
      trackTitle: "Dance Monkey",
      artist: "Tones and I",
      album: "The Kids Are Coming",
      duration: "3:29",
      listenedAt: new Date("2024-01-25T19:45:00"),
      source: "solo",
    },
    {
      id: "3",
      trackTitle: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      duration: "3:53",
      listenedAt: new Date("2024-01-25T18:20:00"),
      source: "room",
      roomName: "Late Night Jams",
    },
  ];

  const connections: Connection[] = [
    {
      id: "1",
      provider: "spotify",
      providerName: "Spotify",
      providerIcon: Music,
      isConnected: true,
      lastSync: new Date("2024-01-25T15:30:00"),
      username: "alexchen_music",
    },
    {
      id: "2",
      provider: "youtube_music",
      providerName: "YouTube Music",
      providerIcon: Youtube,
      isConnected: false,
    },
    {
      id: "3",
      provider: "lastfm",
      providerName: "Last.fm",
      providerIcon: Headphones,
      isConnected: true,
      lastSync: new Date("2024-01-24T12:15:00"),
      username: "alexchen",
    },
  ];

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "spotify":
        return "text-green-500";
      case "youtube_music":
        return "text-red-500";
      case "lastfm":
        return "text-purple-500";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
              className="border-neutral-600 text-neutral-300 hover:border-primary hover:text-primary"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-neutral-800/50 border-neutral-600/30">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar Section */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/80"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    {isEditing ? (
                      <Input
                        value={userProfile.displayName}
                        className="text-2xl font-bold text-white bg-neutral-700 border-neutral-600 text-center md:text-left"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-white">
                        {userProfile.displayName}
                      </h2>
                    )}
                    <p className="text-neutral-400">@{userProfile.username}</p>
                  </div>

                  <div className="mb-4">
                    {isEditing ? (
                      <TextArea
                        name="bio"
                        value={userProfile.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        className="bg-neutral-700 border-neutral-600 text-white text-center md:text-left"
                      />
                    ) : (
                      <p className="text-neutral-300">{userProfile.bio}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral-400">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userProfile.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined {userProfile.joinDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-white">
                      {userProfile.level}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Level {userProfile.level}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {userProfile.xp}/{userProfile.nextLevelXp} XP
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-2">Total Listens</h3>
                <p className="text-3xl font-bold text-primary">
                  {userProfile.totalListens.toLocaleString()}
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Listening Time
                </h3>
                <p className="text-3xl font-bold text-secondary">
                  {formatTime(userProfile.totalTimeMs)}
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">Achievements</h3>
                <p className="text-3xl font-bold text-accent">
                  {userProfile.achievements}
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-neutral/20 to-neutral/10 border-neutral/30">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-neutral/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-neutral-300" />
                </div>
                <h3 className="text-white font-semibold mb-2">Rooms Hosted</h3>
                <p className="text-3xl font-bold text-neutral-300">
                  {userProfile.roomsHosted}
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-neutral-800/50 rounded-lg p-1">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "history", label: "History", icon: Clock },
              { id: "connections", label: "Connections", icon: LinkIcon },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
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
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Social Stats */}
              <Card className="bg-neutral-800/50 border-neutral-600/30">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Social Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-300">Followers</span>
                      <span className="text-white font-semibold">
                        {userProfile.followers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-300">Following</span>
                      <span className="text-white font-semibold">
                        {userProfile.following}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-300">Total Parties</span>
                      <span className="text-white font-semibold">156</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-neutral-800/50 border-neutral-600/30">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentSessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-700/30"
                      >
                        <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                          <Music className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {session.trackTitle}
                          </p>
                          <p className="text-sm text-neutral-400 truncate">
                            {session.artist}
                          </p>
                          {session.roomName && (
                            <p className="text-xs text-primary">
                              in {session.roomName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-400">
                            {session.duration}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {session.listenedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <Card className="bg-neutral-800/50 border-neutral-600/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Listening History
                </h3>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700/30"
                    >
                      <div className="w-12 h-12 bg-neutral-700 rounded flex items-center justify-center">
                        <Music className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {session.trackTitle}
                        </p>
                        <p className="text-sm text-neutral-400 truncate">
                          {session.artist} • {session.album}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              session.source === "room"
                                ? "bg-primary/20 text-primary"
                                : "bg-neutral-700 text-neutral-400"
                            }`}
                          >
                            {session.source === "room" ? "Room" : "Solo"}
                          </span>
                          {session.roomName && (
                            <span className="text-xs text-neutral-500">
                              in {session.roomName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-400">
                          {session.duration}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {session.listenedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "connections" && (
            <Card className="bg-neutral-800/50 border-neutral-600/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Music Platform Connections
                  </h3>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Platform
                  </Button>
                </div>
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-neutral-600/30"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center ${
                            connection.isConnected
                              ? "border-2 border-green-500"
                              : ""
                          }`}
                        >
                          <connection.providerIcon
                            className={`w-6 h-6 ${getProviderColor(
                              connection.provider
                            )}`}
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            {connection.providerName}
                          </h4>
                          {connection.isConnected ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-500">
                                Connected
                              </span>
                              {connection.username && (
                                <span className="text-sm text-neutral-400">
                                  as {connection.username}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <XCircle className="w-4 h-4 text-neutral-500" />
                              <span className="text-sm text-neutral-500">
                                Not connected
                              </span>
                            </div>
                          )}
                          {connection.lastSync && (
                            <p className="text-xs text-neutral-500">
                              Last synced{" "}
                              {connection.lastSync.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {connection.isConnected ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="border-neutral-600 text-neutral-300 hover:border-red-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card className="bg-neutral-800/50 border-neutral-600/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Account Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Email
                    </label>
                    <Input
                      value={userProfile.email}
                      type="email"
                      className="bg-neutral-700 border-neutral-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Username
                    </label>
                    <Input
                      value={userProfile.username}
                      className="bg-neutral-700 border-neutral-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Country
                    </label>
                    <Input
                      value={userProfile.country}
                      className="bg-neutral-700 border-neutral-600 text-white"
                    />
                  </div>
                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

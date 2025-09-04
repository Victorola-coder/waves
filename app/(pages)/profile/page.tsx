"use client";

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
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Button, Card, Input, TextArea, EmptyState } from "@/app/components/ui";
import { useProfile } from "@/app/hooks/use-profile";
import { useAuth } from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "connections" | "settings"
  >("overview");

  const { profile, loading, error, updateProfile } = useProfile();
  const { user } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    // Handle input changes here
    console.log(field, value);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading profile...</p>
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
            icon={User}
            title="Failed to Load Profile"
            description={error}
            actionLabel="Go Back to Dashboard"
            onAction={() => router.push("/dashboard")}
          />
        </div>
      </div>
    );
  }

  // Show profile not found
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <EmptyState
            icon={User}
            title="Profile Not Found"
            description="Unable to load your profile information."
            actionLabel="Go Back to Dashboard"
            onAction={() => router.push("/dashboard")}
          />
        </div>
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
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
                    src={profile.avatar}
                    alt={profile.displayName}
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
                      value={profile.displayName}
                      className="text-2xl font-bold text-white bg-neutral-700 border-neutral-600 text-center md:text-left"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">
                      {profile.displayName}
                    </h2>
                  )}
                  <p className="text-neutral-400">@{profile.username}</p>
                </div>

                <div className="mb-4">
                  {isEditing ? (
                    <TextArea
                      name="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="bg-neutral-700 border-neutral-600 text-white text-center md:text-left"
                    />
                  ) : (
                    <p className="text-neutral-300">{profile.bio}</p>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profile.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">
                    {profile.level}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">
                  Level {profile.level}
                </p>
                <p className="text-xs text-neutral-500">
                  {profile.xp}/{profile.nextLevelXp} XP
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
                {profile.totalListens.toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Listening Time</h3>
              <p className="text-3xl font-bold text-secondary">
                {formatDuration(profile.totalTimeMs)}
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
                {profile.achievements}
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
                {profile.roomsHosted}
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
                      {profile.followers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">Following</span>
                    <span className="text-white font-semibold">
                      {profile.following}
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
                  {profile.recentRooms.length > 0 ? (
                    profile.recentRooms.slice(0, 3).map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-700/30"
                      >
                        <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                          <Music className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {room.name}
                          </p>
                          <p className="text-sm text-neutral-400 truncate">
                            {room.memberCount} members
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-500">
                            {formatDate(room.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={Music}
                      title="No Recent Rooms"
                      description="You haven't hosted any rooms recently."
                      actionLabel="Create a Room"
                      onAction={() => router.push("/rooms/create")}
                      variant="compact"
                    />
                  )}
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
                {/* This section will need to be populated with actual data */}
                <EmptyState
                  icon={Music}
                  title="No Listening History"
                  description="You haven't listened to any music yet."
                  actionLabel="Start Listening"
                  onAction={() => router.push("/discover")}
                />
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
                {profile.connections.length > 0 ? (
                  profile.connections.map((connection) => (
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
                          <span className="text-2xl">
                            {connection.providerIcon}
                          </span>
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
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <XCircle className="w-4 h-4 text-neutral-500" />
                              <span className="text-xs text-neutral-500">
                                Not connected
                              </span>
                            </div>
                          )}
                          {connection.lastSync && (
                            <p className="text-xs text-neutral-500">
                              Last synced {formatDate(connection.lastSync)}
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
                  ))
                ) : (
                  <EmptyState
                    icon={Headphones}
                    title="No Music Platform Connections"
                    description="Connect your music platforms to track your listening history."
                    actionLabel="Connect Platform"
                    onAction={() => router.push("/connections")}
                    variant="compact"
                  />
                )}
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
                    value={profile.email}
                    type="email"
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Username
                  </label>
                  <Input
                    value={profile.username}
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Country
                  </label>
                  <Input
                    value={profile.country}
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
  );
}

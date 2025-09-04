"use client";

import {
  Music,
  Users,
  Lock,
  Globe,
  Youtube,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, Input, TextArea, EmptyState } from "@/app/components/ui";
import { useRooms } from "@/app/hooks/use-rooms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateRoom() {
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    inviteCode: "",
    musicPlatform: "spotify",
  });

  const [step, setStep] = useState(1);
  const { createRoom, loading: apiLoading, error } = useRooms();
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setRoomData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomData.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    try {
      const newRoom = await createRoom({
        name: roomData.name.trim(),
        isPrivate: roomData.isPrivate,
      });

      toast.success("Room created successfully! 🎉");
      router.push(`/rooms/${newRoom.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create room");
    }
  };

  const musicPlatforms = [
    {
      value: "spotify",
      label: "Spotify",
      icon: Music,
      color: "text-green-500",
    },
    {
      value: "youtube_music",
      label: "YouTube Music",
      icon: Youtube,
      color: "text-red-500",
    },
    {
      value: "lastfm",
      label: "Last.fm",
      icon: Music,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center space-x-4 mb-8">
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
        <h1 className="text-2xl font-bold text-white">Create New Room</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= stepNumber
                      ? "border-primary bg-primary text-white"
                      : "border-neutral-600 text-neutral-400"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step > stepNumber ? "bg-primary" : "bg-neutral-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-neutral-400">
              Step {step} of 3:{" "}
              {step === 1
                ? "Room Details"
                : step === 2
                ? "Music Platform"
                : "Review & Create"}
            </p>
          </div>
        </div>

        <Card className="bg-neutral-800/50 border-neutral-600/30">
          <div className="p-8">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Room Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Room Name *
                    </label>
                    <Input
                      placeholder="Enter room name..."
                      value={roomData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Description
                    </label>
                    <TextArea
                      name="description"
                      placeholder="Describe your room's vibe..."
                      value={roomData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="public"
                        name="privacy"
                        checked={!roomData.isPrivate}
                        onChange={() => handleInputChange("isPrivate", false)}
                        className="text-primary"
                      />
                      <label
                        htmlFor="public"
                        className="text-neutral-300 flex items-center space-x-2"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Public</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="private"
                        name="privacy"
                        checked={roomData.isPrivate}
                        onChange={() => handleInputChange("isPrivate", true)}
                        className="text-primary"
                      />
                      <label
                        htmlFor="private"
                        className="text-neutral-300 flex items-center space-x-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Private</span>
                      </label>
                    </div>
                  </div>

                  {roomData.isPrivate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Invite Code
                      </label>
                      <Input
                        placeholder="Enter invite code..."
                        value={roomData.inviteCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("inviteCode", e.target.value)
                        }
                        className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Choose Music Platform
                </h2>

                <div className="space-y-4">
                  {musicPlatforms.map((platform) => (
                    <div
                      key={platform.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        roomData.musicPlatform === platform.value
                          ? "border-primary bg-primary/10"
                          : "border-neutral-600 hover:border-neutral-500"
                      }`}
                      onClick={() =>
                        handleInputChange("musicPlatform", platform.value)
                      }
                    >
                      <div className="flex items-center space-x-4">
                        <platform.icon
                          className={`w-8 h-8 ${platform.color}`}
                        />
                        <div>
                          <h3 className="text-white font-semibold">
                            {platform.label}
                          </h3>
                          <p className="text-neutral-400 text-sm">
                            {platform.value === "spotify" &&
                              "Connect your Spotify account to access your playlists and library"}
                            {platform.value === "youtube_music" &&
                              "Use YouTube Music for a vast selection of tracks and videos"}
                            {platform.value === "lastfm" &&
                              "Track your listening history and discover new music"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Review & Create
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-neutral-700/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Room Details
                    </h3>
                    <p className="text-neutral-300">
                      <strong>Name:</strong> {roomData.name}
                    </p>
                    <p className="text-neutral-300">
                      <strong>Description:</strong>{" "}
                      {roomData.description || "No description"}
                    </p>
                    <p className="text-neutral-300">
                      <strong>Privacy:</strong>{" "}
                      {roomData.isPrivate ? "Private" : "Public"}
                    </p>
                    {roomData.isPrivate && (
                      <p className="text-neutral-300">
                        <strong>Invite Code:</strong> {roomData.inviteCode}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-neutral-700/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Music Platform
                    </h3>
                    <p className="text-neutral-300">
                      <strong>Platform:</strong>{" "}
                      {
                        musicPlatforms.find(
                          (p) => p.value === roomData.musicPlatform
                        )?.label
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setStep(step - 1)}
                  className="border-neutral-600 text-neutral-300 hover:border-primary hover:text-primary"
                >
                  Previous
                </Button>
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !roomData.name.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={apiLoading || !roomData.name.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 ml-auto"
                >
                  {apiLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {apiLoading ? "Creating..." : "Create Room"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

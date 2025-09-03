"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui";
import { Music, ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface LastfmConnectionProps {
  isConnected: boolean;
  username?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function LastfmConnection({
  isConnected,
  username,
  onConnect,
  onDisconnect,
}: LastfmConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Get Last.fm OAuth URL
      const response = await fetch("/api/lastfm/auth", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });

      if (response.ok) {
        const { authUrl } = await response.json();
        // Open Last.fm OAuth in new window
        window.open(authUrl, "_blank", "width=500,height=600");
      }
    } catch (error) {
      console.error("Failed to get Last.fm auth URL:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-800/50 border border-neutral-600/30 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Last.fm</h3>
            <p className="text-neutral-400 text-sm">
              Track your listening history and get recommendations
            </p>
          </div>
        </div>
        {isConnected ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <XCircle className="w-6 h-6 text-neutral-500" />
        )}
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
            <span className="text-green-400 font-medium">
              Connected as @{username}
            </span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="text-center p-3 bg-neutral-700/30 rounded-lg">
              <div className="text-white font-semibold">Scrobbling</div>
              <div className="text-green-400">Active</div>
            </div>
            <div className="text-center p-3 bg-neutral-700/30 rounded-lg">
              <div className="text-white font-semibold">Recommendations</div>
              <div className="text-green-400">Enabled</div>
            </div>
            <div className="text-center p-3 bg-neutral-700/30 rounded-lg">
              <div className="text-white font-semibold">Stats</div>
              <div className="text-green-400">Synced</div>
            </div>
          </div>

          <Button variant="secondary" onClick={onDisconnect} className="w-full">
            Disconnect Last.fm
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-neutral-400 space-y-2">
            <p>• Automatically track what you listen to</p>
            <p>• Get personalized music recommendations</p>
            <p>• View your listening statistics and history</p>
            <p>• Discover new music based on your taste</p>
          </div>

          <Button
            variant="primary"
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              "Connecting..."
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect Last.fm Account
              </>
            )}
          </Button>

          <p className="text-xs text-neutral-500 text-center">
            You'll be redirected to Last.fm to authorize the connection
          </p>
        </div>
      )}
    </motion.div>
  );
}

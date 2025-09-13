"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import Button from "./ui/button";
import Card from "./ui/card";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
  previewUrl?: string;
  isPlaying?: boolean;
}

interface MusicPlayerProps {
  currentTrack?: Track | null;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  onLike?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function MusicPlayer({
  currentTrack,
  isPlaying = false,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onVolumeChange,
  onLike,
  onShare,
  className = "",
}: MusicPlayerProps) {
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);

  // Mock progress update
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          return newProgress >= currentTrack.duration ? 0 : newProgress;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  if (!currentTrack) {
    return (
      <Card className={`bg-neutral-800/50 border-neutral-600/30 ${className}`}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-700 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">No track playing</h3>
          <p className="text-neutral-400 text-sm">
            Start a room or join one to begin listening
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-neutral-800/50 border-neutral-600/30 ${className}`}>
      <div className="p-6">
        {/* Track Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
            {currentTrack.imageUrl ? (
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.album}
                className="w-full h-full object-cover"
              />
            ) : (
              <Play className="w-8 h-8 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">
              {currentTrack.name}
            </h3>
            <p className="text-neutral-400 text-sm truncate">
              {currentTrack.artist}
            </p>
            <p className="text-neutral-500 text-xs truncate">
              {currentTrack.album}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onLike}
              className="p-2 border-neutral-600 text-neutral-400 hover:text-red-500 hover:border-red-500/50"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onShare}
              className="p-2 border-neutral-600 text-neutral-400 hover:text-primary hover:border-primary/50"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="p-2 border-neutral-600 text-neutral-400 hover:text-white hover:border-neutral-500"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-1 cursor-pointer">
            <motion.div
              className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
              initial={{ width: 0 }}
              animate={{
                width: `${(progress / currentTrack.duration) * 100}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={onSkipPrevious}
            className="p-3 border-neutral-600 text-neutral-400 hover:text-white hover:border-primary/50"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={onPlayPause}
            className="w-12 h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 rounded-full p-0"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSkipNext}
            className="p-3 border-neutral-600 text-neutral-400 hover:text-white hover:border-primary/50"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Volume2 className="w-4 h-4 text-neutral-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-neutral-400 w-8">{volume}</span>
        </div>
      </div>
    </Card>
  );
}

// Waves App Configuration
export const APP_NAME = "Waves";
export const APP_DESCRIPTION = "Listen Together, Rise Together";
export const APP_VERSION = "1.0.0";

// API Configuration
export const API_URL = "http://localhost:3001";
export const SPOTIFY_API_URL = "https://api.spotify.com/v1";
export const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0";

// Music Platform IDs
export const MUSIC_PLATFORMS = {
  SPOTIFY: "spotify",
  YOUTUBE_MUSIC: "youtube_music",
  APPLE_MUSIC: "apple_music",
} as const;

// Achievement Milestones
export const ACHIEVEMENTS = {
  LISTENING_TIME: {
    BRONZE: 1000, // 1000 minutes
    SILVER: 5000, // 5000 minutes
    GOLD: 10000, // 10000 minutes
    PLATINUM: 50000, // 50000 minutes
  },
  PARTIES_HOSTED: {
    BRONZE: 5,
    SILVER: 25,
    GOLD: 100,
    PLATINUM: 500,
  },
  FRIENDS_INVITED: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
    PLATINUM: 500,
  },
} as const;

// Leaderboard Categories
export const LEADERBOARD_CATEGORIES = {
  MONTHLY_LISTENERS: "monthly_listeners",
  TOP_HOSTS: "top_hosts",
  MOST_ENGAGED: "most_engaged",
  STREAK_MASTERS: "streak_masters",
} as const;

// Room Settings
export const ROOM_SETTINGS = {
  MAX_PARTICIPANTS: 50,
  MAX_QUEUE_SIZE: 100,
  AUTO_SYNC_DELAY: 2000, // 2 seconds
} as const;

// UI Constants
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
} as const;

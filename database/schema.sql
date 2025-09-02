-- Waves Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  spotify_id TEXT,
  lastfm_username TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE
);

-- Listening rooms table
CREATE TABLE IF NOT EXISTS listening_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_track_id UUID,
  current_track_position INTEGER DEFAULT 0,
  is_playing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  max_participants INTEGER DEFAULT 10,
  is_private BOOLEAN DEFAULT FALSE,
  tags TEXT[]
);

-- Room participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES listening_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  role TEXT DEFAULT 'listener' CHECK (role IN ('host', 'moderator', 'listener')),
  UNIQUE(room_id, user_id)
);

-- Music tracks table
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spotify_id TEXT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration INTEGER, -- in milliseconds
  album_art_url TEXT,
  preview_url TEXT,
  external_url TEXT,
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  play_count INTEGER DEFAULT 0
);

-- Room queue table
CREATE TABLE IF NOT EXISTS room_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES listening_rooms(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES music_tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, position)
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_listening_time INTEGER DEFAULT 0, -- in seconds
  tracks_played INTEGER DEFAULT 0,
  rooms_joined INTEGER DEFAULT 0,
  rooms_created INTEGER DEFAULT 0,
  achievements_earned INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Room chat messages table
CREATE TABLE IF NOT EXISTS room_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES listening_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'system', 'music_update')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  icon_url TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON listening_rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON listening_rooms(created_at);
CREATE INDEX IF NOT EXISTS idx_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_queue_room_id ON room_queue(room_id);
CREATE INDEX IF NOT EXISTS idx_tracks_spotify_id ON music_tracks(spotify_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON room_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_stats_user_id ON user_stats(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for listening_rooms
CREATE TRIGGER update_listening_rooms_updated_at 
  BEFORE UPDATE ON listening_rooms 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile and public profiles
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Public rooms are readable by everyone
CREATE POLICY "Public rooms are viewable" ON listening_rooms
  FOR SELECT USING (is_private = false OR auth.uid() = host_id);

-- Room participants can view their rooms
CREATE POLICY "Participants can view room" ON room_participants
  FOR SELECT USING (auth.uid() = user_id);

-- Users can join public rooms
CREATE POLICY "Users can join public rooms" ON room_participants
  FOR INSERT WITH CHECK (true);

-- Users can leave rooms
CREATE POLICY "Users can leave rooms" ON room_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Music tracks are readable by everyone
CREATE POLICY "Music tracks are viewable" ON music_tracks
  FOR SELECT USING (true);

-- Users can add tracks to queue
CREATE POLICY "Users can add to queue" ON room_queue
  FOR INSERT WITH CHECK (true);

-- Queue is viewable by room participants
CREATE POLICY "Queue is viewable by participants" ON room_queue
  FOR SELECT USING (true);

-- Chat messages are viewable by room participants
CREATE POLICY "Chat messages are viewable by participants" ON room_messages
  FOR SELECT USING (true);

-- Users can send messages to rooms they're in
CREATE POLICY "Users can send messages" ON room_messages
  FOR INSERT WITH CHECK (true);

-- User stats are viewable by the user
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- User achievements are viewable by the user
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

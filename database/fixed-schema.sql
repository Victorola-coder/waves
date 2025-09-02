-- Waves Database Schema (Fixed Version)
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (stores user profiles, linked to auth.users via id)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY, -- Remove the foreign key constraint
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

-- Spotify tokens table
CREATE TABLE IF NOT EXISTS spotify_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_in INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON listening_rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON room_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_queue_room_id ON room_queue(room_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotify_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for listening_rooms table
CREATE POLICY "Anyone can view public rooms" ON listening_rooms
  FOR SELECT USING (is_private = false);

CREATE POLICY "Users can view rooms they're in" ON listening_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_participants 
      WHERE room_id = listening_rooms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can manage their rooms" ON listening_rooms
  FOR ALL USING (host_id = auth.uid());

-- RLS Policies for room_participants table
CREATE POLICY "Users can view participants in rooms they're in" ON room_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_participants rp2
      WHERE rp2.room_id = room_participants.room_id AND rp2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms" ON room_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave rooms" ON room_participants
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for other tables (similar pattern)
CREATE POLICY "Users can view music tracks" ON music_tracks FOR SELECT USING (true);
CREATE POLICY "Users can add music tracks" ON music_tracks FOR INSERT WITH CHECK (added_by = auth.uid());

CREATE POLICY "Users can view queue in rooms they're in" ON room_queue
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_participants 
      WHERE room_id = room_queue.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to queue in rooms they're in" ON room_queue
  FOR INSERT WITH CHECK (
    added_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM room_participants 
      WHERE room_id = room_queue.room_id AND user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_listening_rooms_updated_at 
  BEFORE UPDATE ON listening_rooms 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spotify_tokens_updated_at 
  BEFORE UPDATE ON spotify_tokens 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

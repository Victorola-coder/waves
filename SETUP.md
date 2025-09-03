# 🚀 Waves - Setup Guide

## Database Setup

### Local Development (SQLite)

The project is now configured to use SQLite for local development, which provides:

- ✅ **Fast setup** - no external database needed
- ✅ **Instant development** - no network latency
- ✅ **Easy migration** - can switch to PostgreSQL later

### Environment Variables

Create a `.env.local` file with:

```bash
# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Spotify API (optional - for music integration)
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# Last.fm API (optional - for scrobbling and music discovery)
LASTFM_API_KEY="your-lastfm-api-key"
LASTFM_SECRET="your-lastfm-secret"
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

## Production Setup

When ready for production, you can switch to PostgreSQL:

1. **Update `prisma/schema.prisma`:**

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Set environment variables:**

   ```bash
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **Deploy database:**

   ```bash
   npx prisma db push
   ```

## Music Integration Setup

### Spotify

1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add `http://localhost:3000/api/spotify/auth` to redirect URIs
3. Copy Client ID and Client Secret to your `.env.local`

### Last.fm

1. Create a Last.fm app at [Last.fm API](https://www.last.fm/api/account/create)
2. Copy API Key and Secret to your `.env.local`
3. Users can connect their Last.fm accounts for scrobbling and recommendations

## Features Ready

- ✅ **Authentication** - Signup, login, JWT tokens
- ✅ **User Management** - Profiles, connections
- ✅ **Room System** - Create, join, manage listening rooms
- ✅ **Music Integration** - Spotify OAuth and API
- ✅ **Last.fm Integration** - Scrobbling, user stats, recommendations
- ✅ **Social Features** - Friends, following, leaderboards
- ✅ **Gamification** - Achievements, progress tracking
- ✅ **Real-time Ready** - WebSocket infrastructure planned

## API Endpoints

All major API endpoints are implemented and ready to use:

- `/api/auth/*` - Authentication
- `/api/rooms/*` - Room management
- `/api/spotify/*` - Spotify integration
- `/api/lastfm/*` - Last.fm integration
- `/api/users/*` - User profiles
- `/api/friends` - Social features
- `/api/leaderboard` - Rankings
- `/api/achievements` - Progress tracking

### Last.fm Specific Endpoints

- `GET /api/lastfm/auth` - Get Last.fm OAuth URL
- `POST /api/lastfm/auth` - Complete Last.fm connection
- `POST /api/lastfm/scrobble` - Scrobble tracks to Last.fm
- `GET /api/lastfm/user` - Get user stats and listening history
- `GET /api/lastfm/search` - Search tracks, artists, and albums

import { NextRequest, NextResponse } from 'next/server'
import { spotifyApi } from '@/app/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'track'
    const limit = searchParams.get('limit') || '20'

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Search Spotify
    const searchResults = await spotifyApi.search(query, [type as any], {
      limit: parseInt(limit),
    })

    // Transform results
    const tracks = searchResults.body.tracks?.items.map(track => ({
      id: track.id,
      spotify_id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration: track.duration_ms,
      album_art_url: track.album.images[0]?.url,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
    })) || []

    return NextResponse.json({
      tracks,
      total: searchResults.body.tracks?.total || 0,
    })
  } catch (error) {
    console.error('Music search error:', error)
    return NextResponse.json(
      { error: 'Failed to search music' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyAuthUrl } from '@/app/lib/spotify'

export async function GET() {
  try {
    const authUrl = getSpotifyAuthUrl()
    
    return NextResponse.json({
      authUrl,
    })
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}

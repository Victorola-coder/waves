import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { name, description, max_participants = 10, is_private = false } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Create room
    const { data: room, error: roomError } = await supabase
      .from('listening_rooms')
      .insert({
        name,
        description,
        host_id: user.id,
        max_participants,
        is_private,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (roomError) {
      return NextResponse.json(
        { error: 'Failed to create room' },
        { status: 500 }
      )
    }

    // Add host as participant
    const { error: participantError } = await supabase
      .from('room_participants')
      .insert({
        room_id: room.id,
        user_id: user.id,
        role: 'host',
        joined_at: new Date().toISOString(),
        is_active: true,
      })

    if (participantError) {
      return NextResponse.json(
        { error: 'Failed to add host to room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Room created successfully',
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        host_id: room.host_id,
        max_participants: room.max_participants,
        is_private: room.is_private,
        created_at: room.created_at,
      },
    })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

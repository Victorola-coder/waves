import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/db';
import { getUserFromToken } from '../../lib/auth';
import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  isPrivate: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'active';

    const skip = (page - 1) * limit;

    const rooms = await prisma.room.findMany({
      where: {
        isPrivate: false,
        status: status as any,
      },
      include: {
        host: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        _count: {
          select: {
            members: true,
            queue: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    });

    const total = await prisma.room.count({
      where: {
        isPrivate: false,
        status: status as any,
      }
    });

    return NextResponse.json({
      rooms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, isPrivate } = createRoomSchema.parse(body);

    const room = await prisma.room.create({
      data: {
        name,
        isPrivate,
        hostId: user.id,
        status: 'idle',
      },
      include: {
        host: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });

    // Add creator as first member
    await prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: user.id,
        role: 'host',
      }
    });

    return NextResponse.json(room, { status: 201 });

  } catch (error) {
    console.error('Create room error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

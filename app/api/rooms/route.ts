import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const isPrivateParam = searchParams.get("private");

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (isPrivateParam !== null) {
      where.isPrivate = isPrivateParam === "true";
    }

    const [rooms, total] = await Promise.all([
      prisma.listeningRoom.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          host: { select: { username: true, avatarUrl: true } },
          participants: true,
        },
      }),
      prisma.listeningRoom.count({ where }),
    ]);

    return NextResponse.json({
      rooms: rooms.map((r) => ({
        ...r,
        participants: [{ count: r.participants.length }],
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List rooms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { supabase } from "@/app/lib/supabase";

async function resolveUser(request: NextRequest) {
  const devUserId = request.headers.get("x-user-id");
  if (process.env.NODE_ENV !== "production" && devUserId) {
    const user = await prisma.user.upsert({
      where: { id: devUserId },
      update: {},
      create: {
        id: devUserId,
        email: `${devUserId}@dev.local`,
        username: `dev_${devUserId.substring(0, 6)}`,
      },
    });
    return user;
  }
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await supabase.auth.getUser(token);
  const raw = userData?.user;
  if (!raw) return null;
  const user = await prisma.user.upsert({
    where: { id: raw.id },
    update: { email: raw.email ?? undefined },
    create: {
      id: raw.id,
      email: raw.email || `${raw.id}@user.local`,
      username: raw.email?.split("@")[0] || `user_${raw.id.substring(0, 6)}`,
    },
  });
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await resolveUser(request);
    if (!user)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const profile = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({ profile: { ...profile, stats: null } });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await resolveUser(request);
    if (!user)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const { username, avatar_url, bio, lastfm_username } = await request.json();

    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: user.id } },
        select: { id: true },
      });
      if (existing)
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: username ?? undefined,
        avatarUrl: avatar_url ?? undefined,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

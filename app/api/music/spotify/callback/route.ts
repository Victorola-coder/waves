import { NextRequest, NextResponse } from "next/server";

// Forward Spotify callback from legacy path to the canonical handler
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.search; // includes ?code=...&state=...
  const target = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/auth${search}`;
  return NextResponse.redirect(target);
}



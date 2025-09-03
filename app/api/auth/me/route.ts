import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const bearer = request.headers.get("authorization");
  const token =
    request.cookies.get("auth-token")?.value ||
    (bearer?.startsWith("Bearer ") ? bearer.substring(7) : undefined);

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await getUserFromToken(token);
  return NextResponse.json({ user });
}

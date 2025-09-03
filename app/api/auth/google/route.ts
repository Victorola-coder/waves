import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase";
import { prisma } from "../../../lib/db";
import { generateToken } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.json(
        { error: `OAuth error: ${error}` },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Exchange code for session
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError || !authData.user) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 400 }
      );
    }

    const { user } = authData;

    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      // Create new user
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          authProvider: "google",
          googleId: user.id,
          displayName: user.user_metadata?.full_name || user.user_metadata?.name,
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        },
      });
    } else {
      // Update existing user with Google info
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          authProvider: "google",
          googleId: user.id,
          displayName: user.user_metadata?.full_name || user.user_metadata?.name || dbUser.displayName,
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || dbUser.avatarUrl,
        },
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: dbUser.id,
      email: dbUser.email,
    });

    // Check if app URL is configured
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "App URL not configured" },
        { status: 500 }
      );
    }

    // Redirect to dashboard with token
    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.searchParams.set("token", token);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Get Google OAuth URL
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Check if app URL is configured
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "App URL not configured" },
        { status: 500 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      authUrl: data.url,
      message: "Redirect user to this URL to authorize with Google"
    });

  } catch (error) {
    console.error("Google OAuth URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate OAuth URL" },
      { status: 500 }
    );
  }
}

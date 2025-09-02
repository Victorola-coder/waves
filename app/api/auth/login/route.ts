import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (authData.user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        return NextResponse.json(
          { error: "Failed to fetch user profile" },
          { status: 500 }
        );
      }

      // Update last login
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", authData.user.id);

      return NextResponse.json({
        message: "Login successful",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username: profile.username,
          avatar_url: profile.avatar_url,
        },
        session: authData.session,
      });
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

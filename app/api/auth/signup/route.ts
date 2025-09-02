import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (authData.user) {
      // Create user profile in users table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: authData.user.email!,
        username,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "User created successfully",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username,
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

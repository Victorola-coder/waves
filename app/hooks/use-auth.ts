"use client";

import apiClient from "../lib/api-client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  authProvider: "email" | "google";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  updateProfile: (data: {
    displayName?: string;
    avatarUrl?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        const response = await apiClient.get("/api/auth/me");
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem("auth-token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data;

      localStorage.setItem("auth-token", token);
      setUser(user);
      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      const response = await apiClient.post("/api/auth/signup", {
        email,
        password,
        displayName,
      });
      const { user, token } = response.data;

      localStorage.setItem("auth-token", token);
      setUser(user);
      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth-token");
      setUser(null);
      router.push("/");
    }
  };

  const googleLogin = async () => {
    try {
      const response = await apiClient.post("/api/auth/google");
      const { authUrl } = response.data;

      // Open Google OAuth in new window
      const authWindow = window.open(
        authUrl,
        "google-oauth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      // Listen for OAuth completion
      const checkAuth = setInterval(async () => {
        if (authWindow?.closed) {
          clearInterval(checkAuth);
          await checkAuth(); // Refresh user state
        }
      }, 1000);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Google login failed");
    }
  };

  const updateProfile = async (data: {
    displayName?: string;
    avatarUrl?: string;
  }) => {
    try {
      if (!user) throw new Error("No user logged in");

      const response = await apiClient.put(`/api/users/${user.id}`, data);
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Profile update failed");
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    googleLogin,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

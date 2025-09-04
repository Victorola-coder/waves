"use client";

import { useAuth } from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while checking auth
  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold text-white">Waves</span>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/rooms/create"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Create Room
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/achievements"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Achievements
                </Link>
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Avatar and Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {user.displayName?.[0] || user.email[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white font-medium text-sm">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-neutral-400 text-xs">{user.email}</p>
                </div>
              </div>

              {/* Profile and Logout */}
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="px-3 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("auth-token");
                    router.push("/");
                  }}
                  className="px-3 py-2 text-sm text-neutral-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

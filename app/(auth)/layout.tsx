import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left brand panel (hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 border-r border-neutral-800 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-10 -right-10 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
          </div>

          <Link
            href="/"
            className="relative z-10 flex items-center space-x-3 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white text-3xl">🌊</span>
            </div>
            <span className="text-2xl font-bold text-white">Waves</span>
          </Link>

          <div className="relative z-10 text-center px-10">
            <h2 className="text-white text-3xl font-bold mb-3">
              Listen Together
            </h2>
            <p className="text-neutral-400 max-w-sm">
              Join synchronized listening rooms, discover music with friends,
              and climb the leaderboards.
            </p>
          </div>
        </div>

        {/* Right content (forms) */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

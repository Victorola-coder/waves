"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Music, Bell, Settings, LogOut, User } from "lucide-react";
import { Button } from "../ui";
import Link from "next/link";
import { useAuth } from "../../hooks/use-auth";
import { toast } from "sonner";

export default function NavHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Rooms", href: "/rooms" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Achievements", href: "/achievements" },
    { label: "Profile", href: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!isClient || !user) {
    return null; // Don't render until client-side or if no user
  }

  return (
    <motion.header
      className="bg-neutral/80 backdrop-blur-xl border-b border-neutral-400/20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[131px] py-3 md:py-[10px] flex items-center justify-between relative sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.figure
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0"
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-lg md:text-xl lg:text-2xl">
              🌊
            </span>
          </div>
          <span className="text-white font-bold text-xl md:text-2xl lg:text-3xl">
            Waves
          </span>
        </Link>
      </motion.figure>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-light/80 hover:text-white transition-colors duration-200 font-medium text-base hover:scale-105 transform transition-transform"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Side Actions */}
      <div className="hidden lg:flex items-center space-x-4">
        <Button variant="secondary" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
        </Button>
        <Button variant="secondary" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 text-white hover:bg-neutral-700/50 rounded-lg transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-neutral/95 backdrop-blur-xl border-b border-neutral-400/20 lg:hidden"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-light/80 hover:text-white transition-colors duration-200 font-medium text-lg py-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-neutral-400/20 space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <Bell className="w-5 h-5 mr-3" />
                  Notifications
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

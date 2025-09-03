"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Check if user is logged in
    const token = localStorage.getItem("auth-token");
    if (token) {
      setUser({ id: "user" }); // Simple check for now
    }
  }, []);

  const navItems = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Leaderboards", href: "#leaderboards" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ];

  if (!isClient) {
    return null; // Don't render until client-side
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
        <Link href="/" className="flex items-center gap-3">
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
      <nav className="hidden lg:block flex-1 mx-8 xl:mx-16">
        <ul className="flex items-center justify-center gap-6 xl:gap-8 2xl:gap-[52px]">
          {navItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[24px] xl:leading-[28px] 2xl:leading-[40px] font-medium transition-all duration-300 hover:text-primary hover:font-semibold cursor-pointer text-light/80 whitespace-nowrap"
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Desktop Buttons - Hidden on Mobile */}
      <div className="hidden lg:block flex-shrink-0 flex items-center gap-4">
        {user ? (
          // User is logged in - show dashboard and logout
          <>
            <Button
              variant="secondary"
              className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="primary"
              className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              onClick={() => router.push("/profile")}
            >
              Profile
            </Button>
          </>
        ) : (
          // User is not logged in - show sign in and get started
          <>
            <Button
              variant="secondary"
              className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              onClick={() => router.push("/signup")}
            >
              Get Started
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden flex flex-col space-y-1 p-2 z-50"
        aria-label="Toggle mobile menu"
      >
        <motion.span
          animate={
            isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3 }}
          className="w-6 h-0.5 bg-light rounded-full"
        />
        <motion.span
          animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-0.5 bg-light rounded-full"
        />
        <motion.span
          animate={
            isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3 }}
          className="w-6 h-0.5 bg-light rounded-full"
        />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-neutral/95 backdrop-blur-xl border-b border-neutral-400/20 lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Items */}
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

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-neutral-400/20 space-y-3">
                {user ? (
                  // User is logged in
                  <>
                    <Button
                      variant="secondary"
                      className="w-full justify-center"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/dashboard");
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/profile");
                      }}
                    >
                      Profile
                    </Button>
                  </>
                ) : (
                  // User is not logged in
                  <>
                    <Button
                      variant="secondary"
                      className="w-full justify-center"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/login");
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/signup");
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

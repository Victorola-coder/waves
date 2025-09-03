"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@/app/components/ui";
import { useAuth } from "@/app/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success("Welcome back! 🎵");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await googleLogin();
      toast.success("Google authentication initiated");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🌊</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Welcome Back</h1>
          <p className="text-neutral-400 mt-2">Continue your music journey</p>
        </div>

        {/* Login Form */}
        <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-600/30 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-neutral-700/50 border-neutral-500/30 text-white placeholder-neutral-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-neutral-700/50 border-neutral-500/30 text-white placeholder-neutral-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-600/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-800/50 text-neutral-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            variant="secondary"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full py-3 text-lg font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Chrome className="w-5 h-5 mr-2" />
            )}
            {isGoogleLoading ? "Connecting..." : "Google"}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-neutral-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-400 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

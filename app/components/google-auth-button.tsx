"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui";
import { Chrome } from "lucide-react";

interface GoogleAuthButtonProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
  variant?: "default" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  variant = "default",
  size = "default",
  className = "",
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Get Google OAuth URL
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to get Google OAuth URL");
      }

      const { authUrl } = await response.json();

      // Open Google OAuth in new window
      const authWindow = window.open(
        authUrl,
        "google-oauth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      // Listen for messages from the OAuth window
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === "GOOGLE_OAUTH_SUCCESS") {
          const { token } = event.data;
          onSuccess?.(token);
          authWindow?.close();
          window.removeEventListener("message", handleMessage);
        } else if (event.data.type === "GOOGLE_OAUTH_ERROR") {
          const { error } = event.data;
          onError?.(error);
          authWindow?.close();
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Check if window was closed manually
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          setIsLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error("Google OAuth error:", error);
      onError?.("Failed to start Google authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className={`bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 ${className}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Chrome className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Connecting..." : "Continue with Google"}
      </Button>
    </motion.div>
  );
}

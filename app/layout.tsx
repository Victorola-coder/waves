import "./global.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { AuthProvider } from "./hooks/use-auth";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Waves - Listen Together, Rise Together",
  description:
    "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
  applicationName: "Waves - Social Music Streaming",
  authors: [{ name: "Waves Team" }],
  keywords: [
    "Music",
    "Streaming",
    "Social",
    "Listening Parties",
    "Leaderboards",
    "Spotify",
    "YouTube Music",
  ],
  referrer: "origin",
  creator: "Waves",
  publisher: "Waves",
  robots: "index, follow",
  abstract:
    "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
  category: "Music",
  classification: "Social Music Streaming",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "Waves",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Waves - Listen Together, Rise Together",
    description:
      "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
    url: "https://waves.app",
    siteName: "Waves",
    locale: "en_US",
    images: [
      {
        url: "https://waves.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Waves - Social Music Streaming Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "waves",
    creator: "waves",
    title: "Waves - Listen Together, Rise Together",
    description:
      "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
    images: ["https://waves.app/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

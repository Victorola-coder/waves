import "./global.css";
import { Toaster } from "sonner";
import { AOS } from "./components/global";
import { Poppins, Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://waves.app"),
  icons: {
    icon: "/favicon.png",
  },
  title: "Waves - Listen Together, Rise Together",
  description:
    "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
  applicationName: "Waves - Social Music Streaming",
  authors: [{ name: "Waves Team", url: "https://waves.app" }],
  keywords: [
    "Music",
    "Streaming",
    "Social",
    "Listening Parties",
    "Leaderboards",
    "Spotify",
    "YouTube Music",
  ],
  creator: "Waves",
  publisher: "Waves",
  generator: "Next.js",
  referrer: "origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://waves.app",
    title: "Waves - Listen Together, Rise Together",
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
  },
  twitter: {
    site: "waves",
    creator: "waves",
    title: "Waves - Listen Together, Rise Together",
    description:
      "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
    card: "summary_large_image",
    images: ["https://waves.app/images/og-image.jpg"],
  },
  appleWebApp: {
    capable: true,
    title: "Waves",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  abstract:
    "Connect your music apps and listen together in real-time. Join listening parties, compete on leaderboards, and discover music with friends.",
  category: "Music",
  classification: "Social Music Streaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <Toaster richColors />
        <AOS />
        {children}
      </body>
    </html>
  );
}

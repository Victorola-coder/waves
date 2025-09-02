import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Waves brand typography system
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        geistSans: ["var(--font-geist-sans)", "sans-serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "fade-effect": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        loader: {
          "0%": {
            opacity: "0.2",
          },
          "100%": {
            opacity: "1",
          },
        },
        spin: {},
        "wave-float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "wave-flow": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "fade-in": "fade-effect 300ms linear",
        "slide-down": "slide-down 300ms linear forwards",
        "slide-up": "slide-up 300ms linear forwards",
        "rotate-clockwise": "rotate-clockwise 1s infinite linear",
        "loader-opacity": "loader 1s ease-in-out alternate infinite",
        "spin-slow": "spin 20s linear infinite",
        "wave-float": "wave-float 3s ease-in-out infinite",
        "wave-flow": "wave-flow 2s linear infinite",
      },
      colors: {
        // Waves brand color palette
        primary: {
          DEFAULT: "#0077B6", // Ocean Blue
          50: "#E6F3FA",
          100: "#CCE7F5",
          200: "#99CEEB",
          300: "#66B6E1",
          400: "#339DD7",
          500: "#0077B6", // Main Ocean Blue
          600: "#006FA4",
          700: "#005C8A",
          800: "#004970",
          900: "#003656",
        },
        secondary: {
          DEFAULT: "#00BFA6", // Seafoam Green
          50: "#E6FCFA",
          100: "#CCF9F5",
          200: "#99F3EB",
          300: "#66EDE1",
          400: "#33E7D7",
          500: "#00BFA6", // Main Seafoam Green
          600: "#00AC95",
          700: "#009984",
          800: "#008673",
          900: "#007362",
        },
        accent: {
          DEFAULT: "#FF6B6B", // Sunset Coral
          50: "#FFF0F0",
          100: "#FFE1E1",
          200: "#FFC3C3",
          300: "#FFA5A5",
          400: "#FF8787",
          500: "#FF6B6B", // Main Sunset Coral
          600: "#FF5252",
          700: "#FF3939",
          800: "#FF2020",
          900: "#FF0707",
        },
        neutral: {
          DEFAULT: "#1B262C", // Dark Slate
          50: "#F2F4F5",
          100: "#E5E9EB",
          200: "#CBD3D7",
          300: "#B1BDC3",
          400: "#97A7AF",
          500: "#1B262C", // Main Dark Slate
          600: "#182229",
          700: "#151E26",
          800: "#121A23",
          900: "#0F1620",
        },
        light: {
          DEFAULT: "#F0F3F4", // Misty White
          50: "#FDFEFE",
          100: "#FBFDFD",
          200: "#F7FBFB",
          300: "#F3F9F9",
          400: "#EFF7F7",
          500: "#F0F3F4", // Main Misty White
          600: "#E8EDEF",
          700: "#E0E7EA",
          800: "#D8E1E5",
          900: "#D0DBE0",
        },
        // Legacy colors for backward compatibility
        dark: {
          DEFAULT: "#141517",
          100: "#414141",
          200: "#121212",
          300: "#676B71",
        },
        main: {
          DEFAULT: "#E1DEF0",
          100: "#F3EFFD",
        },
      },
    },
  },
  plugins: [],
};
export default config;

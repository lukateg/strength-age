import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-montserrat)",
          "Montserrat",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        montserrat: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#4ECDC4", // Sage/teal from landing page
          foreground: "#ffffff",
          cream: "#f7f4f1",
          cream2: "#fbfaf8",
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#4ECDC4",
          600: "#3BB8B5",
          700: "#2A9D9A",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        pro: {
          DEFAULT: "var(--pro-gradient)",
          from: "var(--pro-from)",
          to: "var(--pro-to)",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // WarmView Brand Colors (from landing page)
        "qa-neutral": {
          dark: "#2B2D42", // Main dark navy text
          medium: "#6C757D", // Secondary gray text
          light: "#94A3B8", // Light gray text
          white: "#ffffff", // Pure white
          footer: "#f8f9fa", // Light footer background
          border: "#E0E4E7", // Light gray borders
        },
        "qa-success": "#4ECDC4", // Sage/teal - positive actions
        "qa-warning": "#FFD23F", // Yellow - warnings
        "qa-danger": "#FF6B6B", // Red/coral - negative/errors
        "qa-blue": "#3b82f6", // Blue accents
        // Legacy colors maintained for compatibility
        teal: {
          DEFAULT: "#4ECDC4", // Updated to match primary
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#4ECDC4",
          600: "#3BB8B5",
          700: "#2A9D9A",
        },
        green: {
          DEFAULT: "#4ECDC4", // Updated to sage color
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#4ECDC4",
          600: "#3BB8B5",
          700: "#2A9D9A",
        },
        blue: {
          DEFAULT: "#3b82f6",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        purple: {
          DEFAULT: "#7c3aed",
          50: "#faf5ff",
          100: "#f3e8ff",
          500: "#7c3aed",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        success: {
          DEFAULT: "#4ECDC4", // Updated to sage color
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#4ECDC4",
          600: "#3BB8B5",
          700: "#2A9D9A",
        },
        warning: {
          DEFAULT: "#FFD23F", // Updated to match landing page
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#FFD23F",
          600: "#F7C32E",
          700: "#E6B800",
        },
        danger: {
          DEFAULT: "#FF6B6B", // Red/coral from landing page
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#FF6B6B",
          600: "#EF4444",
          700: "#DC2626",
        },
        info: {
          DEFAULT: "#3b82f6",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        slate: {
          DEFAULT: "#1e293b",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 7px)", // Added custom xs size
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

import animate from "tailwindcss-animate";
// const plugins = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html,vue}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "#60a5fa",
          dark: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          alt: "#f5f5f7",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        text: {
          DEFAULT: "#1d1d1f",
          light: "#86868b",
        },
        success: "#34c759",
        error: "#ff3b30",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        DEFAULT: "12px",
      },
      boxShadow: {
        DEFAULT: "0 10px 30px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      animation: {
        fade: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};


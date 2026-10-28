import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const hsl = (v: string) => `hsl(var(--${v}))`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        heading: ["Outfit", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        surface: hsl("surface"),
        subtle: hsl("subtle"),
        indigo: hsl("indigo"),
        purple: hsl("purple"),
        success: hsl("success"),
        warning: hsl("warning"),
        error: hsl("error"),
        foreground: hsl("foreground"),
        primary: { DEFAULT: hsl("primary"), hover: hsl("primary-hover"), foreground: hsl("primary-foreground") },
        secondary: { DEFAULT: hsl("secondary"), foreground: hsl("secondary-foreground") },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: { DEFAULT: hsl("accent"), foreground: hsl("accent-foreground") },
        destructive: { DEFAULT: hsl("destructive"), foreground: hsl("destructive-foreground") },
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        navy: { DEFAULT: hsl("navy"), light: hsl("navy-light") },
        "super-dream": hsl("super-dream"),
        dream: hsl("dream"),
        standard: hsl("standard"),
        regular: hsl("regular"),
        expert: hsl("expert"),
        advanced: hsl("advanced"),
        pro: hsl("pro"),
        beginner: hsl("beginner"),
        sidebar: {
          DEFAULT: hsl("sidebar-background"),
          foreground: hsl("sidebar-foreground"),
          accent: hsl("sidebar-accent"),
          "accent-foreground": hsl("sidebar-accent-foreground"),
          border: hsl("sidebar-border"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 hsl(222 47% 11% / 0.05)",
        "card-hover": "0 4px 12px -2px hsl(222 47% 11% / 0.10)",
      },
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--dream) / 0.0)", opacity: "1" },
          "50%": { boxShadow: "0 0 10px 3px hsl(var(--dream) / 0.45)", opacity: "0.85" },
        },
      },
      animation: { glow: "glow 2s ease-in-out infinite" },
    },
  },
  plugins: [animate],
} satisfies Config;

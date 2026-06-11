import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Todos mapeados a CSS variables (ver app/dark-mode.css)
        ink: "rgb(var(--bg-rgb) / <alpha-value>)",
        warm: "rgb(var(--text-rgb) / <alpha-value>)",
        amber: "rgb(var(--amber-rgb) / <alpha-value>)",
        "amber-dk": "var(--amber-dk)",
        "amber-low": "var(--amber-low)",
        "on-amber": "var(--on-amber)",
        "warm-5": "var(--surface)",
        "warm-10": "var(--border)",
        "warm-20": "var(--text-20)",
        "warm-45": "var(--text-45)",
        "warm-60": "var(--text-60)",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "pulse-amber":"pulseAmber 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseAmber: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
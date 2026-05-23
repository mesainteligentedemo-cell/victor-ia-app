import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E0F12",
        warm: "#F8F7F5",
        amber: "#FFAA17",
        "amber-dk": "#CC8800",
        "amber-low": "rgba(255,170,23,0.08)",
        "warm-5": "rgba(248,247,245,0.05)",
        "warm-10": "rgba(248,247,245,0.10)",
        "warm-20": "rgba(248,247,245,0.20)",
        "warm-45": "rgba(248,247,245,0.45)",
        "warm-60": "rgba(248,247,245,0.60)",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Space Grotesk", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "pulse-amber": "pulseAmber 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseAmber: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Victor IA",
  description: "Tu agencia de inteligencia artificial — panel de trabajo",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23000000'/><text y='24' x='4' font-size='22' fill='%23FFFFFF'>V</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
};

// Aplica el tema guardado ANTES del primer paint (sin flash)
const themeInit = `(function(){try{var t=localStorage.getItem("vi-theme");if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script defer src="https://victor-ia-brain-tracker.vercel.app/vi-track.js" data-site="victor-ia-app" />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victor IA",
  description: "Tu agencia de inteligencia artificial — panel de trabajo",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230E0F12'/><text y='24' x='4' font-size='22' fill='%23FFAA17'>V</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="h-screen overflow-hidden bg-ink text-warm">{children}</body>
    </html>
  );
}

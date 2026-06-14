'use client'

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { initGSAP } from "@/lib/gsap-setup";
import { useEffect } from "react";
import "./globals.css";
import "@/styles/web4o-system.css";

// export const metadata = {
//   title: "Victor IA - Complete SaaS Platform",
//   description: "AI-powered SaaS with 10 modules, CRM, automation, and analytics",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=5",
// };

function GSAPInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initGSAP()
  }, [])

  return children
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz@0,9..144;1,9..144&family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        </head>
        <body className="bg-black text-white antialiased">
          <GSAPInitializer>
            <ErrorBoundary>{children}</ErrorBoundary>
          </GSAPInitializer>
        </body>
      </html>
    </ClerkProvider>
  );
}

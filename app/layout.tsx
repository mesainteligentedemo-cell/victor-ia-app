import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victor IA - Complete SaaS Platform",
  description: "AI-powered SaaS with 10 modules, CRM, automation, and analytics",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        </head>
        <body className="bg-white dark:bg-black text-black dark:text-white antialiased">
          <ErrorBoundary>{children}</ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}

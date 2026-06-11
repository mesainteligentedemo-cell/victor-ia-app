import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Victor IA SaaS',
  description: 'Complete AI-powered SaaS platform'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className="bg-white dark:bg-black text-black dark:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

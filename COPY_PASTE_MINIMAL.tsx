/**
 * COPIA Y PEGA MÍNIMO
 *
 * Reemplaza el contenido de tu app/layout.tsx con esto.
 * Nada más se necesita.
 */

'use client';

import Onboarding from '@/components/Onboarding';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          :root {
            --bg: #ffffff;
            --bg-secondary: #f3f4f6;
            --text: #1f2937;
            --text-secondary: #6b7280;
            --border: #e5e7eb;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #1a1a1a;
              --bg-secondary: #2a2a2a;
              --text: #f5f5f5;
              --text-secondary: #b8b8b8;
              --border: #333333;
            }
          }
        `}</style>
      </head>
      <body>
        <Onboarding />
        {children}
      </body>
    </html>
  );
}

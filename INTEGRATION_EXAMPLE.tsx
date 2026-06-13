/**
 * EJEMPLO COMPLETO DE INTEGRACIÓN
 * Copia esto en tu layout.tsx o app.tsx
 *
 * Este archivo muestra cómo integrar el componente Onboarding
 * en tu aplicación Next.js existente.
 */

'use client';

import Onboarding from '@/components/Onboarding';
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          /* Variables CSS para el Onboarding */
          :root {
            /* Tema claro */
            --bg: #ffffff;
            --bg-secondary: #f3f4f6;
            --text: #1f2937;
            --text-secondary: #6b7280;
            --border: #e5e7eb;
            --blue: rgb(59, 130, 246);
          }

          /* Tema oscuro (automático) */
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #1a1a1a;
              --bg-secondary: #2a2a2a;
              --text: #f5f5f5;
              --text-secondary: #b8b8b8;
              --border: #333333;
              --blue: rgb(59, 130, 246);
            }
          }

          /* Reset global */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          html, body {
            width: 100%;
            height: 100%;
          }

          body {
            background-color: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          /* Smooth transitions para tema */
          * {
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
          }
        `}</style>
      </head>
      <body>
        {/* Componente Onboarding — se muestra SOLO en primer acceso */}
        <Onboarding />

        {/* Tu contenido principal */}
        {children}
      </body>
    </html>
  );
}

/**
 * INSTRUCCIONES DE INTEGRACIÓN
 *
 * 1. Reemplaza el contenido de tu app/layout.tsx con esto
 * 2. Asegúrate de que el import de Onboarding sea correcto:
 *    import Onboarding from '@/components/Onboarding';
 * 3. Verifica que el archivo Onboarding.tsx esté en:
 *    C:\Users\inbou\victor-ia-app\components\Onboarding.tsx
 *
 * CARACTERÍSTICAS
 * ✓ localStorage guard: Solo aparece en primer acceso
 * ✓ 10 pasos educativos
 * ✓ Progreso visual
 * ✓ ESC para cerrar
 * ✓ Dark mode automático
 * ✓ Responsive mobile
 * ✓ Iconos dinámicos
 *
 * LIMPIAR PARA TESTING
 * En consola del navegador:
 * localStorage.removeItem('victor_onboarding_done');
 * location.reload();
 */

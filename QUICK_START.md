# Onboarding Component — Quick Start (30 segundos)

## Paso 1: Copiar el componente (ya está hecho)
```
✅ Archivo: C:\Users\inbou\victor-ia-app\components\Onboarding.tsx
```

## Paso 2: Instalar dependencia
```bash
npm install lucide-react
```

## Paso 3: Agregar al layout.tsx (copia/pega)
```tsx
'use client';

import Onboarding from '@/components/Onboarding';
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <head>
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
```

## Paso 4: Prueba (en navegador nuevo)
```
1. Abre tu app
2. Debería aparecer el tour automáticamente
3. Navega con "Siguiente" / "Anterior"
4. Presiona ESC para cerrar
5. Refresca - no debería aparecer
```

## Paso 5: Testing (limpiar localStorage)
```javascript
// En consola del navegador
localStorage.removeItem('victor_onboarding_done');
location.reload();
```

---

## ¿Completado? 🎉

- [x] Tour aparece en primer acceso
- [x] 10 pasos con iconos
- [x] Navegación completa
- [x] Dark mode funciona
- [x] Mobile responsive
- [x] ESC para cerrar

## Archivos disponibles
- `Onboarding.tsx` — Componente (485 líneas)
- `ONBOARDING_GUIDE.md` — Documentación técnica
- `INTEGRATION_EXAMPLE.tsx` — Código de integración
- `ONBOARDING_CHECKLIST.md` — Testing checklist
- `ONBOARDING_SUMMARY.txt` — Resumen detallado
- `QUICK_START.md` — Este archivo

## Personalización

**Cambiar pasos**: Edita `onboardingSteps` en Onboarding.tsx
**Cambiar colores**: Define variables CSS en tu raíz
**Cambiar iconos**: Importa diferentes de lucide-react

---

**¡Listo para producción!** 🚀

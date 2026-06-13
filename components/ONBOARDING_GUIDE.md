# Componente Onboarding — Victor IA App

## Características

- **10 pasos completos**: Welcome → Chat → Agents → Library → Analytics → Sales → Marketing → Support → Finance → Done
- **localStorage guard**: Solo se muestra en primer acceso (`victor_onboarding_done`)
- **Progreso visual**: Barra de progreso + indicadores por paso
- **Navegación intuitiva**: Botones Anterior/Siguiente + Saltar tour
- **ESC para cerrar**: Cierra el tour presionando Escape
- **Responsive**: Mobile-friendly en todos los tamaños
- **Iconos lucide-react**: Cada paso tiene un icono específico
- **Variables CSS**: Usa `var(--bg)`, `var(--text)`, etc. para adaptarse al tema

## Instalación

El componente ya está en:
```
C:\Users\inbou\victor-ia-app\components\Onboarding.tsx
```

## Integración en tu layout

Agrega el componente en el layout principal (ej: `layout.tsx` o `app.tsx`):

```tsx
import Onboarding from '@/components/Onboarding';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Onboarding />
        {children}
      </body>
    </html>
  );
}
```

## Estructura del componente

### Props
- No requiere props. Es completamente autónomo.

### Estado interno
- `currentStep`: Paso actual (0-9)
- `isVisible`: Visible/oculto
- `isAnimating`: Animación en progreso

### localStorage
- Clave: `victor_onboarding_done`
- Valor: `'true'` cuando completado
- Se guarda al completar o presionar "Saltar tour"

## Personalización

### Cambiar los 10 pasos

Edita el array `onboardingSteps` en el archivo:

```tsx
const onboardingSteps = [
  {
    id: 1,
    title: 'Tu título',
    description: 'Tu descripción',
    hint: '💡 Tip: ...',
    icon: TuIcono,  // De lucide-react
    color: 'from-blue-500 to-cyan-500',  // Gradiente Tailwind
  },
  // ... más pasos
];
```

### Cambiar colores

Los colores usan variables CSS. Edita en tu fichero de estilos global:

```css
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
```

### Cambiar los iconos

Todos los iconos vienen de `lucide-react`. Opciones:

```tsx
import {
  Rocket,           // Welcome
  MessageSquare,    // Chat
  Zap,             // Agents
  BookOpen,        // Library
  BarChart3,       // Analytics
  TrendingUp,      // Sales
  Megaphone,       // Marketing
  Headphones,      // Support
  DollarSign,      // Finance
  CheckCircle2,    // Done
} from 'lucide-react';
```

## Funcionalidad

### Botón "Siguiente"
- Avanza al siguiente paso
- En el último paso: cierra el tour y guarda `victor_onboarding_done` en localStorage

### Botón "Anterior"
- Retrocede al paso anterior
- Deshabilitado en el primer paso

### Botón "Saltar tour"
- Cierra inmediatamente
- Guarda `victor_onboarding_done` en localStorage
- No muestra más el tour

### Indicadores (puntos)
- 10 pequeños círculos al centro
- El actual es más ancho
- Clickeable: ir directo a cualquier paso

### ESC para cerrar
- Escucha `keydown` evento
- Cierra y guarda sin necesidad de botón

## Limpiar localStorage (para testing)

En la consola del navegador:
```javascript
localStorage.removeItem('victor_onboarding_done');
location.reload();
```

Esto vuelve a mostrar el tour al recargar.

## Mobile Responsiveness

- Ancho mínimo: 90% del viewport
- Ancho máximo: 640px
- Texto escalado: 24px en escritorio, ajusta automáticamente
- Botones con padding generoso para touch
- Flex layout para fluir en cualquier tamaño

## Dark Mode

Automático mediante variables CSS. No requiere código adicional.

Ejemplo de variables para dark:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;      /* Fondo modal */
    --text: #f5f5f5;     /* Texto principal */
    --text-secondary: #b8b8b8;  /* Subtítulos */
    --bg-secondary: #2a2a2a;    /* Cajas hint */
    --border: #333333;   /* Bordes */
  }
}
```

## Performance

- Sin dependencias externas (solo lucide-react)
- CSS-in-JS inline (sin bundle adicional)
- Animaciones suaves con transiciones CSS
- localStorage cacheado en memoria tras primer load
- Se destruye completamente cuando `isVisible = false`

## Notas técnicas

- Usa `'use client'` para ser un Client Component
- Soporta SSR sin problemas (verifica `typeof window`)
- Compatible con Next.js App Router
- Gradientes hardcodeados (no usa Tailwind classes por inline styles)
- Transiciones suaves: 200-400ms

## Exportación

El componente es la única export:

```tsx
export default function Onboarding() { ... }
```

Úsalo así:
```tsx
import Onboarding from '@/components/Onboarding';
```

## Troubleshooting

### El tour no aparece
- Revisa localStorage: `localStorage.getItem('victor_onboarding_done')`
- Debería ser `null` o `undefined` en primer acceso
- Si es `'true'`, limpia: `localStorage.removeItem('victor_onboarding_done')`

### Los estilos ven raros
- Verifica que las variables CSS estén definidas en tu raíz
- Ejemplo mínimo en `globals.css`:
```css
:root {
  --bg: #ffffff;
  --text: #1f2937;
  --bg-secondary: #f3f4f6;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
}
```

### ESC no funciona
- Asegúrate de que el componente sea un Client Component (`'use client'`)
- Revisa que no haya listeners conflictivos en otros componentes

## Ejemplo completo de uso en layout.tsx

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

---

**Creado**: 13 de junio de 2026  
**Componente**: Onboarding.tsx (641 líneas)  
**Licencia**: Privado — Victor IA

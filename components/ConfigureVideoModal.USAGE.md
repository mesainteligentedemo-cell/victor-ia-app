# ConfigureVideoModal — Uso y Integración

## Importación

```tsx
import ConfigureVideoModal from '@/components/ConfigureVideoModal';
```

## Props

```typescript
interface ConfigureVideoModalProps {
  isOpen: boolean;              // Controla si el modal está visible
  onClose: () => void;           // Callback cuando se cierra el modal
  onGenerate: (config: VideoConfig) => void;  // Callback cuando se genera el video
}
```

## Ejemplo Completo

```tsx
'use client';

import { useState } from 'react';
import ConfigureVideoModal from '@/components/ConfigureVideoModal';

export default function MyVideoGenerator() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateVideo = (config) => {
    console.log('Generando video con configuración:', config);
    
    // Aquí puedes hacer una llamada a API para generar el video
    // fetch('/api/generate-video', {
    //   method: 'POST',
    //   body: JSON.stringify(config),
    // })
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Generar Video
      </button>

      <ConfigureVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerateVideo}
      />
    </>
  );
}
```

## Estructura de Configuración Retornada

```typescript
interface VideoConfig {
  preset: string;           // 'cinema-studio' | 'storyboard' | 'kling' | 'veo'
  duration: string;         // '6s' | '8s' | '10s' | '15s' | '20s' | '30s' | 'Unlimited'
  aspect: string;           // '16:9' | '9:16' | '1:1' | '4:5' | '21:9'
  motion: string;           // 'Low' | 'Medium' | 'High' | 'Very High'
  speed: string;            // 'Slow (0.5x)' | 'Normal (1x)' | 'Fast (1.5x)' | 'Ultra (2x)'
  smoothness: string;       // 'Low' | 'Medium' | 'High' | 'Ultra'
  colorGrade: string;       // 'Neutral' | 'Warm' | 'Cool' | 'Cinematic' | 'Vintage'
  contrastLevel: string;    // 'Low' | 'Medium' | 'High' | 'Very High'
  saturation: string;       // '0%' a '200%' (slider)
  brightness: string;       // '0%' a '200%' (slider)
  audioType: string;        // 'Voiceover' | 'Music' | 'Ambient' | 'Mix' | 'Silent'
  audioVolume: string;      // '0%' | '25%' | '50%' | '75%' | '100%'
  socialNetworks: string[]; // ['youtube', 'instagram', 'tiktok', 'linkedin', 'facebook', 'twitter']
  effects: string[];        // Arrays de efectos seleccionados
  features: string[];       // Arrays de características seleccionadas
  marketTrends: boolean;    // Analizar tendencias o no
}
```

## Características Implementadas

✅ **UI/UX**
- Modal responsivo (mobile + desktop)
- Animaciones suaves
- Overlay con blur
- Iconos Lucide integrados

✅ **Funcionalidad**
- Estado completo con `useState`
- Validación de inputs obligatorios
- Selecciones múltiples (efectos, características, redes sociales)
- Sliders interactivos (saturación, brillo)
- Preview de duración en segundos

✅ **Secciones Expandibles**
- Configuración Video
- Configuración Audio
- Efectos
- Todas colapsables con ChevronDown icon

✅ **Estilos**
- Variables CSS inline
- Tema dark luxury
- Color principal: #00d9ff (cian)
- Sin Tailwind
- Totalmente personalizable

✅ **Interactividad**
- Hover effects en todos los botones
- Visual feedback (colores, sombras, scale)
- Transiciones suaves

## Personalización

### Cambiar Colores

Busca y reemplaza:
- `#00d9ff` → tu color primario
- `#1a1a1a` → color de fondo modal
- `#999`, `#aaa`, `#bbb` → escalas de grises

### Agregar Más Presets

```tsx
const PRESETS = [
  { id: 'cinema-studio', label: 'Cinema Studio 5.1', icon: '🎬' },
  // Añade aquí más presets
];
```

### Cambiar Opciones de Duración

```tsx
const DURATIONS = ['6s', '8s', '10s', '15s', '20s', '30s', 'Unlimited'];
// Modifica este array
```

## Validación

El componente valida:
- ✅ Preset seleccionado
- ✅ Duración seleccionada
- ✅ Aspecto seleccionado

Si alguno está vacío, muestra un `alert()`.

## Responsive Behavior

- **Desktop**: Layout completo con 4+ columnas de botones
- **Tablet**: Grid adaptive
- **Mobile**: 2 columnas en algunas secciones

## Integración con API

```tsx
const handleGenerateVideo = async (config) => {
  try {
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    
    const result = await response.json();
    console.log('Video generado:', result.videoUrl);
  } catch (error) {
    console.error('Error al generar:', error);
  }
};
```

## Notas

- Componente `'use client'` (Next.js 13+)
- Sin dependencias externas (Lucide incluido)
- TypeScript completo
- Listo para producción

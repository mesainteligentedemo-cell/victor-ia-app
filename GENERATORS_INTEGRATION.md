# Integración de Modales en Página Generators

## Resumen de Cambios

La página `app/dashboard/generators/page.tsx` ha sido actualizada para integrar los modales de configuración `ImageGeneratorModal` y `VideoGeneratorModal`.

## Cambios Realizados

### 1. Importaciones Agregadas
```typescript
import ImageGeneratorModal from '@/components/prospeccion/ImageGeneratorModal';
import VideoGeneratorModal from '@/components/prospeccion/VideoGeneratorModal';
import type { ImageGenerationParams, VideoGenerationParams } from '@/lib/prospeccion-types';
```

### 2. Estados Añadidos
```typescript
const [showImageModal, setShowImageModal] = useState(false);
const [showVideoModal, setShowVideoModal] = useState(false);
const [imageGenerating, setImageGenerating] = useState(false);
const [videoGenerating, setVideoGenerating] = useState(false);
const [imageError, setImageError] = useState<string | null>(null);
const [videoError, setVideoError] = useState<string | null>(null);
const [lastResult, setLastResult] = useState<any>(null);
```

### 3. Handlers para Imágenes

#### `handleOpenImageModal()`
- Limpia errores previos
- Abre el modal de imagen

#### `handleCloseImageModal()`
- Cierra el modal
- Limpia el estado de errores

#### `handleGenerateImage(params: ImageGenerationParams)`
- Realiza llamada POST a `/api/generate/image`
- Maneja errores y los muestra en el modal
- Guarda el resultado en `lastResult`
- Registra el evento en analytics
- Cierra automáticamente el modal si es exitoso

### 4. Handlers para Videos

#### `handleOpenVideoModal()`
- Limpia errores previos
- Abre el modal de video

#### `handleCloseVideoModal()`
- Cierra el modal
- Limpia el estado de errores

#### `handleGenerateVideo(params: VideoGenerationParams)`
- Realiza llamada POST a `/api/generate/video`
- Maneja errores y los muestra en el modal
- Guarda el resultado en `lastResult`
- Registra el evento en analytics
- Cierra automáticamente el modal si es exitoso

### 5. Modificación en Botones del Grid

Cada botón del generador ahora verifica:
- Si es `images` → abre `ImageGeneratorModal`
- Si es `videos` → abre `VideoGeneratorModal`
- Otros → abre el formulario clásico

### 6. Sección de Resultados

Agregada una sección que muestra:
- ✅ Notificación de éxito
- Job ID del trabajo generado
- Botón para ver imagen/video (si URL disponible)

### 7. Renderizado de Modales

Al final de la página se renderizan ambos modales con:
- `isOpen` y `onClose` para control visual
- `onGenerate` con handlers correspondientes
- `isGenerating` para mostrar estado de carga
- `error` para mostrar errores de validación

## Flujo de Usuario

### Para Generar Imagen:
1. Usuario hace clic en "Imágenes"
2. Se abre `ImageGeneratorModal`
3. Usuario completa:
   - Descripción (prompt)
   - Relación de aspecto (1:1, 16:9, 9:16)
   - Cantidad (1, 2, 4 imágenes)
   - Opcional: usa presets rápidos
4. Usuario hace clic en "Generar"
5. Modal muestra "Generando..."
6. Al completar:
   - Modal se cierra automáticamente
   - Resultado aparece en sección "Resultado de generación"

### Para Generar Video:
1. Usuario hace clic en "Videos"
2. Se abre `VideoGeneratorModal`
3. Usuario completa:
   - Descripción (prompt)
   - Duración (5-30 segundos)
   - Relación de aspecto (16:9, 9:16, 1:1)
   - Opcional: usa presets rápidos
4. Usuario hace clic en "Generar Video"
5. Modal muestra "Generando... (~ 2-3 min)"
6. Al completar:
   - Modal se cierra automáticamente
   - Resultado aparece en sección "Resultado de generación"

## Características

### Validaciones
- Prompt mínimo de 20 caracteres (validado en modal)
- Errores se muestran en el modal
- Botones deshabilitados durante generación

### Responsividad
- Grid del generador: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Modales se adaptan a pantalla (max-w-2xl)
- Overflow scroll si contenido es muy grande

### Dark Mode
- Todos los elementos soportan dark mode
- Colores adaptados para ambos temas

### Analytics
- Se registra cada generación con `ANALYTICS_EVENTS.GENERATOR_USED`
- Incluye tipo de generador y Job ID

## Dependencias

Estas importaciones ya existen en el proyecto:
- `react` (useState)
- `lucide-react` (Wand2, Loader)
- `@/lib/hooks/useAnalytics`
- `@/components/prospeccion/ImageGeneratorModal`
- `@/components/prospeccion/VideoGeneratorModal`
- `@/lib/prospeccion-types`

## Testing

Para verificar que todo funciona:

1. **Navegar a `/dashboard/generators`**
2. **Hacer clic en "Imágenes"**
   - Debe abrir `ImageGeneratorModal`
   - Escribir prompt (min. 20 caracteres)
   - Hacer clic en "Generar Imagen"
   - Debe llamar `/api/generate/image`
   - Resultado debe aparecer en sección de resultados

3. **Hacer clic en "Videos"**
   - Debe abrir `VideoGeneratorModal`
   - Escribir prompt (min. 20 caracteres)
   - Hacer clic en "Generar Video"
   - Debe llamar `/api/generate/video`
   - Resultado debe aparecer en sección de resultados

4. **Otros generadores (Sitios, Documentos, Emails, Audio)**
   - Deben abrir formulario clásico sin cambios
   - Funcionalidad existente sin alteraciones

## Archivos Modificados

- `C:\Users\inbou\victor-ia-app\app\dashboard\generators\page.tsx`

## Archivos No Modificados (pero relacionados)

- `C:\Users\inbou\victor-ia-app\components\prospeccion\ImageGeneratorModal.tsx`
- `C:\Users\inbou\victor-ia-app\components\prospeccion\VideoGeneratorModal.tsx`
- `C:\Users\inbou\victor-ia-app\lib\prospeccion-types.ts`
- API endpoints en `C:\Users\inbou\victor-ia-app\app\api\generate\`

## Notas Importantes

1. **Los endpoints `/api/generate/image` y `/api/generate/video` deben estar implementados** y seguir el contrato de request/response esperado.

2. **Respuesta esperada del API:**
   ```typescript
   {
     jobId: string;
     url?: string;  // URL del recurso generado
     status: string;
     message?: string;
   }
   ```

3. **Si la API no retorna en el formato esperado**, el error se mostrará en el modal y en la consola del navegador.

4. **Los presets rápidos** usan la estructura de `QUICK_PRESETS_IMAGE` y `QUICK_PRESETS_VIDEO` del archivo `prospeccion-types.ts`.

5. **El campo `quantity` de imágenes** puede ser 1, 2 o 4 unidades.

6. **El campo `duration` de videos** puede ser 5, 10, 15, 20, 25 o 30 segundos.

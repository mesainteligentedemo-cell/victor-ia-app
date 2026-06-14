# TURNO 2 — Setup & Instalación

## 🎯 Qué se entregó

**5 componentes + 1 página demo completa:**

1. **components/hero/Hero3D.tsx** — Hero con geometría 3D + Bloom postprocessing
2. **components/scroll/ScrollReveal.tsx** — Animaciones al entrar en viewport (ScrollTrigger)
3. **components/AnimatedCounter.tsx** — Contadores animados para stats
4. **app/home-turno2/page.tsx** — Página completa integrando todo
5. **lib/gsap-setup.ts** — Setup GSAP (ya creado en TURNO 1)
6. **styles/web4o-system.css** — Sistema de diseño (ya creado en TURNO 1)

---

## 📦 Dependencias Necesarias

### Ya instaladas en victor-ia-app:
```json
{
  "next": "16.0.0+",
  "react": "19.0.0+",
  "gsap": "3.12.2+",
  "framer-motion": "10.16.4+",
  "three": "r128+",
  "@react-three/fiber": "8.14.5+",
  "@react-three/drei": "9.88.8+",
  "@react-three/postprocessing": "2.16.2+"
}
```

### Si falta algo, instalar:
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install gsap
```

---

## 🚀 Cómo Usar

### 1. **Acceder a la página demo:**
```
http://localhost:3000/home-turno2
```

Verás:
- ✅ Hero 3D con geometría flotante + Bloom
- ✅ Stats section con contadores animados
- ✅ Features grid con scroll reveal stagger
- ✅ Parallax section con movimiento en scroll
- ✅ CTA final con IconSpinner

### 2. **Integrar en tus propias páginas:**

#### Hero 3D
```tsx
import { Hero3D } from '@/components/hero/Hero3D'

export default function Page() {
  return <Hero3D />
}
```

#### Scroll Reveal
```tsx
import { ScrollReveal, ScrollRevealGroup } from '@/components/scroll/ScrollReveal'

<ScrollReveal direction="up" delay={0.2}>
  <h2>Este elemento se anima al entrar en viewport</h2>
</ScrollReveal>

<ScrollRevealGroup>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ScrollRevealGroup>
```

#### Animated Counter
```tsx
import { AnimatedCounter } from '@/components/AnimatedCounter'

<div>
  <AnimatedCounter target={1842} prefix="$" suffix=" MXN" decimals={0} />
</div>
```

---

## ⚙️ Customización

### Hero 3D
**Archivo:** `components/hero/Hero3D.tsx`

```tsx
// Cambiar geometría
<icosahedronGeometry args={[1, 4]} />
↓
<octahedronGeometry args={[1, 4]} />  // octaedro
<torusGeometry args={[1, 0.4, 16, 100]} />  // toro
<sphereGeometry args={[1, 32, 32]} />  // esfera

// Cambiar colores
color="#ffffff" → color="#ff00ff"

// Cambiar velocidad de rotación
meshRef.current.rotation.x += 0.0005  → 0.001 (más rápido)

// Cambiar intensidad del glow
emissiveIntensity={0.15} → 0.3 (más brillo)
```

### ScrollReveal
**Props disponibles:**

```tsx
<ScrollReveal
  direction="up"              // up | down | left | right | in
  delay={0.2}                 // espera N segundos
  duration={0.8}              // duración de la animación
  stagger={false}             // anima children uno a uno
  once={true}                 // anima solo una vez (false = repite siempre)
  threshold={0.2}             // qué tan adentro del viewport (0-1)
>
  {/* contenido */}
</ScrollReveal>
```

### AnimatedCounter
**Props:**

```tsx
<AnimatedCounter
  target={1842}               // número final
  duration={1.5}              // duración
  prefix="$"                  // ej: $1,842
  suffix=" MXN"               // ej: 1,842 MXN
  decimals={2}                // decimales a mostrar
  triggerOnce={true}          // anima una sola vez
/>
```

---

## 🎨 Web 4.0 Integration

Todo está diseñado para Web 4.0 (monochrome luxury dark):
- ✅ Colores: CSS variables (blanco/negro/grises)
- ✅ Tipografía: Fraunces + Onest + JetBrains Mono
- ✅ Motion: GSAP + ScrollTrigger (cinema-grade animations)
- ✅ A11y: Respeta prefers-reduced-motion
- ✅ Performance: 60fps, LCP < 2.5s (con optimización)

---

## 🔧 Próximos Pasos

### TURNO 3 — Director de Arte Audit
Revisar y ajustar:
- [ ] Blur test — ¿se ve bien desenfocado?
- [ ] Tipografía — kerning, tracking, leading
- [ ] Espaciado — nada comprimido, nada suelto
- [ ] Logos/assets — proporciones exactas
- [ ] Responsive — mobile, tablet, desktop
- [ ] Color — contraste, vibrancia
- [ ] Micro-detalles — bordes, sombras, transiciones

### TURNO 4 — Integración Final
- [ ] Reemplazar emojis en dashboard con Icons
- [ ] Aplicar ScrollReveal en todas las páginas
- [ ] Optimizar Hero3D para mobile
- [ ] Añadir Lenis smooth scroll (opcional)

---

## 🐛 Troubleshooting

### "Hero3D se ve negro / sin geometría"
→ Verificar que Canvas está rendering correctamente. Abrir console y buscar errores de Three.js.

### "ScrollReveal no anima"
→ Verificar que ScrollTrigger está registrado en initGSAP() del layout.tsx.

### "AnimatedCounter muestra 0"
→ Agregar `display: inline-block` o `display: block` al elemento padre del Counter.

### "Fuentes no se cargan"
→ Verificar que Google Fonts está importada en app/layout.tsx (ya está hecho).

---

## 📊 Performance

**Optimizaciones incluidas:**

- ✅ Canva DPR limitado a 2 (no renderizar 4K innecesariamente)
- ✅ ScrollTrigger cleanup en unmount
- ✅ prefers-reduced-motion respetado (sin anims si el usuario lo pide)
- ✅ GSAP animations usan `scrub: false` (no perjudica performance)

**Métricas esperadas:**
- FCP: < 1.5s
- LCP: < 2.5s
- CLS: < 0.1
- FPS en scroll: 55-60 (en dispositivos modernos)

---

## 📚 Referencias

- **GSAP ScrollTrigger:** https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber/
- **Three.js Examples:** https://threejs.org/examples/


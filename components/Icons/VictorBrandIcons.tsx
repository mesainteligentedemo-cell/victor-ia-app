'use client';

/**
 * VictorBrandIcons — 21 custom geometric SVGs, one per agent category.
 *
 * Design DNA: matches the Victor IA logo/favicon (angular geometry, no curves).
 * Rules:
 * - viewBox="0 0 24 24", strokeWidth=2, fill=none
 * - strokeLinecap="butt"  — sharp line ends
 * - strokeLinejoin="miter" — acute angle corners
 * - color: currentColor (inherits from parent — white on dark, black on light)
 * - max 4-5 paths/lines per icon
 * - NO rounded shapes — only triangles, straight lines, rectangles, diamonds
 */

import { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'butt' as const,
  strokeLinejoin: 'miter' as const,
});

/* ─── 1. agente-maestro — Triángulo apex + línea base ─────────────────────── */
export function VIAgenteMaestro({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="12 3 22 20 2 20" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

/* ─── 2. automatizacion — Zig-zag angular ─────────────────────────────────── */
export function VIAutomatizacion({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polyline points="2 8 7 4 12 8 17 4 22 8" />
      <polyline points="2 16 7 12 12 16 17 12 22 16" />
    </svg>
  );
}

/* ─── 3. diseno-e-interfaces — Rombo + línea vertical ─────────────────────── */
export function VIDisenoInterfaces({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="12 2 22 12 12 22 2 12" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  );
}

/* ─── 4. dev-y-codigo — Brackets < > ──────────────────────────────────────── */
export function VIDevCodigo({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polyline points="8 5 2 12 8 19" />
      <polyline points="16 5 22 12 16 19" />
    </svg>
  );
}

/* ─── 5. produccion-creativa — Dos triángulos opuestos ────────────────────── */
export function VIProduccionCreativa({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="2 4 12 14 22 4" />
      <polygon points="2 20 12 10 22 20" />
    </svg>
  );
}

/* ─── 6. sitios-y-publicacion — Tres líneas en cascada ────────────────────── */
export function VISitiosPublicacion({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="2" y1="6" x2="22" y2="6" />
      <line x1="6" y1="12" x2="22" y2="12" />
      <line x1="10" y1="18" x2="22" y2="18" />
    </svg>
  );
}

/* ─── 7. copy-y-marketing — Flecha diagonal ascendente ────────────────────── */
export function VICopyMarketing({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="9 5 19 5 19 15" />
    </svg>
  );
}

/* ─── 8. video-y-medios — Play triangle ───────────────────────────────────── */
export function VIVideoMedios({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="5 3 19 12 5 21" />
      <line x1="19" y1="3" x2="19" y2="21" />
    </svg>
  );
}

/* ─── 9. video-juegos-y-3d — Cuadrícula 3×3 ───────────────────────────────── */
export function VIVideoJuegos3D({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="8" y1="2" x2="8" y2="22" />
      <line x1="16" y1="2" x2="16" y2="22" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="2" y1="16" x2="22" y2="16" />
    </svg>
  );
}

/* ─── 10. hubspot-crm — Dos cuadrados + línea diagonal ────────────────────── */
export function VIHubspotCRM({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="2" width="8" height="8" />
      <rect x="14" y="14" width="8" height="8" />
      <line x1="10" y1="10" x2="14" y2="14" />
    </svg>
  );
}

/* ─── 11. inmobiliaria — Escaleras ascendentes ─────────────────────────────── */
export function VIInmobiliaria({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polyline points="2 20 2 16 8 16 8 12 14 12 14 8 20 8 20 4" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

/* ─── 12. seguridad — Escudo geométrico ────────────────────────────────────── */
export function VISeguridad({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="12 2 22 6 22 14 12 22 2 14 2 6" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="12" y1="16" x2="12" y2="16" />
    </svg>
  );
}

/* ─── 13. it-y-tecnologia — CPU / cuadrado con pines ──────────────────────── */
export function VIITTecnologia({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="6" y="6" width="12" height="12" />
      <line x1="9" y1="2" x2="9" y2="6" />
      <line x1="15" y1="2" x2="15" y2="6" />
      <line x1="9" y1="18" x2="9" y2="22" />
      <line x1="15" y1="18" x2="15" y2="22" />
    </svg>
  );
}

/* ─── 14. liderazgo — Libro abierto angular ───────────────────────────────── */
export function VILiderazgo({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="2 4 12 4 12 20 2 20" />
      <polygon points="12 4 22 4 22 20 12 20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

/* ─── 15. neurociencias — Neurona cruciforme ───────────────────────────────── */
export function VINeurociencias({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

/* ─── 16. negocio-y-estrategia — Maletín angular ──────────────────────────── */
export function VINegocioEstrategia({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="8" width="20" height="13" />
      <polyline points="8 8 8 5 16 5 16 8" />
      <line x1="2" y1="14" x2="22" y2="14" />
    </svg>
  );
}

/* ─── 17. ventas-y-marketing-sectorial — Target cuadrados ─────────────────── */
export function VIVentasMarketing({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="2" width="20" height="20" />
      <rect x="7" y="7" width="10" height="10" />
      <rect x="10" y="10" width="4" height="4" />
    </svg>
  );
}

/* ─── 18. seo-y-contenido — Lupa geométrica ───────────────────────────────── */
export function VISEOContenido({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="3" width="12" height="12" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  );
}

/* ─── 19. diseno-especializado — Wireframe interfaz ───────────────────────── */
export function VIDisenoEspecializado({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="2" width="20" height="20" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="8" y1="8" x2="8" y2="22" />
    </svg>
  );
}

/* ─── 20. fabrica-de-contenido — Flujo diagonal ────────────────────────────── */
export function VIFabricaContenido({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="2" width="6" height="6" />
      <rect x="16" y="16" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="8" y1="8" x2="9" y2="9" />
      <line x1="15" y1="15" x2="16" y2="16" />
    </svg>
  );
}

/* ─── 21. otros — V anidada doble (logo DNA) ───────────────────────────────── */
export function VIOtros({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polyline points="2 4 12 20 22 4" />
      <polyline points="6 4 12 14 18 4" />
    </svg>
  );
}

/* ─── Map: iconId → component ────────────────────────────────────────────── */

const VICTOR_ICON_MAP: Record<string, (p: IconProps) => JSX.Element> = {
  'agente-maestro':               VIAgenteMaestro,
  'automatizacion':               VIAutomatizacion,
  'diseno-e-interfaces':          VIDisenoInterfaces,
  'dev-y-codigo':                 VIDevCodigo,
  'produccion-creativa':          VIProduccionCreativa,
  'sitios-y-publicacion':         VISitiosPublicacion,
  'copy-y-marketing':             VICopyMarketing,
  'video-y-medios':               VIVideoMedios,
  'video-juegos-y-3d':            VIVideoJuegos3D,
  'hubspot-crm':                  VIHubspotCRM,
  'inmobiliaria':                 VIInmobiliaria,
  'seguridad':                    VISeguridad,
  'it-y-tecnologia':              VIITTecnologia,
  'liderazgo':                    VILiderazgo,
  'neurociencias':                VINeurociencias,
  'negocio-y-estrategia':         VINegocioEstrategia,
  'ventas-y-marketing-sectorial': VIVentasMarketing,
  'seo-y-contenido':              VISEOContenido,
  'diseno-especializado':         VIDisenoEspecializado,
  'fabrica-de-contenido':         VIFabricaContenido,
  'otros':                        VIOtros,
};

/* ─── Public component ───────────────────────────────────────────────────── */

interface VictorBrandIconProps extends IconProps {
  /**
   * category slug from agents-manifest.json
   * e.g. "agente-maestro", "dev-y-codigo", "seguridad"
   */
  category: string;
  /** Accessible label; pass when icon is the only content */
  label?: string;
}

export function VictorBrandIcon({ category, label, size = 20, ...rest }: VictorBrandIconProps) {
  const Icon = VICTOR_ICON_MAP[category] ?? VIOtros;
  return (
    <span
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon size={size} aria-hidden {...rest} />
    </span>
  );
}

/**
 * Category → icon component lookup (for direct use without wrapper span)
 */
export const VictorBrandIcons: Record<string, (p: IconProps) => JSX.Element> = VICTOR_ICON_MAP;

/**
 * Legacy alias — same as VICTOR_ICON_MAP keys, kept for backwards compat
 * with any existing CATEGORY_ICON usage
 */
export const VICTOR_CATEGORY_ICON: Record<string, string> = Object.fromEntries(
  Object.keys(VICTOR_ICON_MAP).map((k) => [k, k])
);
'use client';

/**
 * AgentIcons — 21 custom monochrome SVGs, one per agent category.
 *
 * Design rules:
 * - 24 × 24 viewBox, stroke-width 2, fill none
 * - color: currentColor (inherits from parent)
 * - style: Lucide-quality, minimal, clean lines
 * - accessibility: aria-hidden by default; wrap in <span aria-label="..."> in consumers
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
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/* ─── Individual icons ────────────────────────────────────────────────────── */

export function IconRobot({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="8" width="18" height="12" rx="3" />
      <circle cx="9" cy="14" r="1.5" />
      <circle cx="15" cy="14" r="1.5" />
      <path d="M12 2v4M9 8V6M15 8V6" />
      <path d="M7 20v2M17 20v2" />
    </svg>
  );
}

export function IconZap({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z" />
    </svg>
  );
}

export function IconPalette({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5" cy="9" r="1.5" />
      <circle cx="15.5" cy="9" r="1.5" />
      <circle cx="12" cy="16" r="1.5" />
      <path d="M19.5 14.5c.5-1 .5-3-1.5-3s-3 1.5-3 3c0 1 .5 2 2 2h2c1 0 2-.5 2-2s-1-2-2-2" />
    </svg>
  );
}

export function IconCode({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function IconFilm({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M2 9h5M17 9h5M2 15h5M17 15h5" />
    </svg>
  );
}

export function IconGlobe({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10" />
      <path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IconPen({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function IconVideo({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

export function IconGamepad({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="7" width="20" height="12" rx="5" />
      <path d="M7 12h4M9 10v4" />
      <circle cx="15.5" cy="12" r="1" />
      <circle cx="17.5" cy="10.5" r="1" />
    </svg>
  );
}

export function IconDatabase({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function IconHome({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function IconShield({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function IconCpu({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9 7V3M15 7V3M9 21v-4M15 21v-4M7 9H3M7 15H3M21 9h-4M21 15h-4" />
    </svg>
  );
}

export function IconGraduation({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <path d="M6 10v6c0 2 2.69 4 6 4s6-2 6-4v-6" />
      <line x1="22" y1="7" x2="22" y2="13" />
    </svg>
  );
}

export function IconBrain({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M9.5 2a3.5 3.5 0 0 0-3 5.5A3.5 3.5 0 0 0 3 11a3.5 3.5 0 0 0 2 3.13V15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-.87A3.5 3.5 0 0 0 21 11a3.5 3.5 0 0 0-3.5-3.5A3.5 3.5 0 0 0 14.5 2" />
      <path d="M12 2v4M12 17v5M9 12h6" />
    </svg>
  );
}

export function IconBriefcase({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IconTarget({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function IconSearch({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IconLayers({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function IconFactory({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M2 20V8l6-4v4l6-4v4l4-2v14H2z" />
      <line x1="6" y1="14" x2="6" y2="14.01" />
      <line x1="10" y1="14" x2="10" y2="14.01" />
      <line x1="14" y1="14" x2="14" y2="14.01" />
    </svg>
  );
}

export function IconPuzzle({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M14.5 2H9.5a1 1 0 0 0-1 1v1.5a1.5 1.5 0 0 1-3 0V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h1.5a1.5 1.5 0 0 1 0 3H3a1 1 0 0 0-1 1V18a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1v-1.5a1.5 1.5 0 0 1 3 0V18a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-4.5a1 1 0 0 0-1-1h-1.5a1.5 1.5 0 0 1 0-3H18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-3.5z" />
    </svg>
  );
}

/* ─── Map: iconId → component ────────────────────────────────────────────── */

const ICON_MAP: Record<string, (p: IconProps) => JSX.Element> = {
  robot:       IconRobot,
  zap:         IconZap,
  palette:     IconPalette,
  code:        IconCode,
  film:        IconFilm,
  globe:       IconGlobe,
  pen:         IconPen,
  video:       IconVideo,
  gamepad:     IconGamepad,
  database:    IconDatabase,
  home:        IconHome,
  shield:      IconShield,
  cpu:         IconCpu,
  graduation:  IconGraduation,
  brain:       IconBrain,
  briefcase:   IconBriefcase,
  target:      IconTarget,
  search:      IconSearch,
  layers:      IconLayers,
  factory:     IconFactory,
  puzzle:      IconPuzzle,
};

/* ─── Public component ───────────────────────────────────────────────────── */

interface AgentIconProps extends IconProps {
  /** iconId from agents-manifest.json, e.g. "robot", "zap", "palette" */
  id: string;
  /** Accessible label; pass when icon is the only content (e.g. no visible text) */
  label?: string;
}

export function AgentIcon({ id, label, size = 20, ...rest }: AgentIconProps) {
  const Icon = ICON_MAP[id] ?? IconPuzzle;
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

/* ─── Category → iconId lookup ────────────────────────────────────────────── */

export const CATEGORY_ICON: Record<string, string> = {
  'agente-maestro':               'robot',
  'automatizacion':               'zap',
  'diseno-e-interfaces':          'palette',
  'dev-y-codigo':                 'code',
  'produccion-creativa':          'film',
  'sitios-y-publicacion':         'globe',
  'copy-y-marketing':             'pen',
  'video-y-medios':               'video',
  'video-juegos-y-3d':            'gamepad',
  'hubspot-crm':                  'database',
  'inmobiliaria':                 'home',
  'seguridad':                    'shield',
  'it-y-tecnologia':              'cpu',
  'liderazgo':                    'graduation',
  'neurociencias':                'brain',
  'negocio-y-estrategia':         'briefcase',
  'ventas-y-marketing-sectorial': 'target',
  'seo-y-contenido':              'search',
  'diseno-especializado':         'layers',
  'fabrica-de-contenido':         'factory',
  'otros':                        'puzzle',
};
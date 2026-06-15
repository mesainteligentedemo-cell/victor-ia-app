'use client';

/**
 * AgentIcons — 21 custom geometric SVGs, one per agent category.
 *
 * Visual DNA: matches Victor IA logo/favicon — angular geometry, NO curves.
 * - viewBox="0 0 24 24", strokeWidth=2, fill=none
 * - strokeLinecap="butt"   — sharp line ends
 * - strokeLinejoin="miter" — acute angle corners
 * - color: currentColor (inherits white/black from parent)
 *
 * This file re-exports everything from VictorBrandIcons.tsx and
 * provides the AgentIcon wrapper used by dashboard/AgentCard.tsx.
 */

import { type SVGProps } from 'react';
import {
  VictorBrandIcon,
  VictorBrandIcons,
  VIAgenteMaestro,
  VIAutomatizacion,
  VIDisenoInterfaces,
  VIDevCodigo,
  VIProduccionCreativa,
  VISitiosPublicacion,
  VICopyMarketing,
  VIVideoMedios,
  VIVideoJuegos3D,
  VIHubspotCRM,
  VIInmobiliaria,
  VISeguridad,
  VIITTecnologia,
  VILiderazgo,
  VINeurociencias,
  VINegocioEstrategia,
  VIVentasMarketing,
  VISEOContenido,
  VIDisenoEspecializado,
  VIFabricaContenido,
  VIOtros,
} from './VictorBrandIcons';

/* Named re-exports that match legacy Lucide-style names used elsewhere */
export {
  VictorBrandIcon,
  VictorBrandIcons,
  VIAgenteMaestro   as IconRobot,
  VIAutomatizacion  as IconZap,
  VIDisenoInterfaces as IconPalette,
  VIDevCodigo       as IconCode,
  VIProduccionCreativa as IconFilm,
  VISitiosPublicacion  as IconGlobe,
  VICopyMarketing   as IconPen,
  VIVideoMedios     as IconVideo,
  VIVideoJuegos3D   as IconGamepad,
  VIHubspotCRM      as IconDatabase,
  VIInmobiliaria    as IconHome,
  VISeguridad       as IconShield,
  VIITTecnologia    as IconCpu,
  VILiderazgo       as IconGraduation,
  VINeurociencias   as IconBrain,
  VINegocioEstrategia as IconBriefcase,
  VIVentasMarketing as IconTarget,
  VISEOContenido    as IconSearch,
  VIDisenoEspecializado as IconLayers,
  VIFabricaContenido    as IconFactory,
  VIOtros               as IconPuzzle,
};

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/* ─── Category → iconId lookup ────────────────────────────────────────────── */

export const CATEGORY_ICON: Record<string, string> = {
  'agente-maestro':               'agente-maestro',
  'automatizacion':               'automatizacion',
  'diseno-e-interfaces':          'diseno-e-interfaces',
  'dev-y-codigo':                 'dev-y-codigo',
  'produccion-creativa':          'produccion-creativa',
  'sitios-y-publicacion':         'sitios-y-publicacion',
  'copy-y-marketing':             'copy-y-marketing',
  'video-y-medios':               'video-y-medios',
  'video-juegos-y-3d':            'video-juegos-y-3d',
  'hubspot-crm':                  'hubspot-crm',
  'inmobiliaria':                 'inmobiliaria',
  'seguridad':                    'seguridad',
  'it-y-tecnologia':              'it-y-tecnologia',
  'liderazgo':                    'liderazgo',
  'neurociencias':                'neurociencias',
  'negocio-y-estrategia':         'negocio-y-estrategia',
  'ventas-y-marketing-sectorial': 'ventas-y-marketing-sectorial',
  'seo-y-contenido':              'seo-y-contenido',
  'diseno-especializado':         'diseno-especializado',
  'fabrica-de-contenido':         'fabrica-de-contenido',
  'otros':                        'otros',
};

/* ─── Public AgentIcon component — used by dashboard/AgentCard.tsx ─────────── */

interface AgentIconProps extends IconProps {
  /**
   * id = category slug from agents-manifest.json
   * AgentCard.tsx passes: agent.iconId ?? CATEGORY_ICON[agent.category] ?? 'otros'
   * With the new system, CATEGORY_ICON values are category slugs, so id === category
   */
  id: string;
  label?: string;
}

export function AgentIcon({ id, label, size = 20, ...rest }: AgentIconProps) {
  return (
    <VictorBrandIcon
      category={id}
      label={label}
      size={size}
      {...rest}
    />
  );
}
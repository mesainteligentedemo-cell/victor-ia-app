/**
 * VICTOR ICONS — Sistema de iconografía propia de Victor IA
 * ----------------------------------------------------------------------------
 * DNA visual: la "V" geométrica. Triángulos, líneas rectas a 45/60/90°,
 * cero curvas suaves, mucho whitespace (densidad 25-35%).
 *
 * Especificación técnica (INMUTABLE — todo icono la respeta):
 *   viewBox        0 0 24 24
 *   stroke-width   2
 *   fill           none (outline)
 *   stroke         currentColor (hereda blanco/negro del contexto)
 *   stroke-linecap miter -> "butt"  (ángulos agudos, no redondeados)
 *   stroke-linejoin "miter"          (esquinas nítidas)
 *
 * Familias:
 *   A. AGENTES  (21) — categorías de skills/agentes
 *   B. UI       (15) — navegación, acciones, feedback
 *   C. STATUS   (4)  — loading, success, error, pending
 *
 * Uso:
 *   import { VictorIcon } from "@/components/icons/victor-icons/VictorIcons";
 *   <VictorIcon name="maestria" size={20} />
 *   <VictorIcon name="check" className="text-gold" strokeWidth={2.5} />
 *
 * El nombre canónico de cada icono se mantiene en sync con victor-icons.js
 * (versión vanilla para el website). Una sola fuente de verdad: este archivo.
 */

import * as React from "react";

// ─────────────────────────────────────────────────────────────────────────
// PATHS — cada entrada es el INNER markup del <svg> (currentColor, stroke 2).
// Diseñados sobre grid de 24 con 2px de inset óptico (área viva 2..22).
// ─────────────────────────────────────────────────────────────────────────

export const VICTOR_ICON_PATHS: Record<string, string> = {
  // ===== A. AGENTES / CATEGORÍAS (21) =====

  // 1. Maestría — la V madre, invertida en apex (triángulo apuntando arriba) + base
  maestria: `<polyline points="3 20 12 4 21 20"/><line x1="7" y1="20" x2="17" y2="20"/>`,

  // 2. Creatividad — dos triángulos opuestos (dualidad / chispa)
  creatividad: `<polyline points="4 11 12 3 12 11"/><polyline points="20 13 12 21 12 13"/>`,

  // 3. Código — brackets angulares < >
  codigo: `<polyline points="9 6 3 12 9 18"/><polyline points="15 6 21 12 15 18"/>`,

  // 4. Datos — pirámide de triángulos apilados (3 niveles)
  datos: `<polyline points="6 14 12 9 18 14"/><polyline points="4 20 12 13 20 20"/><polyline points="9 9 12 6 15 9"/>`,

  // 5. Seguridad — escudo geométrico (pentágono angular) + V interna de verificación
  seguridad: `<polygon points="12 3 20 6 20 12 12 21 4 12 4 6"/><polyline points="9 12 11 14 15 9"/>`,

  // 6. Automatización — zig-zag (flujo angular continuo)
  automatizacion: `<polyline points="3 8 8 8 11 16 16 16"/><polyline points="13 13 16 16 13 19"/><line x1="16" y1="16" x2="21" y2="16"/>`,

  // 7. Inteligencia — V anidada / fractal (meta)
  inteligencia: `<polyline points="3 5 12 19 21 5"/><polyline points="7 7 12 15 17 7"/>`,

  // 8. Web / Diseño — ventana geométrica (rect + barra superior con notch)
  web: `<polygon points="3 5 21 5 21 19 3 19"/><polyline points="3 9 21 9"/><polyline points="6 7 6 7"/>`,

  // 9. Video / Medios — triángulo play dentro de marco angular
  video: `<polygon points="3 5 21 5 21 19 3 19"/><polygon points="10 9 16 12 10 15"/>`,

  // 10. Audio / Voz — ondas angulares ascendentes (barras de ecualizador en zig)
  audio: `<polyline points="3 12 7 12 9 5 13 19 15 12 21 12"/>`,

  // 11. Copy / Contenido — líneas de texto con remate angular
  copy: `<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="11" x2="16" y2="11"/><line x1="4" y1="16" x2="20" y2="16"/><polyline points="18 14 20 16 18 18"/>`,

  // 12. SEO — lupa hexagonal + flecha de crecimiento angular
  seo: `<polygon points="9 3 14 6 14 12 9 15 4 12 4 6"/><line x1="13" y1="14" x2="20" y2="21"/>`,

  // 13. Analítica / BI — barras crecientes (3 triángulos rectángulos)
  analitica: `<polyline points="4 20 4 14 8 14 8 20"/><polyline points="10 20 10 9 14 9 14 20"/><polyline points="16 20 16 4 20 4 20 20"/>`,

  // 14. Marketing — megáfono angular (trapecio + emisión)
  marketing: `<polygon points="4 9 13 5 13 19 4 15"/><polyline points="13 9 18 7 18 17 13 15"/><line x1="20" y1="10" x2="21" y2="9"/><line x1="20" y1="14" x2="21" y2="15"/>`,

  // 15. Finanzas — pirámide de moneda (rombo) con barra base
  finanzas: `<polygon points="12 3 19 12 12 21 5 12"/><line x1="12" y1="7" x2="12" y2="17"/><line x1="9" y1="12" x2="15" y2="12"/>`,

  // 16. Cliente / CRM — V de persona (hombros angulares + cabeza triangular)
  cliente: `<polygon points="12 3 15 8 9 8"/><polyline points="4 21 8 12 16 12 20 21"/>`,

  // 17. Integraciones — dos triángulos enganchados (conexión)
  integraciones: `<polygon points="3 8 10 8 6.5 15"/><polygon points="14 9 21 9 17.5 16"/><line x1="9" y1="11" x2="15" y2="11"/>`,

  // 18. Documentación — libro abierto angular (dos triángulos en V baja)
  documentacion: `<polyline points="3 5 12 8 21 5"/><polyline points="3 5 3 18 12 21 21 18 21 5"/><line x1="12" y1="8" x2="12" y2="21"/>`,

  // 19. DevOps / Deploy — cohete angular (rombo + aletas + escape)
  devops: `<polygon points="12 2 16 10 12 16 8 10"/><polyline points="8 12 5 18 9 15"/><polyline points="16 12 19 18 15 15"/><line x1="11" y1="19" x2="13" y2="19"/>`,

  // 20. 3D / AR — cubo isométrico (líneas a 60°)
  tresd: `<polygon points="12 3 21 8 12 13 3 8"/><polyline points="3 8 3 16 12 21 21 16 21 8"/><line x1="12" y1="13" x2="12" y2="21"/>`,

  // 21. Scraping / Búsqueda web — red angular (nodo central + 3 aristas)
  scraping: `<polygon points="12 9 15 12 12 15 9 12"/><line x1="12" y1="9" x2="12" y2="3"/><line x1="15" y1="12" x2="21" y2="12"/><line x1="9" y1="12" x2="3" y2="12"/><line x1="12" y1="15" x2="12" y2="21"/>`,

  // ===== B. UI (15) =====

  // Home — casa geométrica (trapecio + triángulo techo)
  home: `<polyline points="3 11 12 3 21 11"/><polyline points="5 10 5 21 19 21 19 10"/>`,

  // Menu — 3 líneas horizontales
  menu: `<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>`,

  // Search — lupa hexagonal + mango diagonal 45°
  search: `<polygon points="10 3 15 6 15 12 10 15 5 12 5 6"/><line x1="14" y1="14" x2="21" y2="21"/>`,

  // Settings — engranaje angular (8 líneas radiales + rombo central)
  settings: `<polygon points="12 8 16 12 12 16 8 12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="7" y2="7"/><line x1="17" y1="17" x2="19" y2="19"/><line x1="19" y1="5" x2="17" y2="7"/><line x1="7" y1="17" x2="5" y2="19"/>`,

  // Close — X (dos líneas a 45°)
  close: `<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>`,

  // Arrow — triángulo apuntando (derecha por defecto) — rotar con prop direction
  arrow: `<polyline points="9 4 17 12 9 20"/><line x1="3" y1="12" x2="17" y2="12"/>`,

  // Check — V literal (el checkmark ES la marca)
  check: `<polyline points="4 12 10 18 20 5"/>`,

  // Warning — triángulo apex arriba + barra (universal)
  warning: `<polygon points="12 3 22 20 2 20"/><line x1="12" y1="9" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17.5"/>`,

  // Info — rombo + I (línea simple + punto)
  info: `<polygon points="12 3 19 12 12 21 5 12"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8.5"/>`,

  // Plus / Add — + (dos líneas perpendiculares)
  plus: `<line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/>`,

  // Minus / Remove — — (línea)
  minus: `<line x1="4" y1="12" x2="20" y2="12"/>`,

  // Chevron — V girada (expandir/colapsar). Por defecto apunta abajo
  chevron: `<polyline points="5 9 12 16 19 9"/>`,

  // Edit — lápiz angular (rombo punta + cuerpo a 45°)
  edit: `<polyline points="4 20 4 16 16 4 20 8 8 20 4 20"/><line x1="13" y1="7" x2="17" y2="11"/>`,

  // Trash — bote angular (trapecio + tapa)
  trash: `<line x1="4" y1="6" x2="20" y2="6"/><polyline points="6 6 7 21 17 21 18 6"/><polyline points="9 3 15 3"/><line x1="10" y1="10" x2="10" y2="17"/><line x1="14" y1="10" x2="14" y2="17"/>`,

  // Send — avión de papel angular (triángulo + pliegue)
  send: `<polygon points="3 11 21 3 13 21 11 13"/><line x1="11" y1="13" x2="21" y2="3"/>`,

  // ===== C. STATUS / FEEDBACK (4) =====

  // Loading — triángulo abierto (se anima con rotación; ver isSpinner)
  loading: `<polyline points="12 3 12 3" /><path d="M12 3 A9 9 0 1 1 4.5 7" />`,

  // Success — V dentro de rombo (checkmark Victor IA enmarcado)
  success: `<polygon points="12 3 19 12 12 21 5 12"/><polyline points="8 12 11 15 16 9"/>`,

  // Error — triángulo invertido + X (warning de fallo)
  error: `<polygon points="2 6 22 6 12 21"/><line x1="9" y1="10" x2="15" y2="16"/><line x1="15" y1="10" x2="9" y2="16"/>`,

  // Pending — línea base con 3 puntos de progreso
  pending: `<line x1="4" y1="12" x2="20" y2="12"/><line x1="7" y1="12" x2="7" y2="12.2"/><line x1="12" y1="12" x2="12" y2="12.2"/><line x1="17" y1="12" x2="17" y2="12.2"/>`,
};

export type VictorIconName = keyof typeof VICTOR_ICON_PATHS;

export const VICTOR_ICON_NAMES = Object.keys(VICTOR_ICON_PATHS) as VictorIconName[];

// ─────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────

export interface VictorIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  name: VictorIconName;
  /** px (width = height). Default 24. */
  size?: number;
  /** Default 2 (la especificación del sistema). */
  strokeWidth?: number;
  /** Para `arrow`/`chevron`: rota el icono. 0=derecha/abajo nativo. */
  direction?: "up" | "down" | "left" | "right";
}

const DIRECTION_ROTATION: Record<string, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export function VictorIcon({
  name,
  size = 24,
  strokeWidth = 2,
  direction,
  className,
  style,
  ...rest
}: VictorIconProps) {
  const inner = VICTOR_ICON_PATHS[name];
  if (!inner) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[VictorIcon] icono desconocido: "${name}"`);
    }
    return null;
  }

  const rotation =
    direction != null ? DIRECTION_ROTATION[direction] ?? 0 : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      className={className}
      style={
        rotation
          ? { transform: `rotate(${rotation}deg)`, ...style }
          : style
      }
      aria-hidden={rest["aria-label"] ? undefined : true}
      role={rest["aria-label"] ? "img" : undefined}
      {...rest}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

export default VictorIcon;
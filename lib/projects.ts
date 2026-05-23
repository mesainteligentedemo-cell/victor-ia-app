export type ProjectStatus = "live" | "proposal" | "active" | "paused";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  url?: string;
  description: string;
  keywords: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "victor-ia-website",
    name: "Victor IA Website",
    client: "Interno",
    status: "live",
    url: "victor-ia-website.vercel.app",
    description: "Sitio web principal con canvas water-trail, 18 páginas de servicio",
    keywords: ["victor ia", "nuestro sitio", "nuestra web"],
  },
  {
    id: "costa-negra",
    name: "Costa Negra",
    client: "Costa Negra",
    status: "live",
    url: "victor-ia.com.mx",
    description: "Landing luxury para lotes en Quintana Roo",
    keywords: ["costa negra", "lotes", "quintana roo", "qr"],
  },
  {
    id: "roes-co",
    name: "ROES & CO",
    client: "ROES & CO",
    status: "proposal",
    url: "roes-co-website.vercel.app",
    description: "Propuesta $68k MXN — Auditoría SEO + Web 4.0",
    keywords: ["roes", "plusvalía", "inversionesconplusvalia"],
  },
  {
    id: "seabird-hotel",
    name: "Seabird Hotel",
    client: "Hyatt — Oceanside CA",
    status: "proposal",
    description: "Sitio web luxury, Forbes Recommended, build en seabird-resort/",
    keywords: ["seabird", "hyatt", "california", "oceanside"],
  },
  {
    id: "influence-ia",
    name: "Influence IA Awards",
    client: "Interno",
    status: "live",
    url: "influence-ia-awards-2027.vercel.app",
    description: "Premios web IA — kinetic typography sobre video del ojo",
    keywords: ["influence ia", "awards", "premios"],
  },
  {
    id: "brandbook",
    name: "Victor IA Brandbook",
    client: "Interno",
    status: "live",
    url: "victor-ia-brandbook.vercel.app",
    description: "Manual de identidad digital, 21 secciones",
    keywords: ["brandbook", "manual de identidad", "brand"],
  },
  {
    id: "dashboard-bi",
    name: "Dashboard BI",
    client: "Interno",
    status: "live",
    url: "victor-ia-dashboard.vercel.app",
    description: "Dashboard de analítica y KPIs",
    keywords: ["dashboard", "bi", "analytics", "kpis"],
  },
  {
    id: "rosa-laura",
    name: "Rosa Laura Ubeda",
    client: "Particular — Puebla",
    status: "active",
    description: "Video y foto inmobiliaria, kit de ventas, distribución multiplataforma",
    keywords: ["rosa laura", "propiedad", "puebla", "inmobiliaria"],
  },
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  proposal: "Propuesta",
  active: "Activo",
  paused: "Pausado",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  live: "text-emerald-400 bg-emerald-400/10",
  proposal: "text-amber text-amber bg-amber-low",
  active: "text-blue-400 bg-blue-400/10",
  paused: "text-warm-45 bg-warm-10",
};

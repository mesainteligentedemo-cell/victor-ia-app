export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "web",
    name: "Web & Diseño",
    icon: "🌐",
    skills: [
      { id: "web-4o", name: "Web 4.0", category: "web", description: "Three.js, GSAP, shaders, animaciones avanzadas, pixel-perfecto", icon: "✦" },
      { id: "pixel-perfecto", name: "Pixel Perfecto", category: "web", description: "Cirugía visual: tipografía, grid 8pt, logos, responsive", icon: "◎" },
      { id: "skill-inclusivo", name: "Diseño Inclusivo", category: "web", description: "WCAG 2.2 AA, accesibilidad, eye-tracking, voz", icon: "♿" },
      { id: "svg-motion", name: "SVG Motion", category: "web", description: "Animación SVG, GSAP, D3, data viz, loaders", icon: "◈" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing & SEO",
    icon: "📈",
    skills: [
      { id: "seo-audit-tecnico", name: "Auditoría SEO", category: "marketing", description: "9 dimensiones, Core Web Vitals, plan 90 días", icon: "🔍" },
      { id: "copy-y-marketing", name: "Copy & Marketing", category: "marketing", description: "Copy de alto impacto, email, ads, landing pages", icon: "✍" },
      { id: "curador-apps-saas", name: "Curador Apps", category: "marketing", description: "Auditoría 7D, brand extraction, benchmarks por vertical", icon: "📱" },
    ],
  },
  {
    id: "automation",
    name: "Automatización",
    icon: "⚡",
    skills: [
      { id: "n8n-ia-local", name: "n8n + IA", category: "automation", description: "Workflows con Ollama, OpenRouter, Groq — 5 casos vendibles", icon: "⚙️" },
      { id: "fingerprint-scrapper", name: "Web Scraping", category: "automation", description: "Evasión anti-bot avanzada, Playwright, rotación de identidades", icon: "🕷" },
      { id: "youtube-transcript", name: "YouTube Transcript", category: "automation", description: "Extracción de transcripts de cualquier video", icon: "▶" },
    ],
  },
  {
    id: "ia-tech",
    name: "IA & Tecnología",
    icon: "🤖",
    skills: [
      { id: "ollama-cliente", name: "IA Local (Ollama)", category: "ia-tech", description: "Setup IA local para clientes — servicio vendible $5k-15k MXN", icon: "💻" },
      { id: "openrouter-cliente", name: "OpenRouter", category: "ia-tech", description: "100+ modelos IA con una sola API key, estrategia de costos", icon: "🔗" },
      { id: "groq-api", name: "Groq (Rápido)", category: "ia-tech", description: "~800 tok/s gratuito, Whisper para audio, demos de velocidad", icon: "⚡" },
      { id: "telemetria-iot", name: "IoT & Telemetría", category: "ia-tech", description: "Sensores industriales, pipelines ETL, ML predictivo, edge", icon: "📡" },
    ],
  },
  {
    id: "video",
    name: "Video & Medios",
    icon: "🎬",
    skills: [
      { id: "video-y-medios", name: "Video IA", category: "video", description: "Runway, Kling, Higgsfield — generación y edición con IA", icon: "🎞" },
      { id: "after-effects", name: "After Effects", category: "video", description: "Motion graphics, automatización AE, templates", icon: "Ae" },
    ],
  },
  {
    id: "negocio",
    name: "Negocio",
    icon: "💼",
    skills: [
      { id: "propuestas", name: "Propuestas", category: "negocio", description: "Decks de propuesta, pricing, contratos, seguimiento", icon: "📋" },
      { id: "finanzas", name: "Finanzas", category: "negocio", description: "Análisis financiero, proyecciones, flujo de caja", icon: "💰" },
    ],
  },
];

export function findSkillById(id: string): Skill | undefined {
  for (const cat of SKILL_CATEGORIES) {
    const skill = cat.skills.find((s) => s.id === id);
    if (skill) return skill;
  }
}

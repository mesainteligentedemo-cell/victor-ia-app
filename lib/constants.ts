// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Feature Flags
export const FEATURES = {
  GENERATORS: true,
  AGENTS: true,
  CRM: true,
  AUTOMATION: true,
  ANALYTICS: true,
  TRAINING: true,
  HR: true,
  FINANCE: true,
  INTEGRATIONS: true,
  COLLABORATION: true
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

// CRM Pipeline Stages
export const CRM_STAGES = ["lead", "contacted", "qualified", "proposal", "negotiation", "won", "lost"] as const;

// Generator Types
export const GENERATOR_TYPES = [
  "image",
  "video",
  "presentation",
  "email",
  "landing-page",
  "social-post",
  "audio",
  "pdf"
] as const;

// Roles
export const ROLES = ["admin", "editor", "viewer", "analyst"] as const;

// Toast Messages
export const MESSAGES = {
  SUCCESS: "Operación completada exitosamente",
  ERROR: "Error al procesar la solicitud",
  LOADING: "Cargando...",
  SAVED: "Cambios guardados",
  DELETED: "Elemento eliminado"
};

// API Timeouts
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000
};

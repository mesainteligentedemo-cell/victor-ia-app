// API Configuration
export const API_CONFIG = {
  CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.7,
  TIMEOUT: 30000, // 30 seconds
};

// Rate Limiting
export const RATE_LIMITS = {
  CHAT: { limit: 100, windowMs: 60000 }, // 100 requests per minute
  GENERATORS: { limit: 20, windowMs: 60000 }, // 20 per minute
  API: { limit: 1000, windowMs: 60000 }, // 1000 per minute
};

// Pricing
export const PRICING = {
  STARTER: 150,
  PRO: 500,
  ENTERPRISE: 0, // Custom
};

// Storage Limits
export const STORAGE_LIMITS = {
  STARTER: 10, // GB
  PRO: 100,
  ENTERPRISE: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  GENERATE: '/api/generate/advanced',
  ANALYTICS: '/api/analytics/events',
  GENERATORS: '/api/generations',
  STRIPE_CUSTOMER: '/api/stripe/customer',
  STRIPE_CHECKOUT: '/api/stripe/checkout',
  CRM_CLIENTS: '/api/crm/clients',
  PROJECTS: '/api/projects',
  ASSETS: '/api/library/assets',
  VOICE: '/api/voice/generate',
  METRICS: '/api/dashboard/metrics',
};

// Feature Flags
export const FEATURES = {
  VOICE_INPUT: true,
  VIDEO_GENERATION: true,
  REAL_TIME_ANALYTICS: true,
  TEAM_COLLABORATION: false, // Coming soon
  API_ACCESS: false, // Pro+ only
  ADVANCED_ANALYTICS: false, // Enterprise only
};

// Default Settings
export const DEFAULTS = {
  LANGUAGE: 'es-ES',
  TIMEZONE: 'America/Mexico_City',
  THEME: 'dark',
  NOTIFICATIONS: true,
  EMAIL_DIGEST: 'weekly',
};

// External Services
export const EXTERNAL_SERVICES = {
  CLERK: {
    SIGN_IN_URL: '/sign-in',
    SIGN_UP_URL: '/sign-up',
    AFTER_SIGN_IN_URL: '/dashboard',
    AFTER_SIGN_UP_URL: '/dashboard/onboarding',
  },
  SUPABASE: {
    POOL_SIZE: 20,
  },
  STRIPE: {
    CURRENCY: 'usd',
    TEST_MODE: process.env.NODE_ENV === 'development',
  },
  ELEVENLABS: {
    DEFAULT_VOICE: process.env.ELEVENLABS_VOICE_ID || 'iDEmt5MnqUotdwCIVplo',
    STABILITY: 0.5,
    SIMILARITY: 0.75,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado. Por favor inicia sesión.',
  FORBIDDEN: 'No tienes permiso para acceder a esto.',
  NOT_FOUND: 'Recurso no encontrado.',
  RATE_LIMIT: 'Demasiadas solicitudes. Intenta más tarde.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente.',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  INVALID_INPUT: 'Entrada inválida. Por favor revisa tu entrada.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: '✅ Guardado exitosamente',
  CREATED: '✅ Creado exitosamente',
  DELETED: '✅ Eliminado exitosamente',
  UPDATED: '✅ Actualizado exitosamente',
  SENT: '✅ Enviado exitosamente',
};

// Validation Rules
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[^\s]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PROJECT_NAME_MIN: 3,
  PROJECT_NAME_MAX: 100,
};
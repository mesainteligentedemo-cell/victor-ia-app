/**
 * Deployment Configuration
 * Environment-specific settings for prod, staging, development
 */

export type Environment = 'development' | 'staging' | 'production';

export interface DeploymentConfig {
  environment: Environment;
  appUrl: string;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  openaiApiKey: string;
  sendgridApiKey: string;
  sendgridFromEmail: string;
  elevenLabsApiKey: string;
  elevenLabsAgentId: string;
  elevenLabsVoiceId: string;
  redirectUrl: string;
  corsOrigins: string[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableMetrics: boolean;
  enableTracing: boolean;
  sentryDsn?: string;
  datadog?: {
    apiKey: string;
    appKey: string;
  };
  mixpanel?: {
    token: string;
  };
}

const DEVELOPMENT_CONFIG: DeploymentConfig = {
  environment: 'development',
  appUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'dev@victor-ia.com',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  elevenLabsAgentId: process.env.ELEVENLABS_AGENT_ID || '',
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || '',
  redirectUrl: 'http://localhost:3000/auth/callback',
  corsOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  logLevel: 'debug',
  enableMetrics: false,
  enableTracing: false,
};

const STAGING_CONFIG: DeploymentConfig = {
  environment: 'staging',
  appUrl: 'https://staging.victor-ia.com',
  apiUrl: 'https://staging.victor-ia.com/api',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'staging@victor-ia.com',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  elevenLabsAgentId: process.env.ELEVENLABS_AGENT_ID || '',
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || '',
  redirectUrl: 'https://staging.victor-ia.com/auth/callback',
  corsOrigins: ['https://staging.victor-ia.com'],
  logLevel: 'info',
  enableMetrics: true,
  enableTracing: true,
  sentryDsn: process.env.SENTRY_DSN_STAGING,
  datadog: {
    apiKey: process.env.DATADOG_API_KEY || '',
    appKey: process.env.DATADOG_APP_KEY || '',
  },
  mixpanel: {
    token: process.env.MIXPANEL_TOKEN_STAGING || '',
  },
};

const PRODUCTION_CONFIG: DeploymentConfig = {
  environment: 'production',
  appUrl: 'https://app.victor-ia.com',
  apiUrl: 'https://app.victor-ia.com/api',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@victor-ia.com',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  elevenLabsAgentId: process.env.ELEVENLABS_AGENT_ID || '',
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || '',
  redirectUrl: 'https://app.victor-ia.com/auth/callback',
  corsOrigins: [
    'https://app.victor-ia.com',
    'https://victor-ia.com',
    'https://www.victor-ia.com',
  ],
  logLevel: 'warn',
  enableMetrics: true,
  enableTracing: true,
  sentryDsn: process.env.SENTRY_DSN_PRODUCTION,
  datadog: {
    apiKey: process.env.DATADOG_API_KEY || '',
    appKey: process.env.DATADOG_APP_KEY || '',
  },
  mixpanel: {
    token: process.env.MIXPANEL_TOKEN_PRODUCTION || '',
  },
};

export function getDeploymentConfig(): DeploymentConfig {
  const env = (process.env.NODE_ENV || 'development') as Environment;

  switch (env) {
    case 'staging':
      return STAGING_CONFIG;
    case 'production':
      return PRODUCTION_CONFIG;
    default:
      return DEVELOPMENT_CONFIG;
  }
}

export function validateConfig(config: DeploymentConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    'appUrl',
    'apiUrl',
    'supabaseUrl',
    'supabaseAnonKey',
    'stripePublicKey',
  ];

  for (const field of requiredFields) {
    if (!config[field as keyof DeploymentConfig]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Environment-specific checks
  if (config.environment === 'production') {
    if (!config.stripeSecretKey) {
      errors.push('Stripe secret key required in production');
    }
    if (!config.sentryDsn) {
      errors.push('Sentry DSN required in production');
    }
    if (config.appUrl.includes('localhost')) {
      errors.push('Production URL cannot be localhost');
    }
  }

  // URL validation
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(config.appUrl)) {
    errors.push('Invalid appUrl format');
  }
  if (!urlPattern.test(config.apiUrl)) {
    errors.push('Invalid apiUrl format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const config = getDeploymentConfig();

export default config;
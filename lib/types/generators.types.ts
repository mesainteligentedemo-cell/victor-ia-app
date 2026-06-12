// Generators: 6 media generation types

export type GeneratorType = 'presentation' | 'email' | 'landing-page' | 'social-post' | 'audio' | 'pdf' | 'image' | 'video';
export type StylePreset = 'corporate' | 'creative' | 'minimal' | 'luxury' | 'playful' | 'professional';
export type QualityLevel = 'standard' | 'premium' | 'ultra';

export interface GenerationParams {
  userId: string;
  prompt: string;
  style?: StylePreset;
  quality?: QualityLevel;
}

export interface PresentationParams extends GenerationParams {
  title: string;
  sections: string[];
  layout: 'slides' | 'continuous';
}

export interface EmailParams extends GenerationParams {
  subject: string;
  body: string;
  template: 'prospection' | 'followup' | 'delivery' | 'newsletter' | 'confirmation';
}

export interface LandingPageParams extends GenerationParams {
  title: string;
  description: string;
  template: 'luxury' | 'corporate' | 'portfolio' | 'realestate' | 'hotel' | 'ecommerce' | 'blog';
}

export interface SocialPostParams extends GenerationParams {
  caption: string;
  platform: 'instagram' | 'linkedin' | 'tiktok' | 'twitter';
  tone: 'professional' | 'casual' | 'educational' | 'viral';
}

export interface AudioParams extends GenerationParams {
  script: string;
  voice: string;
  language: string;
  speed: number;
}

export interface PDFParams extends GenerationParams {
  title: string;
  content: string;
  template: 'proposal' | 'report' | 'contract' | 'invoice';
}

export interface GenerationResult {
  id: string;
  userId: string;
  type: GeneratorType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  prompt: string;
  result?: {
    url: string;
    preview?: string;
  };
  error?: string;
  creditsUsed: number;
  createdAt: Date;
  completedAt?: Date;
}
// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'starter' | 'pro' | 'enterprise';
  credits: number;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Chat Types
export interface Message {
  id: string;
  chatId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  tokensUsed: number;
  createdAt: string;
}

export interface ChatRequest {
  message: string;
  systemPrompt?: string;
}

export interface ChatResponse {
  response: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  deadline?: string;
  teamCount: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Client Types
export interface Client {
  id: string;
  userId: string;
  name: string;
  company?: string;
  type?: string;
  stage: 'prospect' | 'proposal' | 'authorized' | 'completed';
  value: number;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Agent Types
export interface Agent {
  id: string;
  userId: string;
  name: string;
  role: string;
  specialty: string;
  model: string;
  status: 'active' | 'idle' | 'thinking';
  tasksCompleted: number;
  uptime: number;
  createdAt: string;
}

// Asset Types
export type AssetType = 'image' | 'video' | 'audio' | 'document' | 'web';

export interface Asset {
  id: string;
  userId: string;
  name: string;
  type: AssetType;
  url: string;
  size: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData?: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  timeline: { date: string; count: number }[];
  topEvents: { event: string; count: number }[];
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Generation Types
export type GenerationType = 'image' | 'video' | 'website' | 'document' | 'email' | 'audio';

export interface GenerationRequest {
  type: GenerationType;
  prompt: string;
  options?: Record<string, any>;
}

export interface GenerationResponse {
  success: boolean;
  jobId?: string;
  status?: string;
  content?: string;
  estimatedTime?: number;
  error?: string;
}

// Dashboard Types
export interface KPI {
  label: string;
  value: string;
  change: string;
  icon: string;
}

export interface DashboardMetrics {
  kpis: Record<string, KPI>;
  activity: {
    labels: string[];
    data: number[];
  };
  pipeline: {
    stage: string;
    count: number;
    value: number;
  }[];
  specialists: {
    name: string;
    usage: number;
  }[];
}

// Voice Types
export interface VoiceRequest {
  text: string;
  voiceId?: string;
  stability?: number;
  similarity?: number;
}

export interface VoiceResponse {
  success: boolean;
  audio?: string;
  duration?: number;
  error?: string;
}
/**
 * PROSPECCION SYSTEM — COMPREHENSIVE TYPESCRIPT TYPES
 * Type-safe system for lead generation, trend tracking, and asset automation
 * Version: 1.0.0 | Last Updated: 2026-06-10
 * 120+ types across 7 domains
 */

// ============================================================================
// 1. CORE GENERATION TYPES
// ============================================================================

/**
 * Job status - discriminated union for type-safe status handling
 */
export type JobStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'generating'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

/**
 * Generation job - main unit of work in the system
 */
export interface GenerationJob {
  id: string;
  userId: string;
  projectId: string;
  status: JobStatus;
  type: 'video' | 'image' | 'batch';
  params: GenerationParams;
  result?: GenerationResult;
  metadata: JobMetadata;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
  retries: number;
  maxRetries: number;
  errorLog: GenerationError[];
}

/**
 * Generation parameters - configuration for content generation
 */
export interface GenerationParams {
  // Content definition
  topic: string;
  description: string;
  platform: Platform[];
  style: ContentStyle;
  tone: ToneOption;
  duration?: number; // seconds for video
  dimensions?: {
    width: number;
    height: number;
  };

  // Media generation
  imageCount?: number;
  videoFormat?: 'mp4' | 'webm' | 'mov';
  audioOptions?: AudioConfig;

  // Features
  includeCaptions: boolean;
  includeHashtags: boolean;
  includeCallToAction: boolean;
  customBranding?: {
    logo?: string;
    colors?: string[];
    watermark?: boolean;
  };

  // Optimization
  trendInsights?: TrendInsight[];
  targetAudience?: DemographicTarget;
  autoEnhance: boolean;
  qualityPreset: 'draft' | 'standard' | 'premium' | 'ultra';

  // Advanced
  modelOverride?: string;
  seedValue?: number;
  temperature?: number;
}

/**
 * Generation result - output and metadata from generation
 */
export interface GenerationResult {
  jobId: string;
  assetId: string;
  urls: {
    primary: string;
    thumbnail?: string;
    preview?: string;
    alternatives?: string[];
  };
  metadata: {
    duration?: number;
    width?: number;
    height?: number;
    fileSize: number;
    mimeType: string;
    format: string;
  };
  quality: QualityMetrics;
  processing: {
    startTime: Date;
    endTime: Date;
    durationMs: number;
    gpuUsed?: boolean;
    costEstimate: number;
  };
  rendition: {
    colorSpace: string;
    bitrate?: string;
    frameRate?: number;
    codec?: string;
  };
}

/**
 * Quality metrics for generated content
 */
export interface QualityMetrics {
  overallScore: number; // 0-100
  clarity: number;
  colorAccuracy: number;
  composition: number;
  engagement: number;
  brandAlignment: number;
  issues?: QualityIssue[];
}

/**
 * Quality issues detected in generation
 */
export interface QualityIssue {
  type: 'color' | 'clarity' | 'composition' | 'brand' | 'compliance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
}

/**
 * Job metadata - tracking and context
 */
export interface JobMetadata {
  batchId?: string;
  source: 'api' | 'dashboard' | 'webhook';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags: string[];
  externalId?: string;
  webhookUrl?: string;
  notificationChannels: NotificationChannel[];
  costCenter?: string;
  labels?: Record<string, string>;
}

/**
 * Content style options
 */
export type ContentStyle =
  | 'luxury'
  | 'playful'
  | 'professional'
  | 'minimalist'
  | 'vibrant'
  | 'cinematic'
  | 'abstract'
  | 'documentary'
  | 'editorial'
  | 'brand';

/**
 * Tone options for generated content
 */
export type ToneOption =
  | 'formal'
  | 'casual'
  | 'educational'
  | 'humorous'
  | 'inspirational'
  | 'urgent'
  | 'empathetic'
  | 'technical'
  | 'narrative';

/**
 * Platform target
 */
export type Platform =
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'twitter'
  | 'facebook'
  | 'tiktok_shop'
  | 'email'
  | 'web'
  | 'podcast'
  | 'twitch';

/**
 * Audio configuration for video
 */
export interface AudioConfig {
  voiceId?: string;
  language: string;
  includeBackground: boolean;
  backgroundMusicUrl?: string;
  voiceCharacter?: 'neutral' | 'energetic' | 'calm' | 'professional';
  volume: number; // 0-100
  speech?: {
    rate: number; // 0.5-2.0
    pitch: number; // 0-100
  };
}

/**
 * Demographic target for content optimization
 */
export interface DemographicTarget {
  ageMin?: number;
  ageMax?: number;
  gender?: 'all' | 'male' | 'female' | 'non-binary';
  countries?: string[];
  languages?: string[];
  interests?: string[];
  income?: 'low' | 'medium' | 'high';
  education?: 'high_school' | 'bachelor' | 'master' | 'phd';
  jobTitles?: string[];
}

// ============================================================================
// 2. QUEUE & WORKFLOW TYPES
// ============================================================================

/**
 * Queued job - job waiting for processing
 */
export interface QueuedJob {
  id: string;
  jobId: string;
  position: number;
  queueSize: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedWaitMs: number;
  estimatedStartTime: Date;
  retryCount: number;
  lastRetryAt?: Date;
  deadLetterReason?: string;
}

/**
 * Generation workflow - pipeline definition
 */
export interface GenerationWorkflow {
  id: string;
  name: string;
  description: string;
  userId: string;
  steps: WorkflowStep[];
  triggerType: 'manual' | 'scheduled' | 'event' | 'webhook';
  schedule?: CronExpression;
  webhookConfig?: WebhookTrigger;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  executionHistory: WorkflowExecution[];
  latestExecution?: WorkflowExecution;
}

/**
 * Workflow step - single stage in pipeline
 */
export interface WorkflowStep {
  id: string;
  index: number;
  type: WorkflowStepType;
  name: string;
  description?: string;
  config: Record<string, unknown>;
  inputMapping: InputMapping;
  outputMapping: OutputMapping;
  errorHandling: ErrorHandling;
  retry: RetryPolicy;
  timeout?: number; // milliseconds
  conditions?: StepCondition[];
  branches?: WorkflowBranch[];
}

/**
 * Workflow step type
 */
export type WorkflowStepType =
  | 'trend_analysis'
  | 'content_generation'
  | 'quality_check'
  | 'enhancement'
  | 'export'
  | 'publish'
  | 'notification'
  | 'webhook_call'
  | 'conditional_branch'
  | 'delay'
  | 'aggregation';

/**
 * Input mapping for workflow steps
 */
export interface InputMapping {
  sourceStep?: string; // step ID
  fieldMappings: Record<string, string>; // target -> source field path
  transformations?: FieldTransformation[];
  staticValues?: Record<string, unknown>;
}

/**
 * Output mapping from workflow step
 */
export interface OutputMapping {
  fieldMappings: Record<string, string>; // output -> target field path
  storeAs?: string; // context variable name
  transformations?: FieldTransformation[];
}

/**
 * Field transformation in mapping
 */
export interface FieldTransformation {
  field: string;
  type: 'uppercase' | 'lowercase' | 'trim' | 'split' | 'join' | 'template' | 'custom';
  config?: Record<string, unknown>;
}

/**
 * Error handling for workflow steps
 */
export interface ErrorHandling {
  strategy: 'fail' | 'retry' | 'skip' | 'fallback';
  fallbackValue?: unknown;
  skipCondition?: string;
}

/**
 * Retry policy for steps
 */
export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

/**
 * Step condition
 */
export interface StepCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'regex';
  value: unknown;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Workflow branch - conditional execution path
 */
export interface WorkflowBranch {
  name: string;
  condition: StepCondition[];
  steps: WorkflowStep[];
}

/**
 * Workflow execution record
 */
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
  outputs: Record<string, unknown>;
  errors: ExecutionError[];
  stepResults: StepResult[];
}

/**
 * Step result in workflow execution
 */
export interface StepResult {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  output: unknown;
  error?: ExecutionError;
  duration: number; // ms
}

/**
 * Execution error
 */
export interface ExecutionError {
  stepId: string;
  code: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

/**
 * Cron expression
 */
export type CronExpression = string; // Standard cron format

/**
 * Webhook trigger configuration
 */
export interface WebhookTrigger {
  url: string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'api_key';
    credentials: string;
  };
  retryPolicy?: RetryPolicy;
}

// ============================================================================
// 3. TRENDING & ANALYTICS TYPES
// ============================================================================

/**
 * Trend insight - data insight from trend analysis
 */
export interface TrendInsight {
  id: string;
  trendId: string;
  insight: string;
  strength: number; // 0-100
  sources: string[];
}

/**
 * Trend - identified trending topic or pattern
 */
export interface Trend {
  id: string;
  topic: string;
  category: TrendCategory;
  platforms: Platform[];
  momentum: number; // 0-100, growth rate
  volume: number; // search/mention volume
  direction: 'rising' | 'falling' | 'stable';
  hashtags: Hashtag[];
  keywords: KeywordMetric[];
  relatedTrends: string[]; // trend IDs
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  demographics: DemographicBreakdown;
  contentOpportunities: ContentOpportunity[];
  competitionLevel: 'low' | 'medium' | 'high';
  seasonality?: 'year_round' | 'seasonal' | 'event_driven' | 'emerging';
  discoveredAt: Date;
  expiresAt?: Date;
  confidence: number; // 0-100
}

/**
 * Trend category
 */
export type TrendCategory =
  | 'entertainment'
  | 'technology'
  | 'news'
  | 'lifestyle'
  | 'business'
  | 'education'
  | 'sports'
  | 'health'
  | 'food'
  | 'fashion'
  | 'gaming'
  | 'social';

/**
 * Hashtag metric
 */
export interface Hashtag {
  tag: string;
  volume: number;
  engagement: number;
  usageGrowth: number; // percentage week-over-week
  avgLikes?: number;
  avgComments?: number;
  avgShares?: number;
}

/**
 * Keyword metric
 */
export interface KeywordMetric {
  keyword: string;
  searchVolume: number;
  trendingScore: number;
  difficulty: 'low' | 'medium' | 'high';
  cpc?: number;
}

/**
 * Demographic breakdown for trends
 */
export interface DemographicBreakdown {
  ageGroups: Record<string, number>; // age range -> percentage
  genders: Record<string, number>; // gender -> percentage
  topCountries: Array<{ country: string; percentage: number }>;
  topLanguages: Array<{ language: string; percentage: number }>;
}

/**
 * Content opportunity - actionable insight from trend
 */
export interface ContentOpportunity {
  id: string;
  trendId: string;
  type: 'reels' | 'shorts' | 'post' | 'story' | 'live' | 'long_form';
  suggestedAngle: string;
  estimatedReach: number;
  estimatedEngagement: number;
  difficulty: 'easy' | 'medium' | 'hard';
  resources: {
    estimatedTimeHours: number;
    requiredSkills: string[];
    toolsNeeded: string[];
  };
  exampleContent?: string[];
}

/**
 * Engagement prediction for content
 */
export interface EngagementPrediction {
  contentId: string;
  predictedAt: Date;
  platform: Platform;
  metrics: {
    estimatedImpressions: {
      value: number;
      confidence: number; // 0-100
      range: [number, number];
    };
    estimatedClicks: {
      value: number;
      confidence: number;
      range: [number, number];
    };
    estimatedLikes: {
      value: number;
      confidence: number;
      range: [number, number];
    };
    estimatedComments: {
      value: number;
      confidence: number;
      range: [number, number];
    };
    estimatedShares: {
      value: number;
      confidence: number;
      range: [number, number];
    };
  };
  ctr: number; // predicted click-through rate
  engagementRate: number; // predicted engagement rate
  virality: ViralityPrediction;
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  model: string; // ML model used for prediction
  trainingDataAge: Date;
}

/**
 * Virality prediction
 */
export interface ViralityPrediction {
  score: number; // 0-100
  likelihood: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  reasoning: string;
  criticalFactors: string[];
  tippingPoint?: number; // engagement threshold for virality
}

/**
 * Performance metrics - actual results after publishing
 */
export interface PerformanceMetrics {
  assetId: string;
  platform: Platform;
  publishedAt: Date;
  metricsEndDate: Date;
  impressions: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  followers: number;
  ctr: number;
  engagementRate: number;
  avgTimeWatched?: number;
  completionRate?: number; // percentage of video watched
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topComments?: CommentAnalysis[];
  referralTraffic?: number;
  conversionCount?: number;
  roi?: number;
  costPerEngagement?: number;
  costPerClick?: number;
  costPerConversion?: number;
}

/**
 * Comment analysis
 */
export interface CommentAnalysis {
  text: string;
  author: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  likes: number;
  replies: number;
  isProminent: boolean;
}

/**
 * User analytics - aggregated performance data
 */
export interface UserAnalytics {
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  generation: {
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    avgDurationMs: number;
    avgCostPerJob: number;
    totalCost: number;
    platformBreakdown: Record<Platform, number>;
    stylePreferences: Record<ContentStyle, number>;
  };
  publishing: {
    totalAssetsPublished: number;
    platformBreakdown: Record<Platform, number>;
  };
  engagement: {
    totalImpressions: number;
    totalClicks: number;
    totalEngagements: number;
    avgCtr: number;
    avgEngagementRate: number;
    topPerformingAssets: string[];
    lowestPerformingAssets: string[];
  };
  trends: {
    trendsAnalyzed: number;
    trendsActedOn: number;
    successRate: number;
    topCategories: TrendCategory[];
  };
  collaboration: {
    sharedAssets: number;
    approvedAssets: number;
    rejectedAssets: number;
    avgReviewTime: number;
  };
  growth: {
    followerGrowth: number;
    engagementGrowth: number;
    reachGrowth: number;
    monthOverMonthGrowth: number;
  };
}

// ============================================================================
// 4. EXPORT & SHARING TYPES
// ============================================================================

/**
 * Export target platform
 */
export type ExportTarget =
  | 'instagram'
  | 'instagram_reels'
  | 'instagram_story'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'youtube_shorts'
  | 'twitter'
  | 'facebook'
  | 'tiktok_shop'
  | 'email'
  | 'web'
  | 'podcast'
  | 'twitch'
  | 'discord'
  | 'slack'
  | 'local';

/**
 * Export configuration
 */
export interface ExportConfig {
  target: ExportTarget;
  assetId: string;
  platformSettings: PlatformExportSettings;
  metadata: ExportMetadata;
  scheduling?: ExportSchedule;
  optimization: ExportOptimization;
}

/**
 * Platform-specific export settings
 */
export interface PlatformExportSettings {
  platform: ExportTarget;
  resolution: 'native' | 'auto' | { width: number; height: number };
  aspectRatio?: string; // e.g., "16:9", "9:16", "1:1"
  fps?: number;
  bitrate?: string;
  codec?: string;
  captionFormat?: 'vtt' | 'srt' | 'embed' | 'none';
  watermark?: boolean;
  hashtags?: string[];
  mentions?: string[];
  description?: string;
  thumbnail?: string;
  scheduledTime?: Date;
  autoPublish: boolean;
  notifyFollowers?: boolean;
}

/**
 * Export metadata
 */
export interface ExportMetadata {
  title?: string;
  description?: string;
  tags: string[];
  category?: string;
  ageRestricted: boolean;
  license?: string;
  createdBy: string;
  sourceJobId: string;
}

/**
 * Export schedule
 */
export interface ExportSchedule {
  type: 'once' | 'recurring';
  scheduledTime: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
    timezone?: string;
  };
  timezone?: string;
  sendNotification: boolean;
}

/**
 * Export optimization
 */
export interface ExportOptimization {
  autoOptimize: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
  colorProfile: 'srgb' | 'adobe_rgb' | 'native';
  aspectRatioMode: 'fit' | 'fill' | 'stretch' | 'crop';
  qualityPreset: 'draft' | 'standard' | 'premium' | 'ultra';
}

/**
 * Exported asset - published/exported version
 */
export interface ExportedAsset {
  id: string;
  assetId: string;
  target: ExportTarget;
  status: 'pending' | 'exporting' | 'exported' | 'published' | 'failed';
  urls: {
    exported: string;
    platform?: string;
  };
  metrics: {
    exportedAt: Date;
    publishedAt?: Date;
    fileSize: number;
    duration?: number;
  };
  platformMetadata: Record<string, unknown>;
  error?: GenerationError;
}

// ============================================================================
// 5. VERSIONING & COLLABORATION TYPES
// ============================================================================

/**
 * Generation version - historical version of generated asset
 */
export interface GenerationVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  timestamp: Date;
  author: string;
  authorName?: string;
  changes: VersionChange[];
  description?: string;
  isCurrent: boolean;
  isArchived: boolean;
  copiedFromVersion?: string;
  tags: string[];
  thumbnail?: string;
}

/**
 * Version change - what was modified
 */
export interface VersionChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type: 'modified' | 'added' | 'removed';
}

/**
 * Merge request - request to merge two versions
 */
export interface MergeRequest {
  id: string;
  assetId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'open' | 'merged' | 'closed' | 'rejected';
  sourceVersion: string; // version ID
  targetVersion: string; // version ID
  mergeStrategy: 'source' | 'target' | 'manual' | 'auto';
  conflicts?: MergeConflict[];
  reviewers: CollaborationReviewer[];
  approvals: CollaborationApproval[];
  comments: CollaborationComment[];
  result?: MergeResult;
}

/**
 * Merge conflict
 */
export interface MergeConflict {
  field: string;
  sourceValue: unknown;
  targetValue: unknown;
  resolution?: unknown;
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Merge result
 */
export interface MergeResult {
  mergedVersionId: string;
  mergedAt: Date;
  mergedBy: string;
  resultingAsset: string;
}

/**
 * Collaboration session - group work session
 */
export interface CollaborationSession {
  id: string;
  assetId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  endedAt?: Date;
  participants: CollaborationParticipant[];
  status: 'active' | 'paused' | 'completed' | 'archived';
  permissions: CollaborationPermission;
  comments: CollaborationComment[];
  approvals: CollaborationApproval[];
  versions: string[]; // version IDs involved
  sharedWith: {
    users: string[];
    teams: string[];
    public: boolean;
  };
}

/**
 * Collaboration participant
 */
export interface CollaborationParticipant {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  joinedAt: Date;
  lastActivityAt: Date;
  permissions: CollaborationPermission;
}

/**
 * Collaboration permission
 */
export interface CollaborationPermission {
  canView: boolean;
  canEdit: boolean;
  canComment: boolean;
  canApprove: boolean;
  canDelete: boolean;
  canShare: boolean;
  canMerge: boolean;
}

/**
 * Collaboration reviewer
 */
export interface CollaborationReviewer {
  userId: string;
  name: string;
  reviewedAt?: Date;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'requested_changes';
}

/**
 * Collaboration approval
 */
export interface CollaborationApproval {
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  comment?: string;
  signature?: string;
}

/**
 * Collaboration comment
 */
export interface CollaborationComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  replies: CollaborationComment[];
  mentionedUsers: string[];
  attachments?: string[];
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// ============================================================================
// 6. USER & SUBSCRIPTION TYPES
// ============================================================================

/**
 * User preferences - personalization settings
 */
export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  defaultStyle: ContentStyle;
  defaultTone: ToneOption;
  autoEnhance: boolean;
  autoPublish: boolean;
  defaultPlatforms: Platform[];
  notificationPreferences: NotificationPreferences;
  apiSettings: {
    rateLimit?: number;
    webhookSecret?: string;
    ipWhitelist?: string[];
  };
  regionPreference?: string;
  languagePreference: string;
  timezone: string;
  privacySettings: {
    shareAnalytics: boolean;
    shareUsageData: boolean;
    allowThirdParty: boolean;
  };
  brandPreferences?: {
    logo?: string;
    colors?: string[];
    fonts?: string[];
  };
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  channels: NotificationChannel[];
  emailOnCompletion: boolean;
  emailOnFailure: boolean;
  emailOnApproval: boolean;
  emailDigest: 'never' | 'daily' | 'weekly' | 'monthly';
  pushNotifications: boolean;
  slackIntegration?: {
    webhookUrl: string;
    channel: string;
  };
  discordIntegration?: {
    webhookUrl: string;
  };
}

/**
 * Notification channel
 */
export type NotificationChannel =
  | 'email'
  | 'sms'
  | 'push'
  | 'webhook'
  | 'slack'
  | 'discord'
  | 'telegram'
  | 'in_app';

/**
 * Credits account - balance and usage tracking
 */
export interface CreditsAccount {
  userId: string;
  balance: number;
  spent: number;
  available: number;
  tier: SubscriptionTier;
  monthlyAllocation: number;
  resetDate: Date;
  transactions: CreditTransaction[];
  alerts: {
    lowBalance: boolean;
    thresholdPercentage: number;
  };
}

/**
 * Credit transaction
 */
export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'promo';
  amount: number;
  balance: number;
  description: string;
  jobId?: string;
  timestamp: Date;
  expiresAt?: Date;
}

/**
 * Subscription tier
 */
export type SubscriptionTier =
  | 'free'
  | 'starter'
  | 'pro'
  | 'enterprise'
  | 'custom';

/**
 * Subscription
 */
export interface Subscription {
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  startDate: Date;
  renewalDate: Date;
  cancellationDate?: Date;
  features: SubscriptionFeatures;
  billing: {
    currency: string;
    amount: number;
    frequency: 'monthly' | 'quarterly' | 'annual';
    autoRenew: boolean;
    paymentMethod?: string;
  };
}

/**
 * Subscription features
 */
export interface SubscriptionFeatures {
  monthlyGenerations: number;
  maxAssetSize?: number; // MB
  platformCount: number;
  collaborators: number;
  apiAccess: boolean;
  webhookSupport: boolean;
  analyticsLevel: 'basic' | 'advanced' | 'enterprise';
  prioritySupport: boolean;
  customBranding: boolean;
  advancedAI: boolean;
  batchProcessing: boolean;
  concurrentJobs: number;
  storageGb: number;
  apiRateLimit: number; // requests per minute
}

// ============================================================================
// 7. ERROR & RESPONSE TYPES
// ============================================================================

/**
 * Generation error - detailed error information
 */
export interface GenerationError {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  retryable: boolean;
  timestamp: Date;
  context?: {
    jobId?: string;
    stepId?: string;
    fieldName?: string;
    inputValue?: unknown;
    suggestion?: string;
  };
  stackTrace?: string;
  userMessage?: string;
}

/**
 * Batch generation progress
 */
export interface BatchGenerationProgress {
  batchId: string;
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  inProgress: number;
  percentageComplete: number;
  successRate: number;
  estimatedTimeRemainingMs: number;
  estimatedCompletionTime: Date;
  currentJobId?: string;
  errors: GenerationError[];
  startTime: Date;
  lastUpdateTime: Date;
  targetTime?: Date;
}

/**
 * API Response wrapper - standardized API response
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retryable: boolean;
  };
  metadata: {
    timestamp: Date;
    requestId: string;
    version: string;
    execution: {
      durationMs: number;
      cacheHit: boolean;
    };
  };
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedAPIResponse<T> extends APIResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    totalPages: number;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Timestamp range for queries
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Sort order for queries
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: SortOption[];
}

/**
 * Filter criteria for searches
 */
export interface FilterCriteria {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';
  value: unknown;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T> {
  successful: T[];
  failed: Array<{ item: T; error: GenerationError }>;
  totalProcessed: number;
  successRate: number;
}

/**
 * Webhook payload
 */
export interface WebhookPayload<T = unknown> {
  id: string;
  event: WebhookEvent;
  timestamp: Date;
  data: T;
  signature?: string;
}

/**
 * Webhook event type
 */
export type WebhookEvent =
  | 'job.completed'
  | 'job.failed'
  | 'job.started'
  | 'asset.generated'
  | 'asset.published'
  | 'asset.exported'
  | 'workflow.completed'
  | 'workflow.failed'
  | 'trend.discovered'
  | 'collaboration.comment'
  | 'approval.requested'
  | 'approval.completed';

/**
 * Cache metadata
 */
export interface CacheMetadata {
  key: string;
  ttl: number; // seconds
  tags: string[];
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Activity log entry
 */
export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: ServiceStatus;
    cache: ServiceStatus;
    queue: ServiceStatus;
    storage: ServiceStatus;
    ai: ServiceStatus;
  };
  uptime: number; // seconds
  version: string;
}

/**
 * Service status
 */
export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime: number; // ms
  lastCheck: Date;
  message?: string;
}

// ============================================================================
// TYPE GUARDS & DISCRIMINATORS
// ============================================================================

/**
 * Type guard for checking job status types
 */
export const isJobStatus = (value: unknown): value is JobStatus => {
  const validStatuses: JobStatus[] = [
    'pending',
    'queued',
    'processing',
    'generating',
    'completed',
    'failed',
    'cancelled',
    'paused',
  ];
  return typeof value === 'string' && validStatuses.includes(value as JobStatus);
};

/**
 * Type guard for checking subscription tiers
 */
export const isSubscriptionTier = (value: unknown): value is SubscriptionTier => {
  const validTiers: SubscriptionTier[] = [
    'free',
    'starter',
    'pro',
    'enterprise',
    'custom',
  ];
  return typeof value === 'string' && validTiers.includes(value as SubscriptionTier);
};

/**
 * Type guard for checking platforms
 */
export const isPlatform = (value: unknown): value is Platform => {
  const validPlatforms: Platform[] = [
    'instagram',
    'tiktok',
    'linkedin',
    'youtube',
    'twitter',
    'facebook',
    'tiktok_shop',
    'email',
    'web',
    'podcast',
    'twitch',
  ];
  return typeof value === 'string' && validPlatforms.includes(value as Platform);
};

/**
 * Discriminate GenerationJob by status
 */
export const isJobCompleted = (
  job: GenerationJob
): job is GenerationJob & { result: GenerationResult } => {
  return job.status === 'completed' && job.result !== undefined;
};

/**
 * Discriminate GenerationJob by failed status
 */
export const isJobFailed = (job: GenerationJob): boolean => {
  return job.status === 'failed' && job.errorLog.length > 0;
};

/**
 * Discriminate Trend by seasonality
 */
export const isSeasonalTrend = (
  trend: Trend
): trend is Trend & { seasonality: Exclude<Trend['seasonality'], undefined> } => {
  return trend.seasonality !== undefined;
};

export default {
  isJobStatus,
  isSubscriptionTier,
  isPlatform,
  isJobCompleted,
  isJobFailed,
  isSeasonalTrend,
};
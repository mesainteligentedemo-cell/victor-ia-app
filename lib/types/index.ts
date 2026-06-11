/**
 * TYPES MODULE — BARREL EXPORT
 * Central export point for all TypeScript type definitions
 * Version: 1.0.0 | Last Updated: 2026-06-10
 */

// Credits System Types
export type {
  CreditCost,
  CreditTransaction,
  CreditsBalance,
  CreditsMetrics,
  UsageHistoryEntry,
  GenerationType,
  ImageQuality,
  VideoQuality,
} from './credits';

// ============================================================================
// CORE GENERATION TYPES (120+)
// ============================================================================

export type {
  JobStatus,
  GenerationJob,
  GenerationParams,
  GenerationResult,
  GenerationError,
  JobMetadata,
  Platform,
  ContentStyle,
  ToneOption,
  AudioConfig,
  TrendInsight,
  DemographicTarget,
  QualityPreset,
  MediaType,
  ExportFormat,
  AnalyticsMetric,
  CacheEntry,
} from './prospeccion.types';

/**
 * Type guard utilities - use these to narrow types safely
 */
export type {
  GeneratedAsset,
  BatchGenerationJob,
  VideoGenerationParams,
  ImageGenerationParams,
  BatchGenerationParams,
} from './prospeccion.types';

/**
 * Analytics and tracking types
 */
export type {
  AnalyticsEvent,
  GenerationEvent,
  BatchEvent,
  ExportEvent,
  AnalyticsData,
  MetricsSnapshot,
} from './prospeccion.types';

/**
 * Rate limiting and quota types
 */
export type {
  RateLimitConfig,
  RateLimitCheckResult,
  QuotaInfo,
  CreditsBalance,
} from './prospeccion.types';

/**
 * Filter and search types
 */
export type {
  FilterState,
  SearchQuery,
  SortOption,
  PaginationState,
} from './prospeccion.types';

/**
 * UI and preference types
 */
export type {
  UserPreferences,
  ModalState,
  ViewMode,
  NotificationPreference,
} from './prospeccion.types';

/**
 * Export and versioning types
 */
export type {
  ExportOptions,
  ExportResult,
  VersionSnapshot,
  VersionHistory,
  CollaborationSession,
} from './prospeccion.types';

/**
 * Subscription and billing types
 */
export type {
  SubscriptionTier,
  BillingInfo,
  UsageStats,
  LimitInfo,
} from './prospeccion.types';

/**
 * Trending and recommendation types
 */
export type {
  TrendingContent,
  TrendingCategory,
  ContentRecommendation,
  InsightData,
} from './prospeccion.types';
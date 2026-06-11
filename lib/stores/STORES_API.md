# PROSPECCION STORE — API REFERENCE

**Version:** 1.0.0  
**Location:** `lib/stores/`  
**Created:** 2026-06-10

## Table of Contents

1. [Overview](#overview)
2. [Core Store API](#core-store-api)
3. [Hooks Guide](#hooks-guide)
4. [State Structure](#state-structure)
5. [Persistence](#persistence)
6. [Examples](#examples)
7. [Testing](#testing)

---

## Overview

The Prospeccion Store is a centralized Zustand-based state management system for the Victor IA app. It handles:

- **Generations**: Video/image creation, tracking, versioning
- **Queue**: Job queuing, batch processing, progress tracking
- **Trending**: Trend discovery, category filtering, insights
- **User**: Preferences, credits, subscription, rate limits
- **UI State**: Modals, view modes, sidebar, dark mode
- **Export & Sharing**: Platform exports, scheduling, collaboration

### Key Features

- ✅ TypeScript-first with 120+ types
- ✅ Persistence to localStorage (generations, preferences, filters)
- ✅ Computed selectors for derived state
- ✅ 30+ convenience hooks for common patterns
- ✅ Async action handling with error tracking
- ✅ Rate limit tracking
- ✅ Real-time queue progress

---

## Core Store API

### Main Store Hook

```typescript
import { useProspeccionStore } from '@/lib/stores';

const store = useProspeccionStore();
// Access all state and actions
```

### State Properties

#### Generations

```typescript
// Generated assets collection
generations: Map<string, GeneratedAsset>

// Currently selected generation
selectedGenerationId?: string

// Filter state for generations
generationFilter: FilterState
```

#### Queue

```typescript
// Queued jobs
queue: QueuedJob[]

// Batch generation progress
queueProgress: BatchGenerationProgress | null

// Pause/resume state
isPaused: boolean
```

#### Trending

```typescript
// Current trending topics
trendingNow: Trend[]

// Last time trending was fetched
lastTrendingUpdate: Date

// Filter for trending
trendingFilter: {
  category?: string[]
  minMomentum?: number
  platforms?: Platform[]
}
```

#### User & Subscription

```typescript
// User ID
userId: string

// User preferences
userPrefs: UserPreferences

// Credit balance (usable units)
creditsBalance: number

// Credits spent this month
creditsUsedThisMonth: number

// Subscription tier
subscriptionTier: SubscriptionTier // 'free' | 'starter' | 'pro' | 'enterprise' | 'custom'

// Rate limit info
rateLimit: RateLimitInfo
```

#### UI State

```typescript
// View mode: 'grid' | 'list' | 'timeline'
viewMode: 'grid' | 'list' | 'timeline'

// Sort configuration
sortBy: SortOption

// Modal states
isVideoModalOpen: boolean
isImageModalOpen: boolean
isExportModalOpen: boolean
selectedExportTarget?: ExportTarget

// Layout
isCollapsedSidebar: boolean
darkMode: boolean

// Loading and error
isLoading: boolean
error: string | null
```

---

## Hooks Guide

### 1. Generation Hooks

#### `useGenerationCreate()`

Create new generations (video/image/batch).

```typescript
const { createVideo, createImages, createBatch, error, isLoading } = useGenerationCreate();

// Create single video
await createVideo({
  topic: 'AI automation',
  description: 'Quick intro video',
  platform: ['instagram', 'tiktok'],
  style: 'luxury',
  tone: 'professional',
  duration: 30,
  includeCaptions: true,
  includeHashtags: true,
  autoEnhance: true,
  qualityPreset: 'premium',
});

// Create batch
await createBatch([params1, params2, params3]);
```

#### `useGeneration(id)`

Manage individual generation.

```typescript
const { generation, select, delete, favorite, archive, duplicate, cancel, retry } = useGeneration(jobId);

// Select in UI
select();

// Toggle favorite
favorite(); // generation.isFavorite flips

// Archive/unarchive
archive();

// Duplicate for variations
await duplicate();

// Cancel if in progress
await cancel();

// Retry if failed
await retry();
```

#### `useGenerationsList(pageSize?)`

Browse and filter generations with pagination.

```typescript
const { generations, total, page, totalPages, setPage, updateFilter, updateSort, resetFilters } = useGenerationsList(20);

// Apply filter
updateFilter({
  status: ['completed'],
  platform: ['instagram'],
  style: ['luxury'],
  searchQuery: 'luxury watch',
});

// Sort
updateSort({ field: 'createdAt', direction: 'desc' });

// Paginate
setPage(2);
```

#### `useRecentGenerations(limit?)`

Get recent and favorite generations.

```typescript
const { recent, favorites } = useRecentGenerations(10);
// recent: 10 most recent (not archived)
// favorites: all marked as favorite
```

---

### 2. Export & Sharing Hooks

#### `useExport(generationId)`

Export and share generations.

```typescript
const { export: export_, share, publish, schedule, isExporting, exportUrls } = useExport(jobId);

// Export to platform-specific format
const url = await export_('instagram_reels', {
  resolution: 'native',
  captionFormat: 'embed',
  watermark: true,
});
// Returns signed URL to exported asset

// Share with users
await share(['user1@email.com', 'user2@email.com'], 'editor');

// Publish to multiple platforms
await publish(['instagram_reels', 'tiktok', 'youtube_shorts']);

// Schedule export for future time
await schedule('instagram_reels', new Date('2026-06-15T14:00:00'));

// Track all exports
console.log(exportUrls);
// { instagram_reels: 'https://...', tiktok: 'https://...' }
```

---

### 3. Queue Hooks

#### `useQueue()`

Manage generation queue and progress.

```typescript
const { queue, queueProgress, isPaused, progressPercent, addToQueue, removeFromQueue, clearQueue, pauseQueue, resumeQueue, isEmpty } = useQueue();

// Check current queue
console.log(queue.length); // Number of jobs

// Add jobs
addToQueue([params1, params2]);

// Monitor progress
console.log(`${progressPercent}% complete`); // 0-100

// Pause/resume
pauseQueue();
resumeQueue();

// Clear all
clearQueue();
```

---

### 4. Credits & Billing Hooks

#### `useCredits()`

Credits and subscription management.

```typescript
const { balance, remaining, usedThisMonth, percentUsed, tier, canGenerate, addCredits, upgradeSubscription } = useCredits();

// Check if can generate
if (!canGenerate) {
  // Show upsell or purchase dialog
}

// Add credits (admin only)
addCredits(100); // Add 100 credits

// Upgrade subscription
upgradeSubscription('pro');

// Monitor usage
console.log(`${usedThisMonth} of 1000 credits used`);
```

#### `useRateLimit()`

Track API rate limits.

```typescript
const { remaining, limit, percentRemaining, resetAt, resetInMs, isRateLimited } = useRateLimit();

// Show rate limit warning
if (percentRemaining < 10) {
  console.warn('Rate limit nearly exceeded');
}

// Countdown timer
console.log(`Resets in ${resetInMs / 1000}s`);
```

---

### 5. Trending Hooks

#### `useTrending()`

Discover and monitor trending content.

```typescript
const { trends, lastUpdate, isLoading, refresh, setFilter, getTrend } = useTrending();

// Get all trends
console.log(trends);

// Apply category filter
setFilter({ category: ['technology'], minMomentum: 70 });

// Get specific trend
const trend = getTrend('trend-123');

// Manual refresh
await refresh();
// Automatically refreshes every 30 minutes
```

#### `useTrendingByCategory(category)`

Get trends by category.

```typescript
const { trends, category, count } = useTrendingByCategory('entertainment');
// Returns trending topics in entertainment category
```

---

### 6. Preferences Hooks

#### `useUserPreferences()`

Manage user settings.

```typescript
const { prefs, darkMode, setDarkMode, updateTheme, updateDefaultPlatforms, updatePrefs } = useUserPreferences();

// Toggle dark mode
setDarkMode(true);

// Update theme (with dark mode sync)
updateTheme('dark'); // or 'light' | 'auto'

// Set default platforms for new generations
updateDefaultPlatforms(['instagram', 'tiktok', 'linkedin']);

// Update any preference
updatePrefs({
  timezone: 'America/Los_Angeles',
  languagePreference: 'en',
});
```

---

### 7. UI State Hooks

#### `useModals()`

Control modal visibility.

```typescript
const { isVideoModalOpen, isImageModalOpen, isExportModalOpen, openVideoModal, closeVideoModal, openImageModal, closeImageModal, toggleExportModal } = useModals();

// Open video creation modal
openVideoModal();

// Toggle export modal with specific target
toggleExportModal('instagram_reels');

// Check state
if (isVideoModalOpen) {
  // Show modal
}
```

#### `useViewMode()`

Control layout and view mode.

```typescript
const { viewMode, isCollapsedSidebar, isGridView, isListView, isTimelineView, setViewMode, toggleSidebar } = useViewMode();

// Change view
setViewMode('list'); // or 'grid' | 'timeline'

// Toggle sidebar
toggleSidebar();

// Check view
if (isGridView) {
  // Render grid layout
}
```

---

### 8. Analytics Hooks

#### `useGenerationStats()`

Generation statistics and metrics.

```typescript
const { total, completed, failed, avgDuration, successRate, failureRate, queueProgress } = useGenerationStats();

// Show stats in dashboard
console.log(`Success rate: ${successRate}%`);
console.log(`Avg duration: ${(avgDuration / 1000).toFixed(1)}s`);
```

---

### 9. Workflow Hooks

#### `useGenerationWorkflow()`

Complete creation-to-export workflow.

```typescript
const { createVideo, createImages, export: export_, share, publish, canGenerate, queue, addToQueue } = useGenerationWorkflow();

// All-in-one workflow
if (canGenerate) {
  const video = await createVideo(params);
  addToQueue([params]);
  // ...later...
  await export_(video.id, 'instagram_reels');
}
```

#### `useDashboard()`

Dashboard overview with all key metrics.

```typescript
const { stats, recent, favorites, creditsBalance, subscriptionTier, trendingCount, queueProgress } = useDashboard();

// Render dashboard with all data
```

#### `useProspeccionError()`

Error handling.

```typescript
const { error, clearError, setError } = useProspeccionError();

// Show error toast
if (error) {
  showToast(error);
  clearError(); // Dismiss
}
```

#### `useProspeccionAsync()`

Wrap async operations with loading/error.

```typescript
const { execute, isLoading, error } = useProspeccionAsync();

const result = await execute(async () => {
  return await someAsyncFunction();
});
```

---

## State Structure

### GeneratedAsset (extends GenerationJob)

```typescript
interface GeneratedAsset extends GenerationJob {
  // Core job fields
  id: string;
  userId: string;
  status: JobStatus; // 'pending' | 'queued' | 'processing' | 'generating' | 'completed' | 'failed' | ...
  type: 'video' | 'image' | 'batch';
  params: GenerationParams;
  result?: GenerationResult;

  // UI flags
  isFavorite: boolean;
  isArchived: boolean;

  // History
  versions: GenerationVersion[];
  exportHistory: ExportedAsset[];
  performanceMetrics?: PerformanceMetrics;

  // Collaboration
  comments?: CollaborationComment[];
  approvals?: CollaborationApproval[];

  // Metadata
  metadata: JobMetadata;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
  retries: number;
  maxRetries: number;
  errorLog: GenerationError[];
}
```

### FilterState

```typescript
interface FilterState {
  status?: string[];
  platform?: Platform[];
  style?: ContentStyle[];
  dateRange?: { start: Date; end: Date };
  searchQuery?: string;
  tags?: string[];
  trending?: boolean;
  minEngagement?: number;
  maxCreditsUsed?: number;
}
```

---

## Persistence

### Auto-Persisted Properties

These are automatically saved to localStorage:

- `userPrefs` — User settings
- `darkMode` — Theme preference
- `viewMode` — Layout preference
- `sortBy` — Default sort
- `generationFilter` — Filter state
- `trendingFilter` — Trending filter

### Manual Persistence

Generations Map must be persisted manually:

```typescript
import { persistGenerations, rehydrateGenerations } from '@/lib/stores';

// On app init
useEffect(() => {
  rehydrateGenerations(store);
}, []);

// On store change
useEffect(() => {
  const unsubscribe = useProspeccionStore.subscribe((state) => {
    persistGenerations(state);
  });
  return unsubscribe;
}, []);
```

### Clear Storage

```typescript
import { clearStorageData } from '@/lib/stores';

clearStorageData(); // Removes all persisted data
```

---

## Examples

### Example 1: Generate and Export Video

```typescript
'use client';

import { useGenerationCreate, useExport } from '@/lib/stores';

export function VideoGenerator() {
  const { createVideo, isLoading } = useGenerationCreate();
  const [videoId, setVideoId] = useState<string>();
  const { export: export_, exportUrls } = useExport(videoId || '');

  const handleCreate = async () => {
    await createVideo({
      topic: 'AI Trends 2026',
      description: 'Latest AI developments',
      platform: ['instagram', 'tiktok'],
      style: 'cinematic',
      tone: 'educational',
      duration: 60,
      includeCaptions: true,
      autoEnhance: true,
      qualityPreset: 'premium',
    });
    // Store returns jobId automatically
  };

  const handleExport = async () => {
    if (videoId) {
      await export_('instagram_reels');
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Create Video'}
      </button>
      {videoId && (
        <button onClick={handleExport}>
          Export to Instagram
        </button>
      )}
      {exportUrls.instagram_reels && (
        <a href={exportUrls.instagram_reels} download>
          Download
        </a>
      )}
    </div>
  );
}
```

### Example 2: Dashboard with Stats

```typescript
'use client';

import { useDashboard } from '@/lib/stores';

export function Dashboard() {
  const { stats, recent, creditsBalance, queueProgress } = useDashboard();

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card title="Total Generations" value={stats.total} />
      <Card title="Success Rate" value={`${stats.successRate}%`} />
      <Card title="Credits Remaining" value={creditsBalance} />
      <Card title="Queue Progress" value={`${queueProgress}%`} />

      <div className="col-span-4">
        <h2>Recent Generations</h2>
        <GenerationGrid generations={recent} />
      </div>
    </div>
  );
}
```

### Example 3: Batch Generation with Queue

```typescript
'use client';

import { useGenerationCreate, useQueue } from '@/lib/stores';

export function BatchGenerator() {
  const { createBatch } = useGenerationCreate();
  const { queue, progressPercent, isPaused, pauseQueue, resumeQueue } = useQueue();

  const handleBatchCreate = async () => {
    const batch = [
      { topic: 'AI', style: 'luxury', ... },
      { topic: 'ML', style: 'professional', ... },
      { topic: 'LLM', style: 'cinematic', ... },
    ];
    await createBatch(batch);
  };

  return (
    <div>
      <button onClick={handleBatchCreate}>Create Batch (3 videos)</button>

      <div className="mt-4">
        <p>Queue: {queue.length} jobs</p>
        <ProgressBar value={progressPercent} />
        <button onClick={isPaused ? resumeQueue : pauseQueue}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
}
```

---

## Testing

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useGenerationCreate, useCredits } from '@/lib/stores';

describe('useGenerationCreate', () => {
  it('creates video and updates store', async () => {
    const { result } = renderHook(() => useGenerationCreate());

    await act(async () => {
      await result.current.createVideo({
        topic: 'Test',
        style: 'luxury',
        // ...
      });
    });

    // Assert store updated
  });
});
```

### Integration Tests

```typescript
describe('Generation Workflow', () => {
  it('creates video, exports, and shares', async () => {
    const { result: create } = renderHook(() => useGenerationCreate());
    const { result: export_ } = renderHook(() => useExport('video-1'));
    const { result: share } = renderHook(() => useExport('video-1'));

    // Test full workflow
  });
});
```

---

## Type Safety

All hooks and selectors are fully typed with TypeScript:

```typescript
// Types are inferred automatically
const generation = useProspeccionStore(state => state.generations.get(id));
// type: GeneratedAsset | undefined

const canGen = useProspeccionStore(state => state.selectCanGenerate());
// type: boolean

const { balance } = useCredits();
// type: number
```

---

## Performance Tips

1. **Memoize Selectors**: Use `useShallow` for object comparisons
   ```typescript
   const prefs = useProspeccionStore(state => state.userPrefs);
   // Only re-renders if userPrefs reference changes
   ```

2. **Batch Updates**: Use store's batch capability
   ```typescript
   store.setState({ /* multiple updates */ });
   ```

3. **Selector Functions**: Extract expensive derived state
   ```typescript
   const filtered = useGenerationsList(); // Already optimized
   ```

---

## Migration Guide

Migrating from other state management (Redux, Context):

```typescript
// Before (Redux)
const { generations } = useSelector(state => state.prospeccion);

// After (Zustand)
const generations = useProspeccionStore(state => 
  state.selectGenerationsFiltered()
);
```

---

## Support

For issues or questions:
- Check types in `lib/types/prospeccion.types.ts`
- Review examples in this guide
- See implementation in `prospeccion.store.ts` and `useProspeccion.hooks.ts`


# PROSPECCION STORE — Global State Management

**Production-ready Zustand store for Victor IA app**  
**Version:** 1.0.0 | **Created:** 2026-06-10

---

## What's Included

### 📦 Core Files

| File | Size | Purpose |
|------|------|---------|
| **prospeccion.store.ts** | 30KB | Main Zustand store with 30+ actions & selectors |
| **useProspeccion.hooks.ts** | 16KB | 20+ convenience hooks for UI components |
| **index.ts** | 2KB | Barrel export for clean imports |
| **STORES_API.md** | 17KB | Complete API reference & examples |
| **QUICKSTART.md** | 6KB | 5-minute getting started guide |

### ✨ Features

- ✅ **Fully typed** with 120+ TypeScript types
- ✅ **Persisted** to localStorage (preferences, filters, generations)
- ✅ **30+ actions** for generation, export, queue, credits, trending
- ✅ **20+ hooks** covering all common patterns
- ✅ **Computed selectors** for derived state (sorted, filtered, stats)
- ✅ **Rate limiting** and credit tracking
- ✅ **Error handling** with Zustand middleware
- ✅ **Real-time** queue progress and batch tracking
- ✅ **Zero dependencies** beyond Zustand
- ✅ **100% tree-shakeable** - only import what you use

---

## Quick Start

### Installation

Already in your project! Just import:

```typescript
// Components
import { useGenerationCreate, useQueue, useCredits } from '@/lib/stores';

// Or import everything
import { useProspeccionStore } from '@/lib/stores';
```

### Minimal Example

```typescript
'use client';

import { useGenerationCreate, useCredits } from '@/lib/stores';

export function CreateVideo() {
  const { createVideo, isLoading } = useGenerationCreate();
  const { canGenerate, balance } = useCredits();

  const handleCreate = async () => {
    if (!canGenerate) return alert(`Need credits`);
    
    await createVideo({
      topic: 'AI trends',
      style: 'luxury',
      tone: 'professional',
      platform: ['instagram', 'tiktok'],
      duration: 30,
      includeCaptions: true,
      qualityPreset: 'premium',
    });
  };

  return (
    <div>
      <p>Credits: {balance}</p>
      <button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Video'}
      </button>
    </div>
  );
}
```

---

## State Structure

### Generations (Map-based for fast access)

```typescript
Map<jobId, GeneratedAsset>
  ├─ id: string
  ├─ status: 'queued' | 'processing' | 'completed' | 'failed' | ...
  ├─ params: GenerationParams
  ├─ result?: GenerationResult
  ├─ isFavorite: boolean
  ├─ isArchived: boolean
  ├─ versions: GenerationVersion[]
  └─ exportHistory: ExportedAsset[]
```

### Queue (Auto-managed)

```typescript
queue: QueuedJob[]        // Jobs waiting to process
queueProgress:            // Batch progress tracking
  ├─ completed: number
  ├─ failed: number
  ├─ percentageComplete: 0-100
  └─ estimatedCompletionTime: Date
```

### User & Billing

```typescript
creditsBalance: number              // Remaining usable units
creditsUsedThisMonth: number        // Current month spending
subscriptionTier: 'free' | 'pro'    // Subscription level
rateLimit: RateLimitInfo            // API rate limits
userPrefs: UserPreferences          // Persisted settings
```

### UI State

```typescript
darkMode: boolean
viewMode: 'grid' | 'list' | 'timeline'
isVideoModalOpen: boolean
isImageModalOpen: boolean
isExportModalOpen: boolean
isCollapsedSidebar: boolean
sortBy: SortOption
generationFilter: FilterState        // Persisted filters
```

---

## Main Hooks

### Generation (Create, Browse, Manage)

```typescript
// Create new generations
const { createVideo, createImages, createBatch } = useGenerationCreate();

// Manage single generation
const { generation, select, delete, favorite, archive, duplicate } = useGeneration(id);

// Browse & filter
const { generations, updateFilter, updateSort, setPage } = useGenerationsList(20);

// Quick access
const { recent, favorites } = useRecentGenerations(10);
```

### Export & Sharing

```typescript
const { export: export_, share, publish, schedule, isExporting } = useExport(videoId);

await export_('instagram_reels');  // Returns signed download URL
await publish(['instagram', 'tiktok']);  // Multi-platform
```

### Queue Management

```typescript
const { queue, progressPercent, isPaused, addToQueue, pauseQueue } = useQueue();
```

### Credits & Billing

```typescript
const { balance, remaining, tier, canGenerate, usedThisMonth } = useCredits();
const { remaining: apiReqs, isRateLimited, resetIn } = useRateLimit();
```

### Trending & Analytics

```typescript
const { trends, refresh, setFilter } = useTrending();
const { stats, successRate, avgDuration } = useGenerationStats();
```

### Preferences & Settings

```typescript
const { prefs, darkMode, setDarkMode, updateDefaultPlatforms } = useUserPreferences();
```

### UI State

```typescript
const { isVideoModalOpen, openVideoModal, closeVideoModal } = useModals();
const { viewMode, isGridView, setViewMode, toggleSidebar } = useViewMode();
```

### Dashboard (All-in-one)

```typescript
const { stats, recent, favorites, creditsBalance, trendingCount, queueProgress } = useDashboard();
```

---

## Actions Overview

### Generation Actions (10)

| Action | Purpose |
|--------|---------|
| `generateVideo()` | Create single video generation |
| `generateImages()` | Create single image generation |
| `batchGenerate()` | Create multiple generations |
| `cancelGeneration()` | Cancel job in progress |
| `retryGeneration()` | Retry failed job |
| `deleteGeneration()` | Remove from store |
| `selectGeneration()` | Select for UI |
| `toggleFavorite()` | Mark/unmark favorite |
| `toggleArchive()` | Archive/unarchive |
| `duplicateGeneration()` | Create variation |

### Export & Sharing Actions (5)

| Action | Purpose |
|--------|---------|
| `exportGeneration()` | Export to platform format |
| `shareGeneration()` | Share with users |
| `publishToSocial()` | Multi-platform publish |
| `scheduleExport()` | Schedule for future time |
| `downloadGeneration()` | Get download link |

### Queue Actions (5)

| Action | Purpose |
|--------|---------|
| `addToQueue()` | Add jobs to queue |
| `removeFromQueue()` | Remove from queue |
| `clearQueue()` | Empty entire queue |
| `pauseQueue()` | Pause processing |
| `resumeQueue()` | Resume processing |

### User & System Actions (10+)

| Action | Purpose |
|--------|---------|
| `updateUserPrefs()` | Update user settings |
| `updateCredits()` | Add/subtract credits |
| `setSubscriptionTier()` | Change tier |
| `updateRateLimit()` | Update API limits |
| `fetchTrending()` | Refresh trending data |
| `updateGenerationFilter()` | Set filter |
| `updateSortBy()` | Change sort |
| `setViewMode()` | Change layout |
| `setDarkMode()` | Toggle dark mode |
| `resetState()` | Clear all state |

---

## Selectors & Derived State

### Computed Selectors

```typescript
// Sorted by date (respects sortBy preference)
selectGenerationsSortedByDate(): GeneratedAsset[]

// Filtered by current filters
selectGenerationsFiltered(): GeneratedAsset[]

// Queue items coming up
selectUpcomingQueue(): QueuedJob[]

// Can generation start?
selectCanGenerate(): boolean  // checks credits + rate limit

// Trending by category
selectTrendingByCategory(category): Trend[]

// Stats
selectGenerationStats(): { total, completed, failed, avgDuration }

// Queue progress 0-100%
selectQueueProgress(): number
```

---

## Persistence

### Auto-Persisted

These save automatically to localStorage:

- `userPrefs` — Theme, timezone, defaults, notification settings
- `darkMode` — Dark mode preference
- `viewMode` — Grid/list/timeline preference
- `sortBy` — Default sort order
- `generationFilter` — Filter state
- `trendingFilter` — Trending filter

### Manual Persistence

Generations Map (if you need it):

```typescript
// On app init
useEffect(() => {
  rehydrateGenerations(store);
}, []);

// Subscribe to changes
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

## Type Safety

Everything is fully typed:

```typescript
// Types are inferred
const { balance } = useCredits();          // balance: number
const { trends } = useTrending();          // trends: Trend[]
const { stats } = useGenerationStats();    // stats: { total: number, ... }

// Params are type-checked
await createVideo({
  topic: 'AI',           // ✓ Required string
  style: 'luxury',       // ✓ Type: ContentStyle
  tone: 'professional',  // ✓ Type: ToneOption
  platform: ['instagram'],  // ✓ Type: Platform[]
  // Intellisense helps here ↑
});

// State access is typed
useProspeccionStore(state => state.creditsBalance);  // type: number
useProspeccionStore(state => state.userPrefs);       // type: UserPreferences
```

---

## Architecture Patterns

### Pattern 1: Component with Creation

```typescript
const { createVideo, isLoading, error } = useGenerationCreate();

const handleCreate = async (params) => {
  try {
    await createVideo(params);
    // Store updated automatically
  } catch (err) {
    // Error in state
  }
};
```

### Pattern 2: Filtered List with Pagination

```typescript
const { generations, updateFilter, updateSort, setPage, page, totalPages } = useGenerationsList(20);

// User filters
<FilterButton onClick={() => updateFilter({ platform: ['instagram'] })} />

// Render with pagination
{generations.map(g => <GenerationCard key={g.id} {...g} />)}
```

### Pattern 3: Queue Monitor

```typescript
const { queue, progressPercent, isPaused, pauseQueue } = useQueue();

<ProgressBar value={progressPercent} />
<Badge>{queue.length} in queue</Badge>
<Button onClick={pauseQueue}>Pause</Button>
```

### Pattern 4: Billing/Credits UI

```typescript
const { balance, remaining, tier, canGenerate } = useCredits();

{!canGenerate && <CTA>Upgrade to continue</CTA>}
<CreditBadge value={balance} />
```

---

## Performance

Zustand is already highly optimized:

```typescript
// ✅ Good: Subscribes only to what you use
const balance = useProspeccionStore(state => state.creditsBalance);
// Only re-renders when balance changes

// ✅ Good: Use preset hooks (already optimized)
const { recent } = useRecentGenerations(5);

// ❌ Avoid: Subscribing to entire store
const allState = useProspeccionStore();  // Re-renders on ANY state change
```

---

## File Structure

```
lib/stores/
├── prospeccion.store.ts      (Main store: 30KB, 900+ lines)
├── useProspeccion.hooks.ts   (Hooks layer: 16KB, 600+ lines)
├── index.ts                  (Barrel export: 2KB)
├── README.md                 (This file)
├── STORES_API.md            (Complete API reference: 17KB)
├── QUICKSTART.md            (5-min guide: 6KB)
└── .../prospeccion.types.ts (Types: 50KB, in lib/types/)
```

---

## Integration Points

### With API

```typescript
// In your API routes
export async function POST /api/generation/video {
  // 1. Validate credits via store or DB
  // 2. Create job
  // 3. Return jobId
  // 4. Store updates automatically via webhook
}
```

### With Services

```typescript
// Queue service listens to store changes
useProspeccionStore.subscribe(async (state) => {
  if (state.queue.length > 0) {
    await processQueue(state.queue);
  }
});
```

### With Analytics

```typescript
// Track generation usage
useProspeccionStore.subscribe((state) => {
  state.generations.forEach(asset => {
    if (asset.status === 'completed') {
      trackEvent('generation_completed', {
        type: asset.type,
        credits_used: asset.result?.processing.costEstimate,
      });
    }
  });
});
```

---

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useGenerationCreate } from '@/lib/stores';

describe('Prospeccion Store', () => {
  it('creates video generation', async () => {
    const { result } = renderHook(() => useGenerationCreate());

    await act(async () => {
      await result.current.createVideo({
        topic: 'Test',
        style: 'luxury',
        // ...
      });
    });

    // Assert state updated
    expect(result.current.isLoading).toBe(false);
  });
});
```

---

## Documentation

- **[STORES_API.md](./STORES_API.md)** — Complete API reference with all hooks, actions, selectors
- **[QUICKSTART.md](./QUICKSTART.md)** — 5-minute getting started guide with patterns
- **[Types](../types/prospeccion.types.ts)** — 120+ type definitions
- **[Implementation](./prospeccion.store.ts)** — Store source code
- **[Hooks](./useProspeccion.hooks.ts)** — Hooks source code

---

## Roadmap

- [x] Core store implementation
- [x] 20+ hooks layer
- [x] Type definitions
- [x] Persistence middleware
- [x] Error handling
- [ ] Real-time sync with backend
- [ ] Offline support
- [ ] Performance monitoring
- [ ] Redux DevTools integration (optional)

---

## Support & Troubleshooting

### "React hook 'X' is called in a function that is not a React function component"
→ Hooks must be called in React components, not async functions

### "Store state not updating"
→ Check if using hook inside component, not just accessing store object

### "Credits not reflecting"
→ Use `useCredits()` hook which has memoization

### "TypeScript errors"
→ Check types in `lib/types/prospeccion.types.ts`

---

## License

Part of Victor IA © 2026

---

**Need help?** Check the examples in `STORES_API.md` or `QUICKSTART.md`
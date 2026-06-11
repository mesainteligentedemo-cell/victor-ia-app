# Import Reference Guide

Quick reference for all available imports across the Prospeccion system.

---

## Types (120+ definitions)

```typescript
import type {
  // === CORE GENERATION ===
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

  // === ANALYTICS ===
  AnalyticsEvent,
  GenerationEvent,
  BatchEvent,
  ExportEvent,
  AnalyticsData,
  MetricsSnapshot,

  // === RATE LIMITING ===
  RateLimitConfig,
  RateLimitCheckResult,
  QuotaInfo,
  CreditsBalance,

  // === FILTERING ===
  FilterState,
  SearchQuery,
  SortOption,
  PaginationState,

  // === UI ===
  UserPreferences,
  ModalState,
  ViewMode,
  NotificationPreference,

  // === EXPORT & VERSION ===
  ExportOptions,
  ExportResult,
  VersionSnapshot,
  VersionHistory,
  CollaborationSession,

  // === SUBSCRIPTION ===
  SubscriptionTier,
  BillingInfo,
  UsageStats,
  LimitInfo,

  // === TRENDING ===
  TrendingContent,
  TrendingCategory,
  ContentRecommendation,
  InsightData,
} from '@/lib/types';
```

---

## Services (8 Total - No React)

```typescript
import {
  ProspeccionService,
  QueueService,
  RateLimitService,
  AnalyticsService,
  PromptEnhancerService,
  TrendingService,
  ExportService,
  VersioningService,
} from '@/lib/services';

// Usage in non-React code, API routes, etc.
const service = new ProspeccionService(config);
const result = await service.generateVideo('user_1', params);
```

---

## Stores & Hooks (20+ Hooks)

```typescript
import {
  // === STORE ===
  useProspeccionStore,
  useProspeccionSelector,
  rehydrateGenerations,
  persistGenerations,
  clearStorageData,

  // === GENERATION HOOKS ===
  useGenerationCreate,
  useGeneration,
  useGenerationsList,
  useRecentGenerations,

  // === EXPORT HOOKS ===
  useExport,

  // === QUEUE HOOKS ===
  useQueue,

  // === BILLING HOOKS ===
  useCredits,
  useRateLimit,

  // === TRENDING HOOKS ===
  useTrending,
  useTrendingByCategory,

  // === PREFERENCES HOOKS ===
  useUserPreferences,

  // === UI STATE HOOKS ===
  useModals,
  useViewMode,

  // === ANALYTICS HOOKS ===
  useGenerationStats,

  // === WORKFLOW HOOKS ===
  useGenerationWorkflow,
  useDashboard,
  useProspeccionError,
  useProspeccionAsync,

  // === STORE TYPES ===
  type ProspeccionState,
  type GeneratedAsset,
  type FilterState,
  type RateLimitInfo,
} from '@/lib/stores';

// Usage in React components
export function MyComponent() {
  const { generate, status } = useGenerationCreate();
  // ...
}
```

---

## Components (10 Components + 3 Hooks)

```typescript
import {
  // === MAIN PAGE ===
  ProspeccionPage,

  // === MODALS ===
  VideoGeneratorModal,
  ImageGeneratorModal,
  BatchGeneratorModal,
  ExportModal,

  // === DISPLAY ===
  ResultsGallery,
  TrendingPanel,

  // === VERSIONING ===
  VersioningPanel,
  VersionComparisonView,
  VersioningIntegrationExample,

  // === LOCAL HOOKS ===
  useProspeccion,
  useTrending,
  useVersionHistory,
} from '@/components/prospeccion';

// Usage
export default function App() {
  return <ProspeccionPage />;
}
```

---

## Common Import Patterns

### Pattern 1: Full Page Implementation
```typescript
// components/my-page.tsx
import {
  ProspeccionPage,
  VideoGeneratorModal,
  ResultsGallery,
} from '@/components/prospeccion';

import {
  useGenerationCreate,
  useGenerationsList,
} from '@/lib/stores';

import type {
  GenerationParams,
  GenerationResult,
} from '@/lib/types';

export function MyPage() {
  const { generate, status } = useGenerationCreate();
  const { generations } = useGenerationsList();

  return (
    <>
      <ProspeccionPage />
      <ResultsGallery assets={generations} />
    </>
  );
}
```

### Pattern 2: Service-Only (API Route)
```typescript
// app/api/generate/route.ts
import { ProspeccionService } from '@/lib/services';
import type { GenerationParams } from '@/lib/types';

export async function POST(request: Request) {
  const params: GenerationParams = await request.json();
  const service = new ProspeccionService(config);
  
  const result = await service.generateVideo(userId, params);
  return Response.json(result);
}
```

### Pattern 3: Custom Hook
```typescript
// hooks/my-hook.ts
import { useGenerationCreate, useQueue } from '@/lib/stores';
import { useProspeccionStore } from '@/lib/stores';
import type { GenerationJob } from '@/lib/types';

export function useMyCustomHook() {
  const { generate } = useGenerationCreate();
  const { queue } = useQueue();
  const store = useProspeccionStore();

  return { generate, queue, store };
}
```

### Pattern 4: Modal Component
```typescript
// components/my-modal.tsx
import { VideoGeneratorModal } from '@/components/prospeccion';
import { useGenerationCreate } from '@/lib/stores';
import type { GenerationParams } from '@/lib/types';

export function MyModal() {
  const { generate } = useGenerationCreate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <VideoGeneratorModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={async (params: GenerationParams) => {
        await generate(params);
        setIsOpen(false);
      }}
    />
  );
}
```

---

## What Goes Where

### ✅ DO Import from `/lib/types`
- In services
- In stores
- In components
- In API routes
- In utility functions
- In test files

### ✅ DO Import from `/lib/services`
- In API routes
- In server-side code
- In utilities (non-React)
- In tests
- In server components

### ✅ DO Import from `/lib/stores`
- In React components
- In client components only
- In custom hooks
- NOT in services

### ✅ DO Import from `/components/prospeccion`
- In parent components
- In page templates
- In layout components
- NOT in services
- NOT in utilities

### ❌ DON'T Import
```typescript
// ❌ Direct service imports in components
import { ProspeccionService } from '@/lib/services';

// ❌ React hooks in services
import { useState } from 'react';

// ❌ Components in services
import { VideoGeneratorModal } from '@/components/prospeccion';

// ❌ Store hooks in services
import { useGenerationCreate } from '@/lib/stores';

// ❌ Services in components (use hooks instead)
const service = new ProspeccionService();
```

---

## Type Checking

```typescript
// ✅ CORRECT: Import type where used
import type { GenerationJob, JobStatus } from '@/lib/types';

export function processJob(job: GenerationJob) {
  const status: JobStatus = job.status;
  return status;
}

// ✅ CORRECT: Type safety in hooks
import { useGenerationCreate } from '@/lib/stores';
import type { GenerationParams } from '@/lib/types';

export function MyComponent() {
  const { generate } = useGenerationCreate();
  
  const params: GenerationParams = { /* ... */ };
  await generate(params);
}

// ❌ WRONG: Missing type imports
export function processJob(job: any) {
  // No type safety
}
```

---

## Barrel Exports Summary

| Module | File | Exports | Usage |
|--------|------|---------|-------|
| Types | `/lib/types/index.ts` | 120+ types | `import type { ... }` |
| Services | `/lib/services/index.ts` | 8 services | `new ServiceClass(config)` |
| Stores | `/lib/stores/index.ts` | 20+ hooks | `useHook()` in React |
| Components | `/components/prospeccion/index.ts` | 13 exports | `<Component />` in JSX |

---

## IDE Autocomplete

When you type:
```typescript
import { 
  // Start typing - autocomplete shows:
  // Services:
  - ProspeccionService
  - QueueService
  - RateLimitService
  // Hooks:
  - useGenerationCreate
  - useQueue
  // Components:
  - ProspeccionPage
  - VideoGeneratorModal
} from '@/lib/...'
```

---

## Quick Copy-Paste Imports

### For a new React component:
```typescript
import { useGenerationCreate, useQueue } from '@/lib/stores';
import { VideoGeneratorModal, ResultsGallery } from '@/components/prospeccion';
import type { GenerationParams, GenerationResult } from '@/lib/types';
```

### For a new API route:
```typescript
import { ProspeccionService } from '@/lib/services';
import type { GenerationParams } from '@/lib/types';
```

### For a new service:
```typescript
import type {
  GenerationJob,
  GenerationParams,
  JobStatus,
} from '@/lib/types';
```

### For a new custom hook:
```typescript
import { useProspeccionStore, useGenerationCreate } from '@/lib/stores';
import type { GenerationResult } from '@/lib/types';
```

---

## Troubleshooting

### "Module has no exported member"
- Use `/index.ts` file from the module
- Check capitalization (ProspeccionService, not prospeccionService)
- Use `import type { ... }` for types

### "Type X is not defined"
- Import from `/lib/types`
- Prefix with `type` keyword: `import type { X }`

### "Cannot find module"
- Use full path: `@/lib/types`
- Check file exists: `C:\Users\inbou\victor-ia-app\lib\types\index.ts`

### "Property not found on service"
- Service methods are listed in SERVICE_GUIDE.md
- Use autocomplete to discover methods
- Check method signature in service file

---

## Testing Imports

```typescript
// ✅ Test services independently
import { ProspeccionService } from '@/lib/services';

test('service works', async () => {
  const service = new ProspeccionService(testConfig);
  const result = await service.generateVideo('user_1', params);
  expect(result.status).toBe('queued');
});

// ✅ Test hooks with RTL
import { renderHook } from '@testing-library/react';
import { useGenerationCreate } from '@/lib/stores';

test('hook works', () => {
  const { result } = renderHook(() => useGenerationCreate());
  expect(result.current.generate).toBeDefined();
});

// ✅ Test components with RTL
import { render } from '@testing-library/react';
import { VideoGeneratorModal } from '@/components/prospeccion';

test('component renders', () => {
  const { getByRole } = render(
    <VideoGeneratorModal isOpen={true} onClose={() => {}} />
  );
  expect(getByRole('dialog')).toBeInTheDocument();
});
```

---

## See Also

- **Architecture:** [/lib/services/README.md](lib/services/README.md)
- **Service Usage:** [/lib/services/SERVICE_GUIDE.md](lib/services/SERVICE_GUIDE.md)
- **Components:** [/components/prospeccion/README.md](components/prospeccion/README.md)
- **Full Status:** [INTEGRATION_STATUS.md](INTEGRATION_STATUS.md)

---

**Last Updated:** 2026-06-10  
**Version:** 1.0.0

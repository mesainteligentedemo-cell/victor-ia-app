# PROSPECCION STORE — QUICK START

**Get up and running in 5 minutes.**

## Installation

Already installed! Just import:

```typescript
import { useProspeccionStore } from '@/lib/stores';
import { useGenerationCreate, useCredits, useDashboard } from '@/lib/stores';
```

---

## 30-Second Overview

```typescript
// Create a generation
const { createVideo } = useGenerationCreate();
await createVideo({
  topic: 'AI automation',
  style: 'luxury',
  tone: 'professional',
  platform: ['instagram', 'tiktok'],
  includeCaptions: true,
});

// Check credits
const { balance, canGenerate } = useCredits();

// Export to platform
const { export: export_ } = useExport(videoId);
await export_('instagram_reels');

// Monitor queue
const { queue, progressPercent } = useQueue();
```

---

## Common Patterns

### Pattern 1: Dashboard Overview

```typescript
import { useDashboard } from '@/lib/stores';

export function Dashboard() {
  const { stats, recent, creditsBalance, queueProgress } = useDashboard();

  return (
    <div>
      <Stat label="Total" value={stats.total} />
      <Stat label="Success" value={`${stats.successRate}%`} />
      <Stat label="Credits" value={creditsBalance} />
      <ProgressBar value={queueProgress} />
      <GenerationGrid items={recent} />
    </div>
  );
}
```

### Pattern 2: Creation Workflow

```typescript
import { useGenerationCreate, useQueue, useCredits } from '@/lib/stores';

export function CreateVideo() {
  const { createVideo, isLoading } = useGenerationCreate();
  const { canGenerate } = useCredits();
  const { addToQueue } = useQueue();

  const handleCreate = async (params) => {
    if (!canGenerate) return alert('No credits');
    await createVideo(params);
    addToQueue([params]);
  };

  return <CreateForm onSubmit={handleCreate} isLoading={isLoading} />;
}
```

### Pattern 3: Filtering & Browsing

```typescript
import { useGenerationsList } from '@/lib/stores';

export function GenerationBrowser() {
  const { generations, updateFilter, updateSort } = useGenerationsList(20);

  return (
    <div>
      <FilterBar onFilter={updateFilter} />
      <SortMenu onSort={updateSort} />
      <GenerationGrid items={generations} />
    </div>
  );
}
```

### Pattern 4: Export & Share

```typescript
import { useExport } from '@/lib/stores';

export function ExportModal({ videoId, onDone }) {
  const { export: export_, share, publish, isExporting } = useExport(videoId);

  return (
    <Modal>
      <Button onClick={() => export_('instagram_reels')}>
        Export to Instagram
      </Button>
      <Button onClick={() => publish(['instagram', 'tiktok'])}>
        Publish to All
      </Button>
      <Button onClick={() => share(['user@email.com'], 'editor')}>
        Share with Team
      </Button>
    </Modal>
  );
}
```

---

## State Management

### Read State

```typescript
// Direct access
const store = useProspeccionStore();
console.log(store.creditsBalance);

// Via hook
const { balance } = useCredits();

// Via selector
const stats = useProspeccionStore(state => state.selectGenerationStats());
```

### Update State

```typescript
// Direct mutation (Zustand handles it)
useProspeccionStore.setState({ darkMode: true });

// Via action
const { setDarkMode } = useUserPreferences();
setDarkMode(true);

// Via hook
const { updateFilter } = useGenerationsList();
updateFilter({ platform: ['instagram'] });
```

---

## Error Handling

```typescript
import { useProspeccionError } from '@/lib/stores';

export function MyComponent() {
  const { error, clearError } = useProspeccionError();

  return (
    <>
      {error && (
        <Toast
          type="error"
          message={error}
          onDismiss={clearError}
        />
      )}
    </>
  );
}
```

Or with async wrapper:

```typescript
const { execute, isLoading, error } = useProspeccionAsync();

const handleClick = async () => {
  const result = await execute(async () => {
    return await someAsyncFunction();
  });
};
```

---

## Persistence

Auto-persisted to localStorage:
- User preferences
- Dark mode
- View mode
- Filters & sorting

Manual for generations (if needed):

```typescript
import { persistGenerations, rehydrateGenerations } from '@/lib/stores';

useEffect(() => {
  rehydrateGenerations(store);
}, []);

const unsubscribe = useProspeccionStore.subscribe(persistGenerations);
```

---

## Performance

Zustand is already optimized, but for large lists:

```typescript
// ✅ Good: Subscribed to specific slice
const creditsBalance = useProspeccionStore(state => state.creditsBalance);

// ✅ Good: Using preset hooks
const { recent } = useRecentGenerations(5);

// ❌ Avoid: Entire store subscription
const store = useProspeccionStore();
```

---

## TypeScript

Full type safety:

```typescript
// Types are inferred
const prefs = useProspeccionStore(state => state.userPrefs);
// type: UserPreferences

const { balance } = useCredits();
// type: number

const { createVideo } = useGenerationCreate();
// ✓ Type-safe params required
await createVideo({
  topic: string,        // ✓ Required
  style: ContentStyle,  // ✓ Specific union
  // ...
});
```

---

## Debugging

Enable debug logging:

```typescript
// In browser console
const store = useProspeccionStore;
store.subscribe(console.log); // Logs all state changes
```

Or inspect state:

```typescript
useProspeccionStore.setState(state => {
  console.log('Current state:', state);
  return state;
});
```

---

## Common Issues

### "Credits not updating"
→ Check `useCredits()` hook, not raw state

### "Generations not persisting"
→ Call `persistGenerations()` on store changes

### "UI not re-rendering"
→ Make sure you're using the hook, not just accessing store object

### "Type errors in params"
→ Check `GenerationParams` type definition in `prospeccion.types.ts`

---

## API Reference Quick Links

- **Full API**: See `STORES_API.md`
- **Types**: See `lib/types/prospeccion.types.ts`
- **Implementation**: See `prospeccion.store.ts`
- **Hooks**: See `useProspeccion.hooks.ts`

---

## Next Steps

1. ✅ Store created and ready
2. 📝 Add API endpoints for generation
3. 🔌 Connect to Higgsfield/video gen service
4. 🎨 Build components consuming hooks
5. 📊 Add analytics tracking
6. 🧪 Write tests

---

**Questions?** Check examples in `STORES_API.md`

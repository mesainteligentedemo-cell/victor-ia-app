# QueueService - Quick Start Guide

## 5-Minute Setup

### 1. Import the Service

```typescript
import { getQueueService } from '@/lib/services/queue.service';
import { useQueueService } from '@/lib/hooks/useQueueService';
```

### 2. Add a Job

```typescript
const queue = getQueueService();

const jobId = queue.addJob(
  job,                    // GenerationJob
  'premium',              // User tier
  true                    // Is trending?
);
```

### 3. Monitor Status

```typescript
const status = await queue.getQueueStats();
console.log(`Pending: ${status.pendingJobs}`);
console.log(`Success Rate: ${(status.successRate * 100).toFixed(2)}%`);
```

### 4. Use in React

```typescript
'use client';
import { useQueueService } from '@/lib/hooks/useQueueService';

export function MyComponent() {
  const queue = useQueueService();
  
  const handleClick = () => {
    queue.addJob(jobData, 'video');
  };

  const status = queue.getQueueStatus();

  return (
    <div>
      <button onClick={handleClick}>Generate</button>
      <p>Pending: {status.pendingJobs}</p>
    </div>
  );
}
```

## Priority Examples

```typescript
// Free user, image batch, not trending
// Priority = 100 × 1.0 × 1.0 × 1.1 = 110

// Enterprise user, trending video
// Priority = 50 × 2.0 × 1.2 × 1.0 = 120

// Premium user, small image batch, trending
// Priority = 100 × 1.5 × 1.2 × 1.1 = 198
```

## Common Operations

```typescript
const queue = getQueueService();

// Pause/resume
queue.pauseQueue();
queue.resumeQueue();

// Cancel job
await queue.cancelJob(jobId);

// Reprioritize
await queue.reprioritize(jobId, 'high');

// Clear old jobs
const cleared = await queue.clearCompletedJobs();

// Get all jobs
const jobs = queue.queue; // Access internal map if needed

// Get failed jobs
const failed = Array.from(queue.queue.values())
  .filter(j => j.status === 'failed');
```

## React Hooks

### useQueueService (Main Hook)

```typescript
const queue = useQueueService({
  autoRefresh: true,        // Auto-update every refreshInterval
  refreshInterval: 1000,    // Milliseconds
  userTier: 'premium',      // Default tier for added jobs
});

// All operations
queue.addJob(jobData, 'video');
queue.cancelJob(jobId);
queue.pauseQueue();
queue.resumeQueue();
const status = queue.getQueueStatus();
```

### useJobStatus (Monitor Single Job)

```typescript
const job = useJobStatus(jobId);

if (job?.status === 'completed') {
  console.log('Done!', job.result?.urls);
}
```

### useQueueMetrics (Real-time Stats)

```typescript
const metrics = useQueueMetrics();
console.log(`Success Rate: ${metrics?.successRate * 100}%`);
console.log(`Throughput: ${metrics?.throughput} jobs/min`);
```

## Configuration

```typescript
const queue = getQueueService({
  maxConcurrent: 5,          // Default: 5
  maxRetries: 3,             // Default: 3
  persistenceEnabled: true,  // Default: true
  useIndexedDB: true,        // Default: true
  defaultUserTier: 'free',   // Default: 'free'
});
```

## Job Status Flow

```
pending → queued → processing → completed
                ↓
                failed (with retries)
                ↓
                cancelled
```

## Retry Strategy

```
Attempt 1: Wait 1s  (4^0)
Attempt 2: Wait 4s  (4^1)
Attempt 3: Wait 16s (4^2)
Attempt 4: Wait 60s (capped)
```

## Real-World Example

```typescript
'use client';

import { useQueueService } from '@/lib/hooks/useQueueService';
import { VideoGenerationParams } from '@/lib/prospeccion-types';

export function VideoGenForm() {
  const queue = useQueueService({ userTier: 'enterprise' });
  const [jobId, setJobId] = useState<string>();

  const handleSubmit = (formData: VideoGenerationParams) => {
    // Create GenerationJob
    const job: GenerationJob = {
      id: crypto.randomUUID(),
      userId: 'user123',
      projectId: 'project456',
      status: 'pending',
      type: 'video',
      params: { /* ... */ },
      metadata: { /* ... */ },
      createdAt: new Date(),
      updatedAt: new Date(),
      retries: 0,
      maxRetries: 3,
      errorLog: [],
    };

    // Queue it
    const id = await queue.enqueue(job, 'enterprise', true);
    setJobId(id);
  };

  if (jobId) {
    const status = queue.getQueueStatus();
    return (
      <div>
        <p>Job: {jobId}</p>
        <p>Position: {status.pendingJobs}</p>
        <p>ETA: {status.estimatedTimeRemaining}s</p>
      </div>
    );
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

## Performance Tips

1. **Batch small jobs**: 2-4 items process before 20+ items
2. **Set correct tier**: Premium/Enterprise get priority boost
3. **Use trending flag**: For time-sensitive content
4. **Monitor metrics**: Track success rate and throughput
5. **Clear old jobs**: Prevent memory bloat
6. **Adjust concurrency**: Match your API rate limits

## Debugging

```typescript
const queue = getQueueService();

// View all jobs
console.log(queue.queue);

// View queue order
console.log(queue.queueOrder);

// Check paused state
console.log(queue.isPaused);

// View processing jobs
console.log(queue.processingJobs);

// View priority map
console.log(queue.jobPriorityMap);
```

## Files to Know

| File | Purpose |
|------|---------|
| `lib/services/queue.service.ts` | Core service |
| `lib/hooks/useQueueService.ts` | React hooks |
| `lib/services/QUEUE_SERVICE.md` | Full API docs |
| `lib/services/queue.service.test.ts` | Tests + examples |

## Next Steps

1. ✓ Review QUEUE_SERVICE.md for complete API
2. ✓ Check queue.service.test.ts for usage examples
3. ✓ Integrate with your GenerationJob processor
4. ✓ Add queue UI dashboard
5. ✓ Deploy and monitor metrics

## Support

- Full API docs: `lib/services/QUEUE_SERVICE.md`
- Usage examples: `lib/services/queue.service.test.ts`
- Implementation guide: `lib/services/QUEUE_SERVICE_IMPLEMENTATION.md`
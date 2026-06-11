# VersioningService — Git-like Generation Management

Complete versioning system for Victor IA App with version tracking, rollback, merging, and lineage management.

## Overview

The VersioningService provides a Git-like version control system for generated assets (videos, images, etc.). It tracks all changes, enables rollback to previous versions, supports merging multiple versions with conflict detection, and maintains a complete audit trail.

**Current Version:** 1.0.0  
**Last Updated:** 2026-06-10

## Features

### Core Capabilities

- ✅ **Save versions** with automatic change tracking
- ✅ **View history** of all versions with detailed metadata
- ✅ **Rollback** to any previous version instantly
- ✅ **Compare** two versions with detailed diff visualization
- ✅ **Merge** versions using three strategies (combine-best, blend-styles, composite)
- ✅ **Tag versions** for organization and quick access
- ✅ **Archive versions** for cleanup without deletion
- ✅ **Lineage tracking** showing version dependencies and merge origins
- ✅ **Quality scoring** for each version
- ✅ **Engagement prediction** for marketing optimization

### Merge Strategies

| Strategy | Use Case | Behavior |
|----------|----------|----------|
| `combine-best` | Multi-part content | Use video from v1 + audio from v2 |
| `blend-styles` | Style refinement | v1 style + v2 content updates |
| `composite` | Creative mixing | Create new generation from both elements |

## Installation

### 1. Service File
Located: `lib/services/versioning.service.ts`

```typescript
import { versioningService } from '@/lib/services/versioning.service';
```

### 2. API Routes
- POST `/api/versions` — Save new version
- GET `/api/versions?assetId=...` — List all versions
- GET `/api/versions?assetId=...&action=lineage` — Get version lineage
- GET `/api/versions/[versionId]?action=compare&compareWith=...` — Compare versions
- PATCH `/api/versions/[versionId]` — Update metadata (tag, archive)
- POST `/api/versions/rollback` — Rollback to version
- POST `/api/versions/merge` — Merge two versions

### 3. React Hook
Located: `lib/hooks/useVersioning.ts`

```typescript
import { useVersioning } from '@/lib/hooks/useVersioning';

const { saveVersion, listVersions, rollback, merge } = useVersioning({ assetId: 'asset-123' });
```

## API Reference

### SaveVersion

Saves a new version of an asset with automatic change tracking.

```typescript
const result = await versioningService.saveVersion(
  generationResult, // GenerationResult | GenerationJob
  'v1.0 - Initial release',
  {
    author: 'user@example.com',
    description: 'First version with color correction',
    tags: ['production', 'color-graded'],
    quality: qualityMetrics,
    engagementPrediction: 85
  }
);

// Returns: VersionedAsset
{
  id: 'asset-123',
  jobId: 'job-456',
  assetId: 'asset-123',
  currentVersionId: 'asset-123-v1',
  versionCount: 1,
  createdAt: Date,
  updatedAt: Date,
  tags: ['production', 'color-graded'],
  metadata: { ... }
}
```

### GetVersionHistory

Fetch all versions for an asset in chronological order.

```typescript
const history = await versioningService.getVersionHistory('asset-123');

// Returns: DetailedVersion[]
[
  {
    id: 'asset-123-v1',
    versionNumber: 1,
    timestamp: Date,
    author: 'user@example.com',
    quality: { score: 85, metrics: {...} },
    engagement: { prediction: 85, viralityScore: 0 },
    ...
  },
  ...
]
```

### Rollback

Restore the asset to a specific previous version. Creates a new version that reverts changes.

```typescript
const result = await versioningService.rollback(
  'asset-123',
  2, // targetVersionNumber
  'user@example.com'
);

// Returns: RollbackResult
{
  assetId: 'asset-123',
  fromVersionId: 'asset-123-v5',
  toVersionId: 'asset-123-v2',
  newVersionId: 'asset-123-v6', // Restored content
  restoredAt: Date,
  restoredBy: 'user@example.com',
  changesReverted: [...],
  success: true
}
```

### CreateMerge

Merge two versions using a specified strategy with automatic conflict detection.

```typescript
const result = await versioningService.createMerge(
  'asset-123-v2', // v1Id
  'asset-123-v4', // v2Id
  'combine-best',
  'user@example.com'
);

// Returns: MergeResultDetail
{
  mergedVersionId: 'asset-123-v5',
  mergedAt: Date,
  mergedBy: 'user@example.com',
  strategy: 'combine-best',
  conflicts: [
    {
      field: 'audioVolume',
      v1Value: 0.8,
      v2Value: 0.6,
      severity: 'low'
    }
  ],
  resolvedConflicts: [...],
  success: true
}
```

### CompareVersions

Get detailed diff between two versions with visualization data.

```typescript
const diff = await versioningService.compareVersions(
  'asset-123-v1',
  'asset-123-v2'
);

// Returns: VersionDiff
{
  fromVersionId: 'asset-123-v1',
  toVersionId: 'asset-123-v2',
  changes: [
    {
      field: 'quality.overallScore',
      oldValue: 75,
      newValue: 85,
      type: 'modified'
    },
    {
      field: 'tags',
      oldValue: undefined,
      newValue: ['color-graded'],
      type: 'added'
    }
  ],
  summary: {
    fieldsChanged: 5,
    fieldsAdded: 2,
    fieldsRemoved: 0
  },
  visualization: {
    type: 'side-by-side',
    fromThumbnail: 'https://...',
    toThumbnail: 'https://...',
    highlights: [...]
  }
}
```

### ListVersions

Get all versions with statistics and diffs between consecutive versions.

```typescript
const response = await versioningService.listVersions('asset-123');

// Returns: VersionListResponse
{
  assetId: 'asset-123',
  currentVersionId: 'asset-123-v5',
  versions: [DetailedVersion, ...],
  diffs: {
    'asset-123-v1': [VersionDiff, ...],
    'asset-123-v2': [VersionDiff, ...],
    ...
  },
  stats: {
    totalVersions: 5,
    oldestVersion: 'asset-123-v1',
    newestVersion: 'asset-123-v5',
    averageTimePerVersion: 3600000, // ms
    contributors: ['user1@example.com', 'user2@example.com']
  }
}
```

### GetVersionLineage

Get DAG (directed acyclic graph) of version relationships including merges and branches.

```typescript
const lineage = await versioningService.getVersionLineage('asset-123');

// Returns: VersionLineage
{
  assetId: 'asset-123',
  versions: [DetailedVersion, ...],
  graph: {
    nodes: [
      {
        id: 'asset-123-v1',
        versionNumber: 1,
        author: 'user@example.com',
        timestamp: Date,
        type: 'original'
      },
      {
        id: 'asset-123-v2',
        versionNumber: 2,
        type: 'revision'
      },
      {
        id: 'asset-123-v5',
        versionNumber: 5,
        type: 'merge'
      }
    ],
    edges: [
      { from: 'asset-123-v1', to: 'asset-123-v2', type: 'sequential' },
      { from: 'asset-123-v2', to: 'asset-123-v3', type: 'sequential' },
      { from: 'asset-123-v3', to: 'asset-123-v5', type: 'merge' },
      { from: 'asset-123-v4', to: 'asset-123-v5', type: 'merge' }
    ]
  }
}
```

## React Hook Usage

### Basic Setup

```typescript
'use client';
import { useVersioning } from '@/lib/hooks/useVersioning';

export function AssetVersionControl() {
  const {
    loading,
    error,
    versions,
    selectedVersion,
    saveVersion,
    listVersions,
    rollback,
    compareVersions,
    merge,
  } = useVersioning({ assetId: 'asset-123' });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error.message}</div>}
      
      <button onClick={() => listVersions('asset-123')}>
        Load Versions
      </button>

      <div className="versions-list">
        {versions.map((v) => (
          <div key={v.id}>
            <h3>v{v.versionNumber}</h3>
            <p>{v.description}</p>
            <small>{new Date(v.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Save New Version

```typescript
async function handleSaveVersion() {
  const result = await saveVersion(
    generationResult,
    'Export to Instagram',
    {
      author: 'user@example.com',
      description: 'Optimized for Instagram Stories (9:16)',
      tags: ['instagram', 'optimized']
    }
  );

  if (result) {
    console.log('Saved version:', result.currentVersionId);
  }
}
```

### Rollback to Previous Version

```typescript
async function handleRollback(targetVersion: number) {
  const result = await rollback('asset-123', targetVersion, 'user@example.com');
  
  if (result?.success) {
    // Show success message
    await listVersions('asset-123'); // Refresh
  } else {
    // Show error
  }
}
```

### Merge Two Versions

```typescript
async function handleMerge(v1Id: string, v2Id: string) {
  const result = await merge(
    v1Id,
    v2Id,
    'combine-best', // Strategy
    'user@example.com'
  );

  if (result?.success) {
    // Show merged result
    console.log('Merged version:', result.mergedVersionId);
    console.log('Conflicts:', result.conflicts);
  }
}
```

### Compare Versions

```typescript
async function showComparison(v1: DetailedVersion, v2: DetailedVersion) {
  const diff = await compareVersions(v1.id, v2.id);
  
  return (
    <div className="comparison">
      <div className="column">
        <img src={diff.visualization.fromThumbnail} />
        <h3>Version {v1.versionNumber}</h3>
      </div>
      
      <div className="changes">
        {diff.changes.map((change) => (
          <div key={change.field} className={change.type}>
            <strong>{change.field}:</strong>
            {change.type === 'modified' && (
              <span>
                {JSON.stringify(change.oldValue)} →{' '}
                {JSON.stringify(change.newValue)}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="column">
        <img src={diff.visualization.toThumbnail} />
        <h3>Version {v2.versionNumber}</h3>
      </div>
    </div>
  );
}
```

## Database Schema

### Main Tables

```sql
-- Versioned assets
CREATE TABLE versioned_assets (
  id UUID PRIMARY KEY,
  asset_id VARCHAR NOT NULL,
  job_id VARCHAR,
  current_version_id VARCHAR NOT NULL,
  version_count INTEGER DEFAULT 0,
  parent_asset_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  UNIQUE(asset_id)
);

-- Generation versions
CREATE TABLE generation_versions (
  id VARCHAR PRIMARY KEY,
  asset_id VARCHAR NOT NULL REFERENCES versioned_assets(asset_id),
  version_number INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  author VARCHAR NOT NULL,
  author_name VARCHAR,
  description TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  changes JSONB DEFAULT '[]',
  thumbnail VARCHAR,
  quality_score NUMERIC,
  quality_metrics JSONB,
  engagement_prediction NUMERIC,
  file_metadata JSONB,
  asset_snapshot JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Version merges
CREATE TABLE version_merges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merged_version_id VARCHAR NOT NULL,
  v1_id VARCHAR NOT NULL,
  v2_id VARCHAR NOT NULL,
  strategy VARCHAR NOT NULL,
  merged_by VARCHAR NOT NULL,
  merged_at TIMESTAMP NOT NULL,
  conflicts JSONB DEFAULT '[]',
  resolved_conflicts JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_versions_asset ON generation_versions(asset_id);
CREATE INDEX idx_versions_timestamp ON generation_versions(timestamp);
CREATE INDEX idx_versions_author ON generation_versions(author);
CREATE INDEX idx_merges_v1 ON version_merges(v1_id);
CREATE INDEX idx_merges_v2 ON version_merges(v2_id);
```

## Metadata Structure

### Version Metadata

Each version includes:
- **author**: User who created/modified the version
- **timestamp**: When the version was created
- **changes**: List of field modifications (field, oldValue, newValue, type)
- **description**: Human-readable change summary
- **tags**: Labels for organization (#color-graded, #production, etc.)
- **quality**: Score (0-100) and detailed metrics
- **engagement**: Predicted metrics and virality score
- **fileMetadata**: Size, format, duration, dimensions

### Asset Snapshot

The full asset state is stored with each version for instant restoration:
```typescript
asset_snapshot: {
  urls: { primary, thumbnail, preview, alternatives },
  metadata: { duration, width, height, fileSize, format },
  quality: { overallScore, clarity, composition, ... },
  processing: { duration, cost, ... },
  ...
}
```

## Performance Considerations

### Optimization Tips

1. **Archive old versions** - Use `archiveVersion()` to keep tables lean
2. **Limit version count** - Implement retention policy (e.g., keep last 20)
3. **Use tags for filtering** - Query by tags instead of scanning all versions
4. **Batch comparisons** - Cache frequently compared version pairs
5. **Lazy load snapshots** - Only fetch full snapshots when needed

### Scaling

- **Versions table** - Add partitioning by date for large datasets
- **Snapshots** - Consider external storage (S3) for large assets
- **Diffs caching** - Pre-compute and cache frequently used diffs
- **Lineage graphs** - Cache DAG generation for 100+ versions

## Error Handling

All service methods include error handling:

```typescript
try {
  const result = await versioningService.rollback(...);
} catch (error) {
  console.error('Rollback failed:', error);
  // Show user-friendly message
}
```

Hook automatically sets `error` state:

```typescript
const { error, clearError } = useVersioning();

if (error) {
  return <Alert type="error">{error.message}</Alert>;
}
```

## Best Practices

1. **Always provide metadata** - Include author, description, tags
2. **Use meaningful version names** - Not just "v2", but "v2 - Color correction"
3. **Tag strategically** - Use tags for quick filtering (#production, #draft, #export)
4. **Archive regularly** - Keep only recent versions in active memory
5. **Document merges** - Leave clear notes on why versions were merged
6. **Monitor quality scores** - Track quality trends across versions
7. **Back up important versions** - Export or tag production versions

## Troubleshooting

### Version not found
- Check assetId parameter
- Ensure version exists (call listVersions first)
- Verify user has access permissions

### Merge conflicts
- Review conflict details in result
- Choose resolution strategy
- Create new version with resolved state

### Rollback failed
- Verify target version exists
- Check version number is valid
- Ensure snapshot data is intact

## API Examples

### cURL

```bash
# Save version
curl -X POST http://localhost:3000/api/versions \
  -H "Content-Type: application/json" \
  -d '{
    "asset": { ... },
    "versionName": "v1.0",
    "metadata": {
      "author": "user@example.com",
      "tags": ["production"]
    }
  }'

# List versions
curl "http://localhost:3000/api/versions?assetId=asset-123"

# Rollback
curl -X POST http://localhost:3000/api/versions/rollback \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": "asset-123",
    "targetVersionNumber": 2,
    "rolledBackBy": "user@example.com"
  }'

# Merge
curl -X POST http://localhost:3000/api/versions/merge \
  -H "Content-Type: application/json" \
  -d '{
    "v1Id": "asset-123-v2",
    "v2Id": "asset-123-v4",
    "strategy": "combine-best",
    "mergedBy": "user@example.com"
  }'
```

## Related Services

- **AnalyticsService** - Track version performance metrics
- **CollaborationService** - Share versions and approval workflows
- **QueueService** - Queue version processing jobs

## Support

For issues or questions, refer to:
- Main documentation: `/docs/README.md`
- Type definitions: `/lib/types/prospeccion.types.ts`
- Service tests: `/lib/services/__tests__/versioning.test.ts`
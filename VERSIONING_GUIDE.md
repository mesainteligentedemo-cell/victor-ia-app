# Versioning & Comparison UI — Complete Guide

## Overview

A production-grade versioning system for image and video assets with:
- **Timeline** of all versions with thumbnails, timestamps, and quality scores
- **Comparison Views** (side-by-side, overlay, slider)
- **Merge Strategies** (blend, composite, combine, alternate)
- **Version Management** (rollback, rename, delete)
- **Quality Metrics** and metadata tracking

## Components

### 1. VersioningPanel.tsx
The main UI component for version management.

**Features:**
- Expandable timeline showing all versions
- Current version highlighted with checkmark
- Quality score indicator (0-100) with color coding
- Version author and timestamp
- Metadata preview (prompt, size, duration)
- Quick actions: preview, rollback, rename, compare, delete
- Merge dialog with strategy selection
- Compare mode toggle for side-by-side selection

**Props:**
```typescript
interface VersioningPanelProps {
  asset: GeneratedAsset;
  versions: AssetVersion[];
  onVersionSelect: (versionId: string) => void;
  onVersionRollback: (versionId: string) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionRename: (versionId: string, newName: string) => void;
  onMergeStart: (config: MergeConfig) => Promise<{ url: string; id: string }>;
  onCompare?: (v1: AssetVersion, v2: AssetVersion) => void;
  currentUser?: string;
}
```

**Usage:**
```jsx
<VersioningPanel
  asset={selectedAsset}
  versions={versionHistory}
  onVersionSelect={(versionId) => loadVersion(versionId)}
  onVersionRollback={(versionId) => rollback(versionId)}
  onVersionDelete={(versionId) => deleteVersion(versionId)}
  onVersionRename={(id, name) => renameVersion(id, name)}
  onMergeStart={(config) => mergeVersions(config)}
  onCompare={(v1, v2) => setComparison({v1, v2})}
  currentUser="designer@company.com"
/>
```

### 2. VersionComparisonView.tsx
Full-screen comparison viewer with multiple view modes.

**Features:**
- **Side-by-Side Mode**: Two versions in grid layout
- **Overlay Mode**: V2 as floating window over V1
- **Slider Mode**: Draggable divider between versions
- Zoom controls (50-200%)
- Metrics comparison panel with quality scores
- Metadata display (prompts, styles, parameters)
- Export buttons for both versions

**Props:**
```typescript
interface VersionComparisonViewProps {
  v1: AssetVersion;
  v2: AssetVersion;
  assetType: "image" | "video";
  onClose?: () => void;
  onSelectVersion?: (versionId: string) => void;
}
```

**Usage:**
```jsx
const [comparison, setComparison] = useState(null);

{comparison && (
  <VersionComparisonView
    v1={comparison.v1}
    v2={comparison.v2}
    assetType="image"
    onClose={() => setComparison(null)}
    onSelectVersion={(id) => handleSelect(id)}
  />
)}
```

### 3. useVersionHistory.ts
React hook for managing version state and operations.

**Features:**
- Create versions from assets
- Rollback to specific versions
- Rename/delete versions
- Merge versions (server-side)
- Statistics calculation (average quality, time span, etc.)
- localStorage persistence support

**Methods:**
```typescript
const {
  createVersion,        // (asset, author?, name?) => AssetVersion
  getVersions,          // (assetId) => AssetVersion[]
  rollbackToVersion,    // (assetId, versionId) => AssetVersion | null
  renameVersion,        // (assetId, versionId, newName) => void
  deleteVersion,        // (assetId, versionId) => boolean
  mergeVersions,        // (assetId, config) => Promise<{url, id}>
  clearHistory,         // (assetId) => void
  getStatistics,        // (assetId) => Statistics
  histories,            // Map<assetId, VersionHistory>
} = useVersionHistory({ maxVersions: 20 });
```

**Usage:**
```jsx
import { useVersionHistory } from '@/components/prospeccion/useVersionHistory';

function MyComponent() {
  const { createVersion, getVersions, mergeVersions } = useVersionHistory();

  const handleCreate = (asset) => {
    const version = createVersion(asset, 'user@company.com', 'v1.0');
    console.log('Created:', version);
  };

  return <button onClick={() => handleCreate(asset)}>Create Version</button>;
}
```

## Data Structures

### AssetVersion
```typescript
interface AssetVersion {
  id: string;                    // Unique version ID
  assetId: string;               // Parent asset ID
  versionNumber: number;         // Sequential version number
  timestamp: Date;               // Creation time
  author: string;                // Who created this version
  name?: string;                 // Custom name (v1.0, "Final", etc)
  thumbnailUrl?: string;         // Preview thumbnail
  qualityScore: number;          // 0-100 quality metric
  metadata?: {
    prompt: string;              // Original prompt
    params: any;                 // Generation parameters
    estimatedSize?: number;      // File size in bytes
    duration?: number;           // Duration in seconds (videos)
  };
  baseUrl: string;               // Full URL to asset
  isCurrent: boolean;            // Is this the active version?
}
```

### VersionHistory
```typescript
interface VersionHistory {
  assetId: string;
  versions: AssetVersion[];
  currentVersionId: string;
}
```

### MergeConfig
```typescript
interface MergeConfig {
  strategy: 'combine' | 'blend' | 'composite' | 'alternate';
  v1Id: string;                  // Base version
  v2Id: string;                  // Secondary version
  blendRatio?: number;           // 0-100, default 50 (for blend)
  compositeMode?: 'overlay' | 'multiply' | 'screen';  // for composite
}
```

## Merge Strategies

### 1. Blend
- Smoothly blend two assets using alpha transparency
- Adjustable blend ratio (0-100%)
- Works for images and videos
- Result: smooth cross-fade between versions

```
Blend(V1, V2, ratio=50)
└─ Output: (V1 × ratio) + (V2 × (100-ratio))
```

### 2. Composite
- Layer one asset over another with blend modes
- Supports overlay, multiply, screen modes
- Maintains sharp details from both sources
- Works for images and videos

```
Composite(V1, V2, mode='overlay')
└─ Output: V2 layered on top of V1 with blend mode
```

### 3. Combine
- Side-by-side or grid layout
- Creates composite view of both versions
- Good for comparison output
- Works for images and videos

```
Combine(V1, V2)
└─ Output: [V1] [V2] side-by-side
```

### 4. Alternate
- Cut/switch between versions
- For videos: create edit with alternating clips
- For images: create slideshow
- Creates animation showing both versions

```
Alternate(V1, V2)
└─ Output: V1 (5s) → V2 (5s) → repeat
```

## API Endpoints

### POST /api/merge/versions
Merge two asset versions.

**Request:**
```json
{
  "assetId": "video-123",
  "v1Url": "https://cdn.example.com/v1.mp4",
  "v2Url": "https://cdn.example.com/v2.mp4",
  "assetType": "video",
  "config": {
    "strategy": "blend",
    "v1Id": "video-123-v1",
    "v2Id": "video-123-v2",
    "blendRatio": 50
  }
}
```

**Response:**
```json
{
  "mergeId": "merge-1718023456789-abc123",
  "mergedUrl": "https://cdn.example.com/merged-abc123.mp4",
  "duration": 30,
  "metadata": {
    "strategy": "blend",
    "source_v1": "video-123-v1",
    "source_v2": "video-123-v2",
    "blend_ratio": 50,
    "created_at": "2024-06-10T15:30:45Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid merge strategy"
}
```

## Quality Scoring

Quality scores (0-100) are calculated automatically based on:

| Factor | Bonus |
|--------|-------|
| Ultra quality | +30 |
| Premium quality | +20 |
| Standard quality | +10 |
| File < 1MB | +10 |
| File < 5MB | +5 |
| Recent (< 30 days old) | 0 |
| Old (> 30 days) | -5 |
| Very old (> 90 days) | -10 |
| Completed status | +5 |

## Integration Example

Complete example in `VersioningIntegrationExample.tsx`:

```jsx
import { useState, useCallback } from 'react';
import VersioningPanel from './VersioningPanel';
import VersionComparisonView from './VersionComparisonView';
import { useVersionHistory } from './useVersionHistory';

function MyAssetEditor() {
  const { createVersion, getVersions, mergeVersions } = useVersionHistory();
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [versions, setVersions] = useState([]);
  const [compareView, setCompareView] = useState(null);

  return (
    <>
      <VersioningPanel
        asset={currentAsset}
        versions={versions}
        onVersionRollback={(versionId) => {
          const version = versions.find(v => v.id === versionId);
          setCurrentAsset(prev => ({
            ...prev,
            url: version.baseUrl,
          }));
        }}
        onMergeStart={async (config) => {
          const result = await mergeVersions(currentAsset.id, config);
          return result;
        }}
        onCompare={(v1, v2) => setCompareView({v1, v2})}
      />

      {compareView && (
        <VersionComparisonView
          v1={compareView.v1}
          v2={compareView.v2}
          assetType={currentAsset.type}
          onClose={() => setCompareView(null)}
        />
      )}
    </>
  );
}
```

## Performance Considerations

### Version Limit
- Default: 20 versions per asset
- Configure via `useVersionHistory({ maxVersions: 30 })`
- Older versions auto-pruned when limit exceeded
- Current version never deleted

### Memory Usage
- Thumbnails: ~50KB each
- Metadata: ~5KB each
- 20 versions ≈ 1.2MB memory

### Network Optimization
- Merge operations use URL-based processing
- No need to download full assets to client
- Result URL returned directly

### Lazy Loading
- Versions only expanded on demand
- Thumbnails loaded on scroll
- Comparison view lazy-mounts

## Customization

### Custom Quality Calculator
```typescript
const { createVersion } = useVersionHistory({
  onCalculateQuality: (asset) => {
    // Custom scoring logic
    return Math.random() * 100;
  }
});
```

### Custom Naming
```typescript
const version = createVersion(
  asset,
  'designer@company.com',
  `${asset.type}-${new Date().toISOString()}`
);
```

### Custom Metadata
```typescript
// When creating version, metadata is auto-populated from asset.params
// Override by modifying hook implementation
```

## Styling

Uses Tailwind CSS with dark theme. Key colors:

- **Current version**: Emerald (✓)
- **Quality good**: Blue (75+)
- **Quality excellent**: Emerald (90+)
- **Hover**: Slate-600

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 13+)
- IE11: ❌ Not supported

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader support
- ✅ Color not only indicator (icons + badges)
- ✅ Proper ARIA labels

## Known Limitations

1. **Merge Processing**
   - Currently mocked in API
   - Production needs FFmpeg for videos
   - Sharp/Pillow for images

2. **File Size**
   - Display is estimated for demo
   - Real sizes from metadata API needed

3. **Duration**
   - Video durations must be manually specified
   - Automatic detection via ffprobe recommended

4. **Permissions**
   - All users can see all versions
   - Implement auth checks if needed

## Future Enhancements

- [ ] Version diffing visualization
- [ ] Batch operations (delete multiple)
- [ ] Version comments/annotations
- [ ] Collaborative editing with locks
- [ ] Version branching
- [ ] AI-powered quality scoring
- [ ] Version publishing/staging
- [ ] Automatic backup versioning

## Troubleshooting

### Versions not persisting
- Check `useVersionHistory` hook maxVersions
- Ensure localStorage access allowed
- Browser incognito mode disables storage

### Merge fails
- Validate URLs are CORS-enabled
- Check API endpoint is running
- Review console for error messages

### Comparison view black
- Ensure asset URLs are accessible
- Check CORS headers
- Verify image/video format support

## Support

For issues or questions:
1. Check `VersioningIntegrationExample.tsx` for usage
2. Review component props documentation
3. Check browser console for errors
4. Verify API endpoint is accessible
# Credits System Documentation

## Overview

The Credits System manages user credit balances for media generation (images and videos). It includes:

- **Credit Costs**: Different costs for different media types and qualities
- **Balance Management**: Track user balances, deductions, and additions
- **Usage Limits**: Daily and monthly usage quotas
- **Transaction History**: Complete audit trail of all credit transactions
- **Metrics & Analytics**: Detailed usage metrics and projections

## Cost Model

### Image Generation
- **Standard 1:1**: 2 credits
- **Standard 16:9**: 3 credits
- **Premium 1:1**: 4 credits
- **Premium 16:9**: 6 credits

### Video Generation
- **Short (5-15s)**: 10 credits
- **Medium (15-30s)**: 20 credits
- **Long (30-60s)**: 50 credits

### Initial & Limits
- **Initial Free Credits**: 1000 credits per new user
- **Monthly Quota**: 10,000 credits/month
- **Daily Limit**: 500 credits/day

## Services

### CreditsService

Core service class for all credit operations.

#### Key Methods

```typescript
// Get/Initialize User
CreditsService.initializeUser(userId: string): CreditsBalance
CreditsService.getBalance(userId: string): number
CreditsService.getBalanceInfo(userId: string): CreditsBalance

// Deduct/Add Credits
CreditsService.deductCredits(userId: string, amount: number): boolean
CreditsService.addCredits(userId: string, amount: number, reason: string): CreditTransaction
CreditsService.recordGeneration(
  userId: string,
  cost: number,
  type: "image" | "video",
  quality: string,
  metadata?: { assetId?: string; projectId?: string }
): { success: boolean; transaction?: CreditTransaction; error?: string }

// Calculate Costs
CreditsService.calculateCost(type: "image" | "video", quality: string, duration?: number): number
CreditsService.getCostDefinitions(): Record<string, CreditCost>

// Check Limits
CreditsService.canAfford(userId: string, cost: number): boolean
CreditsService.canUseDaily(userId: string, cost: number): boolean
CreditsService.canUseMonthly(userId: string, cost: number): boolean

// History & Metrics
CreditsService.getUsageHistory(userId: string): UsageHistoryEntry[]
CreditsService.getTransactionHistory(userId: string, limit?: number): CreditTransaction[]
CreditsService.getMetrics(userId: string): CreditsMetrics

// Admin
CreditsService.resetBalance(userId: string, amount?: number): CreditsBalance
```

#### Usage Example

```typescript
import { CreditsService } from "@/lib/services/credits.service";

const userId = "user-123";

// Check if user can afford
if (!CreditsService.canAfford(userId, 20)) {
  console.log("Insufficient credits");
  return;
}

// Record a generation
const result = CreditsService.recordGeneration(
  userId,
  20,
  "video",
  "medium",
  { assetId: "asset-456" }
);

if (result.success) {
  console.log("Generation recorded, new balance:", CreditsService.getBalance(userId));
} else {
  console.log("Error:", result.error);
}

// Get metrics
const metrics = CreditsService.getMetrics(userId);
console.log("Daily usage:", metrics.dailyUsage);
console.log("Monthly usage:", metrics.monthlyUsage);
```

## Components

### CreditsMeter

Visual component displaying user's balance and usage metrics.

#### Props

```typescript
interface CreditsMeterProps {
  userId: string;
  estimatedCost?: number;           // Show preview of generation cost
  onInsufficientCredits?: (needed: number, available: number) => void;
  className?: string;
}
```

#### Usage Example

```tsx
import { CreditsMeter } from "@/components/CreditsMeter";

export function MyComponent() {
  const [estimatedCost, setEstimatedCost] = useState(0);

  return (
    <CreditsMeter
      userId="user-123"
      estimatedCost={estimatedCost}
      onInsufficientCredits={(needed, available) => {
        console.log(`Need ${needed}, only have ${available}`);
      }}
    />
  );
}
```

#### Features

- Real-time balance display
- Generation cost preview
- Daily usage progress bar
- Monthly quota tracking
- Low balance warnings
- Projected runout date
- Insufficient credit alerts

## Hooks

### useCredits

Main hook for managing credits in components.

```typescript
const {
  metrics,           // CreditsMetrics
  transactions,      // CreditTransaction[]
  isLoading,         // boolean
  error,             // string | null
  canAfford,         // (cost: number) => boolean
  canUseDaily,       // (cost: number) => boolean
  canUseMonthly,     // (cost: number) => boolean
  recordGeneration,  // async (cost, type, quality, metadata?) => Promise
  calculateCost,     // (type, quality, duration?) => number
  getBalance,        // () => number
  refresh,           // () => void
  currentBalance,    // number
  totalAvailable,    // number
  percentageUsed,    // number
} = useCredits({ userId: "user-123" });
```

#### Usage Example

```tsx
import { useCredits } from "@/lib/hooks/useCredits";

export function VideoGenerator() {
  const { 
    metrics, 
    canAfford, 
    recordGeneration, 
    calculateCost 
  } = useCredits({ 
    userId: "user-123",
    refreshInterval: 5000  // Auto-refresh every 5s
  });

  const handleGenerateVideo = async () => {
    const cost = calculateCost("video", "medium", 20);

    if (!canAfford(cost)) {
      alert("Insufficient credits");
      return;
    }

    const result = await recordGeneration(cost, "video", "medium", {
      assetId: "my-asset"
    });

    if (result.success) {
      console.log("Video generation started");
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <p>Balance: {metrics?.currentBalance}</p>
      <button onClick={handleGenerateVideo}>Generate Video</button>
    </div>
  );
}
```

### useCreditsCost

Simple hook for calculating costs.

```typescript
const { cost, formatted, costDefinitions } = useCreditsCost("video", "medium", 20);
// cost = 20
// formatted = "20 credits"
// costDefinitions = { ... }
```

### useCreditsCheck

Check if operation is allowed.

```typescript
const { canAfford, canUseDaily, canUseMonthly, canProceed } = useCreditsCheck(
  "user-123",
  20
);

if (canProceed) {
  // User can generate with this cost
}
```

## API Routes

### GET /api/credits/balance

Retrieve user's credit balance and metrics.

**Query Parameters:**
- `userId` (required): User identifier

**Headers:**
- `X-User-Id`: Alternative to query param

**Response:**

```json
{
  "success": true,
  "userId": "user-123",
  "balance": {
    "current": 980,
    "total": 1000,
    "spent": 20,
    "lastUpdated": "2024-06-10T12:00:00Z"
  },
  "metrics": {
    "currentBalance": 980,
    "totalAvailable": 1000,
    "percentageUsed": 2.0,
    "monthlyUsage": {
      "spent": 20,
      "remaining": 9980,
      "percentageOfQuota": 0.2
    },
    "dailyUsage": {
      "today": 20,
      "limit": 500,
      "percentageOfDaily": 4.0
    },
    "lastTransactionDate": "2024-06-10T12:00:00Z",
    "projectedRunoutDate": null
  },
  "recentTransactions": [
    {
      "id": "txn-1717960800000-abc",
      "amount": 20,
      "type": "debit",
      "reason": "Generated medium video",
      "timestamp": "2024-06-10T12:00:00Z",
      "generationType": "video"
    }
  ]
}
```

### POST /api/credits/balance

Add credits to user account (admin only).

**Request Body:**

```json
{
  "userId": "user-123",
  "amount": 500,
  "reason": "Promotional bonus"
}
```

**Response:**

```json
{
  "success": true,
  "transaction": {
    "id": "txn-1717960800000-xyz",
    "amount": 500,
    "reason": "Promotional bonus",
    "timestamp": "2024-06-10T12:00:00Z"
  },
  "newBalance": 1480
}
```

## Integration Examples

### In Image Generator Modal

```tsx
import { ImageGeneratorModal } from "@/components/prospeccion/ImageGeneratorModal";
import { CreditsMeter } from "@/components/CreditsMeter";
import { useCredits } from "@/lib/hooks/useCredits";

export function ProspeccionPage() {
  const { calculateCost } = useCredits({ userId: "user-123" });
  const [imageQuality, setImageQuality] = useState("premium");
  const estimatedCost = calculateCost("image", imageQuality);

  return (
    <div className="grid grid-cols-3 gap-4">
      <CreditsMeter userId="user-123" estimatedCost={estimatedCost} />
      <ImageGeneratorModal onGenerate={handleGenerate} />
    </div>
  );
}
```

### In Video Generator Modal

```tsx
export function VideoGeneratorModal() {
  const { 
    metrics, 
    canAfford, 
    recordGeneration, 
    calculateCost 
  } = useCredits({ userId: "user-123" });

  const handleGenerateVideo = async (params) => {
    const cost = calculateCost("video", params.quality, params.duration);

    if (!canAfford(cost)) {
      setError(`Need ${cost} credits, have ${metrics.currentBalance}`);
      return;
    }

    try {
      const result = await recordGeneration(cost, "video", params.quality, {
        projectId: currentProject.id
      });

      if (result.success) {
        // Proceed with generation
        await generateVideo(params);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {/* Modal content */}
      <button 
        disabled={!metrics || !canAfford(estimatedCost)}
        onClick={handleGenerateVideo}
      >
        Generate Video
      </button>
    </div>
  );
}
```

## Testing

### Reset User Balance

For testing/development:

```typescript
CreditsService.resetBalance("user-123", 1000);
```

### Add Test Credits

```typescript
CreditsService.addCredits("user-123", 100, "Test bonus");
```

### Check Metrics

```typescript
const metrics = CreditsService.getMetrics("user-123");
console.log(metrics);
```

## Future Enhancements

- [ ] Database persistence (currently in-memory)
- [ ] Credit packages/bundles (buy 5000 credits, get 1000 free)
- [ ] Referral bonuses
- [ ] Seasonal promotions
- [ ] Credit expiration policies
- [ ] Usage analytics dashboard
- [ ] Webhooks for credit events
- [ ] Payment integration (Stripe, etc.)
- [ ] Rate limiting per API key
- [ ] Credit gifting between users

# Credits System Integration Examples

## Quick Start

### 1. Display Credits Meter in Your Component

```tsx
import { CreditsMeter } from "@/components/CreditsMeter";

export function MyPage() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Left sidebar - Credits info */}
      <CreditsMeter userId="user-123" className="col-span-1" />
      
      {/* Main content */}
      <div className="col-span-3">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### 2. Preview Generation Cost

```tsx
import { CreditsMeter } from "@/components/CreditsMeter";
import { useState } from "react";

export function VideoGeneratorModal() {
  const [quality, setQuality] = useState("standard");
  const [duration, setDuration] = useState(15);
  
  // Estimated cost for 15s standard video = 10 credits
  const estimatedCost = 10;

  return (
    <>
      <CreditsMeter 
        userId="user-123" 
        estimatedCost={estimatedCost}
        onInsufficientCredits={(needed, available) => {
          alert(`Need ${needed} credits, only have ${available}`);
        }}
      />
      
      <div className="mt-4">
        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
          <option value="standard">Standard (10 credits)</option>
          <option value="premium">Premium (20 credits)</option>
        </select>
        
        <button>Generate Video</button>
      </div>
    </>
  );
}
```

### 3. Use the Hook in Components

```tsx
import { useCredits } from "@/lib/hooks/useCredits";

export function ImageGenerator() {
  const { 
    metrics, 
    canAfford, 
    recordGeneration, 
    calculateCost 
  } = useCredits({ userId: "user-123" });

  const handleGenerateImage = async () => {
    const cost = calculateCost("image", "premium");

    if (!canAfford(cost)) {
      console.error("Insufficient credits");
      return;
    }

    // Record the generation
    const result = await recordGeneration(cost, "image", "premium", {
      projectId: "proj-123",
      assetId: "asset-456"
    });

    if (result.success) {
      console.log("Image generation started");
      // Proceed with actual generation
    } else {
      console.error(result.error);
    }
  };

  return (
    <button 
      onClick={handleGenerateImage}
      disabled={!metrics || !canAfford(calculateCost("image", "premium"))}
    >
      Generate Image ({calculateCost("image", "premium")} credits)
    </button>
  );
}
```

## Batch Generation Example

```tsx
import { useCredits } from "@/lib/hooks/useCredits";

export function BatchImageGenerator() {
  const { 
    metrics, 
    recordGeneration, 
    calculateCost 
  } = useCredits({ userId: "user-123" });

  const handleGenerateBatch = async (count: number) => {
    const costPer = calculateCost("image", "standard");
    const totalCost = costPer * count;

    if (metrics!.currentBalance < totalCost) {
      alert(`Need ${totalCost} credits, have ${metrics!.currentBalance}`);
      return;
    }

    const batchId = `batch-${Date.now()}`;
    const successes = [];
    const failures = [];

    for (let i = 0; i < count; i++) {
      const result = await recordGeneration(
        costPer, 
        "image", 
        "standard",
        { batchId, index: i }
      );

      if (result.success) {
        successes.push(i);
      } else {
        failures.push({ index: i, error: result.error });
      }
    }

    console.log(`Generated ${successes.length}/${count} images`);
    if (failures.length > 0) {
      console.log("Failures:", failures);
    }
  };

  return (
    <button onClick={() => handleGenerateBatch(4)}>
      Generate 4 Images ({calculateCost("image", "standard") * 4} credits)
    </button>
  );
}
```

## Fetch from API Endpoint

```tsx
"use client";

import { useEffect, useState } from "react";

export function BalanceFromAPI() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/credits/balance?userId=user-123");
        const data = await response.json();
        
        if (data.success) {
          setBalance(data.balance.current);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading balance...</div>;
  
  return <div>Balance: {balance} credits</div>;
}
```

## Direct Service Usage (Server-side)

```typescript
import { CreditsService } from "@/lib/services/credits.service";

// In your API route or server action
export async function POST(request: Request) {
  const { userId, assetId } = await request.json();

  // Check balance
  if (!CreditsService.canAfford(userId, 20)) {
    return Response.json(
      { error: "Insufficient credits" },
      { status: 402 }
    );
  }

  // Record the generation
  const result = CreditsService.recordGeneration(
    userId,
    20,
    "video",
    "medium",
    { assetId }
  );

  if (!result.success) {
    return Response.json(
      { error: result.error },
      { status: 402 }
    );
  }

  // Proceed with generation...
  return Response.json({
    success: true,
    transaction: result.transaction,
    newBalance: CreditsService.getBalance(userId)
  });
}
```

## Metrics & Analytics

```tsx
import { useCredits } from "@/lib/hooks/useCredits";

export function CreditsMetricsPanel() {
  const { metrics } = useCredits({ userId: "user-123" });

  if (!metrics) return null;

  return (
    <div className="space-y-4">
      {/* Overall usage */}
      <div>
        <h3>Total Usage</h3>
        <p>{metrics.percentageUsed.toFixed(1)}% of all credits used</p>
      </div>

      {/* Daily usage */}
      <div>
        <h3>Daily Usage</h3>
        <p>{metrics.dailyUsage.today} / {metrics.dailyUsage.limit} credits</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${metrics.dailyUsage.percentageOfDaily}%` }}
          />
        </div>
      </div>

      {/* Monthly usage */}
      <div>
        <h3>Monthly Usage</h3>
        <p>{metrics.monthlyUsage.spent} / {metrics.monthlyUsage.spent + metrics.monthlyUsage.remaining} credits</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: `${metrics.monthlyUsage.percentageOfQuota}%` }}
          />
        </div>
      </div>

      {/* Runout projection */}
      {metrics.projectedRunoutDate && (
        <div>
          <h3>Projected Runout</h3>
          <p>{new Date(metrics.projectedRunoutDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
```

## Admin: Add Credits (Server-side)

```typescript
import { CreditsService } from "@/lib/services/credits.service";

// In your API route
export async function POST(request: Request) {
  const { userId, amount, reason } = await request.json();

  // TODO: Add auth check to ensure user is admin
  // if (!isAdmin(request)) {
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const transaction = CreditsService.addCredits(
    userId,
    amount,
    reason || "Admin bonus"
  );

  return Response.json({
    success: true,
    transaction,
    newBalance: CreditsService.getBalance(userId)
  });
}
```

Call via curl:
```bash
curl -X POST http://localhost:3000/api/credits/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "amount": 500,
    "reason": "Referral bonus"
  }'
```

## Transaction History

```tsx
import { useCredits } from "@/lib/hooks/useCredits";

export function TransactionHistory() {
  const { transactions } = useCredits({ userId: "user-123" });

  return (
    <div className="space-y-2">
      <h3>Recent Transactions</h3>
      {transactions.map((txn) => (
        <div 
          key={txn.id} 
          className="p-3 border rounded"
        >
          <div className="flex justify-between">
            <span className="font-semibold">{txn.reason}</span>
            <span className={txn.type === "credit" ? "text-green-600" : "text-red-600"}>
              {txn.type === "credit" ? "+" : "-"}{txn.amount}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(txn.timestamp).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Cost Prediction

```tsx
import { useCreditsCost } from "@/lib/hooks/useCredits";

export function CostCalculator() {
  const shortVideo = useCreditsCost("video", "short", 15);
  const mediumVideo = useCreditsCost("video", "medium", 30);
  const premiumImage = useCreditsCost("image", "premium");

  return (
    <table className="w-full">
      <tbody>
        <tr>
          <td>Short Video (15s)</td>
          <td>{shortVideo.formatted}</td>
        </tr>
        <tr>
          <td>Medium Video (30s)</td>
          <td>{mediumVideo.formatted}</td>
        </tr>
        <tr>
          <td>Premium Image</td>
          <td>{premiumImage.formatted}</td>
        </tr>
      </tbody>
    </table>
  );
}
```

## Advanced: Check Multiple Limits

```tsx
import { useCreditsCheck } from "@/lib/hooks/useCredits";

export function AdvancedGenerationButton() {
  const checks = useCreditsCheck("user-123", 20);

  return (
    <button 
      disabled={!checks.canProceed}
      title={
        !checks.canAfford ? "Insufficient credits" :
        !checks.canUseDaily ? "Daily limit exceeded" :
        !checks.canUseMonthly ? "Monthly quota exceeded" :
        ""
      }
    >
      Generate
    </button>
  );
}
```

## Integration with Prospeccion Service

```tsx
import { ProspeccionService } from "@/lib/services/prospeccion.service";
import { useCredits } from "@/lib/hooks/useCredits";

export function GeneratorWithCreditsCheck() {
  const { recordGeneration, calculateCost } = useCredits({ 
    userId: "user-123" 
  });

  const handleGenerate = async (params: VideoGenerationParams) => {
    // Calculate cost based on params
    const cost = calculateCost("video", params.quality, params.duration);

    // Record credit deduction
    const creditResult = await recordGeneration(
      cost,
      "video",
      params.quality,
      { projectId: params.projectId }
    );

    if (!creditResult.success) {
      throw new Error(creditResult.error);
    }

    // Proceed with actual generation
    const prospeccionService = new ProspeccionService();
    return await prospeccionService.generateVideo(params);
  };

  return (
    // Component code
    null
  );
}
```

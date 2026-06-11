# Credits System Testing Guide

## Unit Testing Examples

### Test CreditsService

```typescript
// __tests__/services/credits.service.test.ts

import { CreditsService } from "@/lib/services/credits.service";

describe("CreditsService", () => {
  const testUserId = "test-user-" + Date.now();

  beforeEach(() => {
    CreditsService.resetBalance(testUserId);
  });

  describe("Initialization", () => {
    it("should initialize user with free credits", () => {
      const balance = CreditsService.initializeUser(testUserId);
      expect(balance.balance).toBe(1000);
      expect(balance.totalEarned).toBe(1000);
      expect(balance.totalSpent).toBe(0);
    });

    it("should return existing balance on second init", () => {
      CreditsService.initializeUser(testUserId);
      const result = CreditsService.deductCredits(testUserId, 100);
      
      const balance = CreditsService.initializeUser(testUserId);
      expect(balance.balance).toBe(900);
    });
  });

  describe("Balance Operations", () => {
    beforeEach(() => {
      CreditsService.initializeUser(testUserId);
    });

    it("should get current balance", () => {
      const balance = CreditsService.getBalance(testUserId);
      expect(balance).toBe(1000);
    });

    it("should deduct credits successfully", () => {
      const success = CreditsService.deductCredits(testUserId, 100);
      expect(success).toBe(true);
      expect(CreditsService.getBalance(testUserId)).toBe(900);
    });

    it("should reject deduction if insufficient balance", () => {
      const success = CreditsService.deductCredits(testUserId, 1500);
      expect(success).toBe(false);
      expect(CreditsService.getBalance(testUserId)).toBe(1000);
    });

    it("should add credits", () => {
      const txn = CreditsService.addCredits(testUserId, 500, "Test bonus");
      expect(txn.amount).toBe(500);
      expect(CreditsService.getBalance(testUserId)).toBe(1500);
    });
  });

  describe("Cost Calculations", () => {
    it("should calculate image costs", () => {
      expect(CreditsService.calculateCost("image", "standard", undefined)).toBe(3);
      expect(CreditsService.calculateCost("image", "premium", undefined)).toBe(6);
    });

    it("should calculate video costs by duration", () => {
      expect(CreditsService.calculateCost("video", "short", 15)).toBe(10);
      expect(CreditsService.calculateCost("video", "medium", 30)).toBe(20);
      expect(CreditsService.calculateCost("video", "long", 60)).toBe(50);
    });
  });

  describe("Generation Recording", () => {
    beforeEach(() => {
      CreditsService.initializeUser(testUserId);
    });

    it("should record successful generation", () => {
      const result = CreditsService.recordGeneration(
        testUserId,
        20,
        "video",
        "medium",
        { assetId: "test-asset" }
      );

      expect(result.success).toBe(true);
      expect(result.transaction?.amount).toBe(20);
      expect(CreditsService.getBalance(testUserId)).toBe(980);
    });

    it("should reject generation if insufficient credits", () => {
      const result = CreditsService.recordGeneration(
        testUserId,
        1500,
        "video",
        "long"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient credits");
      expect(CreditsService.getBalance(testUserId)).toBe(1000);
    });
  });

  describe("Limit Checks", () => {
    beforeEach(() => {
      CreditsService.initializeUser(testUserId);
    });

    it("should check if user can afford cost", () => {
      expect(CreditsService.canAfford(testUserId, 500)).toBe(true);
      expect(CreditsService.canAfford(testUserId, 2000)).toBe(false);
    });

    it("should check daily limits", () => {
      const canUse = CreditsService.canUseDaily(testUserId, 200);
      expect(canUse).toBe(true);
      
      // Daily limit is 500, so 600 should fail
      const cannotUse = CreditsService.canUseDaily(testUserId, 600);
      expect(cannotUse).toBe(false);
    });

    it("should check monthly limits", () => {
      const canUse = CreditsService.canUseMonthly(testUserId, 5000);
      expect(canUse).toBe(true);
      
      // Monthly quota is 10,000, so 11,000 should fail
      const cannotUse = CreditsService.canUseMonthly(testUserId, 11000);
      expect(cannotUse).toBe(false);
    });
  });

  describe("Metrics & History", () => {
    beforeEach(() => {
      CreditsService.initializeUser(testUserId);
      CreditsService.recordGeneration(testUserId, 20, "video", "medium");
      CreditsService.recordGeneration(testUserId, 10, "image", "premium");
    });

    it("should retrieve transaction history", () => {
      const history = CreditsService.getTransactionHistory(testUserId);
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].type).toBe("debit");
    });

    it("should calculate metrics correctly", () => {
      const metrics = CreditsService.getMetrics(testUserId);
      expect(metrics.currentBalance).toBe(970);
      expect(metrics.percentageUsed).toBeCloseTo(3, 1);
      expect(metrics.dailyUsage.today).toBe(30);
    });

    it("should group usage by date and type", () => {
      const history = CreditsService.getUsageHistory(testUserId);
      expect(history.length).toBeGreaterThan(0);
      // Should have entries for video and image
      const hasVideo = history.some(h => h.type === "video");
      const hasImage = history.some(h => h.type === "image");
      expect(hasVideo || hasImage).toBe(true);
    });
  });

  describe("Admin Functions", () => {
    it("should reset user balance", () => {
      CreditsService.initializeUser(testUserId);
      CreditsService.deductCredits(testUserId, 500);
      
      const reset = CreditsService.resetBalance(testUserId, 1000);
      expect(reset.balance).toBe(1000);
      expect(reset.totalSpent).toBe(0);
    });
  });
});
```

## Component Testing

```typescript
// __tests__/components/CreditsMeter.test.tsx

import { render, screen } from "@testing-library/react";
import { CreditsMeter } from "@/components/CreditsMeter";
import { CreditsService } from "@/lib/services/credits.service";

describe("CreditsMeter Component", () => {
  const testUserId = "test-user-" + Date.now();

  beforeEach(() => {
    CreditsService.resetBalance(testUserId);
    CreditsService.initializeUser(testUserId);
  });

  it("should render balance meter", () => {
    render(<CreditsMeter userId={testUserId} />);
    
    expect(screen.getByText("Available Credits")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("should show generation cost preview", () => {
    render(
      <CreditsMeter userId={testUserId} estimatedCost={20} />
    );
    
    expect(screen.getByText("Generation Cost")).toBeInTheDocument();
    expect(screen.getByText("20 credits")).toBeInTheDocument();
  });

  it("should show insufficient credits warning", () => {
    CreditsService.deductCredits(testUserId, 990);
    
    render(
      <CreditsMeter userId={testUserId} estimatedCost={100} />
    );
    
    expect(screen.getByText("Insufficient")).toBeInTheDocument();
  });

  it("should display daily usage", () => {
    CreditsService.recordGeneration(testUserId, 50, "video", "medium");
    
    render(<CreditsMeter userId={testUserId} />);
    
    expect(screen.getByText("Daily Usage")).toBeInTheDocument();
    expect(screen.getByText(/50 \/ 500/)).toBeInTheDocument();
  });

  it("should call onInsufficientCredits callback", () => {
    const callback = jest.fn();
    CreditsService.deductCredits(testUserId, 990);
    
    render(
      <CreditsMeter 
        userId={testUserId} 
        estimatedCost={100}
        onInsufficientCredits={callback}
      />
    );
    
    expect(callback).toHaveBeenCalledWith(100, 10);
  });
});
```

## Hook Testing

```typescript
// __tests__/hooks/useCredits.test.ts

import { renderHook, act, waitFor } from "@testing-library/react";
import { useCredits } from "@/lib/hooks/useCredits";
import { CreditsService } from "@/lib/services/credits.service";

describe("useCredits Hook", () => {
  const testUserId = "test-user-" + Date.now();

  beforeEach(() => {
    CreditsService.resetBalance(testUserId);
    CreditsService.initializeUser(testUserId);
  });

  it("should initialize with user metrics", async () => {
    const { result } = renderHook(() =>
      useCredits({ userId: testUserId })
    );

    await waitFor(() => {
      expect(result.current.metrics).toBeDefined();
      expect(result.current.metrics?.currentBalance).toBe(1000);
    });
  });

  it("should check if user can afford", async () => {
    const { result } = renderHook(() =>
      useCredits({ userId: testUserId })
    );

    await waitFor(() => {
      expect(result.current.canAfford(500)).toBe(true);
      expect(result.current.canAfford(2000)).toBe(false);
    });
  });

  it("should calculate cost correctly", async () => {
    const { result } = renderHook(() =>
      useCredits({ userId: testUserId })
    );

    expect(result.current.calculateCost("video", "medium", 20)).toBe(20);
    expect(result.current.calculateCost("image", "premium")).toBe(6);
  });

  it("should record generation", async () => {
    const { result } = renderHook(() =>
      useCredits({ userId: testUserId })
    );

    await waitFor(() => {
      expect(result.current.metrics).toBeDefined();
    });

    await act(async () => {
      const response = await result.current.recordGeneration(
        20,
        "video",
        "medium",
        { assetId: "test" }
      );
      expect(response.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.currentBalance).toBe(980);
    });
  });

  it("should refresh metrics", async () => {
    const { result } = renderHook(() =>
      useCredits({ userId: testUserId, refreshInterval: 0 })
    );

    await waitFor(() => {
      expect(result.current.metrics).toBeDefined();
    });

    const initialBalance = result.current.currentBalance;

    await act(async () => {
      CreditsService.deductCredits(testUserId, 100);
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.currentBalance).toBeLessThan(initialBalance);
    });
  });
});
```

## API Testing

```typescript
// __tests__/api/credits.test.ts

import { GET, POST } from "@/app/api/credits/balance/route";
import { CreditsService } from "@/lib/services/credits.service";

describe("GET /api/credits/balance", () => {
  it("should return user balance", async () => {
    const testUserId = "test-user-" + Date.now();
    CreditsService.initializeUser(testUserId);

    const request = new Request(
      `http://localhost:3000/api/credits/balance?userId=${testUserId}`
    );

    const response = await GET(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.balance.current).toBe(1000);
    expect(data.metrics).toBeDefined();
  });

  it("should require userId", async () => {
    const request = new Request("http://localhost:3000/api/credits/balance");
    const response = await GET(request as any);

    expect(response.status).toBe(400);
  });

  it("should support X-User-Id header", async () => {
    const testUserId = "test-user-" + Date.now();
    CreditsService.initializeUser(testUserId);

    const request = new Request("http://localhost:3000/api/credits/balance", {
      headers: { "X-User-Id": testUserId }
    });

    const response = await GET(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});

describe("POST /api/credits/balance", () => {
  it("should add credits to user", async () => {
    const testUserId = "test-user-" + Date.now();
    CreditsService.initializeUser(testUserId);

    const request = new Request("http://localhost:3000/api/credits/balance", {
      method: "POST",
      body: JSON.stringify({
        userId: testUserId,
        amount: 500,
        reason: "Test bonus"
      })
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.newBalance).toBe(1500);
  });

  it("should require all fields", async () => {
    const request = new Request("http://localhost:3000/api/credits/balance", {
      method: "POST",
      body: JSON.stringify({ userId: "test" })
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
  });
});
```

## Manual Testing Checklist

```
☐ Balance Display
  ☐ Initial balance shows 1000
  ☐ Color changes from green → yellow → red as balance decreases
  ☐ Percentage shows correct calculation

☐ Cost Preview
  ☐ Shows correct cost for different media types
  ☐ Turns red when insufficient credits
  ☐ Shows "Need X more credits" message

☐ Generation Recording
  ☐ Credits deduct after recording generation
  ☐ Cannot generate if insufficient balance
  ☐ Transaction history updates immediately

☐ Limits
  ☐ Daily limit enforced (500 credits/day)
  ☐ Monthly limit enforced (10,000 credits/month)
  ☐ Warnings show when approaching limits

☐ Metrics
  ☐ Usage history groups by date and type
  ☐ Projected runout date calculates correctly
  ☐ Percentage calculations accurate

☐ API
  ☐ GET /api/credits/balance returns correct data
  ☐ POST /api/credits/balance adds credits
  ☐ Query param and header both work
```

## Performance Testing

```typescript
// Benchmark: 1000 generations recorded
const userId = "perf-test";
CreditsService.initializeUser(userId);
CreditsService.resetBalance(userId, 50000); // Large balance

console.time("1000-generations");
for (let i = 0; i < 1000; i++) {
  CreditsService.recordGeneration(userId, 10, "video", "short");
}
console.timeEnd("1000-generations");

// Expected: < 100ms
// If slower, optimize data structures or move to database

const metrics = CreditsService.getMetrics(userId);
console.log("Final balance:", metrics.currentBalance); // Should be ~40000
```

## Test Environment Setup

```bash
# Install testing dependencies
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  jest \
  @types/jest

# Create jest.config.js
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
EOF

# Create jest.setup.js
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom'
EOF

# Update package.json
npm set-script test "jest"
npm set-script test:watch "jest --watch"
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Specific test file
npm test -- services/credits.service.test.ts

# Coverage report
npm test -- --coverage
```

/**
 * Credits System Types
 * Define all types for credit management, transactions, and costs
 */

export type GenerationType = "image" | "video";
export type ImageQuality = "standard" | "premium";
export type VideoQuality = "short" | "medium" | "long";

export interface CreditCost {
  type: GenerationType;
  quality?: ImageQuality | VideoQuality;
  duration?: number;
  cost: number;
  description: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "debit" | "credit";
  reason: string;
  generationType?: GenerationType;
  quality?: string;
  duration?: number;
  timestamp: Date;
  metadata?: {
    assetId?: string;
    projectId?: string;
    batchId?: string;
    [key: string]: string | undefined;
  };
}

export interface CreditsBalance {
  userId: string;
  balance: number;
  totalSpent: number;
  totalEarned: number;
  lastUpdated: Date;
}

export interface UsageHistoryEntry {
  date: Date;
  type: GenerationType;
  quality?: string;
  count: number;
  totalCostSpent: number;
}

export interface CreditsMetrics {
  userId: string;
  currentBalance: number;
  totalAvailable: number;
  percentageUsed: number;
  monthlyUsage: {
    spent: number;
    remaining: number;
    percentageOfQuota: number;
  };
  dailyUsage: {
    today: number;
    limit: number;
    percentageOfDaily: number;
  };
  lastTransactionDate?: Date;
  projectedRunoutDate?: Date;
}

/**
 * Cost definitions for different media types and qualities
 * All costs in credits (1 credit = 1 unit of computation)
 */
export const CREDIT_COSTS: Record<string, CreditCost> = {
  "image:standard:1x1": {
    type: "image",
    quality: "standard",
    cost: 2,
    description: "Standard Image (1:1)",
  },
  "image:standard:16x9": {
    type: "image",
    quality: "standard",
    cost: 3,
    description: "Standard Image (16:9)",
  },
  "image:premium:1x1": {
    type: "image",
    quality: "premium",
    cost: 4,
    description: "Premium Image (1:1)",
  },
  "image:premium:16x9": {
    type: "image",
    quality: "premium",
    cost: 6,
    description: "Premium Image (16:9)",
  },
  "video:short:5-15s": {
    type: "video",
    quality: "short",
    duration: 15,
    cost: 10,
    description: "Video Short (5-15s)",
  },
  "video:medium:15-30s": {
    type: "video",
    quality: "medium",
    duration: 30,
    cost: 20,
    description: "Video Medium (15-30s)",
  },
  "video:long:30-60s": {
    type: "video",
    quality: "long",
    duration: 60,
    cost: 50,
    description: "Video Long (30-60s)",
  },
};

/**
 * Initial free credits every new user receives
 */
export const INITIAL_FREE_CREDITS = 1000;

/**
 * Monthly credit quota per user (optional limit)
 */
export const MONTHLY_CREDIT_QUOTA = 10000;

/**
 * Daily credit limit per user (optional limit)
 */
export const DAILY_CREDIT_LIMIT = 500;
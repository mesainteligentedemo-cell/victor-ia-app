/**
 * CreditsService - Core credit management system
 * Handles balance checks, deductions, additions, and usage tracking
 */

import type {
  CreditTransaction,
  CreditsBalance,
  CreditsMetrics,
  UsageHistoryEntry,
  GenerationType,
  CreditCost,
} from "@/lib/types/credits";
import {
  CREDIT_COSTS,
  INITIAL_FREE_CREDITS,
  MONTHLY_CREDIT_QUOTA,
  DAILY_CREDIT_LIMIT,
} from "@/lib/types/credits";

/**
 * In-memory storage for demo/development
 * In production, replace with database
 */
const userBalances = new Map<string, CreditsBalance>();
const transactions = new Map<string, CreditTransaction[]>();

export class CreditsService {
  /**
   * Initialize user with free credits (called on signup)
   */
  static initializeUser(userId: string): CreditsBalance {
    if (!userBalances.has(userId)) {
      const balance: CreditsBalance = {
        userId,
        balance: INITIAL_FREE_CREDITS,
        totalSpent: 0,
        totalEarned: INITIAL_FREE_CREDITS,
        lastUpdated: new Date(),
      };
      userBalances.set(userId, balance);
      transactions.set(userId, [
        {
          id: `txn-${Date.now()}-init`,
          userId,
          amount: INITIAL_FREE_CREDITS,
          type: "credit",
          reason: "Initial free credits",
          timestamp: new Date(),
        },
      ]);
    }
    return userBalances.get(userId)!;
  }

  /**
   * Get current balance for user
   */
  static getBalance(userId: string): number {
    const balance = userBalances.get(userId);
    if (!balance) {
      this.initializeUser(userId);
      return INITIAL_FREE_CREDITS;
    }
    return balance.balance;
  }

  /**
   * Get full balance info
   */
  static getBalanceInfo(userId: string): CreditsBalance {
    const balance = userBalances.get(userId);
    if (!balance) {
      return this.initializeUser(userId);
    }
    return balance;
  }

  /**
   * Deduct credits (returns false if insufficient balance)
   */
  static deductCredits(userId: string, amount: number): boolean {
    const balance = this.getBalanceInfo(userId);

    if (balance.balance < amount) {
      return false;
    }

    balance.balance -= amount;
    balance.totalSpent += amount;
    balance.lastUpdated = new Date();
    userBalances.set(userId, balance);

    return true;
  }

  /**
   * Add credits to user account
   */
  static addCredits(
    userId: string,
    amount: number,
    reason: string,
    metadata?: Record<string, string>
  ): CreditTransaction {
    const balance = this.getBalanceInfo(userId);
    balance.balance += amount;
    balance.totalEarned += amount;
    balance.lastUpdated = new Date();
    userBalances.set(userId, balance);

    const transaction: CreditTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId,
      amount,
      type: "credit",
      reason,
      timestamp: new Date(),
      metadata,
    };

    const userTxns = transactions.get(userId) || [];
    userTxns.push(transaction);
    transactions.set(userId, userTxns);

    return transaction;
  }

  /**
   * Record a generation deduction with full details
   */
  static recordGeneration(
    userId: string,
    cost: number,
    generationType: GenerationType,
    quality: string,
    metadata?: { assetId?: string; projectId?: string; batchId?: string }
  ): { success: boolean; transaction?: CreditTransaction; error?: string } {
    if (!this.deductCredits(userId, cost)) {
      return {
        success: false,
        error: `Insufficient credits. Need ${cost}, have ${this.getBalance(userId)}`,
      };
    }

    const transaction: CreditTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId,
      amount: cost,
      type: "debit",
      reason: `Generated ${quality} ${generationType}`,
      generationType,
      quality,
      timestamp: new Date(),
      metadata,
    };

    const userTxns = transactions.get(userId) || [];
    userTxns.push(transaction);
    transactions.set(userId, userTxns);

    return { success: true, transaction };
  }

  /**
   * Calculate cost for generation based on type and params
   */
  static calculateCost(
    type: GenerationType,
    quality: string,
    duration?: number
  ): number {
    let costKey = `${type}:${quality}`;

    if (type === "video" && duration) {
      if (duration <= 15) costKey = "video:short:5-15s";
      else if (duration <= 30) costKey = "video:medium:15-30s";
      else costKey = "video:long:30-60s";
    } else if (type === "image" && quality) {
      // For images, append aspect ratio indicator if needed
      costKey = `image:${quality}:16x9`; // default to 16:9
    }

    const costDef = CREDIT_COSTS[costKey];
    return costDef?.cost || 10; // fallback cost
  }

  /**
   * Get usage history for user
   */
  static getUsageHistory(userId: string): UsageHistoryEntry[] {
    const userTxns = transactions.get(userId) || [];

    // Group transactions by date and type
    const groupedByDate = new Map<string, Map<string, UsageHistoryEntry>>();

    userTxns
      .filter((t) => t.type === "debit" && t.generationType)
      .forEach((txn) => {
        const dateKey = txn.timestamp.toISOString().split("T")[0];
        if (!groupedByDate.has(dateKey)) {
          groupedByDate.set(dateKey, new Map());
        }

        const dayMap = groupedByDate.get(dateKey)!;
        const typeKey = `${txn.generationType}:${txn.quality || "default"}`;

        if (!dayMap.has(typeKey)) {
          dayMap.set(typeKey, {
            date: new Date(dateKey),
            type: txn.generationType!,
            quality: txn.quality,
            count: 0,
            totalCostSpent: 0,
          });
        }

        const entry = dayMap.get(typeKey)!;
        entry.count += 1;
        entry.totalCostSpent += txn.amount;
      });

    // Flatten to array
    const history: UsageHistoryEntry[] = [];
    groupedByDate.forEach((dayMap) => {
      dayMap.forEach((entry) => {
        history.push(entry);
      });
    });

    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Get full transaction history
   */
  static getTransactionHistory(userId: string, limit = 50): CreditTransaction[] {
    const userTxns = transactions.get(userId) || [];
    return userTxns.slice(-limit).reverse();
  }

  /**
   * Get detailed metrics for user
   */
  static getMetrics(userId: string): CreditsMetrics {
    const balance = this.getBalanceInfo(userId);
    const userTxns = transactions.get(userId) || [];

    // Calculate daily usage
    const today = new Date().toISOString().split("T")[0];
    const todaySpent = userTxns
      .filter(
        (t) =>
          t.type === "debit" && t.timestamp.toISOString().split("T")[0] === today
      )
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate monthly usage (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlySpent = userTxns
      .filter((t) => t.type === "debit" && t.timestamp > thirtyDaysAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    // Estimate runout date
    const avgDailySpend = monthlySpent / 30;
    const daysUntilRunout = avgDailySpend > 0 ? balance.balance / avgDailySpend : null;
    let projectedRunoutDate: Date | undefined;
    if (daysUntilRunout && daysUntilRunout > 0) {
      projectedRunoutDate = new Date(Date.now() + daysUntilRunout * 24 * 60 * 60 * 1000);
    }

    return {
      userId,
      currentBalance: balance.balance,
      totalAvailable: balance.totalEarned,
      percentageUsed: (balance.totalSpent / balance.totalEarned) * 100,
      monthlyUsage: {
        spent: monthlySpent,
        remaining: Math.max(0, MONTHLY_CREDIT_QUOTA - monthlySpent),
        percentageOfQuota: (monthlySpent / MONTHLY_CREDIT_QUOTA) * 100,
      },
      dailyUsage: {
        today: todaySpent,
        limit: DAILY_CREDIT_LIMIT,
        percentageOfDaily: (todaySpent / DAILY_CREDIT_LIMIT) * 100,
      },
      lastTransactionDate:
        userTxns.length > 0 ? userTxns[userTxns.length - 1].timestamp : undefined,
      projectedRunoutDate,
    };
  }

  /**
   * Check if user can afford generation
   */
  static canAfford(userId: string, cost: number): boolean {
    return this.getBalance(userId) >= cost;
  }

  /**
   * Check daily limit not exceeded
   */
  static canUseDaily(userId: string, cost: number): boolean {
    const metrics = this.getMetrics(userId);
    return metrics.dailyUsage.today + cost <= DAILY_CREDIT_LIMIT;
  }

  /**
   * Check monthly limit not exceeded
   */
  static canUseMonthly(userId: string, cost: number): boolean {
    const metrics = this.getMetrics(userId);
    return metrics.monthlyUsage.spent + cost <= MONTHLY_CREDIT_QUOTA;
  }

  /**
   * Get all cost definitions
   */
  static getCostDefinitions(): Record<string, CreditCost> {
    return { ...CREDIT_COSTS };
  }

  /**
   * Reset user balance (admin only - for testing)
   */
  static resetBalance(userId: string, amount = INITIAL_FREE_CREDITS): CreditsBalance {
    const balance: CreditsBalance = {
      userId,
      balance: amount,
      totalSpent: 0,
      totalEarned: amount,
      lastUpdated: new Date(),
    };
    userBalances.set(userId, balance);
    transactions.set(userId, []);
    return balance;
  }
}
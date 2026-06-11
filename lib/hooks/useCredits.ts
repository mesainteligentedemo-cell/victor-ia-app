/**
 * useCredits Hook
 * React hook for managing credits in components
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { CreditsMetrics, CreditTransaction } from "@/lib/types/credits";
import { CreditsService } from "@/lib/services/credits.service";

interface UseCreditsOptions {
  userId: string;
  refreshInterval?: number;
}

export function useCredits({ userId, refreshInterval = 5000 }: UseCreditsOptions) {
  const [metrics, setMetrics] = useState<CreditsMetrics | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load metrics
  const loadMetrics = useCallback(() => {
    try {
      const newMetrics = CreditsService.getMetrics(userId);
      setMetrics(newMetrics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metrics");
    }
  }, [userId]);

  // Load transaction history
  const loadTransactions = useCallback(() => {
    try {
      const txns = CreditsService.getTransactionHistory(userId, 50);
      setTransactions(txns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    loadMetrics();
    loadTransactions();
    setIsLoading(false);
  }, [loadMetrics, loadTransactions]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      loadMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, loadMetrics]);

  // Check if user can afford a generation
  const canAfford = useCallback(
    (cost: number): boolean => {
      return CreditsService.canAfford(userId, cost);
    },
    [userId]
  );

  // Check daily limit
  const canUseDaily = useCallback(
    (cost: number): boolean => {
      return CreditsService.canUseDaily(userId, cost);
    },
    [userId]
  );

  // Check monthly limit
  const canUseMonthly = useCallback(
    (cost: number): boolean => {
      return CreditsService.canUseMonthly(userId, cost);
    },
    [userId]
  );

  // Deduct credits and record generation
  const recordGeneration = useCallback(
    async (
      cost: number,
      type: "image" | "video",
      quality: string,
      metadata?: { assetId?: string; projectId?: string; batchId?: string }
    ) => {
      const result = CreditsService.recordGeneration(userId, cost, type, quality, metadata);

      if (result.success) {
        // Reload metrics after successful deduction
        loadMetrics();
        loadTransactions();
      }

      return result;
    },
    [userId, loadMetrics, loadTransactions]
  );

  // Calculate cost
  const calculateCost = useCallback(
    (type: "image" | "video", quality: string, duration?: number): number => {
      return CreditsService.calculateCost(type, quality, duration);
    },
    []
  );

  // Get current balance
  const getBalance = useCallback((): number => {
    return CreditsService.getBalance(userId);
  }, [userId]);

  // Refresh manually
  const refresh = useCallback((): void => {
    loadMetrics();
    loadTransactions();
  }, [loadMetrics, loadTransactions]);

  return {
    // State
    metrics,
    transactions,
    isLoading,
    error,

    // Methods
    canAfford,
    canUseDaily,
    canUseMonthly,
    recordGeneration,
    calculateCost,
    getBalance,
    refresh,

    // Computed
    currentBalance: metrics?.currentBalance ?? 0,
    totalAvailable: metrics?.totalAvailable ?? 0,
    percentageUsed: metrics?.percentageUsed ?? 0,
  };
}

/**
 * useCreditsCost Hook
 * Simpler hook just for calculating costs
 */
export function useCreditsCost(
  type: "image" | "video",
  quality: string,
  duration?: number
) {
  const cost = CreditsService.calculateCost(type, quality, duration);

  return {
    cost,
    formatted: `${cost} credits`,
    costDefinitions: CreditsService.getCostDefinitions(),
  };
}

/**
 * useCreditsCheck Hook
 * Check if operation is allowed
 */
export function useCreditsCheck(userId: string, cost: number) {
  const [checks, setChecks] = useState({
    canAfford: false,
    canUseDaily: false,
    canUseMonthly: false,
  });

  useEffect(() => {
    setChecks({
      canAfford: CreditsService.canAfford(userId, cost),
      canUseDaily: CreditsService.canUseDaily(userId, cost),
      canUseMonthly: CreditsService.canUseMonthly(userId, cost),
    });
  }, [userId, cost]);

  return {
    ...checks,
    canProceed: checks.canAfford && checks.canUseDaily && checks.canUseMonthly,
  };
}

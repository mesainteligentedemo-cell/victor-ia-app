/**
 * CreditsMeter Component
 * Visual display of user's credit balance, usage metrics, and generation cost preview
 */

"use client";

import React, { useState, useEffect } from "react";
import type { CreditsMetrics } from "@/lib/types/credits";
import {
  INITIAL_FREE_CREDITS,
  MONTHLY_CREDIT_QUOTA,
  DAILY_CREDIT_LIMIT,
} from "@/lib/types/credits";
import { CreditsService } from "@/lib/services/credits.service";

interface CreditsMeterProps {
  userId: string;
  estimatedCost?: number;
  onInsufficientCredits?: (needed: number, available: number) => void;
  className?: string;
}

export function CreditsMeter({
  userId,
  estimatedCost = 0,
  onInsufficientCredits,
  className = "",
}: CreditsMeterProps) {
  const [metrics, setMetrics] = useState<CreditsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial metrics
    const loadMetrics = async () => {
      try {
        const balance = await CreditsService.getBalance(userId);
        const totalAvailable = Math.max(balance, INITIAL_FREE_CREDITS);
        const spent = Math.max(0, totalAvailable - balance);

        const newMetrics: CreditsMetrics = {
          userId,
          currentBalance: balance,
          totalAvailable,
          percentageUsed: totalAvailable > 0 ? (spent / totalAvailable) * 100 : 0,
          monthlyUsage: {
            spent,
            remaining: Math.max(0, MONTHLY_CREDIT_QUOTA - spent),
            percentageOfQuota: MONTHLY_CREDIT_QUOTA > 0 ? (spent / MONTHLY_CREDIT_QUOTA) * 100 : 0,
          },
          dailyUsage: {
            today: 0,
            limit: DAILY_CREDIT_LIMIT,
            percentageOfDaily: 0,
          },
        };

        setMetrics(newMetrics);
        setIsLoading(false);

        // Check if user can afford the estimated cost
        if (estimatedCost > 0 && balance < estimatedCost) {
          onInsufficientCredits?.(estimatedCost, newMetrics.currentBalance);
        }
      } catch (error) {
        console.error("Failed to load credits metrics:", error);
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [userId, estimatedCost, onInsufficientCredits]);

  if (isLoading || !metrics) {
    return (
      <div
        className={`animate-pulse bg-gray-800 rounded-lg p-4 ${className}`}
      >
        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-32"></div>
      </div>
    );
  }

  const isLowBalance = metrics.currentBalance < 100;
  const isCritical = metrics.currentBalance < 50;
  const hasInsufficientCredits = estimatedCost > 0 && metrics.currentBalance < estimatedCost;
  const exceedsDaily = estimatedCost > 0 && metrics.dailyUsage.today + estimatedCost > metrics.dailyUsage.limit;
  const exceedsMonthly = estimatedCost > 0 && metrics.monthlyUsage.remaining < estimatedCost;

  // Determine color based on balance status
  const getBalanceColor = () => {
    if (hasInsufficientCredits || isCritical) return "text-gray-600";
    if (isLowBalance) return "text-yellow-400";
    return "text-gray-600";
  };

  const getProgressColor = () => {
    if (hasInsufficientCredits || isCritical) return "bg-red-600";
    if (isLowBalance) return "bg-yellow-600";
    return "bg-green-600";
  };

  const getProgressBarColor = () => {
    if (hasInsufficientCredits || isCritical) return "bg-red-500";
    if (isLowBalance) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const progressPercent = (metrics.currentBalance / metrics.totalAvailable) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Balance Overview */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400">Available Credits</p>
            <p className={`text-3xl font-bold ${getBalanceColor()}`}>
              {metrics.currentBalance.toLocaleString()}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${getProgressColor()} bg-opacity-20`}>
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.5 1.5H5.75A4.25 4.25 0 001.5 5.75v8.5A4.25 4.25 0 005.75 18.5h8.5a4.25 4.25 0 004.25-4.25V9.5M10.5 5.25v9.5M7 10h7M10.5 1.5v18" />
            </svg>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Total Available</span>
            <span className="text-xs font-semibold text-gray-400">
              {((metrics.percentageUsed) || 0).toFixed(1)}% used
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor()} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Generation Cost Preview */}
      {estimatedCost > 0 && (
        <div className={`rounded-lg p-3 border ${
          hasInsufficientCredits
            ? "bg-red-500 bg-opacity-10 border-red-500 border-opacity-50"
            : "bg-blue-500 bg-opacity-10 border-blue-500 border-opacity-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Generation Cost</p>
              <p className={`text-lg font-semibold ${
                hasInsufficientCredits
                  ? "text-gray-600"
                  : "text-gray-600"
              }`}>
                {estimatedCost} credits
              </p>
            </div>
            {hasInsufficientCredits && (
              <div className="text-right">
                <p className="text-xs text-gray-600">Insufficient</p>
                <p className="text-xs text-gray-600">
                  Need {estimatedCost - metrics.currentBalance} more
                </p>
              </div>
            )}
            {!hasInsufficientCredits && estimatedCost > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-600">Available</p>
                <p className="text-xs text-gray-400">
                  {(metrics.currentBalance - estimatedCost).toLocaleString()} left
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage Limits */}
      <div className="grid grid-cols-2 gap-3">
        {/* Daily Limit */}
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Daily Usage</p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-200">
              {metrics.dailyUsage.today} / {metrics.dailyUsage.limit}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  exceedsDaily ? "bg-red-500" : "bg-blue-500"
                } transition-all`}
                style={{
                  width: `${Math.min(100, (metrics.dailyUsage.percentageOfDaily))}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {metrics.dailyUsage.percentageOfDaily.toFixed(0)}% of daily limit
            </p>
          </div>
        </div>

        {/* Monthly Limit */}
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Monthly Quota</p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-200">
              {metrics.monthlyUsage.spent} / {metrics.monthlyUsage.spent + metrics.monthlyUsage.remaining}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  exceedsMonthly ? "bg-red-500" : "bg-purple-500"
                } transition-all`}
                style={{
                  width: `${Math.min(100, (metrics.monthlyUsage.percentageOfQuota))}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {metrics.monthlyUsage.percentageOfQuota.toFixed(0)}% of monthly quota
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {hasInsufficientCredits && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 font-semibold">âš ï¸ Insufficient Credits</p>
          <p className="text-xs text-gray-600 mt-1">
            You need {estimatedCost - metrics.currentBalance} more credits for this generation.
          </p>
        </div>
      )}

      {exceedsDaily && !hasInsufficientCredits && (
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-50 rounded-lg p-3">
          <p className="text-sm text-yellow-400 font-semibold">âš ï¸ Daily Limit Exceeded</p>
          <p className="text-xs text-yellow-300 mt-1">
            This generation would exceed your daily usage limit.
          </p>
        </div>
      )}

      {exceedsMonthly && !hasInsufficientCredits && !exceedsDaily && (
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-50 rounded-lg p-3">
          <p className="text-sm text-yellow-400 font-semibold">âš ï¸ Monthly Quota Exceeded</p>
          <p className="text-xs text-yellow-300 mt-1">
            This generation would exceed your monthly quota.
          </p>
        </div>
      )}

      {metrics.projectedRunoutDate && metrics.currentBalance > 0 && (
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Projected runout date</p>
          <p className="text-sm text-gray-600 font-semibold">
            {new Date(metrics.projectedRunoutDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default CreditsMeter;

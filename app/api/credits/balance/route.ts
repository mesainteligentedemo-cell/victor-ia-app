/**
 * GET /api/credits/balance
 * Retrieve user's current credit balance and metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { CreditsService } from "@/lib/services/credits.service";

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params or headers
    const userId =
      request.nextUrl.searchParams.get("userId") ||
      request.headers.get("X-User-Id") ||
      "default-user";

    if (!userId) {
      return NextResponse.json(
        {
          error: "Missing userId parameter",
          message: "Please provide userId as query param or X-User-Id header",
        },
        { status: 400 }
      );
    }

    // Initialize user if first time
    const balance = CreditsService.getBalanceInfo(userId);

    // Get metrics
    const metrics = CreditsService.getMetrics(userId);

    // Get recent transaction history
    const recentTransactions = CreditsService.getTransactionHistory(userId, 10);

    return NextResponse.json(
      {
        success: true,
        userId,
        balance: {
          current: balance.balance,
          total: balance.totalEarned,
          spent: balance.totalSpent,
          lastUpdated: balance.lastUpdated,
        },
        metrics,
        recentTransactions: recentTransactions.map((txn) => ({
          id: txn.id,
          amount: txn.amount,
          type: txn.type,
          reason: txn.reason,
          timestamp: txn.timestamp,
          generationType: txn.generationType,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/credits/balance] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch balance",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/credits/balance
 * Add credits to user account (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, reason } = body;

    if (!userId || !amount || !reason) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Please provide userId, amount, and reason",
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          error: "Invalid amount",
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // TODO: Add auth check for admin
    // if (!isAdmin(request)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const transaction = CreditsService.addCredits(userId, amount, reason);
    const newBalance = CreditsService.getBalance(userId);

    return NextResponse.json(
      {
        success: true,
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          reason: transaction.reason,
          timestamp: transaction.timestamp,
        },
        newBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/credits/balance] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add credits",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

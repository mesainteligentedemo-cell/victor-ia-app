/**
 * GET /api/credits/balance
 * Retrieve user's current credit balance and metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { CreditsService } from "@/lib/services/credits.service";
import { logger } from '@/lib/logger';

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

    // Get user balance
    const balance = await CreditsService.getBalance(userId);

    return NextResponse.json(
      {
        success: true,
        userId,
        balance: balance,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    logger.error('[GET /api/credits/balance] Error:', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch balance",
        message: 'An error occurred processing your request',
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

    await CreditsService.addCredits(userId, amount);
    const newBalance = await CreditsService.getBalance(userId);

    return NextResponse.json(
      {
        success: true,
        message: `Added ${amount} credits to user ${userId}`,
        newBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('[POST /api/credits/balance] Error:', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add credits",
        message: 'An error occurred processing your request',
      },
      { status: 500 }
    );
  }
}

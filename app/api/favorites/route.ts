import { NextRequest, NextResponse } from "next/server";
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    const favorites = [
      { id: 1, type: "template", name: "Sales Email", icon: "📧" },
      { id: 2, type: "agent", name: "Lead Qualifier", icon: "🤖" },
      { id: 3, type: "workflow", name: "Lead Pipeline", icon: "⚙️" },
    ];

    return NextResponse.json(favorites);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, itemId, itemType } = await request.json();

    if (action === "add") {
      return NextResponse.json({ success: true, message: "Added to favorites" });
    } else if (action === "remove") {
      return NextResponse.json({ success: true, message: "Removed from favorites" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    const notifications = [
      { id: 1, title: "Generation Complete", message: "Your image has been generated", read: false },
      { id: 2, title: "Agent Executed", message: "Lead Qualifier executed successfully", read: false },
      { id: 3, title: "Report Ready", message: "Your monthly report is ready", read: true },
    ];

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, notificationId } = await request.json();

    if (action === "mark-read") {
      return NextResponse.json({ success: true, message: "Marked as read" });
    } else if (action === "clear-all") {
      return NextResponse.json({ success: true, message: "All notifications cleared" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

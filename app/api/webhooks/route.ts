import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();

    console.log("Webhook received:", { event, data });

    if (event === "generation.complete") {
      console.log("Generation completed:", data);
    } else if (event === "agent.execution") {
      console.log("Agent execution:", data);
    } else if (event === "prospect.created") {
      console.log("Prospect created:", data);
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const webhooks = [
      { id: 1, event: "generation.complete", url: "https://example.com/webhook", active: true },
      { id: 2, event: "agent.execution", url: "https://example.com/webhook", active: true },
    ];

    return NextResponse.json(webhooks);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

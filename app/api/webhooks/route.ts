import { NextRequest, NextResponse } from "next/server";

// Webhook secret debe estar en variables de entorno
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "default-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    // CRÍTICO: Validar Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header", code: 401 },
        { status: 401 }
      );
    }

    // Extraer token (esperado formato: "Bearer <token>")
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json(
        { error: "Invalid Authorization format. Use: Bearer <token>", code: 401 },
        { status: 401 }
      );
    }

    // Validar que el token coincida con el secret
    if (token !== WEBHOOK_SECRET) {
      console.warn(`Webhook: Unauthorized attempt with token: ${token.substring(0, 10)}...`);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", code: 401 },
        { status: 401 }
      );
    }

    // Parsear y validar JSON
    let payload;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: 400 },
        { status: 400 }
      );
    }

    const { event, data } = payload;

    // Validar estructura mínima del webhook
    if (!event) {
      return NextResponse.json(
        { error: "Missing 'event' field in webhook payload", code: 400 },
        { status: 400 }
      );
    }

    const sanitizedEvent = String(event).trim().toLowerCase();
    console.log("Webhook received:", { event: sanitizedEvent, dataKeys: data ? Object.keys(data) : "no data" });

    // Procesar eventos conocidos
    if (sanitizedEvent === "generation.complete") {
      console.log("Generation completed event processed");
    } else if (sanitizedEvent === "agent.execution") {
      console.log("Agent execution event processed");
    } else if (sanitizedEvent === "prospect.created") {
      console.log("Prospect created event processed");
    } else {
      console.warn(`Unknown event type: ${sanitizedEvent}`);
    }

    return NextResponse.json({ success: true, message: "Webhook processed", eventType: sanitizedEvent });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: String(error), code: 500 },
      { status: 500 }
    );
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

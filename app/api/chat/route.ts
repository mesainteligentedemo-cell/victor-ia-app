import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { message, systemPrompt } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system:
          systemPrompt ||
          `Eres Victor IA, una agencia de inteligencia artificial con 155 especialistas.
Tienes expertise en diseño, desarrollo, video, marketing, copywriting y más.
Responde con precisión, genera ideas innovadoras y estructura tus respuestas para ser claras y accionables.
Siempre sugiere pasos concretos y próximas acciones.`,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        { error: "Failed to get response from Claude" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText =
      data.content?.[0]?.text || "Sin respuesta";

    return NextResponse.json({
      response: responseText,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
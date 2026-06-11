import { NextRequest, NextResponse } from "next/server";
import type { ImageGenerationParams } from "@/lib/prospeccion-types";

export async function POST(request: NextRequest) {
  try {
    const { params, taskId } = await request.json();

    // Validación básica
    if (!params.prompt || params.prompt.length < 20) {
      return NextResponse.json(
        { error: "Prompt must be at least 20 characters" },
        { status: 400 }
      );
    }

    // Por ahora, generar imágenes simuladas
    // En producción, llamar a Higgsfield o Flux API
    const mockImages = Array.from({ length: params.quantity || 1 }).map(
      (_, i) =>
        `https://picsum.photos/800/600?random=${taskId}-${i}-${Date.now()}`
    );

    // Simular generación con delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      taskId,
      url: mockImages[0],
      urls: mockImages,
      status: "completed",
      aspectRatio: params.aspectRatio,
      style: params.style,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
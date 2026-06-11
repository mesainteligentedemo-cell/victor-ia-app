import { NextRequest, NextResponse } from "next/server";
import type { VideoGenerationParams } from "@/lib/prospeccion-types";

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

    // Por ahora, generar video simulado
    // En producción, llamar a Kling AI o Runway API
    const mockVideoUrl = `https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4?timestamp=${Date.now()}`;

    // Simular generación con delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      taskId,
      url: mockVideoUrl,
      status: "completed",
      duration: params.duration,
      aspectRatio: params.aspectRatio,
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
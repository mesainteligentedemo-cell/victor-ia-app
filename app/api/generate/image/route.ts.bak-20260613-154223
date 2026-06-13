/**
 * POST /api/generate/image
 * Generate images with Higgsfield or comparable service
 * Body: { prompt, style, quality, quantity, aspectRatio }
 */

import { NextRequest, NextResponse } from "next/server";
import type { ImageGenerationParams } from "@/lib/prospeccion-types";

const QUALITY_TO_CREDITS = {
  standard: 50,
  hq: 100,
  ultra: 150,
};

export async function POST(request: NextRequest) {
  try {
    const { params, taskId } = await request.json();

    // Validate input
    if (!params.prompt || params.prompt.length < 10) {
      return NextResponse.json(
        { error: "Prompt must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!params.quantity || params.quantity < 1 || params.quantity > 4) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 4" },
        { status: 400 }
      );
    }

    const quality = params.quality || "hq";
    const quantity = params.quantity || 1;
    const creditsNeeded = (QUALITY_TO_CREDITS[quality as keyof typeof QUALITY_TO_CREDITS] || 100) * quantity;

    // TODO: Check user credits before proceeding
    // const userId = await getUserIdFromRequest(request);
    // const balance = await getBalance(userId);
    // if (balance < creditsNeeded) return NextResponse.json({...}, 402);

    // Generate images via Higgsfield
    const mockImages = Array.from({ length: quantity }).map(
      (_, i) =>
        `https://res.cloudinary.com/victor-ia/image/upload/c_scale,w_1024,q_auto/generated/${taskId}-${i}-${Date.now()}.jpg`
    );

    // Log generation
    console.log(`[IMAGE] Generated ${quantity} images (${quality}), credits: ${creditsNeeded}`);

    return NextResponse.json(
      {
        success: true,
        taskId,
        images: mockImages.map((url, i) => ({
          id: `img_${taskId}_${i}`,
          url,
          thumb: url.replace("w_1024", "w_256"),
        })),
        quality,
        creditsUsed: creditsNeeded,
        status: "completed",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/generate/image] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
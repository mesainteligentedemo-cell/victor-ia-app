/**
 * ProspeccionService - Main orchestrator
 */

import type {
  VideoGenerationParams,
  ImageGenerationParams,
  GeneratedAsset,
} from "@/lib/prospeccion-types";

export interface RecommendedParams {
  videoParams?: Partial<VideoGenerationParams>;
  imageParams?: Partial<ImageGenerationParams>;
  reasoning: string[];
}

export class ProspeccionService {
  async getRecommendedSettings(prompt: string): Promise<RecommendedParams> {
    const lower = prompt.toLowerCase();
    const recommendations: RecommendedParams = { reasoning: [] };

    if (lower.includes("anunci") || lower.includes("comercial")) {
      recommendations.videoParams = { duration: 20, style: "cinematic", quality: "premium" };
      recommendations.reasoning.push("Commercial → premium quality");
    } else if (lower.includes("red") || lower.includes("social")) {
      recommendations.videoParams = { duration: 15, style: "animated", quality: "standard" };
      recommendations.reasoning.push("Social media → short format optimized");
    } else {
      recommendations.videoParams = { duration: 20, quality: "standard" };
      recommendations.reasoning.push("Standard recommendations");
    }

    return recommendations;
  }

  validateParams(params: VideoGenerationParams | ImageGenerationParams) {
    const errors: string[] = [];
    if (!params.prompt || params.prompt.length < 20) {
      errors.push("Prompt must be at least 20 characters");
    }
    if (params.prompt.length > 2000) {
      errors.push("Prompt exceeds 2000 characters");
    }
    return { valid: errors.length === 0, errors };
  }

  async generateVideo(params: VideoGenerationParams): Promise<GeneratedAsset> {
    const validation = this.validateParams(params);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const jobId = `video-${Date.now()}`;
    const response = await fetch("/api/generate/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params, taskId: jobId }),
    });

    if (!response.ok) throw new Error("Generation failed");
    const data = await response.json();

    return {
      id: jobId,
      type: "video",
      url: data.url,
      params,
      status: "completed",
      createdAt: new Date(),
    };
  }

  async generateImage(params: ImageGenerationParams): Promise<GeneratedAsset> {
    const validation = this.validateParams(params);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const jobId = `image-${Date.now()}`;
    const response = await fetch("/api/generate/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params, taskId: jobId }),
    });

    if (!response.ok) throw new Error("Generation failed");
    const data = await response.json();

    return {
      id: jobId,
      type: "image",
      url: data.url,
      params,
      status: "completed",
      createdAt: new Date(),
    };
  }
}

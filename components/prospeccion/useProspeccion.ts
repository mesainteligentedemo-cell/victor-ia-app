import { useState, useCallback } from "react";
import type {
  GeneratedAsset,
  Preset,
  VideoGenerationParams,
  ImageGenerationParams,
} from "@/lib/prospeccion-types";

export function useProspeccion() {
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = useCallback(
    async (params: VideoGenerationParams) => {
      setIsGenerating(true);
      setError(null);
      const taskId = `video-${Date.now()}`;
      setCurrentTaskId(taskId);

      try {
        const response = await fetch("/api/generate/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params, taskId }),
        });

        if (!response.ok) throw new Error("Failed to generate video");

        const data = await response.json();

        const newAsset: GeneratedAsset = {
          id: taskId,
          type: "video",
          url: data.url,
          params,
          status: "completed",
          createdAt: new Date(),
        };

        setAssets((prev) => [newAsset, ...prev]);
        return newAsset;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        throw err;
      } finally {
        setIsGenerating(false);
        setCurrentTaskId(null);
      }
    },
    []
  );

  const generateImage = useCallback(
    async (params: ImageGenerationParams) => {
      setIsGenerating(true);
      setError(null);
      const taskId = `image-${Date.now()}`;
      setCurrentTaskId(taskId);

      try {
        const response = await fetch("/api/generate/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params, taskId }),
        });

        if (!response.ok) throw new Error("Failed to generate image");

        const data = await response.json();

        const newAsset: GeneratedAsset = {
          id: taskId,
          type: "image",
          url: data.url,
          params,
          status: "completed",
          createdAt: new Date(),
        };

        setAssets((prev) => [newAsset, ...prev]);
        return newAsset;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        throw err;
      } finally {
        setIsGenerating(false);
        setCurrentTaskId(null);
      }
    },
    []
  );

  const savePreset = useCallback((preset: Preset) => {
    setPresets((prev) => {
      const existing = prev.findIndex((p) => p.id === preset.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = preset;
        return updated;
      }
      return [preset, ...prev];
    });

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "prospeccion_presets",
        JSON.stringify([...presets, preset])
      );
    }
  }, [presets]);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    assets,
    presets,
    isGenerating,
    currentTaskId,
    error,
    generateVideo,
    generateImage,
    savePreset,
    deleteAsset,
    deletePreset,
  };
}
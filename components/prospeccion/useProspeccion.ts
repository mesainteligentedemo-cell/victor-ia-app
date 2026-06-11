import { useState, useCallback } from "react";
import type {
  GeneratedAsset,
  Preset,
  VideoGenerationParams,
  ImageGenerationParams,
} from "@/lib/prospeccion-types";

export interface BatchItem {
  id: string;
  prompt: string;
  params: ImageGenerationParams | VideoGenerationParams;
  status: "pending" | "generating" | "completed" | "failed";
  result?: GeneratedAsset;
  error?: string;
  progress?: number;
}

export function useProspeccion() {
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState(0);
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

  const batchGenerateImages = useCallback(
    async (items: BatchItem[], onProgress?: (item: GeneratedAsset) => void) => {
      setIsBatchGenerating(true);
      setError(null);
      setBatchProgress(0);

      try {
        const results: GeneratedAsset[] = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const taskId = item.id;

          try {
            const response = await fetch("/api/generate/image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                params: item.params as ImageGenerationParams,
                taskId
              }),
            });

            if (!response.ok) throw new Error("Failed to generate image");

            const data = await response.json();

            const newAsset: GeneratedAsset = {
              id: taskId,
              type: "image",
              url: data.url,
              params: item.params,
              status: "completed",
              createdAt: new Date(),
            };

            results.push(newAsset);
            setAssets((prev) => [newAsset, ...prev]);

            if (onProgress) {
              onProgress(newAsset);
            }

            setBatchProgress(((i + 1) / items.length) * 100);
          } catch (err) {
            console.error(`Failed to generate item ${i}:`, err);
            setBatchProgress(((i + 1) / items.length) * 100);
          }
        }

        return results;
      } finally {
        setIsBatchGenerating(false);
      }
    },
    []
  );

  const batchGenerateVideos = useCallback(
    async (items: BatchItem[], onProgress?: (item: GeneratedAsset) => void) => {
      setIsBatchGenerating(true);
      setError(null);
      setBatchProgress(0);

      try {
        const results: GeneratedAsset[] = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const taskId = item.id;

          try {
            const response = await fetch("/api/generate/video", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                params: item.params as VideoGenerationParams,
                taskId
              }),
            });

            if (!response.ok) throw new Error("Failed to generate video");

            const data = await response.json();

            const newAsset: GeneratedAsset = {
              id: taskId,
              type: "video",
              url: data.url,
              params: item.params,
              status: "completed",
              createdAt: new Date(),
            };

            results.push(newAsset);
            setAssets((prev) => [newAsset, ...prev]);

            if (onProgress) {
              onProgress(newAsset);
            }

            setBatchProgress(((i + 1) / items.length) * 100);
          } catch (err) {
            console.error(`Failed to generate item ${i}:`, err);
            setBatchProgress(((i + 1) / items.length) * 100);
          }
        }

        return results;
      } finally {
        setIsBatchGenerating(false);
      }
    },
    []
  );

  return {
    assets,
    presets,
    isGenerating,
    isBatchGenerating,
    currentTaskId,
    batchProgress,
    error,
    generateVideo,
    generateImage,
    batchGenerateImages,
    batchGenerateVideos,
    savePreset,
    deleteAsset,
    deletePreset,
  };
}
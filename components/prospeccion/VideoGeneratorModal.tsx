"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { VideoGenerationParams } from "@/lib/prospeccion-types";
import { QUICK_PRESETS_VIDEO } from "@/lib/prospeccion-types";
import { CloseIcon as X, VideoIcon as Zap, LoaderIcon as Loader2, AlertIcon as AlertCircle } from "@/components/Icons/CustomIcons";

interface VideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: VideoGenerationParams) => Promise<any>;
  isGenerating: boolean;
  error?: string | null;
}

export default function VideoGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  error,
}: VideoGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<5 | 10 | 15 | 20 | 25 | 30>(15);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("9:16");
  const [style, setStyle] = useState<string>("cinematic");
  const [quality, setQuality] = useState<"draft" | "standard" | "premium">("standard");
  const [includeAudio, setIncludeAudio] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (prompt.trim().length < 20) {
      alert("El prompt debe tener al menos 20 caracteres");
      return;
    }

    try {
      await onGenerate({
        prompt,
        duration,
        aspectRatio: aspectRatio as any,
        style: style as any,
        fps: 30,
        quality,
        includeAudio,
      });
      setPrompt("");
    } catch (err) {
      console.error("Generation error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-white dark:bg-black/95 backdrop-blur">
          <h2 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            <Zap size={18} className="text-black dark:text-white" />
            Generar Video
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-200 hover:text-black dark:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={18} className="text-gray-600 dark:text-gray-200 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-200">{error}</p>
            </div>
          )}

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              ¿Qué quieres crear?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el video en detalle..."
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:border-gray-400 dark:border-gray-700 focus:outline-none resize-none h-24"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">
              {prompt.length}/1000 caracteres · Mínimo 20
            </p>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              O usa un preset rápido:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_PRESETS_VIDEO.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    const config = preset.config as any;
                    if (config.duration) setDuration(config.duration);
                    if (config.aspectRatio) setAspectRatio(config.aspectRatio);
                    if (config.style) setStyle(config.style);
                    if (config.quality) setQuality(config.quality);
                  }}
                  disabled={isGenerating}
                  className="p-3 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:border-gray-700 hover:bg-black rounded-lg transition-colors text-center disabled:opacity-50"
                >
                  <div className="text-lg mb-1">{preset.icon}</div>
                  <p className="text-xs font-medium text-black dark:text-white">{preset.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">Duración</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) as any)}
                disabled={isGenerating}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white focus:border-gray-400 dark:border-gray-700 focus:outline-none"
              >
                {[5, 10, 15, 20, 25, 30].map((d) => (
                  <option key={d} value={d}>{d}s</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">Aspecto</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                disabled={isGenerating}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white focus:border-gray-400 dark:border-gray-700 focus:outline-none"
              >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || prompt.trim().length < 20}
            className="w-full bg-gradient-to-r from-gray-100 to-white hover:from-gray-100 disabled:from-warm-30 text-black dark:text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando... (~ 2-3 min)
              </>
            ) : (
              <>
                <Zap size={18} />
                Generar Video
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}




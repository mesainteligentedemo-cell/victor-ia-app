"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ImageGenerationParams } from "@/lib/prospeccion-types";
import { QUICK_PRESETS_IMAGE } from "@/lib/prospeccion-types";
import { X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: ImageGenerationParams) => Promise<any>;
  isGenerating: boolean;
  error?: string | null;
}

export default function ImageGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  error,
}: ImageGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [style, setStyle] = useState<string>("photorealistic");
  const [quality, setQuality] = useState<"standard" | "premium" | "ultra">("premium");
  const [quantity, setQuantity] = useState<1 | 2 | 4>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (prompt.trim().length < 20) {
      alert("El prompt debe tener al menos 20 caracteres");
      return;
    }

    try {
      await onGenerate({
        prompt,
        aspectRatio: aspectRatio as any,
        style: style as any,
        quality,
        quantity,
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
        className="bg-ink border border-warm-10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-10 sticky top-0 bg-ink/95 backdrop-blur">
          <h2 className="text-lg font-semibold text-warm flex items-center gap-2">
            <ImageIcon size={18} className="text-amber" />
            Generar Imagen
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-warm-10 rounded-lg transition-colors text-warm-45 hover:text-warm"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm mb-2">
              ¿Qué quieres diseñar?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe la imagen con detalle..."
              className="w-full bg-warm-5 border border-warm-10 rounded-lg px-3 py-2 text-warm placeholder-warm-30 focus:border-amber focus:outline-none resize-none h-24"
              disabled={isGenerating}
            />
            <p className="text-xs text-warm-30 mt-1">
              {prompt.length}/1000 caracteres · Mínimo 20
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm mb-3">
              O usa un preset rápido:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_PRESETS_IMAGE.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    const config = preset.config as any;
                    if (config.aspectRatio) setAspectRatio(config.aspectRatio);
                    if (config.style) setStyle(config.style);
                    if (config.quality) setQuality(config.quality);
                    if (config.quantity) setQuantity(config.quantity);
                  }}
                  disabled={isGenerating}
                  className="p-3 border border-warm-10 hover:border-amber hover:bg-amber/5 rounded-lg transition-colors text-center disabled:opacity-50"
                >
                  <div className="text-lg mb-1">{preset.icon}</div>
                  <p className="text-xs font-medium text-warm">{preset.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm mb-3">
              Relación de aspecto
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["1:1", "16:9", "9:16"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio as any)}
                  disabled={isGenerating}
                  className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium disabled:opacity-50 ${
                    aspectRatio === ratio
                      ? "border-amber bg-amber/10 text-amber"
                      : "border-warm-10 text-warm hover:border-warm-20"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm mb-3">
              ¿Cuántas imágenes?
            </label>
            <div className="flex gap-3">
              {[1, 2, 4].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantity(q as any)}
                  disabled={isGenerating}
                  className={`px-6 py-2 rounded-lg border transition-colors font-medium disabled:opacity-50 ${
                    quantity === q
                      ? "border-amber bg-amber/10 text-amber"
                      : "border-warm-10 text-warm hover:border-warm-20"
                  }`}
                >
                  {q} imagen{q > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || prompt.trim().length < 20}
            className="w-full bg-gradient-to-r from-amber to-amber/80 hover:from-amber/90 disabled:from-warm-30 text-black font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                Generar {quantity === 1 ? "Imagen" : `${quantity} Imágenes`}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

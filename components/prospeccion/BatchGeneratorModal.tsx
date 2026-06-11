"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import type { ImageGenerationParams, VideoGenerationParams } from "@/lib/prospeccion-types";

interface BatchGeneratorModalProps {
  isOpen: boolean;
  type: "video" | "image";
  onClose: () => void;
  onGenerate: (items: Array<{ prompt: string; params: any }>) => Promise<void>;
  isGenerating: boolean;
}

export default function BatchGeneratorModal({
  isOpen,
  type,
  onClose,
  onGenerate,
  isGenerating,
}: BatchGeneratorModalProps) {
  const [prompts, setPrompts] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleGenerate = async () => {
    const promptList = prompts
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (promptList.length === 0) return;

    const items = promptList.map((prompt) => ({
      prompt,
      params:
        type === "video"
          ? { prompt, duration: 15, aspectRatio: "9:16" }
          : { prompt, aspectRatio: "1:1", quality: "standard" },
    }));

    await onGenerate(items);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-ink border border-warm-10 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-warm">
            Generar {type === "video" ? "Videos" : "Imágenes"} en Lote
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-warm-10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm mb-2">
              Ingresa prompts (uno por línea):
            </label>
            <textarea
              value={prompts}
              onChange={(e) => setPrompts(e.target.value)}
              placeholder="Prompt 1&#10;Prompt 2&#10;Prompt 3..."
              className="w-full h-40 bg-warm-5 border border-warm-10 rounded-lg px-3 py-2 text-warm placeholder-warm-30 focus:border-amber focus:outline-none"
            />
            <p className="text-xs text-warm-30 mt-1">
              {prompts.split("\n").filter((p) => p.trim()).length} prompts
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || prompts.split("\n").filter((p) => p.trim()).length === 0}
            className="w-full bg-gradient-to-r from-amber to-amber/80 hover:from-amber/90 disabled:from-warm-30 text-black font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Upload size={18} />
                Generar Lote
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { GeneratedAsset } from "@/lib/prospeccion-types";
import { Download, Trash2, Copy, Play, Image as ImageIcon } from "lucide-react";

interface ResultsGalleryProps {
  assets: GeneratedAsset[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ResultsGallery({
  assets,
  onDelete,
  isLoading = false,
}: ResultsGalleryProps) {
  const handleDownload = async (url: string, type: "video" | "image") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const urlObj = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObj;
      link.download = `generated-${type}-${Date.now()}.${type === "video" ? "mp4" : "png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlObj);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copiada al portapapeles");
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-warm-30 text-4xl mb-3">🎬</div>
        <p className="text-warm-45 text-sm mb-2">
          {isLoading ? "Generando..." : "Sin generaciones aún"}
        </p>
        <p className="text-warm-30 text-xs text-center">
          {isLoading
            ? "Tu contenido estará listo en unos momentos"
            : "Crea tu primer video o imagen con los generadores de arriba"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-warm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber" />
        Generaciones Recientes ({assets.length})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset, idx) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group border border-warm-10 rounded-lg overflow-hidden hover:border-amber hover:shadow-lg hover:shadow-amber/20 transition-all bg-warm-5/30"
          >
            {/* Thumbnail/Preview */}
            <div className="relative aspect-video bg-black/40 flex items-center justify-center overflow-hidden">
              {asset.type === "video" ? (
                <>
                  <video
                    src={asset.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play
                      size={40}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={asset.url}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ImageIcon
                      size={40}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className="inline-block px-2 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium text-white capitalize">
                  {asset.status === "completed" ? "✓" : asset.status === "generating" ? "⏳" : "✕"}{" "}
                  {asset.type}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
              <p className="text-xs text-warm-30 line-clamp-2">{asset.params.prompt}</p>

              <div className="flex flex-wrap gap-1">
                {asset.type === "video" && (
                  <>
                    <span className="px-2 py-0.5 bg-warm-10 rounded text-xs text-warm-45">
                      {(asset.params as any).duration}s
                    </span>
                    <span className="px-2 py-0.5 bg-warm-10 rounded text-xs text-warm-45">
                      {(asset.params as any).aspectRatio}
                    </span>
                  </>
                )}
                {asset.type === "image" && (
                  <>
                    <span className="px-2 py-0.5 bg-warm-10 rounded text-xs text-warm-45">
                      {(asset.params as any).aspectRatio}
                    </span>
                    <span className="px-2 py-0.5 bg-warm-10 rounded text-xs text-warm-45">
                      {(asset.params as any).quality}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-warm-20">
                {new Date(asset.createdAt).toLocaleDateString("es-MX")}
              </p>
            </div>

            {/* Actions */}
            <div className="px-3 pb-3 flex gap-2">
              <button
                onClick={() => handleDownload(asset.url, asset.type)}
                className="flex-1 flex items-center justify-center gap-1 p-2 bg-amber/10 hover:bg-amber/20 text-amber rounded-lg transition-colors text-xs font-medium"
                title="Descargar"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Descargar</span>
              </button>

              <button
                onClick={() => handleCopyUrl(asset.url)}
                className="flex-1 flex items-center justify-center gap-1 p-2 bg-warm-10 hover:bg-warm-15 text-warm-45 rounded-lg transition-colors text-xs font-medium"
                title="Copiar URL"
              >
                <Copy size={14} />
                <span className="hidden sm:inline">Copiar URL</span>
              </button>

              <button
                onClick={() => onDelete(asset.id)}
                className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
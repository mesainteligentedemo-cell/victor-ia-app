"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import type { GeneratedAsset } from "@/lib/prospeccion-types";
import {
  Download,
  Trash2,
  Copy,
  Play,
  Image as ImageIcon,
  Filter,
  ArrowUpDown,
  Clock,
  TrendingUp,
  Share2,
  RefreshCw,
  Zap,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

interface ResultsGalleryProps {
  assets: GeneratedAsset[];
  onDelete: (id: string) => void;
  onGenerateVariation?: (assetId: string) => void;
  onCreateMerge?: (assetIds: string[]) => void;
  onSchedulePublish?: (assetId: string) => void;
  onExport?: (asset: GeneratedAsset) => void;
  isLoading?: boolean;
}

type FilterType = "all" | "video" | "image";
type SortBy = "date" | "quality" | "engagement" | "cost";
type QualityScore = "draft" | "standard" | "premium" | "ultra";

interface AssetWithMetrics extends GeneratedAsset {
  engagementScore: number;
  estimatedCost: number;
  quality: QualityScore;
}

export default function ResultsGallery({
  assets,
  onDelete,
  onGenerateVariation,
  onCreateMerge,
  onSchedulePublish,
  onExport,
  isLoading = false,
}: ResultsGalleryProps) {
  // State Management
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [showVersionTimeline, setShowVersionTimeline] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);

  // Calculate metrics for each asset
  const assetsWithMetrics = useMemo(
    () =>
      assets.map((asset) => {
        const quality: QualityScore =
          (asset.params as any).quality || "standard";
        const engagementScore = Math.random() * 100; // Simulated; replace with real data
        const estimatedCost =
          asset.type === "video"
            ? quality === "premium"
              ? 2.5
              : quality === "standard"
                ? 1.5
                : 0.5
            : quality === "ultra"
              ? 1.2
              : quality === "premium"
                ? 0.8
                : 0.3;

        return {
          ...asset,
          engagementScore,
          estimatedCost,
          quality,
        } as AssetWithMetrics;
      }),
    [assets]
  );

  // Filter and Sort Logic
  const filteredAndSortedAssets = useMemo(() => {
    let result = assetsWithMetrics;

    // Apply filter
    if (filterType !== "all") {
      result = result.filter((a) => a.type === filterType);
    }

    // Apply sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "quality":
          const qualityOrder = { draft: 0, standard: 1, premium: 2, ultra: 3 };
          return (
            qualityOrder[b.quality as QualityScore] -
            qualityOrder[a.quality as QualityScore]
          );
        case "engagement":
          return b.engagementScore - a.engagementScore;
        case "cost":
          return b.estimatedCost - a.estimatedCost;
        default:
          return 0;
      }
    });

    return result;
  }, [assetsWithMetrics, filterType, sortBy]);

  // Utility Functions
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
  };

  const toggleAssetSelection = (id: string) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAssets(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAssets.size === filteredAndSortedAssets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(filteredAndSortedAssets.map((a) => a.id)));
    }
  };

  const handleBatchExport = async () => {
    // Create a CSV or ZIP with selected assets
    const selected = filteredAndSortedAssets.filter((a) =>
      selectedAssets.has(a.id)
    );
    console.log("Exporting:", selected);
    // Implementation depends on format preference
  };

  const getStatusBadge = (asset: GeneratedAsset) => {
    switch (asset.status) {
      case "completed":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-gray-600 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            Aprobado
          </div>
        );
      case "generating":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-gray-600 rounded-full text-xs font-medium">
            <Loader size={12} className="animate-spin" />
            Generando
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-gray-600 rounded-full text-xs font-medium">
            <AlertCircle size={12} />
            Error
          </div>
        );
      default:
        return null;
    }
  };

  const renderEngagementPrediction = (score: number) => {
    const level =
      score > 75 ? "Muy Alto" : score > 50 ? "Alto" : "Moderado";
    const color =
      score > 75
        ? "text-gray-600"
        : score > 50
          ? "text-black-400"
          : "text-gray-600";

    return (
      <div className={`text-xs font-medium ${color}`}>
        PredicciÃ³n: {level} ({Math.round(score)}%)
      </div>
    );
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-gray-600 text-4xl mb-3">ðŸŽ¬</div>
        <p className="text-gray-600 text-sm mb-2">
          {isLoading ? "Generando..." : "Sin generaciones aÃºn"}
        </p>
        <p className="text-gray-600 text-xs text-center">
          {isLoading
            ? "Tu contenido estarÃ¡ listo en unos momentos"
            : "Crea tu primer video o imagen con los generadores de arriba"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Bulk Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-warm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            Generaciones Recientes ({filteredAndSortedAssets.length})
          </h3>
          {selectedAssets.size > 0 && (
            <span className="text-xs text-black font-medium">
              {selectedAssets.size} seleccionado(s)
            </span>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg bg-gray-100/40 border border-gray-300">
          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-600" />
            {["all", "video", "image"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as FilterType)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterType === type
                    ? "bg-black text-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type === "all" ? "Todo" : type === "video" ? "Videos" : "ImÃ¡genes"}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowUpDown size={14} className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
            >
              <option value="date">MÃ¡s reciente</option>
              <option value="quality">Calidad</option>
              <option value="engagement">Engagement</option>
              <option value="cost">Costo</option>
            </select>
          </div>

          {/* Compare Mode Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              compareMode
                ? "bg-black text-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Comparar
          </button>

          {/* Bulk Actions */}
          {selectedAssets.size > 0 && (
            <button
              onClick={handleBatchExport}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-gray-600 hover:bg-green-500/30 transition-colors"
            >
              Exportar ({selectedAssets.size})
            </button>
          )}
        </div>
      </div>

      {/* Compare Mode Header */}
      {compareMode && selectedAssets.size > 1 && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-gray-600 flex justify-between items-center">
          <span>Comparando {selectedAssets.size} items</span>
          <button
            onClick={() => {
              setCompareMode(false);
              setSelectedAssets(new Set());
            }}
            className="text-gray-600 hover:text-gray-600 font-medium"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAndSortedAssets.map((asset, idx) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
              className={`group border rounded-lg overflow-hidden transition-all cursor-pointer ${
                selectedAssets.has(asset.id)
                  ? "border-gray-400 shadow-lg shadow-amber/30 bg-black"
                  : "border-gray-300 hover:border-gray-400 hover:shadow-lg hover:shadow-amber/20 bg-gray-100/30"
              }`}
              onClick={() =>
                compareMode ? toggleAssetSelection(asset.id) : null
              }
            >
              {/* Selection Checkbox (Visible in Compare Mode) */}
              {compareMode && (
                <div className="absolute top-2 left-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAssetSelection(asset.id);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedAssets.has(asset.id)
                        ? "bg-black border-gray-400"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {selectedAssets.has(asset.id) && (
                      <CheckCircle size={16} className="text-gray-600" />
                    )}
                  </button>
                </div>
              )}

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
                  {getStatusBadge(asset)}
                </div>

                {/* Retry Button (Failed Status) */}
                {asset.status === "failed" && (
                  <button className="absolute bottom-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors">
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>

              {/* Info Section */}
              <div className="p-3 space-y-2 border-t border-gray-300">
                <p className="text-xs text-gray-600 line-clamp-2">
                  {asset.params.prompt}
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2">
                  {asset.type === "video" && (
                    <>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {(asset.params as any).duration}s
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {(asset.params as any).aspectRatio}
                      </span>
                    </>
                  )}
                  {asset.type === "image" && (
                    <>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {(asset.params as any).aspectRatio}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {asset.quality}
                      </span>
                    </>
                  )}
                </div>

                {/* Engagement Analytics (On Hover/Expand) */}
                {showAnalytics === asset.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 border-t border-gray-300 space-y-2"
                  >
                    {renderEngagementPrediction(asset.engagementScore)}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Est. Costo:</span>
                      <span className="text-black font-medium">
                        ${asset.estimatedCost.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    {new Date(asset.createdAt).toLocaleDateString("es-MX")}
                  </p>
                  <button
                    onClick={() =>
                      setShowAnalytics(
                        showAnalytics === asset.id ? null : asset.id
                      )
                    }
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <TrendingUp size={12} />
                  </button>
                </div>
              </div>

              {/* Actions - Row 1 (Main Actions) */}
              <div className="px-3 py-3 grid grid-cols-3 gap-2 border-t border-gray-300">
                <button
                  onClick={() => handleDownload(asset.url, asset.type)}
                  className="flex items-center justify-center gap-1 p-2 bg-black hover:bg-black text-black rounded-lg transition-colors text-xs font-medium"
                  title="Descargar"
                >
                  <Download size={14} />
                </button>

                <button
                  onClick={() => handleCopyUrl(asset.url)}
                  className="flex items-center justify-center gap-1 p-2 bg-gray-100 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors text-xs font-medium"
                  title="Copiar URL"
                >
                  <Copy size={14} />
                </button>

                <button
                  onClick={() => onDelete(asset.id)}
                  className="flex items-center justify-center gap-1 p-2 hover:bg-red-500/10 text-gray-600 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Actions - Row 2 (Quick Actions) */}
              <div className="px-3 pb-3 grid grid-cols-2 gap-2 border-t border-gray-300">
                <button
                  onClick={() => onGenerateVariation?.(asset.id)}
                  className="flex items-center justify-center gap-1 p-2 bg-blue-500/10 hover:bg-blue-500/20 text-gray-600 rounded-lg transition-colors text-xs font-medium"
                  title="Generar variaciÃ³n"
                >
                  <Zap size={12} />
                  <span className="hidden sm:inline">VariaciÃ³n</span>
                </button>

                <button
                  onClick={() => onSchedulePublish?.(asset.id)}
                  className="flex items-center justify-center gap-1 p-2 bg-green-500/10 hover:bg-green-500/20 text-gray-600 rounded-lg transition-colors text-xs font-medium"
                  title="Programar publicaciÃ³n"
                >
                  <Clock size={12} />
                  <span className="hidden sm:inline">Programar</span>
                </button>
              </div>

              {/* Actions - Row 3 (More Menu) */}
              <div className="px-3 pb-3 border-t border-gray-300">
                <details className="group/menu">
                  <summary className="flex items-center justify-center gap-1 p-2 bg-gray-100 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors text-xs font-medium cursor-pointer w-full">
                    <MoreVertical size={12} />
                    <span>MÃ¡s</span>
                  </summary>
                  <div className="absolute mt-1 w-40 bg-gray-100 border border-gray-300 rounded-lg shadow-xl z-20 overflow-hidden">
                    <button
                      onClick={() => onExport?.(asset)}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-600 text-xs transition-colors text-left"
                    >
                      <Share2 size={12} />
                      Exportar para redes
                    </button>
                    <button
                      onClick={() => onCreateMerge?.([asset.id])}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-600 text-xs transition-colors text-left"
                    >
                      <Zap size={12} />
                      Crear merge
                    </button>
                    <button
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-600 text-xs transition-colors text-left"
                      onClick={() =>
                        setShowVersionTimeline(
                          showVersionTimeline === asset.id ? null : asset.id
                        )
                      }
                    >
                      <Clock size={12} />
                      Historial de versiones
                    </button>
                    <button
                      onClick={() => navigator.share?.({ url: asset.url })}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-600 text-xs transition-colors text-left"
                    >
                      <Share2 size={12} />
                      Compartir
                    </button>
                  </div>
                </details>
              </div>

              {/* Version Timeline (Expanded) */}
              {showVersionTimeline === asset.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-3 space-y-2 border-t border-gray-300"
                >
                  <p className="text-xs font-semibold text-gray-600">
                    Versiones (1)
                  </p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    <button className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-100 text-xs text-gray-600 transition-colors">
                      v1 Â· {new Date(asset.createdAt).toLocaleTimeString()}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

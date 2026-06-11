"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoGeneratorModal from "./VideoGeneratorModal";
import ImageGeneratorModal from "./ImageGeneratorModal";
import BatchGeneratorModal from "./BatchGeneratorModal";
import ResultsGallery from "./ResultsGallery";
import TrendingPanel from "./TrendingPanel";
import { useProspeccion } from "./useProspeccion";
import type { TrendingTopic } from "@/lib/services/trending.service";
import {
  Zap,
  Image as ImageIcon,
  Settings,
  TrendingUp,
  Clock,
  BarChart3,
  Download,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Flame,
  MessageSquare,
  Upload,
} from "lucide-react";

type TrendingItem = {
  id: string;
  label: string;
  count: number;
  trend: number; // percentage change
};

export default function ProspeccionPage() {
  const {
    assets,
    isGenerating,
    error,
    generateVideo,
    generateImage,
    deleteAsset,
  } = useProspeccion();

  // Queue management
  const [queue, setQueue] = useState<string[]>([]);
  const [queueStats, setQueueStats] = useState({ pending: 0, completed: 0 });

  // Trending
  const [trending, setTrending] = useState<TrendingItem[]>([
    { id: "1", label: "Marketing Ads", count: 234, trend: 12 },
    { id: "2", label: "Product Showcases", count: 189, trend: 8 },
    { id: "3", label: "Social Content", count: 156, trend: 15 },
  ]);
  const [lastTrendingUpdate, setLastTrendingUpdate] = useState(new Date());

  // Analytics
  const [analyticsData, setAnalyticsData] = useState({
    avgTime: 45,
    successRate: 94,
    creditsUsed: 128,
    creditsRemaining: 872,
  });

  // Collaboration
  const [pendingApprovals, setPendingApprovals] = useState<
    Array<{ id: string; from: string; timestamp: Date; status: string }>
  >([
    {
      id: "1",
      from: "María García",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "Shared video for campaign",
    },
    {
      id: "2",
      from: "Carlos López",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "Waiting on image approval",
    },
  ]);

  // Modals
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchType, setBatchType] = useState<"image" | "video">("image");

  // Trending integration
  const [selectedTrendPrompt, setSelectedTrendPrompt] = useState<string | null>(null);

  // Real-time queue updates
  useEffect(() => {
    if (isGenerating) {
      const taskId = `gen-${Date.now()}`;
      setQueue((prev) => [...prev, taskId]);
      setQueueStats((prev) => ({ ...prev, pending: prev.pending + 1 }));
    } else if (queue.length > 0) {
      const completed = queue.shift();
      if (completed) {
        setQueue((prev) => prev.slice(1));
        setQueueStats((prev) => ({
          pending: Math.max(0, prev.pending - 1),
          completed: prev.completed + 1,
        }));
      }
    }
  }, [isGenerating, queue]);

  // Simulate trending updates every 30s
  const refreshTrending = useCallback(() => {
    setTrending((prev) =>
      prev.map((item) => ({
        ...item,
        count: Math.floor(item.count * (0.95 + Math.random() * 0.15)),
        trend: Math.floor((Math.random() - 0.5) * 30),
      }))
    );
    setLastTrendingUpdate(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshTrending, 30000);
    return () => clearInterval(interval);
  }, [refreshTrending]);

  // Update analytics
  useEffect(() => {
    const newStats = {
      avgTime: Math.floor(30 + Math.random() * 60),
      successRate: Math.floor(90 + Math.random() * 8),
      creditsUsed: Math.floor(analyticsData.creditsUsed + Math.random() * 20),
      creditsRemaining: Math.max(
        0,
        analyticsData.creditsRemaining - Math.floor(Math.random() * 20)
      ),
    };
    setAnalyticsData(newStats);
  }, [assets.length]);

  const videoCount = assets.filter((a) => a.type === "video").length;
  const imageCount = assets.filter((a) => a.type === "image").length;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Header with Badges */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shadow-md">
                ✨
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-black">
                Prospección Media
              </h1>
            </div>

            {/* Trending Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded-full bg-gray-200 border border-gray-400 flex items-center gap-1">
                <Flame size={14} className="text-black" />
                <span className="text-xs font-medium text-black">Trending</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-gray-200 border border-gray-400 flex items-center gap-1">
                <Clock size={14} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-500">
                  Live Queue
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm sm:text-base">
            Genera videos e imágenes con IA. Perfecto para campañas, redes y propuestas.
          </p>
        </motion.div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR — Quick Stats & Trending (25%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                <BarChart3 size={16} />
                Quick Stats
              </h3>

              <div className="p-4 bg-gray-100/30 border border-gray-300 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Credits</span>
                  <span className="text-sm font-bold text-black">
                    {analyticsData.creditsRemaining}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber to-amber/60 transition-all"
                    style={{
                      width: `${(analyticsData.creditsRemaining / 1000) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-100/30 border border-gray-300 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="text-2xl font-bold text-black">
                  {assets.filter((a) => {
                    const today = new Date();
                    const assetDate = new Date(a.createdAt);
                    return (
                      assetDate.toDateString() === today.toDateString()
                    );
                  }).length}
                </p>
              </div>
            </div>

            {/* Trending Now */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                  <TrendingUp size={16} />
                  Trending Now
                </h3>
                <button
                  onClick={refreshTrending}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Refresh trending"
                >
                  <RefreshCw size={14} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-2">
                {trending.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="p-3 bg-gray-100/30 border border-gray-300 rounded-lg"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-medium text-black line-clamp-1">
                        {item.label}
                      </span>
                      {item.trend > 0 && (
                        <span className="text-xs font-bold text-gray-600">
                          +{item.trend}%
                        </span>
                      )}
                      {item.trend < 0 && (
                        <span className="text-xs font-bold text-gray-600">
                          {item.trend}%
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {item.count}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-gray-600 text-center">
                Updated {Math.round((Date.now() - lastTrendingUpdate.getTime()) / 1000)}s ago
              </p>
            </div>

            {/* Recent Templates */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-black">
                Recent Templates
              </h3>
              <div className="space-y-2">
                {["Product Demo", "Social Reel", "Testimonial"].map((template) => (
                  <button
                    key={template}
                    className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100/50 rounded-lg border border-transparent hover:border-gray-300 transition-all"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CENTER — Generators & Gallery (50%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Generator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Video Generator */}
              <button
                onClick={() => setVideoModalOpen(true)}
                disabled={isGenerating}
                className="group relative overflow-hidden rounded-xl border border-gray-300 p-6 hover:border-black hover:shadow-lg hover:bg-gray-100/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-gray-100 to-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <Zap size={20} className="text-black" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-black mb-1">
                      Generar Video
                    </h3>
                    <p className="text-xs text-gray-500">
                      5-30 segundos con IA
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-black/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              </button>

              {/* Image Generator */}
              <button
                onClick={() => setImageModalOpen(true)}
                disabled={isGenerating}
                className="group relative overflow-hidden rounded-xl border border-gray-300 p-6 hover:border-black hover:shadow-lg hover:bg-gray-100/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-gray-100 to-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <ImageIcon size={20} className="text-black" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-black mb-1">
                      Generar Imagen
                    </h3>
                    <p className="text-xs text-gray-500">
                      Cualquier resolución en minutos
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-black/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              </button>
            </div>

            {/* Batch Generator CTA */}
            <button
              onClick={() => {
                setBatchType("image");
                setBatchModalOpen(true);
              }}
              className="w-full p-4 bg-gradient-to-r from-gray-100 to-white border border-gray-300 hover:border-black hover:bg-gray-50 rounded-lg flex items-start gap-3 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors flex-shrink-0">
                <Upload size={18} className="text-black" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-black mb-1">
                  Generación en Lote
                </p>
                <p className="text-xs text-gray-500">
                  Sube múltiples prompts y genera imágenes/videos en paralelo
                </p>
              </div>
            </button>

            {/* Queue Status */}
            <AnimatePresence>
              {queue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Clock size={16} />
                      Queue Status
                    </p>
                    <span className="text-xs font-bold text-gray-600">
                      {queueStats.pending} pending
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {queue.map((item) => (
                      <div
                        key={item}
                        className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-gray-100/30 border border-gray-300 rounded-lg text-center hover:border-amber/40 transition-colors">
                <p className="text-2xl font-bold text-black">{assets.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Assets</p>
              </div>

              <div className="p-4 bg-gray-100/30 border border-gray-300 rounded-lg text-center hover:border-amber/40 transition-colors">
                <p className="text-2xl font-bold text-black">{videoCount}</p>
                <p className="text-xs text-gray-500 mt-1">Videos</p>
              </div>

              <div className="p-4 bg-gray-100/30 border border-gray-300 rounded-lg text-center hover:border-amber/40 transition-colors">
                <p className="text-2xl font-bold text-black">{imageCount}</p>
                <p className="text-xs text-gray-500 mt-1">Imágenes</p>
              </div>
            </div>

            {/* Results Gallery */}
            <div className="border border-gray-300 rounded-xl p-6 bg-gray-100/30">
              <ResultsGallery
                assets={assets}
                onDelete={deleteAsset}
                isLoading={isGenerating}
              />
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR — Analytics & Collaboration (25%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Trending Panel — Social Media Trends & Suggestions */}
            <TrendingPanel
              intent="video"
              refreshInterval={30 * 60 * 1000}
              onTrendSelect={(trend: TrendingTopic, suggestedPrompt: string) => {
                setSelectedTrendPrompt(suggestedPrompt);
                setVideoModalOpen(true);
              }}
            />

            {/* Performance Analytics */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                <BarChart3 size={16} />
                Performance
              </h3>

              <div className="p-4 bg-gray-100/30 border border-gray-300 rounded-lg space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Avg. Time</span>
                    <span className="text-sm font-bold text-black">
                      {analyticsData.avgTime}s
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${Math.min(analyticsData.avgTime / 120 * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Success Rate</span>
                    <span className="text-sm font-bold text-gray-600">
                      {analyticsData.successRate}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${analyticsData.successRate}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-300">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Used Today</span>
                    <span className="text-black font-bold">
                      {analyticsData.creditsUsed} credits
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-black">Export</h3>

              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100/50 rounded-lg border border-gray-300 hover:border-amber/40 transition-all flex items-center gap-2 group">
                  <Download size={14} className="text-gray-600 group-hover:text-black transition-colors" />
                  Download All
                </button>
                <button className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100/50 rounded-lg border border-gray-300 hover:border-amber/40 transition-all flex items-center gap-2 group">
                  <Download size={14} className="text-gray-600 group-hover:text-black transition-colors" />
                  Export as Zip
                </button>
                <button className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100/50 rounded-lg border border-gray-300 hover:border-amber/40 transition-all flex items-center gap-2 group">
                  <Download size={14} className="text-gray-600 group-hover:text-black transition-colors" />
                  Copy Share Link
                </button>
              </div>
            </div>

            {/* Collaboration — Pending Approvals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                  <MessageSquare size={16} />
                  Approvals
                </h3>
                {pendingApprovals.length > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/20 text-black">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.map((approval) => (
                    <motion.div
                      key={approval.id}
                      layout
                      className="p-3 bg-gray-100/30 border border-gray-300 rounded-lg hover:border-amber/40 transition-colors"
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <AlertCircle
                          size={14}
                          className="text-black mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-black truncate">
                            {approval.from}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {approval.status}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 ml-5">
                        {Math.floor(
                          (Date.now() - approval.timestamp.getTime()) / 60000
                        )}m ago
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-3 text-center">
                    <CheckCircle size={16} className="text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">All approved!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <span className="animate-spin">⏳</span>
                  Generating...
                </p>
                <p className="text-xs text-blue-200/70">
                  Esto puede tomar hasta 3 minutos
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-sm font-medium text-red-300 flex items-center gap-2 mb-1">
                  <AlertCircle size={14} />
                  Error
                </p>
                <p className="text-xs text-red-200/70">{error}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <VideoGeneratorModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onGenerate={generateVideo}
        isGenerating={isGenerating}
        error={error}
      />

      <ImageGeneratorModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onGenerate={generateImage}
        isGenerating={isGenerating}
        error={error}
      />
    </div>
  );
}
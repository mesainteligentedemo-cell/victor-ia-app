"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import VideoGeneratorModal from "./VideoGeneratorModal";
import ImageGeneratorModal from "./ImageGeneratorModal";
import ResultsGallery from "./ResultsGallery";
import { useProspeccion } from "./useProspeccion";
import { Zap, Image as ImageIcon, Settings, TrendingUp } from "lucide-react";

export default function ProspeccionPage() {
  const {
    assets,
    isGenerating,
    error,
    generateVideo,
    generateImage,
    deleteAsset,
  } = useProspeccion();

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-warm flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber to-amber/60 flex items-center justify-center">
              ✨
            </span>
            Prospección Media
          </h1>
          <p className="text-warm-45 text-sm sm:text-base">
            Genera videos e imágenes con IA. Perfecto para campañas, redes y propuestas.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel — Generadores */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Video Generator Card */}
            <button
              onClick={() => setVideoModalOpen(true)}
              disabled={isGenerating}
              className="group relative overflow-hidden rounded-xl border border-warm-10 p-6 hover:border-amber hover:shadow-lg hover:shadow-amber/20 hover:bg-warm-5/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-warm-5/30 to-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber/0 to-amber/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center group-hover:bg-amber/30 transition-colors">
                  <Zap size={20} className="text-amber" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-warm mb-1">Generar Video</h3>
                  <p className="text-xs text-warm-30">
                    Crea videos de 5-30 segundos con IA
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-amber/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            </button>

            {/* Image Generator Card */}
            <button
              onClick={() => setImageModalOpen(true)}
              disabled={isGenerating}
              className="group relative overflow-hidden rounded-xl border border-warm-10 p-6 hover:border-amber hover:shadow-lg hover:shadow-amber/20 hover:bg-warm-5/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-warm-5/30 to-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber/0 to-amber/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center group-hover:bg-amber/30 transition-colors">
                  <ImageIcon size={20} className="text-amber" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-warm mb-1">Generar Imagen</h3>
                  <p className="text-xs text-warm-30">
                    Crea imágenes únicas con IA en minutos
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-amber/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            <div className="p-4 bg-warm-5/30 border border-warm-10 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber">{assets.length}</p>
              <p className="text-xs text-warm-30 mt-1">Generaciones</p>
            </div>

            <div className="p-4 bg-warm-5/30 border border-warm-10 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber">
                {assets.filter((a) => a.type === "video").length}
              </p>
              <p className="text-xs text-warm-30 mt-1">Videos</p>
            </div>

            <div className="p-4 bg-warm-5/30 border border-warm-10 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber">
                {assets.filter((a) => a.type === "image").length}
              </p>
              <p className="text-xs text-warm-30 mt-1">Imágenes</p>
            </div>
          </motion.div>

          {/* Results Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border border-warm-10 rounded-xl p-6 bg-warm-5/30"
          >
            <ResultsGallery
              assets={assets}
              onDelete={deleteAsset}
              isLoading={isGenerating}
            />
          </motion.div>
        </div>

        {/* Sidebar — Info Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Info Card */}
          <div className="p-6 bg-gradient-to-br from-amber/10 to-amber/5 border border-amber/20 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-amber" />
              <h3 className="font-semibold text-warm">Consejos</h3>
            </div>

            <div className="space-y-3 text-sm text-warm-30">
              <p>
                ✨ <strong>Prompts detallados</strong> generan mejores resultados
              </p>
              <p>
                🎬 <strong>Usa presets</strong> para resultados más rápidos
              </p>
              <p>
                ⚡ <strong>Calidad Premium</strong> toma más tiempo pero vale la pena
              </p>
              <p>
                💾 <strong>Descarga tus creaciones</strong> antes de cerrar la sesión
              </p>
            </div>
          </div>

          {/* Capability Card */}
          <div className="p-6 border border-warm-10 rounded-xl bg-warm-5/30 space-y-4">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-warm-45" />
              <h3 className="font-semibold text-warm">Capacidades</h3>
            </div>

            <div className="space-y-2 text-xs text-warm-30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Videos: 5 a 30 segundos
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Imágenes: Cualquier resolución
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Formatos: MP4, PNG, JPG
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Estilos: 10+ opciones
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Sin límite de generaciones
              </div>
            </div>
          </div>

          {/* Status */}
          {isGenerating && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm font-medium text-blue-300 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Generando tu contenido...
              </p>
              <p className="text-xs text-blue-200/70 mt-2">
                Esto puede tomar hasta 3 minutos según la complejidad
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm font-medium text-red-300">Error</p>
              <p className="text-xs text-red-200/70 mt-1">{error}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modales */}
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
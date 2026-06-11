"use client";

import { useGeneratorsStore } from "@/lib/stores";
import { GeneratorCard } from "@/components/modules";
import { useState } from "react";

const GENERATORS = [
  { type: "image", title: "Generador de Imágenes", description: "Crea imágenes con IA", icon: "🖼️" },
  { type: "video", title: "Generador de Videos", description: "Produce videos profesionales", icon: "🎬" },
  { type: "presentation", title: "Presentaciones", description: "Crea decks impactantes", icon: "📊" },
  { type: "email", title: "Emails", description: "Redacta emails personalizados", icon: "📧" },
  { type: "landing-page", title: "Landing Pages", description: "Landing pages de conversión", icon: "🌐" },
  { type: "social-post", title: "Posts Sociales", description: "Contenido para redes", icon: "📱" }
];

export default function GeneratorsPage() {
  const { generations } = useGeneratorsStore();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const recentGenerations = generations.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Generadores IA</h1>
        <p className="text-gray-600 dark:text-gray-400">Crea contenido profesional en segundos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Generados</p>
          <p className="text-3xl font-bold text-black dark:text-white">{generations.length}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Créditos Usados</p>
          <p className="text-3xl font-bold text-black dark:text-white">{generations.reduce((sum, g) => sum + (g.creditsUsed || 0), 0)}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Tipos Disponibles</p>
          <p className="text-3xl font-bold text-black dark:text-white">6</p>
        </div>
      </div>

      {/* Generators Grid */}
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Herramientas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GENERATORS.map((gen) => (
            <GeneratorCard key={gen.type} {...gen} />
          ))}
        </div>
      </div>

      {/* Recent */}
      {recentGenerations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Generaciones Recientes</h2>
          <div className="space-y-2">
            {recentGenerations.map((gen) => (
              <div key={gen.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-black dark:text-white capitalize">{gen.type}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{gen.prompt}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded">{gen.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

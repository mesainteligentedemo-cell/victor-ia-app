'use client';

import { useState } from 'react';
import { Wand2, Loader } from 'lucide-react';
import { useAnalytics, ANALYTICS_EVENTS } from '@/lib/hooks/useAnalytics';

const GENERATORS = [
  {
    id: 'websites',
    icon: '🌐',
    title: 'Sitios Web',
    description: 'Sitio web completo en 60 minutos',
    fields: [
      { name: 'nombre', label: 'Nombre/Empresa', type: 'text', placeholder: 'Ej: Costa Negra' },
      { name: 'tipo', label: 'Tipo de Sitio', type: 'select', options: ['Landing Page', 'E-commerce', 'Blog', 'Portfolio', 'SaaS'] },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Describe el proyecto...' }
    ]
  },
  {
    id: 'videos',
    icon: '🎬',
    title: 'Videos',
    description: 'Videos con VO, música y efectos',
    fields: [
      { name: 'titulo', label: 'Título', type: 'text', placeholder: 'Ej: Presentación Costa Negra' },
      { name: 'duracion', label: 'Duración (seg)', type: 'number', placeholder: '30' },
      { name: 'aspecto', label: 'Aspecto', type: 'select', options: ['16:9', '9:16', '1:1', '4:3'] },
      { name: 'script', label: 'Script', type: 'textarea', placeholder: 'Escribe el guión...' }
    ]
  },
  {
    id: 'images',
    icon: '🖼️',
    title: 'Imágenes',
    description: 'Imágenes 4K con IA',
    fields: [
      { name: 'prompt', label: 'Descripción', type: 'textarea', placeholder: 'Describe la imagen...' },
      { name: 'aspecto', label: 'Aspecto', type: 'select', options: ['1:1', '16:9', '9:16', '4:3'] },
      { name: 'resolucion', label: 'Resolución', type: 'select', options: ['1K', '2K', '4K'] }
    ]
  },
  {
    id: 'documents',
    icon: '📄',
    title: 'Documentos',
    description: 'PDFs y presentaciones',
    fields: [
      { name: 'titulo', label: 'Título', type: 'text', placeholder: 'Ej: Propuesta Comercial' },
      { name: 'tipo', label: 'Tipo', type: 'select', options: ['Presentación', 'PDF', 'Propuesta', 'Reporte'] },
      { name: 'contenido', label: 'Contenido', type: 'textarea', placeholder: 'Describe el contenido...' }
    ]
  },
  {
    id: 'emails',
    icon: '✉️',
    title: 'Emails',
    description: 'Emails HTML luxury',
    fields: [
      { name: 'asunto', label: 'Asunto', type: 'text', placeholder: 'Ej: Bienvenido' },
      { name: 'contenido', label: 'Contenido', type: 'textarea', placeholder: 'Escribe el mensaje...' }
    ]
  },
  {
    id: 'voice',
    icon: '🎤',
    title: 'Audio/VO',
    description: 'Voces con ElevenLabs',
    fields: [
      { name: 'script', label: 'Script', type: 'textarea', placeholder: 'Texto a leer...' },
      { name: 'voz', label: 'Voz', type: 'select', options: ['Rachel', 'Bella', 'Josh', 'Victor', 'Charlotte'] }
    ]
  }
];

export default function GeneratorsPage() {
  const [selectedGenerator, setSelectedGenerator] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { track } = useAnalytics();

  const currentGenerator = GENERATORS.find(g => g.id === selectedGenerator);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGenerator) return;

    setLoading(true);

    try {
      // Map generator ID to API type
      const typeMap: Record<string, string> = {
        websites: 'website',
        videos: 'video',
        images: 'image',
        documents: 'document',
        emails: 'email',
        voice: 'audio',
      };

      const generationType = typeMap[currentGenerator.id];
      const prompt = formData.contenido || formData.script || formData.prompt || formData.descripcion || '';

      // Call generation API
      const response = await fetch('/api/generate/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: generationType,
          prompt,
          options: {
            aspecto: formData.aspecto,
            resolucion: formData.resolucion,
            duracion: formData.duracion,
          },
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const result = await response.json();

      // Track analytics
      await track(ANALYTICS_EVENTS.GENERATOR_USED, {
        generatorType: currentGenerator.id,
        jobId: result.jobId,
        timestamp: new Date().toISOString(),
      });

      alert('✅ Generación iniciada!');
      setSelectedGenerator(null);
      setFormData({});
    } catch (error) {
      console.error('Generation error:', error);
      alert('❌ Error en la generación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedGenerator && currentGenerator) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedGenerator(null)}
          className="mb-6 text-sm font-medium hover:underline"
        >
          ← Volver
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentGenerator.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{currentGenerator.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{currentGenerator.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4">
            {currentGenerator.fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-2">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <option value="">Seleccionar...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800"
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSelectedGenerator(null)}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                {loading ? 'Generando...' : '✨ Generar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generadores de Contenido</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Crea contenido profesional en minutos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GENERATORS.map(gen => (
          <button
            key={gen.id}
            onClick={() => setSelectedGenerator(gen.id)}
            className="text-left p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition hover:border-black dark:hover:border-white"
          >
            <div className="text-4xl mb-4">{gen.icon}</div>
            <h3 className="font-bold text-lg mb-2">{gen.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{gen.description}</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wand2 size={16} />
              Comenzar
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <h2 className="text-xl font-bold mb-6">Generaciones Recientes</h2>
        <div className="p-8 text-center border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Sin generaciones aún. ¡Crea tu primera!</p>
        </div>
      </div>
    </div>
  );
}

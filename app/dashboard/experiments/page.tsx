'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ExperimentsPage() {
  const { user } = useUser();
  const [experiments, setExperiments] = useState([
    {
      id: 1,
      nombre: 'Test: Dark mode vs Light',
      estado: 'En progreso',
      inicio: '2024-06-01',
      fin: '2024-06-15',
      variante_a: { nombre: 'Dark', conversion: 28.5 },
      variante_b: { nombre: 'Light', conversion: 24.2 },
      estadistico: 'p=0.043 (Significativo)',
      ganador: 'Dark',
    },
    {
      id: 2,
      nombre: 'Test: CTA "Enviar" vs "Continuar"',
      estado: 'Completado',
      inicio: '2024-05-15',
      fin: '2024-05-29',
      variante_a: { nombre: 'Enviar', conversion: 31.2 },
      variante_b: { nombre: 'Continuar', conversion: 29.8 },
      estadistico: 'p=0.156 (No significativo)',
      ganador: 'Empate',
    },
  ]);

  const getEstadoColor = (estado) => {
    if (estado === 'En progreso') return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    if (estado === 'Completado') return 'bg-green-500/10 border-green-500/20 text-green-400';
    return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
  };

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">A/B Testing (Experimentos)</h1>
        <p className="text-gray-400">Ejecuta pruebas controladas para optimizar tu producto</p>
        {user && <p className="text-sm text-gray-500 mt-2">Usuario: {user.emailAddresses[0].emailAddress}</p>}
      </div>

      <button className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
        + Nuevo experimento
      </button>

      <div className="space-y-6">
        {experiments.map((exp) => (
          <div key={exp.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{exp.nombre}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {exp.inicio} → {exp.fin}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getEstadoColor(exp.estado)}`}>
                {exp.estado}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 p-4 rounded">
                <p className="text-gray-400 text-sm">Variante A</p>
                <p className="text-2xl font-bold text-white mt-1">{exp.variante_a.nombre}</p>
                <p className="text-xl text-blue-400 mt-2">{exp.variante_a.conversion}%</p>
                <p className="text-xs text-gray-500">conversión</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded">
                <p className="text-gray-400 text-sm">Variante B</p>
                <p className="text-2xl font-bold text-white mt-1">{exp.variante_b.nombre}</p>
                <p className="text-xl text-purple-400 mt-2">{exp.variante_b.conversion}%</p>
                <p className="text-xs text-gray-500">conversión</p>
              </div>
            </div>

            <div className="bg-gray-800/30 p-4 rounded border border-gray-700">
              <p className="text-sm text-gray-400">Resultado estadístico</p>
              <p className="text-lg font-semibold text-white mt-1">{exp.estadistico}</p>
              <p className="text-sm text-green-400 mt-2">
                🏆 Ganador: <span className="font-bold">{exp.ganador}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
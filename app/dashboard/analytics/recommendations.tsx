'use client';

import { useUser } from '@clerk/nextjs';

export default function RecommendationsPage() {
  const { user } = useUser();

  const recommendations = [
    {
      id: 1,
      tipo: 'Equipo',
      titulo: 'Mantener equipo de Costa Negra',
      descripcion: 'Este equipo fue 37% más rápido en el último proyecto',
      impacto: 'Ahorra 20+ horas',
      confianza: '98%',
      icon: '👥',
      color: 'from-green-500/20 to-green-500/5 border-green-500/20',
    },
    {
      id: 2,
      tipo: 'Assets',
      titulo: 'Preparar assets día anterior',
      descripcion: 'Reduce tiempo de asset management en 30%',
      impacto: 'Ahorra 5 horas/proyecto',
      confianza: '92%',
      icon: '📦',
      color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    },
    {
      id: 3,
      tipo: 'Feedback',
      titulo: 'Feedback máximo 1x por semana',
      descripcion: 'Reduce iteraciones de 3 a 1 en promedio',
      impacto: 'Ahorra 15 horas/proyecto',
      confianza: '89%',
      icon: '💬',
      color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Recomendaciones Inteligentes</h1>
        <p className="text-gray-400">Basadas en patrones detectados en tus proyectos</p>
        {user && <p className="text-sm text-gray-500 mt-2">Usuario: {user.emailAddresses[0].emailAddress}</p>}
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className={`p-6 rounded-lg border bg-gradient-to-r ${rec.color} backdrop-blur-sm hover:border-white/20 transition cursor-pointer`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-700 rounded text-gray-200 mr-2">
                      {rec.tipo}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-700 rounded text-gray-200">
                      {rec.confianza} confianza
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{rec.titulo}</h3>
                <p className="text-gray-400 mb-3">{rec.descripcion}</p>
                <p className="text-sm font-semibold text-green-400">→ {rec.impacto}</p>
              </div>
              <button className="ml-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium whitespace-nowrap">
                Aplicar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Estadísticas de Patrones</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 p-4 rounded hover:bg-gray-800 transition">
            <p className="text-gray-400 text-sm">Patrones Detectados</p>
            <p className="text-3xl font-bold text-white mt-1">12</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded hover:bg-gray-800 transition">
            <p className="text-gray-400 text-sm">Precisión Promedio</p>
            <p className="text-3xl font-bold text-white mt-1">93%</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded hover:bg-gray-800 transition">
            <p className="text-gray-400 text-sm">Ahorro Potencial</p>
            <p className="text-3xl font-bold text-white mt-1">$45k</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded hover:bg-gray-800 transition">
            <p className="text-gray-400 text-sm">Proyectos Analizados</p>
            <p className="text-3xl font-bold text-white mt-1">26</p>
          </div>
        </div>
      </div>
    </div>
  );
}
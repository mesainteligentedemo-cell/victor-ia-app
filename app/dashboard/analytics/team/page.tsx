'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/nextjs';

export default function TeamPage() {
  const { user } = useUser();

  const specialists = [
    { id: 1, nombre: 'Frontend Dev', velocidad: 1.47, proyectos: 8, calidad: 98, uptime: 100 },
    { id: 2, nombre: 'Designer (GSAP)', velocidad: 1.33, proyectos: 6, calidad: 96, uptime: 99 },
    { id: 3, nombre: 'SEO Specialist', velocidad: 1.27, proyectos: 5, calidad: 94, uptime: 100 },
    { id: 4, nombre: 'Backend Dev', velocidad: 1.12, proyectos: 7, calidad: 97, uptime: 98 },
    { id: 5, nombre: 'QA Tester', velocidad: 0.98, proyectos: 10, calidad: 99, uptime: 100 },
  ];

  const velocityData = specialists.map(s => ({ nombre: s.nombre.split(' ')[0], velocidad: s.velocidad }));

  const getVelocityColor = (vel: number) => {
    if (vel >= 1.4) return 'bg-green-500/10 border-green-500/20';
    if (vel >= 1.2) return 'bg-blue-500/10 border-blue-500/20';
    if (vel >= 1.0) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-gray-500/10 border-gray-500/20';
  };

  const getVelocityBadge = (vel: number) => {
    if (vel >= 1.4) return { color: 'text-green-400', bg: 'bg-green-500/20' };
    if (vel >= 1.2) return { color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (vel >= 1.0) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Team Performance</h1>
        <p className="text-gray-400">Leaderboard de especialistas por velocidad</p>
        {user && <p className="text-sm text-gray-500 mt-2">Usuario: {user.emailAddresses[0].emailAddress}</p>}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Velocidad por Especialista (multiplicador)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="nombre" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            <Bar dataKey="velocidad" fill="#3b82f6" name="Velocidad (1.0 = on time)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white mb-4">Ranking</h2>
        {specialists.map((spec, idx) => {
          const badge = getVelocityBadge(spec.velocidad);
          return (
            <div key={spec.id} className={`p-4 rounded-lg border ${getVelocityColor(spec.velocidad)} backdrop-blur-sm hover:border-white/20 transition`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{spec.nombre}</p>
                    <p className="text-sm text-gray-400">{spec.proyectos} proyectos completados</p>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className={`text-2xl font-bold ${badge.color}`}>{spec.velocidad.toFixed(2)}x</p>
                    <p className="text-xs text-gray-400">Velocidad</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{spec.calidad}%</p>
                    <p className="text-xs text-gray-400">Calidad</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">{spec.uptime}%</p>
                    <p className="text-xs text-gray-400">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/nextjs';

export default function ROIPage() {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roiData = [
      { mes: 'Enero', ahorrado: 2000, horas: 40 },
      { mes: 'Febrero', ahorrado: 3500, horas: 65 },
      { mes: 'Marzo', ahorrado: 5200, horas: 95 },
      { mes: 'Abril', ahorrado: 4800, horas: 88 },
      { mes: 'Mayo', ahorrado: 6500, horas: 120 },
      { mes: 'Junio', ahorrado: 8200, horas: 150 },
    ];
    setData(roiData);
    setLoading(false);
  }, []);

  const totalAhorrado = data.reduce((sum, d) => sum + d.ahorrado, 0);
  const costVictorIA = 1200;
  const roi = ((totalAhorrado - costVictorIA) / costVictorIA * 100).toFixed(0);

  if (loading) {
    return <div className="p-8 text-white">Cargando...</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">ROI Dashboard</h1>
        <p className="text-gray-400">Visualiza cuánto dinero ahorraste con Victor IA</p>
        {user && <p className="text-sm text-gray-500 mt-2">Usuario: {user.emailAddresses[0].emailAddress}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition">
          <p className="text-gray-400 text-sm font-medium">Total Ahorrado</p>
          <p className="text-4xl font-bold text-green-400 mt-2">${totalAhorrado.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-2">Últimos 6 meses</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition">
          <p className="text-gray-400 text-sm font-medium">Costo Victor IA</p>
          <p className="text-4xl font-bold text-blue-400 mt-2">${costVictorIA}</p>
          <p className="text-gray-500 text-sm mt-2">Inversión total</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition">
          <p className="text-gray-400 text-sm font-medium">ROI</p>
          <p className="text-4xl font-bold text-purple-400 mt-2">{roi}%</p>
          <p className="text-gray-500 text-sm mt-2">Retorno de inversión</p>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Ahorro Mensual ($)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="mes" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="ahorrado" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} name="Dinero Ahorrado" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Desglose por Mes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="pb-4 text-gray-400 font-medium">Mes</th>
                <th className="pb-4 text-gray-400 font-medium">Horas Ahorradas</th>
                <th className="pb-4 text-gray-400 font-medium">Dinero Ahorrado</th>
                <th className="pb-4 text-gray-400 font-medium">Valor/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800/50 transition">
                  <td className="py-4 text-white font-medium">{row.mes}</td>
                  <td className="py-4 text-gray-400">{row.horas}h</td>
                  <td className="py-4 text-green-400 font-semibold">${row.ahorrado}</td>
                  <td className="py-4 text-blue-400">${(row.ahorrado / row.horas).toFixed(0)}/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
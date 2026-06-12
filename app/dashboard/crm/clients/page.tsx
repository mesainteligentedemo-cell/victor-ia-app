'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';

const SAMPLE_CLIENTS = [
  {
    id: 1,
    name: 'Costa Negra',
    company: 'Costa Negra Inmobiliaria',
    type: 'Real Estate',
    stage: 'Autorizado',
    value: 15000,
    date: '2026-05-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'Seabird Resort',
    company: 'Hyatt California',
    type: 'Hospitality',
    stage: 'Propuesta',
    value: 25000,
    date: '2026-06-01',
    status: 'pending'
  }
];

export default function ClientsPage() {
  const [clients, setClients] = useState(SAMPLE_CLIENTS);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('Todos');

  const stages = ['Todos', 'Prospecto', 'Propuesta', 'Autorizado', 'Completado', 'Perdido'];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'Todos' || client.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{clients.length} clientes registrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:shadow-lg transition"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stages.map(stage => (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition font-medium text-sm ${
                filterStage === stage
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Etapa</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Valor</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, idx) => (
              <tr key={client.id} className={`border-b border-gray-200 dark:border-gray-800 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900/30' : 'bg-gray-50 dark:bg-gray-900/60'} hover:bg-gray-100 dark:hover:bg-gray-800 transition`}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(client.date).toLocaleDateString('es-ES')}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{client.company}</td>
                <td className="px-6 py-4 text-sm">{client.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    client.stage === 'Autorizado' ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300' :
                    client.stage === 'Propuesta' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300' :
                    client.stage === 'Prospecto' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300'
                  }`}>
                    {client.stage}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-sm">${client.value.toLocaleString('es-MX')}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm hover:underline font-medium text-black dark:text-white">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No hay clientes que coincidan con los filtros</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:shadow-lg transition"
          >
            + Crear Cliente
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Nuevo Cliente</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre *</label>
                <input type="text" placeholder="Ej: Costa Negra" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Empresa</label>
                <input type="text" placeholder="Ej: Costa Negra Inmobiliaria" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo *</label>
                <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white">
                  <option>Real Estate</option>
                  <option>Hospitality</option>
                  <option>E-commerce</option>
                  <option>SaaS</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Etapa *</label>
                <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white">
                  <option>Prospecto</option>
                  <option>Propuesta</option>
                  <option>Autorizado</option>
                  <option>Completado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Valor del Proyecto</label>
                <input type="number" placeholder="15000" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:shadow-lg transition">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
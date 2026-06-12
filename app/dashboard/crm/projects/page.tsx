'use client';

import { useState } from 'react';
import { Plus, Calendar, Users } from 'lucide-react';

const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: 'Costa Negra Website',
    client: 'Costa Negra',
    status: 'En progreso',
    progress: 75,
    startDate: '2026-05-15',
    deadline: '2026-06-15',
    team: 5,
    priority: 'Alta'
  },
  {
    id: 2,
    name: 'Seabird Hotel Redesign',
    client: 'Seabird Resort',
    status: 'Planificación',
    progress: 20,
    startDate: '2026-06-01',
    deadline: '2026-07-01',
    team: 8,
    priority: 'Media'
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');

  const statuses = ['Todos', 'Planificación', 'En progreso', 'Revisión', 'Completado'];

  const filtered = projects.filter(p => filterStatus === 'Todos' || p.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{projects.length} proyectos activos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:shadow-lg transition"
        >
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition font-medium text-sm ${
              filterStatus === status
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(project => (
          <div key={project.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.client}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                project.status === 'Completado' ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300' :
                project.status === 'En progreso' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300' :
                project.status === 'Revisión' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300' :
                'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progreso</span>
                <span className="text-gray-600 dark:text-gray-400">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-black dark:bg-white h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Meta */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>{new Date(project.deadline).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users size={16} />
                <span>{project.team} especialistas</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Ver Detalles
              </button>
              <button className="flex-1 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:shadow-lg transition">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No hay proyectos con este estado</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium"
          >
            + Crear Proyecto
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Nuevo Proyecto</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre *</label>
                <input type="text" placeholder="Ej: Costa Negra Website" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cliente *</label>
                <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800">
                  <option>Seleccionar cliente...</option>
                  <option>Costa Negra</option>
                  <option>Seabird Resort</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fecha de Inicio *</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fecha Límite *</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium">
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

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Bienvenido a tu agencia</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">155 especialistas listos para trabajar</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Plan actual', value: 'PRO', subtitle: '3 sitios activos' },
            { label: 'Especialistas', value: '15', subtitle: '24/7 disponibles' },
            { label: 'Proyectos', value: '0', subtitle: 'Crea tu primero' },
            { label: 'Assets', value: '45K+', subtitle: 'Listos para usar' }
          ].map((stat, i) => (
            <div key={i} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900/50 hover:shadow-md transition">
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium mb-2">{stat.label}</p>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-8 overflow-x-auto">
          {['overview', 'crm', 'generators', 'analytics', 'team'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 transition font-medium text-sm uppercase tracking-wider ${
                activeTab === tab
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab === 'overview' && 'Inicio'}
              {tab === 'crm' && 'CRM'}
              {tab === 'generators' && 'Generadores'}
              {tab === 'analytics' && 'Analytics'}
              {tab === 'team' && 'Equipo'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/crm" className="p-6 border-2 border-black dark:border-white rounded-lg bg-black dark:bg-white text-white dark:text-black hover:shadow-lg transition">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold mb-2">Nuevo Cliente</h3>
              <p className="text-sm opacity-80">Registra un prospecto o cliente existente</p>
            </Link>
            <Link href="/dashboard/generators" className="p-6 border-2 border-black dark:border-white rounded-lg bg-black dark:bg-white text-white dark:text-black hover:shadow-lg transition">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-bold mb-2">Generar Contenido</h3>
              <p className="text-sm opacity-80">Crea sitios, videos, imágenes y más</p>
            </Link>
            <Link href="/dashboard/analytics" className="p-6 border-2 border-black dark:border-white rounded-lg bg-black dark:bg-white text-white dark:text-black hover:shadow-lg transition">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Ver Métricas</h3>
              <p className="text-sm opacity-80">ROI, actividad y performance</p>
            </Link>
          </div>

          {/* Especialistas */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tu equipo: 155 especialistas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🎨', name: 'Diseño', count: 40 },
                { icon: '🎬', name: 'Video', count: 15 },
                { icon: '💻', name: 'Dev', count: 25 },
                { icon: '📝', name: 'Copy', count: 8 },
                { icon: '🔐', name: 'Seguridad', count: 38 },
                { icon: '⚙️', name: 'Automation', count: 15 },
                { icon: '📊', name: 'Marketing', count: 12 },
                { icon: '+', name: '20 más', count: 2 }
              ].map((cat, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{cat.count} esp.</p>
                </div>
              ))}
            </div>
          </div>

          {/* Assets */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tu librería: 45,000+ assets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '📦', title: '222 React Components', desc: 'Copy-paste ready' },
                { icon: '🖼️', title: '2,800+ Imágenes', desc: 'WebP optimizadas' },
                { icon: '🎬', title: '4,254 Videos 4K', desc: 'Listos para editar' },
                { icon: '✨', title: '133 Animaciones', desc: 'GSAP + Framer' },
                { icon: '🔤', title: 'Premium Fonts', desc: 'Garamond, Inter' },
                { icon: '🎨', title: 'Estilos', desc: 'Luxury, Minimal' }
              ].map((asset, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">{asset.icon}</div>
                  <h4 className="font-semibold text-sm">{asset.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{asset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'crm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/crm" className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold">Proyectos</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Gestiona tus proyectos activos</p>
            </Link>
            <Link href="/dashboard/crm" className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold">Clientes</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Base de datos completa</p>
            </Link>
            <Link href="/dashboard/crm" className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-bold">Tareas</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Workflow y asignaciones</p>
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'generators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '🌐', title: 'Sitios Web', desc: '60 min completo' },
              { emoji: '🎬', title: 'Videos', desc: 'Con VO y música' },
              { emoji: '🖼️', title: 'Imágenes', desc: '4K de calidad' },
              { emoji: '📄', title: 'Documentos', desc: 'PDFs y presentaciones' },
              { emoji: '✉️', title: 'Emails', desc: 'HTML premium' },
              { emoji: '🎤', title: 'Audio/VO', desc: 'ElevenLabs IA' }
            ].map((gen, i) => (
              <Link key={i} href="/dashboard/generators" className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition">
                <div className="text-3xl mb-3">{gen.emoji}</div>
                <h3 className="font-bold">{gen.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{gen.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="font-bold mb-4">Actividad Última Semana</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Proyectos creados</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Clientes registrados</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Assets generados</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="font-bold mb-4">Uso del Plan</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sitios activos</span>
                    <span>3/3</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Especialistas activos</span>
                    <span>15/15</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="font-bold mb-4">Miembros del Equipo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded">
                <div>
                  <p className="font-medium text-sm">Tú</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Admin</p>
                </div>
                <span className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded">Propietario</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
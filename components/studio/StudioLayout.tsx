'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  updatedAt: string
}

interface StudioLayoutProps {
  children: React.ReactNode
  projects?: Project[]
  onNewProject?: () => void
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'ahora'
  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export default function StudioLayout({ children, projects = [], onNewProject }: StudioLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 lg:z-auto
          w-[230px] h-full flex-shrink-0
          bg-zinc-950 border-r border-zinc-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-800">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <span className="text-black text-xs font-bold">V</span>
          </div>
          <span className="text-sm font-semibold text-white">Victor IA Studio</span>
        </div>

        {/* New Project Button */}
        <div className="px-3 pt-3">
          <button
            onClick={onNewProject}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Nuevo Proyecto
          </button>
        </div>

        {/* Recent Projects */}
        <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-zinc-800">
          {projects.length > 0 && (
            <>
              <p className="text-xs text-zinc-500 uppercase tracking-wider px-1 mb-2">Recientes</p>
              <ul className="space-y-0.5">
                {projects.map((project) => (
                  <li key={project.id}>
                    <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-800 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300 truncate flex-1 group-hover:text-white transition-colors">
                          {project.name}
                        </span>
                        <span className="text-xs text-zinc-600 ml-2 flex-shrink-0">
                          {getRelativeTime(project.updatedAt)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {projects.length === 0 && (
            <p className="text-xs text-zinc-600 px-1 mt-2">No hay proyectos aún</p>
          )}
        </div>

        {/* Nav Links */}
        <div className="border-t border-zinc-800 px-3 py-3 space-y-0.5">
          <Link
            href="/biblioteca"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-zinc-800 transition-colors text-sm text-zinc-400 hover:text-white"
          >
            <span>📚</span>
            Biblioteca
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-zinc-800 transition-colors text-sm text-zinc-400 hover:text-white"
          >
            <span>⚙️</span>
            Configuración
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-400 hover:text-white transition-colors p-1"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-zinc-300">Victor IA Studio</span>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
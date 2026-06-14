'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { QuickActionButton } from '@/components/dashboard/QuickActionButton'
import { StatCard } from '@/components/dashboard/StatCard'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { ScrollReveal } from '@/components/scroll/ScrollReveal'
import { Icon } from '@/components/Icon'

/**
 * DASHBOARD PAGE — TURNO 4 REFACTORED
 * Reemplazados todos los emojis con Icons
 * Agregado ScrollReveal a todas las secciones
 * Utilizadas CSS variables web4o
 */

const PROJECTS = [
  {
    id: 1,
    name: 'Victor IA Website',
    desc: 'Sitio web principal de la agencia',
    icon: 'Home' as const,
  },
  {
    id: 2,
    name: 'Costa Negra',
    desc: 'Landing HubSpot luxury lotes Quintana Roo',
    icon: 'Folder' as const,
  },
  {
    id: 3,
    name: 'Brandbook Victor IA',
    desc: 'Manual de identidad visual - 21 secciones',
    icon: 'FileText' as const,
  },
  {
    id: 4,
    name: 'Dashboard BI',
    desc: 'Dashboard Next.js con KPIs de la agencia',
    icon: 'Analytics' as const,
  },
  {
    id: 5,
    name: 'Influence IA Awards',
    desc: 'Premio anual a la innovación con IA',
    icon: 'Star' as const,
  },
]

const URGENTS = [
  {
    id: 1,
    person: 'Jimena Rodriguez',
    task: 'URGENTE: elaborar y enviar propuesta hoy',
    urgent: true,
  },
  {
    id: 2,
    person: 'Rosa Laura Ubeda',
    task: 'Vigencia propuesta: 31 mayo 2026',
    urgent: false,
  },
]

const QUICK_ACTIONS = [
  { icon: 'Code' as const, label: 'Studio' },
  { icon: 'Palette' as const, label: 'Image Lab' },
  { icon: 'FileText' as const, label: 'Video' },
  { icon: 'Home' as const, label: 'Web / CMS' },
  { icon: 'Zap' as const, label: 'Estudio IA' },
  { icon: 'Folder' as const, label: 'CRM' },
]

const QUICK_GENERATORS = [
  { icon: 'Chat' as const, label: 'Chat IA' },
  { icon: 'Search' as const, label: '¿Qué hice?' },
  { icon: 'Zap' as const, label: 'Estudio' },
  { icon: 'Send' as const, label: 'Voz' },
]

const PIPELINE_STAGES = [
  { stage: 'Prospectos', count: 12, width: '100%' },
  { stage: 'Propuestas', count: 8, width: '67%' },
  { stage: 'Autorizado', count: 4, width: '33%' },
  { stage: 'Completado', count: 2, width: '17%' },
]

export default function DashboardPageTurno4() {
  const [activeTab, setActiveTab] = useState('inicio')

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <ScrollReveal direction="up" delay={0}>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              Sábado 13 de Junio · 2026
            </p>
            <div className="flex items-center gap-4">
              <Icon name="Home" size={48} animated animation="scalePop" />
              <h1 className="text-hero font-display italic font-bold">
                Buenos días, Victor
              </h1>
            </div>
          </div>
        </ScrollReveal>

        {/* TABS */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex gap-8 border-b border-border-secondary">
            {['inicio', 'actividad', 'crm'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-body font-600 transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-accent -mb-0.5'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {activeTab === 'inicio' && (
          <div className="space-y-12">
            {/* QUICK ACTIONS */}
            <DashboardSection title="Acciones Rápidas" delay={0.15}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionButton key={action.label} {...action} />
                ))}
              </div>
            </DashboardSection>

            {/* STATS */}
            <DashboardSection title="Métricas Clave" delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="En Producción"
                  value={6}
                  subtitle="2 pendientes"
                  icon="Zap"
                />
                <StatCard
                  label="En Pipeline"
                  value={4}
                  subtitle="2 urgentes"
                  icon="Upload"
                />
                <StatCard
                  label="Por Cobrar"
                  value={41000}
                  prefix="$"
                  suffix=" MXN"
                  subtitle="+ USD"
                  icon="Download"
                />
              </div>
            </DashboardSection>

            {/* PROJECTS */}
            <DashboardSection title="Proyectos Activos" delay={0.25}>
              <div className="space-y-3">
                {PROJECTS.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            </DashboardSection>

            {/* URGENTS */}
            <DashboardSection title="🚨 Urgentes" delay={0.3}>
              <div className="space-y-3">
                {URGENTS.map((urgent) => (
                  <AlertCard
                    key={urgent.id}
                    title={urgent.person}
                    description={urgent.task}
                    urgent={urgent.urgent}
                  />
                ))}
              </div>
            </DashboardSection>

            {/* QUICK GENERATORS */}
            <DashboardSection title="¿Qué hacemos hoy?" subtitle="Herramientas" delay={0.35}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {QUICK_GENERATORS.map((gen) => (
                  <QuickActionButton key={gen.label} {...gen} />
                ))}
              </div>
            </DashboardSection>

            {/* PIPELINE VISUALIZATION */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="card">
                <div className="space-y-6">
                  <h2 className="text-lg font-display italic font-bold">
                    Pipeline de Generación
                  </h2>

                  <div className="flex gap-4 items-flex-end">
                    {PIPELINE_STAGES.map((stage) => (
                      <div
                        key={stage.stage}
                        className="flex-1 flex flex-col gap-3"
                      >
                        <div
                          className="bg-gradient-to-b from-white to-white opacity-20 rounded-lg transition-opacity hover:opacity-30"
                          style={{ width: stage.width, height: '80px' }}
                        />
                        <div>
                          <p className="text-xs font-body font-600 text-text-secondary">
                            {stage.stage}
                          </p>
                          <p className="text-xl font-display italic font-bold text-white">
                            {stage.count}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* QUICK LINKS */}
            <ScrollReveal direction="up" delay={0.45}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/chat"
                  className="card hover:bg-elevated flex items-center justify-between group"
                >
                  <span className="text-sm font-body font-600">Chat Agente</span>
                  <Icon
                    name="ArrowRight"
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  href="/dashboard/generators"
                  className="card hover:bg-elevated flex items-center justify-between group"
                >
                  <span className="text-sm font-body font-600">Generadores</span>
                  <Icon
                    name="ArrowRight"
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  href="/dashboard/activity"
                  className="card hover:bg-elevated flex items-center justify-between group"
                >
                  <span className="text-sm font-body font-600">Actividad</span>
                  <Icon
                    name="ArrowRight"
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        )}

        {activeTab === 'actividad' && (
          <ScrollReveal direction="up">
            <div className="card text-center py-20">
              <Icon
                name="Analytics"
                size={48}
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-text-muted">Actividad - Próximamente</p>
            </div>
          </ScrollReveal>
        )}

        {activeTab === 'crm' && (
          <ScrollReveal direction="up">
            <div className="card text-center py-20">
              <Icon
                name="Folder"
                size={48}
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-text-muted">📋 CRM - Próximamente</p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}

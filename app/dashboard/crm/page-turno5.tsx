'use client'

import { useState } from 'react'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { ScrollReveal } from '@/components/scroll/ScrollReveal'
import { Icon } from '@/components/Icon'

/**
 * CRM PAGE — TURNO 5 REFACTORED
 * Pipeline de ventas en Kanban
 */

const INITIAL_DEALS = {
  prospecto: [
    { id: 1, name: 'Empresa ABC', value: 15000, contact: 'Juan García', icon: 'Home' as const },
    { id: 2, name: 'Startup XYZ', value: 8500, contact: 'María López', icon: 'Code' as const },
  ],
  propuesta: [
    { id: 3, name: 'Agencia Digital', value: 35000, contact: 'Carlos Ruiz', icon: 'Palette' as const },
    { id: 4, name: 'E-commerce Pro', value: 22000, contact: 'Ana Martínez', icon: 'Upload' as const },
  ],
  autorizado: [
    { id: 5, name: 'Costa Negra', value: 68000, contact: 'Pablo Mendez', icon: 'Folder' as const },
  ],
  completado: [
    { id: 6, name: 'Victor IA Website', value: 45000, contact: 'Remi Creative', icon: 'Star' as const },
    { id: 7, name: 'Brandbook', value: 12000, contact: 'Team Victor', icon: 'FileText' as const },
  ],
}

const COLUMNS = [
  { id: 'prospecto', title: 'Prospectos', color: 'bg-blue-500 bg-opacity-10' },
  { id: 'propuesta', title: 'Propuestas', color: 'bg-yellow-500 bg-opacity-10' },
  { id: 'autorizado', title: 'Autorizado', color: 'bg-purple-500 bg-opacity-10' },
  { id: 'completado', title: 'Completado', color: 'bg-green-500 bg-opacity-10' },
]

export default function CRMPageTurno5() {
  const [deals, setDeals] = useState(INITIAL_DEALS)

  const handleDragStart = (e: React.DragEvent, dealId: number, fromColumn: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('dealId', dealId.toString())
    e.dataTransfer.setData('fromColumn', fromColumn)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault()
    const dealId = parseInt(e.dataTransfer.getData('dealId'))
    const fromColumn = e.dataTransfer.getData('fromColumn') as keyof typeof deals

    if (fromColumn === toColumn) return

    const deal = deals[fromColumn].find((d) => d.id === dealId)
    if (!deal) return

    setDeals({
      ...deals,
      [fromColumn]: deals[fromColumn].filter((d) => d.id !== dealId),
      [toColumn as keyof typeof deals]: [...deals[toColumn as keyof typeof deals], deal],
    })
  }

  const totalValue = Object.values(deals)
    .flat()
    .reduce((sum, deal) => sum + deal.value, 0)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <ScrollReveal direction="up" delay={0}>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              Ventas
            </p>
            <div className="flex items-center gap-4">
              <Icon name="Folder" size={48} animated animation="scalePop" />
              <h1 className="text-hero font-display italic font-bold">
                CRM Pipeline
              </h1>
            </div>
            <p className="text-text-secondary mt-4">
              Arrastra deals entre columnas para actualizar su estado
            </p>
          </div>
        </ScrollReveal>

        {/* STATS */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-text-dim mb-2">
                Total Pipeline
              </p>
              <p className="text-3xl font-display italic font-bold">
                ${(totalValue / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-text-dim mb-2">
                Total Deals
              </p>
              <p className="text-3xl font-display italic font-bold">
                {Object.values(deals).flat().length}
              </p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-text-dim mb-2">
                Tasa Cierre
              </p>
              <p className="text-3xl font-display italic font-bold">
                28%
              </p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-text-dim mb-2">
                Avg Deal Size
              </p>
              <p className="text-3xl font-display italic font-bold">
                ${(totalValue / Object.values(deals).flat().length / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* KANBAN BOARD */}
        <ScrollReveal direction="up" delay={0.15}>
          <DashboardSection title="Pipeline" subtitle="Arrastra para mover" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {COLUMNS.map((column) => (
                <div
                  key={column.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`${column.color} rounded-lg p-4 min-h-96 border border-white border-opacity-10`}
                >
                  <h3 className="font-body font-600 text-sm mb-4 text-text-primary">
                    {column.title}
                  </h3>

                  <div className="space-y-3">
                    {deals[column.id as keyof typeof deals].map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, deal.id, column.id)
                        }
                        className="card cursor-move hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <Icon
                            name={deal.icon}
                            size={24}
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-body font-600 text-white">
                              {deal.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {deal.contact}
                            </p>
                            <p className="text-sm font-display italic font-bold text-white mt-2">
                              ${deal.value.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </ScrollReveal>

        {/* ADD DEAL CTA */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="card text-center py-12">
            <Icon name="Plus" size={48} className="mx-auto mb-4" />
            <h3 className="text-2xl font-display italic font-bold mb-2">
              Agregar Nuevo Deal
            </h3>
            <p className="text-text-secondary mb-6">
              Crea un nuevo prospecto o propuesta
            </p>
            <button className="btn btn-primary">
              + Nuevo Deal
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

'use client';

/**
 * Dashboard de Agentes — 155 Skills como Agentes Interactivos
 *
 * Muestra todos los 155 agentes de Victor IA organizados en 21 categorías.
 * Cada agente es una tarjeta con botón "Ver más" que abre un modal con detalles:
 * - Qué hace
 * - Cómo lo hace
 * - Para qué lo hace
 *
 * Data: lib/agents-manifest.json (155 agentes, importado estáticamente)
 * Componentes: AgentsGrid (search + filter + modal) + DashboardLayout
 */

import { useMemo } from 'react';
import { Bot } from 'lucide-react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AgentsGrid from '@/components/dashboard/AgentsGrid';
import manifestRaw from '@/lib/agents-manifest.json';
import type { AgentsManifest } from '@/components/dashboard/agents-types';

const manifest = manifestRaw as AgentsManifest;

export default function AgentsPage() {
  const today = useMemo(
    () =>
      new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  return (
    <DashboardLayout
      header={
        <header className="vi-agents-header">
          <div className="vi-agents-header__id">
            <span className="vi-agents-header__icon" aria-hidden>
              <Bot size={20} />
            </span>
            <div>
              <h1 className="vi-agents-header__title">Dashboard de Agentes</h1>
              <p className="vi-agents-header__sub">
                {manifest.total} agentes especializados · {manifest.categories.length} categorías
              </p>
            </div>
          </div>
          <span className="vi-agents-header__date">{today}</span>

          <style jsx>{`
            .vi-agents-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              flex-wrap: wrap;
            }
            .vi-agents-header__id {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .vi-agents-header__icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 44px;
              height: 44px;
              border-radius: 13px;
              color: var(--blue);
              background: rgba(59, 130, 246, 0.1);
              border: 1px solid rgba(59, 130, 246, 0.26);
            }
            .vi-agents-header__title {
              margin: 0;
              font-family: var(--font-display);
              font-size: 26px;
              font-weight: 700;
              letter-spacing: -0.02em;
              color: var(--p);
              line-height: 1.15;
            }
            .vi-agents-header__sub {
              margin: 2px 0 0;
              font-size: 13px;
              color: var(--t3);
            }
            .vi-agents-header__date {
              font-size: 13px;
              color: var(--t3);
              text-transform: capitalize;
            }
            @media (max-width: 768px) {
              .vi-agents-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
              }
              .vi-agents-header__date {
                align-self: flex-start;
              }
            }
          `}</style>
        </header>
      }
    >
      <AgentsGrid />
    </DashboardLayout>
  );
}

'use client';

/**
 * AgentCategorySection — one category header + a responsive grid of AgentCards.
 *
 * The header shows the category emoji/label and the count of (filtered) agents.
 * Cards animate in with a staggered fade/rise; the stagger index is capped so a
 * large category (e.g. 38 Seguridad) doesn't accumulate a long delay tail.
 */

import { memo } from 'react';
import AgentCard from './AgentCard';
import type { Agent } from './agents-types';

export interface AgentCategorySectionProps {
  label: string;
  agents: Agent[];
  onOpen: (agent: Agent) => void;
}

function AgentCategorySectionBase({ label, agents, onOpen }: AgentCategorySectionProps) {
  if (agents.length === 0) return null;

  return (
    <section className="vi-cat">
      <div className="vi-cat__head">
        <h2 className="vi-cat__title">{label}</h2>
        <span className="vi-cat__count">
          {agents.length} {agents.length === 1 ? 'agente' : 'agentes'}
        </span>
      </div>

      <div className="vi-cat__grid">
        {agents.map((agent, i) => (
          <div
            key={agent.id}
            className="vi-cat__item"
            style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
          >
            <AgentCard agent={agent} onOpen={onOpen} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .vi-cat {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .vi-cat__head {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .vi-cat__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--p);
        }
        .vi-cat__count {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--t3);
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--bg2);
          border: 1px solid var(--b);
        }
        .vi-cat__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          align-items: stretch;
        }
        .vi-cat__item {
          display: flex;
          opacity: 0;
          animation: vi-card-in 0.4s ease forwards;
        }
        .vi-cat__item > :global(*) {
          width: 100%;
        }

        @keyframes vi-card-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1100px) {
          .vi-cat__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 820px) {
          .vi-cat__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 520px) {
          .vi-cat__grid {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vi-cat__item {
            opacity: 1;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

const AgentCategorySection = memo(AgentCategorySectionBase);
export default AgentCategorySection;
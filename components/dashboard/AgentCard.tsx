'use client';

/**
 * AgentCard — a single agent (skill) tile.
 *
 * Compact card: emoji badge, name, short description, model pill + a couple of
 * tags, and a "Ver más" affordance that opens the detail modal. The whole card
 * is a button so it is keyboard-accessible; the visible "Ver más" row is a
 * visual hint, not a separate focus target, to avoid nested interactives.
 */

import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Agent } from './agents-types';

export interface AgentCardProps {
  agent: Agent;
  onOpen: (agent: Agent) => void;
}

function AgentCardBase({ agent, onOpen }: AgentCardProps) {
  return (
    <button
      type="button"
      className="vi-agent-card"
      onClick={() => onOpen(agent)}
      aria-label={`Ver detalles de ${agent.name}`}
    >
      <div className="vi-agent-card__top">
        <span className="vi-agent-card__emoji" aria-hidden>
          {agent.emoji}
        </span>
        <span
          className={`vi-agent-card__model${
            agent.model.includes('opus') ? ' is-opus' : ' is-sonnet'
          }`}
        >
          {agent.model.includes('opus') ? 'Opus' : 'Sonnet'}
        </span>
      </div>

      <h3 className="vi-agent-card__name">{agent.name}</h3>
      <p className="vi-agent-card__desc">{agent.shortDesc}</p>

      <div className="vi-agent-card__tags" aria-hidden>
        {agent.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="vi-agent-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <span className="vi-agent-card__more">
        Ver más
        <ArrowUpRight size={14} aria-hidden />
      </span>

      <style jsx>{`
        .vi-agent-card {
          appearance: none;
          text-align: left;
          cursor: pointer;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 18px 18px 16px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: var(--r);
          color: var(--p);
          transition: border-color 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease, background 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .vi-agent-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            140% 120% at 0% 0%,
            rgba(59, 130, 246, 0.08),
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .vi-agent-card:hover {
          border-color: var(--blue);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }
        .vi-agent-card:hover::before {
          opacity: 1;
        }
        .vi-agent-card:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 2px;
        }
        .vi-agent-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vi-agent-card__emoji {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 22px;
          line-height: 1;
          border-radius: 12px;
          background: var(--bg3);
          border: 1px solid var(--b);
        }
        .vi-agent-card__model {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid var(--b);
        }
        .vi-agent-card__model.is-opus {
          color: var(--gold);
          background: rgba(216, 180, 254, 0.1);
          border-color: rgba(216, 180, 254, 0.28);
        }
        .vi-agent-card__model.is-sonnet {
          color: var(--blue);
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.28);
        }
        .vi-agent-card__name {
          margin: 2px 0 0;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
          color: var(--p);
        }
        .vi-agent-card__desc {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--t2);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .vi-agent-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
        }
        .vi-agent-card__tag {
          font-size: 10.5px;
          color: var(--t3);
          padding: 3px 8px;
          border-radius: 999px;
          background: var(--bg);
          border: 1px solid var(--b);
        }
        .vi-agent-card__more {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--blue);
        }
        .vi-agent-card:hover .vi-agent-card__more {
          gap: 6px;
        }
      `}</style>
    </button>
  );
}

const AgentCard = memo(AgentCardBase);
export default AgentCard;
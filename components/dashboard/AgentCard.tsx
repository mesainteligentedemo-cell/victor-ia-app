'use client';

/**
 * AgentCard — a single agent (skill) tile.
 *
 * Compact card: SVG icon badge, name, short description, model pill + a couple
 * of tags, and a "Ver más" affordance that opens the detail modal. The whole
 * card is a button so it is keyboard-accessible; the visible "Ver más" row is
 * a visual hint, not a separate focus target, to avoid nested interactives.
 *
 * Visual rules (award-worthy overhaul 2026-06-15):
 * - Icons: custom monochrome SVGs from AgentIcons (no emojis)
 * - Shadows: subtle luxury — no heavy dark drop-shadows
 * - Colors: pure monochrome, no blue/purple rainbow pills
 */

import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AgentIcon, CATEGORY_ICON } from '@/components/icons/AgentIcons';
import type { Agent } from './agents-types';

export interface AgentCardProps {
  agent: Agent;
  onOpen: (agent: Agent) => void;
}

function AgentCardBase({ agent, onOpen }: AgentCardProps) {
  const iconId = agent.iconId ?? CATEGORY_ICON[agent.category] ?? 'puzzle';
  const isOpus = agent.model.includes('opus');

  return (
    <button
      type="button"
      className="vi-agent-card"
      onClick={() => onOpen(agent)}
      aria-label={`Ver detalles de ${agent.name}`}
    >
      <div className="vi-agent-card__top">
        {/* SVG icon — monochrome, replaces emoji */}
        <span
          className="vi-agent-card__icon"
          aria-hidden
        >
          <AgentIcon id={iconId} size={20} />
        </span>

        {/* Model pill — monochrome, no color */}
        <span
          className={`vi-agent-card__model${isOpus ? ' is-opus' : ' is-sonnet'}`}
          aria-label={isOpus ? 'Modelo Opus' : 'Modelo Sonnet'}
        >
          {isOpus ? 'Opus' : 'Sonnet'}
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

      <span className="vi-agent-card__more" aria-hidden>
        Ver más
        <ArrowUpRight size={14} />
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

        /* Subtle hover lift — no colored radial gradient */
        .vi-agent-card:hover {
          border-color: var(--p2);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .vi-agent-card:focus-visible {
          outline: 2px solid var(--p);
          outline-offset: 2px;
        }

        .vi-agent-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Icon badge — monochrome, replaces emoji */
        .vi-agent-card__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--bg3);
          border: 1px solid var(--b);
          color: var(--p);
        }

        /* Model pill — pure monochrome, no rainbow colors */
        .vi-agent-card__model {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid var(--b2);
          color: var(--t3);
          background: var(--bg3);
        }

        /* Opus gets a slightly stronger border — still monochrome */
        .vi-agent-card__model.is-opus {
          color: var(--p2);
          border-color: var(--b2);
          background: var(--bg3);
        }

        .vi-agent-card__model.is-sonnet {
          color: var(--t3);
          border-color: var(--b);
          background: transparent;
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

        /* "Ver más" — neutral ink, no blue */
        .vi-agent-card__more {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--t3);
          transition: color 0.15s ease, gap 0.15s ease;
        }

        .vi-agent-card:hover .vi-agent-card__more {
          color: var(--p);
          gap: 6px;
        }
      `}</style>
    </button>
  );
}

const AgentCard = memo(AgentCardBase);
export default AgentCard;
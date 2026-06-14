'use client';

/**
 * AgentsGrid — the main view: search + category filter over the 155 agents,
 * grouped into category sections, with a shared detail modal.
 *
 * Data source: lib/agents-manifest.json (imported statically, so it is bundled
 * and needs no fetch). Filtering is in-memory and memoized. Search matches the
 * agent name, short description, tags and category label (accent-insensitive).
 */

import { useDeferredValue, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Bot } from 'lucide-react';

import manifestRaw from '@/lib/agents-manifest.json';
import AgentCategorySection from './AgentCategorySection';
import AgentModal from './AgentModal';
import type { Agent, AgentsManifest } from './agents-types';

const manifest = manifestRaw as AgentsManifest;
const ALL_AGENTS: Agent[] = manifest.agents;
const CATEGORIES = manifest.categories;

/** Lowercase + strip diacritics for forgiving search. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function AgentsGrid() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');
  const [selected, setSelected] = useState<Agent | null>(null);

  // Keep typing responsive even with 155 items being filtered.
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = norm(deferredQuery.trim());
    return ALL_AGENTS.filter((a) => {
      if (activeCat !== 'all' && a.category !== activeCat) return false;
      if (!q) return true;
      const haystack = norm(
        `${a.name} ${a.shortDesc} ${a.categoryLabel} ${a.tags.join(' ')}`,
      );
      return haystack.includes(q);
    });
  }, [deferredQuery, activeCat]);

  // Group filtered agents by category, preserving manifest category order.
  const grouped = useMemo(() => {
    const map = new Map<string, Agent[]>();
    for (const a of filtered) {
      const bucket = map.get(a.category);
      if (bucket) bucket.push(a);
      else map.set(a.category, [a]);
    }
    return CATEGORIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      agents: map.get(c.slug) ?? [],
    })).filter((g) => g.agents.length > 0);
  }, [filtered]);

  const resultCount = filtered.length;

  return (
    <div className="vi-agents">
      {/* Controls */}
      <div className="vi-agents__controls">
        <div className="vi-agents__search" role="search">
          <Search size={16} aria-hidden style={{ color: 'var(--t3)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar agentes por nombre, tag o categoría…"
            aria-label="Buscar agentes"
            className="vi-agents__search-input"
          />
        </div>

        <label className="vi-agents__filter">
          <SlidersHorizontal size={15} aria-hidden style={{ color: 'var(--t3)' }} />
          <span className="vi-agents__filter-label">Categoría</span>
          <select
            value={activeCat}
            onChange={(e) => setActiveCat(e.target.value)}
            aria-label="Filtrar por categoría"
            className="vi-agents__select"
          >
            <option value="all">Todas ({manifest.total})</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label} ({c.count})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Result meta */}
      <p className="vi-agents__meta">
        <Bot size={14} aria-hidden />
        <span>
          <strong>{resultCount}</strong> de {manifest.total} agentes
          {activeCat !== 'all' && ' · 1 categoría'}
          {deferredQuery.trim() && ` · "${deferredQuery.trim()}"`}
        </span>
      </p>

      {/* Sections or empty state */}
      {grouped.length > 0 ? (
        <div className="vi-agents__sections">
          {grouped.map((g) => (
            <AgentCategorySection
              key={g.slug}
              label={g.label}
              agents={g.agents}
              onOpen={setSelected}
            />
          ))}
        </div>
      ) : (
        <div className="vi-agents__empty">
          <span className="vi-agents__empty-emoji" aria-hidden>
            🔍
          </span>
          <p className="vi-agents__empty-title">Sin resultados</p>
          <p className="vi-agents__empty-sub">
            No hay agentes que coincidan con tu búsqueda. Prueba otro término o
            quita el filtro de categoría.
          </p>
          <button
            type="button"
            className="vi-agents__empty-btn"
            onClick={() => {
              setQuery('');
              setActiveCat('all');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Detail modal */}
      <AgentModal agent={selected} onClose={() => setSelected(null)} />

      <style jsx>{`
        .vi-agents {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .vi-agents__controls {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .vi-agents__search {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 240px;
          padding: 11px 16px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 999px;
          transition: border-color 0.18s ease;
        }
        .vi-agents__search:focus-within {
          border-color: var(--blue);
        }
        .vi-agents__search-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: var(--p);
          font-size: 13.5px;
        }
        .vi-agents__search-input::placeholder {
          color: var(--t3);
        }
        .vi-agents__filter {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px 0 16px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 999px;
          cursor: pointer;
          transition: border-color 0.18s ease;
        }
        .vi-agents__filter:focus-within {
          border-color: var(--blue);
        }
        .vi-agents__filter-label {
          font-size: 13px;
          color: var(--t2);
        }
        .vi-agents__select {
          appearance: none;
          background: transparent;
          border: none;
          outline: none;
          color: var(--p);
          font-size: 13px;
          font-family: var(--font-body);
          padding: 11px 4px;
          cursor: pointer;
          max-width: 220px;
        }
        .vi-agents__select option {
          background: var(--bg2);
          color: var(--p);
        }
        .vi-agents__meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-size: 13px;
          color: var(--t3);
        }
        .vi-agents__meta strong {
          color: var(--p);
        }
        .vi-agents__sections {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .vi-agents__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          padding: 64px 24px;
          background: var(--bg2);
          border: 1px dashed var(--b2);
          border-radius: var(--r2);
        }
        .vi-agents__empty-emoji {
          font-size: 38px;
        }
        .vi-agents__empty-title {
          margin: 4px 0 0;
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 700;
          color: var(--p);
        }
        .vi-agents__empty-sub {
          margin: 0;
          max-width: 380px;
          font-size: 13px;
          color: var(--t3);
        }
        .vi-agents__empty-btn {
          margin-top: 10px;
          appearance: none;
          padding: 10px 18px;
          border-radius: 10px;
          background: var(--blue);
          border: none;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .vi-agents__empty-btn:hover {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 560px) {
          .vi-agents__filter {
            width: 100%;
            justify-content: space-between;
          }
          .vi-agents__select {
            max-width: none;
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
'use client';

/**
 * DashboardMetrics — the three KPI cards across the top of the dashboard:
 * Total customers, Members, Active now.
 *
 * Each card shows a value, an optional delta badge (↑/↓ %) and a small
 * sparkline-style accent. Cards fade + slide in on mount via CSS only
 * (no JS animation lib required) with a staggered delay.
 */

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface DashboardMetric {
  id: string;
  /** Card heading, e.g. "Total customers" */
  label: string;
  /** Already-formatted value, e.g. "2,120" or "$41k" */
  value: string;
  /** Percentage change, positive or negative. Omit to hide the badge. */
  delta?: number;
  /** Sublabel shown under the value, e.g. "this month" */
  caption?: string;
}

export interface DashboardMetricsProps {
  metrics: DashboardMetric[];
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="vi-metrics" role="list">
      {metrics.map((m, i) => {
        const hasDelta = typeof m.delta === 'number';
        const up = (m.delta ?? 0) >= 0;
        return (
          <article
            key={m.id}
            role="listitem"
            className="vi-metrics__card"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="vi-metrics__head">
              <span className="vi-metrics__label">{m.label}</span>
              {hasDelta && (
                <span
                  className={`vi-metrics__delta${up ? ' is-up' : ' is-down'}`}
                  aria-label={`${up ? 'aumento' : 'descenso'} de ${Math.abs(m.delta as number)} por ciento`}
                >
                  {up ? <ArrowUpRight size={13} aria-hidden /> : <ArrowDownRight size={13} aria-hidden />}
                  {Math.abs(m.delta as number)}%
                </span>
              )}
            </div>

            <p className="vi-metrics__value">{m.value}</p>
            {m.caption && <p className="vi-metrics__caption">{m.caption}</p>}
          </article>
        );
      })}

      <style jsx>{`
        .vi-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .vi-metrics__card {
          position: relative;
          padding: 22px 24px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: var(--r);
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          animation: vi-metric-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .vi-metrics__card:hover {
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
        }
        .vi-metrics__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .vi-metrics__label {
          font-size: 13px;
          font-weight: 500;
          color: var(--t2);
        }
        .vi-metrics__delta {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 999px;
        }
        .vi-metrics__delta.is-up {
          color: #34d399;
          background: rgba(52, 211, 153, 0.12);
        }
        .vi-metrics__delta.is-down {
          color: #f87171;
          background: rgba(248, 113, 113, 0.12);
        }
        .vi-metrics__value {
          font-family: var(--font-display);
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: var(--p);
          margin: 0;
        }
        .vi-metrics__caption {
          margin: 6px 0 0;
          font-size: 12px;
          color: var(--t3);
        }

        @keyframes vi-metric-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .vi-metrics {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vi-metrics__card {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
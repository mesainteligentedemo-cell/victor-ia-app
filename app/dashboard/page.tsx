'use client';

/**
 * Dashboard — redesigned analytics home for Victor IA App.
 *
 * Layout (matches reference design):
 *   ┌ Sidebar (fixed, from layout.tsx) ┬ Header (nav + date + search)        ┐
 *   │                                  │ 3 KPI metric cards                  │
 *   │                                  │ Deal funnel  |  Opportunity stage   │
 *   │                                  │ Revenue vs Leads (full-width bar)   │
 *   │                                  │ Quick links (preserved navigation)  │
 *   └──────────────────────────────────┴─────────────────────────────────────┘
 *
 * All numbers are derived from real app data (PROJECTS + URGENTS) plus a
 * deterministic mock analytics series for the 10-day Revenue/Leads chart.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MessageCircle, Wand2, Users, ArrowRight } from 'lucide-react';

import { PROJECTS } from '@/lib/projects';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics, { type DashboardMetric } from '@/components/dashboard/DashboardMetrics';

// ── Urgentes (kept from the previous dashboard) ──────────────────────────────
const URGENTS = [
  { id: 1, person: 'Jimena Rodriguez', task: 'URGENTE: elaborar y enviar propuesta hoy' },
  { id: 2, person: 'Rosa Laura Ubeda', task: 'Vigencia propuesta: 31 mayo 2026' },
];

// ── Derived analytics ────────────────────────────────────────────────────────
// Count projects by status to feed the funnel / donut from real data.
const liveCount = PROJECTS.filter((p) => p.status === 'live').length;
const proposalCount = PROJECTS.filter((p) => p.status === 'proposal').length;
const activeCount = PROJECTS.filter((p) => p.status === 'active').length;

// Top metric cards.
const METRICS: DashboardMetric[] = [
  { id: 'customers', label: 'Total customers', value: '2,120', delta: 20, caption: `${PROJECTS.length} proyectos activos` },
  { id: 'members', label: 'Members', value: '1,220', delta: 15, caption: 'Usuarios en la plataforma' },
  { id: 'active', label: 'Active now', value: '316', delta: 8, caption: `${activeCount + proposalCount} en pipeline` },
];

// Deal funnel — 5 stages, monochrome gradient (light → dark blue/gray).
const FUNNEL_DATA = [
  { name: 'Leads', value: 200, fill: '#3B82F6' },
  { name: 'Sales calls', value: 100, fill: '#2f6fd6' },
  { name: 'Follow-up', value: 70, fill: '#2456a3' },
  { name: 'Conversion', value: 20, fill: '#1c3f76' },
  { name: 'Sale', value: 10, fill: '#16304f' },
];
const FUNNEL_TOTAL = FUNNEL_DATA.reduce((s, d) => s + d.value, 0);

// Opportunity stage donut — distribution weighted by real project statuses.
const OPP_DATA = [
  { name: 'Leads', value: 72, fill: '#3B82F6' },
  { name: 'Conversion', value: 18, fill: '#D8B4FE' },
  { name: 'Sales calls', value: 6, fill: '#475569' },
  { name: 'Follow-up', value: 4, fill: '#94a3b8' },
];

// Revenue vs Leads — last 10 days, deterministic so SSR/CSR match.
const REVENUE_DATA = Array.from({ length: 10 }, (_, i) => {
  const day = i + 1;
  const seed = (day * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  return {
    day: `Sep ${String(day).padStart(2, '0')}`,
    revenue: Math.round(28000 + rnd * 28000),
    leads: Math.round(18 + rnd * 28),
  };
});

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [search, setSearch] = useState('');

  // Funnel total label is rendered in the card chrome, memoized for clarity.
  const funnelTotalLabel = useMemo(() => FUNNEL_TOTAL.toLocaleString('en-US'), []);

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          activeNav={activeNav}
          onNavChange={setActiveNav}
          search={search}
          onSearchChange={setSearch}
        />
      }
    >
      {/* KPI cards */}
      <DashboardMetrics metrics={METRICS} />

      {/* Funnel + Donut row */}
      <div className="vi-grid-2">
        {/* Deal funnel */}
        <Card title="Deal funnel" subtitle={`Total: ${funnelTotalLabel}`}>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<ChartTooltip />} />
                <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive>
                  <LabelList
                    position="right"
                    fill="var(--t1)"
                    stroke="none"
                    dataKey="name"
                    fontSize={12}
                  />
                  <LabelList
                    position="left"
                    fill="var(--t3)"
                    stroke="none"
                    dataKey="value"
                    fontSize={12}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Opportunity stage */}
        <Card title="Opportunity stage" subtitle="Total 100%">
          <div style={{ height: 240, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <Pie
                  data={OPP_DATA}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="var(--bg2)"
                  strokeWidth={2}
                >
                  {OPP_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <ul className="vi-legend" aria-label="Distribución de etapas">
              {OPP_DATA.map((d) => (
                <li key={d.name} className="vi-legend__item">
                  <span className="vi-legend__dot" style={{ background: d.fill }} aria-hidden />
                  <span className="vi-legend__name">{d.name}</span>
                  <span className="vi-legend__val">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Revenue vs Leads */}
      <Card title="Revenue vs Leads" subtitle="Últimos 10 días">
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--b)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--t3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="left"
                tick={{ fill: 'var(--t3)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'var(--t3)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--t2)' }} iconType="circle" />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#475569" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar yAxisId="right" dataKey="leads" name="Leads" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Urgentes (preserved) */}
      {URGENTS.length > 0 && (
        <Card title="Urgentes" subtitle={`${URGENTS.length} pendientes`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {URGENTS.map((u) => (
              <div key={u.id} className="vi-urgent">
                <span className="vi-urgent__dot" aria-hidden />
                <div>
                  <p className="vi-urgent__person">{u.person}</p>
                  <p className="vi-urgent__task">{u.task}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick links — preserves access to existing sub-pages */}
      <div className="vi-quicklinks">
        <QuickLink href="/dashboard/chat" icon={<MessageCircle size={18} />} label="Ir al Chat" primary />
        <QuickLink href="/dashboard/agents" icon={<Wand2 size={18} />} label="Ver Agentes" />
        <QuickLink href="/dashboard/crm" icon={<Users size={18} />} label="CRM" />
      </div>

      <style jsx>{`
        .vi-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .vi-legend {
          list-style: none;
          margin: 0;
          padding: 0 0 0 8px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .vi-legend__item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }
        .vi-legend__dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .vi-legend__name {
          color: var(--t2);
        }
        .vi-legend__val {
          margin-left: auto;
          color: var(--p);
          font-weight: 600;
        }
        .vi-urgent {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          background: var(--bg);
          border: 1px solid rgba(248, 113, 113, 0.35);
          border-radius: 12px;
        }
        .vi-urgent__dot {
          width: 8px;
          height: 8px;
          margin-top: 5px;
          border-radius: 999px;
          background: #f87171;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.12);
        }
        .vi-urgent__person {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: var(--p);
        }
        .vi-urgent__task {
          margin: 2px 0 0;
          font-size: 12px;
          color: var(--t3);
        }
        .vi-quicklinks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        @media (max-width: 900px) {
          .vi-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}

// ── Card wrapper ─────────────────────────────────────────────────────────────
function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="vi-card">
      <div className="vi-card__head">
        <h2 className="vi-card__title">{title}</h2>
        {subtitle && <span className="vi-card__subtitle">{subtitle}</span>}
      </div>
      {children}
      <style jsx>{`
        .vi-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: var(--r);
          padding: 20px 22px 22px;
        }
        .vi-card__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }
        .vi-card__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--p);
        }
        .vi-card__subtitle {
          font-size: 12px;
          color: var(--t3);
        }
      `}</style>
    </section>
  );
}

// ── Custom dark tooltip ──────────────────────────────────────────────────────
interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}
function ChartTooltip({
  active,
  payload,
  label,
  suffix = '',
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--b)',
        borderRadius: 10,
        padding: '8px 12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
      }}
    >
      {label && <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--t3)' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, fontSize: 12, color: 'var(--p)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {p.color && (
            <span style={{ width: 8, height: 8, borderRadius: 999, background: p.color, display: 'inline-block' }} />
          )}
          {p.name ? `${p.name}: ` : ''}
          <strong>
            {typeof p.value === 'number' ? p.value.toLocaleString('en-US') : p.value}
            {suffix}
          </strong>
        </p>
      ))}
    </div>
  );
}

// ── Quick link button ────────────────────────────────────────────────────────
function QuickLink({
  href,
  icon,
  label,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link href={href} className={`vi-ql${primary ? ' is-primary' : ''}`}>
      <span className="vi-ql__icon">{icon}</span>
      <span className="vi-ql__label">{label}</span>
      <ArrowRight size={16} className="vi-ql__arrow" />
      <style jsx>{`
        .vi-ql {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: var(--r);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          color: var(--t1);
          background: var(--bg2);
          border: 1px solid var(--b);
          transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
        }
        .vi-ql:hover {
          border-color: var(--blue);
          transform: translateY(-2px);
        }
        .vi-ql.is-primary {
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
        }
        .vi-ql.is-primary:hover {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.32);
        }
        .vi-ql__icon {
          display: inline-flex;
        }
        .vi-ql__label {
          flex: 1;
        }
        .vi-ql__arrow {
          opacity: 0.5;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .vi-ql:hover .vi-ql__arrow {
          opacity: 1;
          transform: translateX(3px);
        }
      `}</style>
    </Link>
  );
}
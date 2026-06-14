'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface MonthBucket {
  month: string;
  label: string;
  ingresos: number;
  egresos: number;
  balance: number;
}
interface CategoryRow { category: string; direction: 'income' | 'expense'; total: number; }
interface Summary { ingresos: number; egresos: number; balance: number; receivable: number; payable: number; }

const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

function StatCard({ label, value, accent, hint }: { label: string; value: string; accent?: string; hint?: string }) {
  return (
    <div style={{ padding: 20, background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 12 }}>
      <p style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.05em' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent || 'var(--p)', margin: 0 }}>{value}</p>
      {hint && <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>{hint}</p>}
    </div>
  );
}

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<MonthBucket[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/finance/summary');
        if (!res.ok) throw new Error('No se pudieron cargar las finanzas.');
        const data = await res.json();
        if (!active) return;
        setSummary(data.summary);
        setMonthly(data.monthly ?? []);
        setCategories(data.categories ?? []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar finanzas.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div style={{ padding: 24, color: 'var(--p)' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Finanzas</h1>
      <p style={{ color: 'var(--t2)', marginBottom: 28, fontSize: 14 }}>Flujo de caja, balance y cuentas por cobrar/pagar</p>

      {error && (
        <div style={{ padding: 14, background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', color: 'var(--red)', borderRadius: 12, marginBottom: 24, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--t3)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 28 }}>
            <StatCard label="Ingresos (mes)" value={fmt(summary?.ingresos ?? 0)} accent="var(--green)" />
            <StatCard label="Egresos (mes)" value={fmt(summary?.egresos ?? 0)} accent="var(--red)" />
            <StatCard label="Balance" value={fmt(summary?.balance ?? 0)} accent={(summary?.balance ?? 0) >= 0 ? 'var(--green)' : 'var(--red)'} />
            <StatCard label="Por cobrar" value={fmt(summary?.receivable ?? 0)} hint="Proyectos autorizados" />
            <StatCard label="Por pagar" value={fmt(summary?.payable ?? 0)} hint="Suscripciones activas" />
          </div>

          <div style={{ padding: 20, background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 12, marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Flujo histórico (12 meses)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" stroke="rgba(229,225,231,0.4)" fontSize={12} />
                <YAxis stroke="rgba(229,225,231,0.4)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--b)', borderRadius: 8, color: 'var(--p)' }}
                  formatter={(v: number) => fmt(v)}
                />
                <Legend />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#22C55E" fill="url(#gIngresos)" strokeWidth={2} />
                <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#f87171" fill="url(#gEgresos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: 20, background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Detalle por categoría</h2>
            {categories.length === 0 ? (
              <p style={{ color: 'var(--t3)', fontSize: 13 }}>Sin movimientos registrados todavía.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--t3)', fontSize: 12 }}>
                    <th style={{ padding: '8px 0', borderBottom: '1px solid var(--b)' }}>Categoría</th>
                    <th style={{ padding: '8px 0', borderBottom: '1px solid var(--b)' }}>Tipo</th>
                    <th style={{ padding: '8px 0', borderBottom: '1px solid var(--b)', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, i) => (
                    <tr key={i} style={{ fontSize: 13 }}>
                      <td style={{ padding: '10px 0', borderBottom: '1px solid var(--b)', textTransform: 'capitalize' }}>{c.category}</td>
                      <td style={{ padding: '10px 0', borderBottom: '1px solid var(--b)' }}>
                        <span style={{ color: c.direction === 'income' ? 'var(--green)' : 'var(--red)' }}>
                          {c.direction === 'income' ? 'Ingreso' : 'Egreso'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 0', borderBottom: '1px solid var(--b)', textAlign: 'right', fontWeight: 600 }}>{fmt(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

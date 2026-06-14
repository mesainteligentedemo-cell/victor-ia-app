'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Win { inputTokens: number; outputTokens: number; cost: number; }
interface Daily { date: string; input: number; output: number; }
interface ByModel { model: string; tokens: number; cost: number; }
interface ByClient { client: string; cost: number; tokens: number; revenue: number; roi: number; }
interface Row { date: string; prompt: string; model: string; inputTokens: number; outputTokens: number; durationMs: number; cost: number; client: string; }
interface Eff { revenuePerHour: number; roiOverall: number; totalCost: number; totalRevenue: number; totalHours: number; }

const PIE_COLORS = ['#3B82F6', '#D8B4FE', '#22C55E', '#eec04e', '#f87171', '#60a5fa'];
const usd = (n: number) => `$${n.toFixed(2)}`;
const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

export default function ActivityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windows, setWindows] = useState<{ d7: Win; d30: Win; d90: Win } | null>(null);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [byModel, setByModel] = useState<ByModel[]>([]);
  const [byClient, setByClient] = useState<ByClient[]>([]);
  const [table, setTable] = useState<Row[]>([]);
  const [eff, setEff] = useState<Eff | null>(null);
  const [graphify, setGraphify] = useState<{ savedPct: number; queries: number } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [uRes, gRes] = await Promise.all([
          fetch('/api/activity/usage?days=90'),
          fetch('/api/graphify'),
        ]);
        if (!uRes.ok) throw new Error('No se pudieron cargar las métricas.');
        const u = await uRes.json();
        if (!active) return;
        setWindows(u.windows);
        setDaily(u.daily ?? []);
        setByModel(u.byModel ?? []);
        setByClient(u.byClient ?? []);
        setTable(u.table ?? []);
        setEff(u.efficiency);
        if (gRes.ok) {
          const g = await gRes.json();
          setGraphify({ savedPct: g.tokens?.savedPct ?? 0, queries: g.tokens?.queriesThisMonth ?? 0 });
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
    <div style={{ padding: 18, background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 12 }}>
      <p style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{value}</p>
      {hint && <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>{hint}</p>}
    </div>
  );

  const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ padding: 20, background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 12 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ padding: 24, color: 'var(--p)' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Actividad · Tokens & ROI</h1>
      <p style={{ color: 'var(--t2)', marginBottom: 24, fontSize: 14 }}>Consumo, costo estimado y retorno por cliente</p>

      {error && (
        <div style={{ padding: 12, background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', color: 'var(--red)', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--t3)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 24 }}>
            <Stat label="Tokens (7d)" value={k((windows?.d7.inputTokens ?? 0) + (windows?.d7.outputTokens ?? 0))} hint={`Costo ${usd(windows?.d7.cost ?? 0)}`} />
            <Stat label="Tokens (30d)" value={k((windows?.d30.inputTokens ?? 0) + (windows?.d30.outputTokens ?? 0))} hint={`Costo ${usd(windows?.d30.cost ?? 0)}`} />
            <Stat label="Tokens (90d)" value={k((windows?.d90.inputTokens ?? 0) + (windows?.d90.outputTokens ?? 0))} hint={`Costo ${usd(windows?.d90.cost ?? 0)}`} />
            <Stat label="ROI global" value={`${((eff?.roiOverall ?? 0) * 100).toFixed(0)}%`} hint={`Ingresos ${usd(eff?.totalRevenue ?? 0)}`} />
            <Stat label="Eficiencia" value={usd(eff?.revenuePerHour ?? 0)} hint="ingresos / hora" />
            <Stat label="Graphify ahorro" value={`${graphify?.savedPct ?? 0}%`} hint={`${graphify?.queries ?? 0} queries`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, marginBottom: 16 }}>
            <Panel title="Tokens en el tiempo">
              {daily.length === 0 ? (
                <p style={{ color: 'var(--t3)', fontSize: 13 }}>Sin datos de tokens todavía.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="rgba(229,225,231,0.4)" fontSize={11} />
                    <YAxis stroke="rgba(229,225,231,0.4)" fontSize={11} tickFormatter={k} />
                    <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--b)', borderRadius: 8, color: 'var(--p)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="input" name="Input" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="output" name="Output" stroke="#D8B4FE" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel title="Tokens por modelo">
              {byModel.length === 0 ? (
                <p style={{ color: 'var(--t3)', fontSize: 13 }}>Sin datos por modelo.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={byModel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="model" stroke="rgba(229,225,231,0.4)" fontSize={11} />
                    <YAxis stroke="rgba(229,225,231,0.4)" fontSize={11} tickFormatter={k} />
                    <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--b)', borderRadius: 8, color: 'var(--p)' }} />
                    <Bar dataKey="tokens" name="Tokens" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel title="Costo por cliente">
              {byClient.length === 0 ? (
                <p style={{ color: 'var(--t3)', fontSize: 13 }}>Sin datos por cliente.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={byClient} dataKey="cost" nameKey="client" cx="50%" cy="50%" outerRadius={90} label={(e) => (e as { client: string }).client}>
                      {byClient.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => usd(v)} contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--b)', borderRadius: 8, color: 'var(--p)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Panel>
          </div>

          <Panel title="Detalle de uso (últimos 100)">
            {table.length === 0 ? (
              <p style={{ color: 'var(--t3)', fontSize: 13 }}>Aún no hay eventos con tokens registrados. Los eventos de analítica con campos inputTokens/outputTokens aparecerán aquí.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--t3)' }}>
                      {['Fecha', 'Prompt', 'Modelo', 'In', 'Out', 'Dur', 'Costo', 'Cliente'].map((h) => (
                        <th key={h} style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((r, i) => (
                      <tr key={i}>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap' }}>{new Date(r.date).toLocaleDateString('es-MX')}</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.prompt}</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>{r.model}</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>{k(r.inputTokens)}</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>{k(r.outputTokens)}</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>{(r.durationMs / 1000).toFixed(1)}s</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)', color: 'var(--orange)' }}>{usd(r.cost)}</td>
                        <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>{r.client}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}

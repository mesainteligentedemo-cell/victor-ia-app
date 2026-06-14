'use client';

import { useEffect, useRef, useState } from 'react';
import { Network, Search, Zap, GitBranch, Sparkles, Loader } from 'lucide-react';

type GNode = { id: string; label: string; type: string; weight: number; summary: string };
type GEdge = { source: string; target: string; relation: string; weight: number };

const TYPE_COLORS: Record<string, string> = {
  concept: '#8B5CF6',
  project: '#3B82F6',
  skill: '#22C55E',
  memory: '#eec04e',
};

export default function GraphifyPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ nodes: GNode[]; edges: GEdge[]; tokensSaved?: number } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selected, setSelected] = useState<GNode | null>(null);
  const [explain, setExplain] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch('/api/graphify')
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setResult(d.fullGraph);
      })
      .catch(() => {});
  }, []);

  // Force-ish radial layout draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 60;
    const pos = new Map<string, { x: number; y: number }>();
    const concepts = result.nodes.filter((n) => n.type === 'concept');
    const others = result.nodes.filter((n) => n.type !== 'concept');

    concepts.forEach((n, i) => {
      const a = (i / Math.max(concepts.length, 1)) * Math.PI * 2 - Math.PI / 2;
      pos.set(n.id, { x: cx + Math.cos(a) * radius * 0.35, y: cy + Math.sin(a) * radius * 0.35 });
    });
    others.forEach((n, i) => {
      const a = (i / Math.max(others.length, 1)) * Math.PI * 2;
      pos.set(n.id, { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
    });

    // edges
    ctx.lineWidth = 1;
    result.edges.forEach((e) => {
      const a = pos.get(e.source);
      const b = pos.get(e.target);
      if (!a || !b) return;
      ctx.strokeStyle = `rgba(139,92,246,${0.15 + e.weight * 0.25})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    // nodes
    result.nodes.forEach((n) => {
      const p = pos.get(n.id);
      if (!p) return;
      const r = 6 + n.weight * 8;
      const color = TYPE_COLORS[n.type] || '#888';
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = selected?.id === n.id ? 18 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, p.x, p.y + r + 14);
    });
  }, [result, selected]);

  const runQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setExplain(null);
    setSelected(null);
    try {
      const r = await fetch('/api/graphify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'query', query }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d);
    } catch {
      // keep previous graph
    } finally {
      setLoading(false);
    }
  };

  const openExplain = async (node: GNode) => {
    setSelected(node);
    try {
      const r = await fetch('/api/graphify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'explain', node: node.id }),
      });
      const d = await r.json();
      if (r.ok) setExplain(d);
    } catch {
      setExplain(null);
    }
  };

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <Network size={28} style={{ color: '#8B5CF6' }} />
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>Graphify</h1>
      </div>
      <p style={{ color: 'var(--t2)', marginBottom: '28px' }}>
        Grafo de conocimiento sobre memoria, skills y proyectos. Ahorra 4-5x tokens consultando relaciones en lugar de releer archivos.
      </p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Nodos indexados', value: stats?.indices?.total ?? '—', sub: `${stats?.indices?.edges ?? 0} relaciones`, color: '#8B5CF6' },
          { label: 'Skills en grafo', value: stats?.indices?.skills ?? '—', sub: 'con bitácoras', color: '#22C55E' },
          { label: 'Ahorro de tokens', value: stats ? `${stats.tokens.savedPct}%` : '—', sub: `${(stats?.tokens?.baselineRead ?? 0).toLocaleString()} → ${(stats?.tokens?.graphRead ?? 0).toLocaleString()}`, color: '#3B82F6' },
          { label: 'Última query', value: result?.tokensSaved ? `${result.tokensSaved.toLocaleString()}` : '0', sub: 'tokens ahorrados', color: '#eec04e' },
        ].map((c) => (
          <div key={c.label} style={{ padding: '20px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '14px' }}>
            <p style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>{c.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: c.color, margin: '6px 0 2px' }}>{c.value}</p>
            <p style={{ fontSize: '12px', color: 'var(--t3)', margin: 0 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Query bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
            placeholder="Ej: ¿qué skills se usaron en Victor IA Website?"
            style={{
              width: '100%', padding: '14px 14px 14px 44px', background: 'var(--bg2)',
              border: '1px solid var(--b)', borderRadius: '12px', color: 'var(--p)', fontSize: '14px',
            }}
          />
        </div>
        <button
          onClick={runQuery}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white',
            border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
          }}
        >
          {loading ? <Loader size={16} className="animate-spin" /> : <Zap size={16} />}
          {loading ? 'Consultando…' : 'Query BFS'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Graph canvas */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '16px', padding: '12px', height: '520px', position: 'relative' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', gap: '14px' }}>
            {Object.entries(TYPE_COLORS).map(([t, c]) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--t2)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Side panel: node list + explain */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '16px', padding: '16px', maxHeight: '250px', overflowY: 'auto' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', margin: '0 0 12px' }}>
              <GitBranch size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Nodos en vista
            </p>
            {result?.nodes.map((n) => (
              <button
                key={n.id}
                onClick={() => openExplain(n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left',
                  padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '4px',
                  background: selected?.id === n.id ? 'rgba(139,92,246,0.12)' : 'transparent', color: 'var(--p)', fontSize: '13px',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLORS[n.type] || '#888' }} />
                {n.label}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '16px', padding: '16px', flex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', margin: '0 0 12px' }}>
              <Sparkles size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Explicación
            </p>
            {!selected && <p style={{ color: 'var(--t3)', fontSize: '13px' }}>Selecciona un nodo para ver sus relaciones.</p>}
            {selected && (
              <>
                <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{selected.label}</p>
                <p style={{ fontSize: '13px', color: 'var(--t2)', margin: '0 0 14px' }}>{selected.summary}</p>
                {explain?.relations?.map((r: any, i: number) => (
                  <div key={i} style={{ padding: '8px 0', borderTop: '1px solid var(--b)' }}>
                    <p style={{ fontSize: '12px', margin: 0 }}>
                      <span style={{ color: '#8B5CF6', fontWeight: 600 }}>{r.relation}</span> → {r.target}
                    </p>
                    {r.summary && <p style={{ fontSize: '11px', color: 'var(--t3)', margin: '2px 0 0' }}>{r.summary}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

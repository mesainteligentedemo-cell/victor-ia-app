'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, X } from 'lucide-react';

type Stage = 'prospect' | 'proposal' | 'authorized' | 'completed';

interface Card {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  stage: Stage;
  value: number;
  deadline: string | null;
  notes: string | null;
  created_at: string;
}

const COLUMNS: { stage: Stage; label: string }[] = [
  { stage: 'prospect', label: 'Prospecto' },
  { stage: 'proposal', label: 'Propuesta' },
  { stage: 'authorized', label: 'Autorizado' },
  { stage: 'completed', label: 'Completado' },
];

const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

/** Urgency from deadline: red <=3d, yellow <=10d, green otherwise/none. */
function urgency(deadline: string | null): { dot: string; color: string } {
  if (!deadline) return { dot: '🟢', color: 'var(--green)' };
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (days <= 3) return { dot: '🔴', color: 'var(--red)' };
  if (days <= 10) return { dot: '🟡', color: 'var(--orange)' };
  return { dot: '🟢', color: 'var(--green)' };
}

export default function CRMKanbanPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Card | null>(null);
  const [savingDetail, setSavingDetail] = useState(false);

  // filters
  const [search, setSearch] = useState('');
  const [minValue, setMinValue] = useState('');
  const [fromDate, setFromDate] = useState('');

  const fetchCards = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/crm/kanban');
      if (!res.ok) throw new Error('No se pudieron cargar los clientes.');
      const data = await res.json();
      setCards(data.cards ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (search && !`${c.name} ${c.company ?? ''}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (minValue && c.value < Number(minValue)) return false;
      if (fromDate && new Date(c.created_at) < new Date(fromDate)) return false;
      return true;
    });
  }, [cards, search, minValue, fromDate]);

  const byStage = (stage: Stage) => filtered.filter((c) => c.stage === stage);
  const colTotal = (stage: Stage) => byStage(stage).reduce((sum, c) => sum + c.value, 0);

  const moveCard = async (id: string, stage: Stage) => {
    const prev = cards;
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    try {
      const res = await fetch('/api/crm/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'move', id, stage }),
      });
      if (!res.ok) throw new Error('move failed');
    } catch {
      setCards(prev); // rollback
      setError('No se pudo mover la tarjeta.');
    }
  };

  const saveDetail = async () => {
    if (!detail) return;
    setSavingDetail(true);
    try {
      const res = await fetch('/api/crm/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: detail.id,
          fields: {
            name: detail.name,
            company: detail.company ?? '',
            email: detail.email ?? '',
            phone: detail.phone ?? '',
            value: detail.value,
            deadline: detail.deadline ?? '',
            notes: detail.notes ?? '',
          },
        }),
      });
      if (!res.ok) throw new Error('update failed');
      setCards((cs) => cs.map((c) => (c.id === detail.id ? detail : c)));
      setDetail(null);
    } catch {
      setError('No se pudo guardar.');
    } finally {
      setSavingDetail(false);
    }
  };

  return (
    <div style={{ padding: 24, color: 'var(--p)' }}>
      <style>{`
        .kb-col{background:var(--bg2);border:1px solid var(--b);border-radius:14px;padding:12px;min-height:340px;transition:background .15s;}
        .kb-col.over{background:var(--bg3);border-color:var(--blue);}
        .kb-card{background:var(--bg);border:1px solid var(--b);border-radius:10px;padding:12px;margin-bottom:10px;cursor:grab;transition:all .12s;}
        .kb-card:hover{border-color:var(--b2);transform:translateY(-1px);}
        .kb-card:active{cursor:grabbing;}
        .kb-input{padding:9px 12px;border:1px solid var(--b);border-radius:10px;background:var(--bg2);color:var(--p);font-size:13px;outline:none;}
        .kb-input:focus{border-color:var(--blue);}
      `}</style>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>CRM · Pipeline</h1>
      <p style={{ color: 'var(--t2)', marginBottom: 20, fontSize: 14 }}>Arrastra las tarjetas entre etapas</p>

      {error && (
        <div style={{ padding: 12, background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', color: 'var(--red)', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="kb-input" placeholder="Buscar cliente…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input className="kb-input" type="number" placeholder="Valor mínimo" value={minValue} onChange={(e) => setMinValue(e.target.value)} style={{ width: 140 }} />
        <input className="kb-input" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ color: 'var(--t3)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Loader2 size={16} className="animate-spin" /> Cargando…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
          {COLUMNS.map((col) => (
            <div
              key={col.stage}
              className="kb-col"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('over'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('over')}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('over');
                if (dragId) moveCard(dragId, col.stage);
                setDragId(null);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 4px' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{col.label}</span>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>{byStage(col.stage).length} · {fmt(colTotal(col.stage))}</span>
              </div>

              {byStage(col.stage).map((c) => {
                const u = urgency(c.deadline);
                return (
                  <div
                    key={c.id}
                    className="kb-card"
                    draggable
                    onDragStart={() => setDragId(c.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setDetail(c)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--p)' }}>{c.name}</span>
                      <span title="Urgencia" style={{ fontSize: 12 }}>{u.dot}</span>
                    </div>
                    {c.company && <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{c.company}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>{fmt(c.value)}</span>
                      {c.deadline && <span style={{ fontSize: 10, color: u.color }}>{new Date(c.deadline).toLocaleDateString('es-MX')}</span>}
                    </div>
                  </div>
                );
              })}

              {byStage(col.stage).length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--t4)', textAlign: 'center', padding: '24px 0' }}>Sin tarjetas</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div
          onClick={() => setDetail(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 16, boxShadow: 'var(--shadow-float)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--b)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Detalle del cliente</h2>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 20, display: 'grid', gap: 14 }}>
              {([
                ['name', 'Nombre', 'text'],
                ['company', 'Empresa', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Teléfono', 'tel'],
              ] as const).map(([key, label, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--t1)' }}>{label}</label>
                  <input className="kb-input" style={{ width: '100%' }} type={type}
                    value={(detail[key] as string) ?? ''}
                    onChange={(e) => setDetail({ ...detail, [key]: e.target.value })} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--t1)' }}>Valor</label>
                  <input className="kb-input" style={{ width: '100%' }} type="number"
                    value={detail.value} onChange={(e) => setDetail({ ...detail, value: Number(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--t1)' }}>Fecha límite</label>
                  <input className="kb-input" style={{ width: '100%' }} type="date"
                    value={detail.deadline ? detail.deadline.slice(0, 10) : ''}
                    onChange={(e) => setDetail({ ...detail, deadline: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--t1)' }}>Notas</label>
                <textarea className="kb-input" style={{ width: '100%', minHeight: 90, resize: 'vertical' }}
                  value={detail.notes ?? ''} onChange={(e) => setDetail({ ...detail, notes: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderTop: '1px solid var(--b)' }}>
              <button onClick={() => setDetail(null)} style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--bg3)', color: 'var(--p)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={saveDetail} disabled={savingDetail} style={{ flex: 2, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--blue)', background: 'var(--blue)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {savingDetail && <Loader2 size={15} className="animate-spin" />}
                {savingDetail ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

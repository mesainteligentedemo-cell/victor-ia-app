'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  Video,
  Monitor,
  Globe,
  Mic,
  BookOpen,
  Settings,
  BarChart2,
  X,
  Loader2,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ActionKey = 'image' | 'video' | 'presentation' | 'web' | 'voice' | 'training' | 'admin' | 'dashboard';

interface StudioAction {
  key: ActionKey;
  icon: React.ReactNode;
  title: string;
  desc: string;
  promptLabel: string;
  promptPlaceholder: string;
  configKey: string;
}

interface Creation {
  id: string;
  action_type: string;
  status: string;
  result_url?: string | null;
  content?: { html?: string; job_id?: string } | null;
  created_at?: string;
  config?: Record<string, unknown>;
}

interface GenerateResult {
  status: string;
  result_url?: string | null;
  html_content?: string;
  job_id?: string | null;
  message?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Studio actions config
// ---------------------------------------------------------------------------
const ACTIONS: StudioAction[] = [
  {
    key: 'image',
    icon: <ImageIcon size={22} />,
    title: 'Imagen',
    desc: 'Genera imágenes 4K con IA',
    promptLabel: 'Describe la imagen',
    promptPlaceholder: 'Ej: Fotografía editorial de un despacho legal luxury, iluminación dramática...',
    configKey: 'prompt',
  },
  {
    key: 'video',
    icon: <Video size={22} />,
    title: 'Video',
    desc: 'Video cinemático con Higgsfield',
    promptLabel: 'Describe el video',
    promptPlaceholder: 'Ej: Escena nocturna de ciudad futurista con destellos de neón...',
    configKey: 'prompt',
  },
  {
    key: 'presentation',
    icon: <Monitor size={22} />,
    title: 'Presentación',
    desc: 'Slides animados en HTML',
    promptLabel: 'Tema de la presentación',
    promptPlaceholder: 'Ej: Estrategia de crecimiento Q3 para startup de tecnología legal...',
    configKey: 'topic',
  },
  {
    key: 'web',
    icon: <Globe size={22} />,
    title: 'Landing Web',
    desc: 'Landing page lista para deploy',
    promptLabel: 'Describe el sitio web',
    promptPlaceholder: 'Ej: Landing page para despacho de abogados especializado en derecho corporativo...',
    configKey: 'description',
  },
  {
    key: 'voice',
    icon: <Mic size={22} />,
    title: 'Voice Over',
    desc: 'Voz IA con ElevenLabs',
    promptLabel: 'Texto para narrar',
    promptPlaceholder: 'Ej: Bienvenidos a Victor IA, la solución de inteligencia artificial...',
    configKey: 'text',
  },
  {
    key: 'training',
    icon: <BookOpen size={22} />,
    title: 'Capacitación',
    desc: 'Módulo de entrenamiento interactivo',
    promptLabel: 'Tema de la capacitación',
    promptPlaceholder: 'Ej: Técnicas avanzadas de cierre de ventas en timeshare...',
    configKey: 'topic',
  },
  {
    key: 'admin',
    icon: <Settings size={22} />,
    title: 'Admin',
    desc: 'Tareas administrativas con IA',
    promptLabel: 'Tarea a ejecutar',
    promptPlaceholder: 'Ej: Generar reporte de actividad semanal para el equipo...',
    configKey: 'task',
  },
  {
    key: 'dashboard',
    icon: <BarChart2 size={22} />,
    title: 'Dashboard',
    desc: 'Reporte visual con métricas',
    promptLabel: 'Métricas a mostrar',
    promptPlaceholder: 'Ej: KPIs de ventas mensuales, pipeline activo y proyección Q4...',
    configKey: 'metrics',
  },
];

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: string }) {
  const cfg =
    status === 'completed' || status === 'success'
      ? { color: '#22c55e', bg: 'rgba(34,197,94,.12)', icon: <CheckCircle size={11} /> }
      : status === 'processing'
      ? { color: '#f59e0b', bg: 'rgba(245,158,11,.12)', icon: <Clock size={11} /> }
      : { color: '#ef4444', bg: 'rgba(239,68,68,.12)', icon: <AlertCircle size={11} /> };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
      }}
    >
      {cfg.icon}
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function TrackerPage() {
  const [openModal, setOpenModal] = useState<ActionKey | null>(null);
  const [promptValue, setPromptValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loadingCreations, setLoadingCreations] = useState(false);

  const currentAction = ACTIONS.find((a) => a.key === openModal) ?? null;

  // ---- Fetch recent creations
  const fetchCreations = useCallback(async () => {
    setLoadingCreations(true);
    try {
      const res = await fetch('/api/create?userId=pablo');
      if (!res.ok) throw new Error('Error al cargar creaciones');
      const json = await res.json();
      setCreations((json.data ?? []).slice(0, 10));
    } catch {
      // silent — Supabase might not be connected
    } finally {
      setLoadingCreations(false);
    }
  }, []);

  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  // ---- Open modal
  const openAction = (key: ActionKey) => {
    setOpenModal(key);
    setPromptValue('');
    setResult(null);
    setError(null);
  };

  // ---- Close modal
  const closeModal = () => {
    setOpenModal(null);
    setPromptValue('');
    setResult(null);
    setError(null);
  };

  // ---- Submit generation
  const handleGenerate = async () => {
    if (!currentAction || !promptValue.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: currentAction.key,
          config: { [currentAction.configKey]: promptValue.trim() },
          userId: 'pablo',
        }),
      });

      const json: GenerateResult = await res.json();

      if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);

      setResult(json);
      // Refresh list after successful generation
      fetchCreations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ---- Format date
  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ---- Action label map
  const ACTION_LABEL: Record<string, string> = {
    image: 'Imagen',
    video: 'Video',
    presentation: 'Presentación',
    web: 'Landing Web',
    voice: 'Voice Over',
    training: 'Capacitación',
    admin: 'Admin',
    dashboard: 'Dashboard',
  };

  return (
    <>
      <style>{`
        /* ── CSS Variables ── */
        :root {
          --tk-bg: #070708;
          --tk-card: #0F0F12;
          --tk-border: rgba(255,255,255,.054);
          --tk-gold: #B89A6A;
          --tk-gold-low: rgba(184,154,106,.12);
          --tk-t2: rgba(255,255,255,.45);
          --tk-t3: rgba(255,255,255,.25);
          --tk-radius: 14px;
          --tk-radius-sm: 10px;
        }

        /* ── Action buttons grid ── */
        .tk-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .tk-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .tk-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── Action button ── */
        .tk-action-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 18px 16px;
          background: var(--tk-card);
          border: 1px solid var(--tk-border);
          border-radius: var(--tk-radius);
          cursor: pointer;
          transition: border-color .18s, transform .18s, background .18s;
          text-align: left;
          width: 100%;
          color: inherit;
        }
        .tk-action-btn:hover {
          border-color: var(--tk-gold);
          background: rgba(184,154,106,.06);
          transform: translateY(-2px);
        }
        .tk-action-btn:active {
          transform: translateY(0);
        }

        /* ── Action icon ── */
        .tk-action-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: var(--tk-gold-low);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--tk-gold);
          flex-shrink: 0;
        }

        /* ── Section card ── */
        .tk-card {
          background: var(--tk-card);
          border: 1px solid var(--tk-border);
          border-radius: var(--tk-radius);
          padding: 24px;
        }

        /* ── Modal overlay ── */
        .tk-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.7);
          backdrop-filter: blur(6px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        /* ── Modal panel ── */
        .tk-modal {
          background: var(--tk-card);
          border: 1px solid var(--tk-border);
          border-radius: 18px;
          width: 100%;
          max-width: 560px;
          padding: 28px;
          position: relative;
          animation: tk-modal-in .18s ease;
        }
        @keyframes tk-modal-in {
          from { opacity: 0; transform: scale(.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Textarea ── */
        .tk-textarea {
          width: 100%;
          min-height: 120px;
          padding: 14px 16px;
          background: rgba(255,255,255,.04);
          border: 1px solid var(--tk-border);
          border-radius: var(--tk-radius-sm);
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: border-color .15s;
          box-sizing: border-box;
        }
        .tk-textarea:focus {
          border-color: var(--tk-gold);
        }

        /* ── Primary button ── */
        .tk-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--tk-gold);
          color: #070708;
          font-weight: 700;
          font-size: 14px;
          border: none;
          border-radius: var(--tk-radius-sm);
          cursor: pointer;
          transition: opacity .15s, transform .15s;
          white-space: nowrap;
        }
        .tk-btn-primary:hover:not(:disabled) {
          opacity: .88;
          transform: translateY(-1px);
        }
        .tk-btn-primary:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        /* ── Ghost button ── */
        .tk-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid var(--tk-border);
          border-radius: var(--tk-radius-sm);
          color: var(--tk-t2);
          font-size: 13px;
          cursor: pointer;
          transition: border-color .15s, color .15s;
        }
        .tk-btn-ghost:hover {
          border-color: rgba(255,255,255,.15);
          color: #fff;
        }

        /* ── Result box ── */
        .tk-result {
          margin-top: 16px;
          padding: 16px;
          border-radius: var(--tk-radius-sm);
          font-size: 13px;
        }
        .tk-result-success {
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.25);
          color: #4ade80;
        }
        .tk-result-error {
          background: rgba(239,68,68,.1);
          border: 1px solid rgba(239,68,68,.25);
          color: #f87171;
        }
        .tk-result-processing {
          background: rgba(245,158,11,.1);
          border: 1px solid rgba(245,158,11,.25);
          color: #fbbf24;
        }

        /* ── Creations table ── */
        .tk-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .tk-table th {
          text-align: left;
          padding: 10px 12px;
          color: var(--tk-t3);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .06em;
          border-bottom: 1px solid var(--tk-border);
        }
        .tk-table td {
          padding: 12px 12px;
          color: var(--tk-t2);
          border-bottom: 1px solid rgba(255,255,255,.03);
          vertical-align: middle;
        }
        .tk-table tr:last-child td {
          border-bottom: none;
        }
        .tk-table tr:hover td {
          background: rgba(255,255,255,.02);
        }

        /* ── Scrollable result preview ── */
        .tk-html-preview {
          margin-top: 10px;
          padding: 10px 14px;
          background: rgba(0,0,0,.3);
          border-radius: 8px;
          font-size: 12px;
          color: rgba(255,255,255,.5);
          max-height: 80px;
          overflow: hidden;
          font-family: 'Fira Mono', monospace;
        }
      `}</style>

      {/* ── Page container ── */}
      <div style={{ padding: '28px 32px 56px', maxWidth: 1200, margin: '0 auto', color: '#fff' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-.02em' }}>
            Tracker de Creaciones
          </h1>
          <p style={{ color: 'rgba(255,255,255,.45)', marginTop: 6, fontSize: 14 }}>
            Studio integrado — genera, guarda y rastrea todo desde un solo lugar
          </p>
        </div>

        {/* ── Studio section ── */}
        <div className="tk-card" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--tk-gold)' }}>
              Crear nuevo trabajo
            </h2>
            <p style={{ fontSize: 13, color: 'var(--tk-t2)', marginTop: 4 }}>
              Elige un tipo y el resultado se guarda automáticamente en el tracker
            </p>
          </div>

          <div className="tk-grid">
            {ACTIONS.map((action) => (
              <button
                key={action.key}
                className="tk-action-btn"
                onClick={() => openAction(action.key)}
              >
                <div className="tk-action-icon">{action.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tk-t2)' }}>{action.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent creations section ── */}
        <div className="tk-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Últimas creaciones</h2>
              <p style={{ fontSize: 13, color: 'var(--tk-t2)', marginTop: 4 }}>
                Las 10 más recientes — se actualiza automáticamente
              </p>
            </div>
            <button
              className="tk-btn-ghost"
              onClick={fetchCreations}
              disabled={loadingCreations}
              title="Actualizar"
            >
              <RefreshCw size={13} style={{ opacity: loadingCreations ? .4 : 1 }} />
              Actualizar
            </button>
          </div>

          {loadingCreations ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--tk-t3)' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', display: 'inline' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : creations.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 0',
                color: 'var(--tk-t3)',
                fontSize: 14,
              }}
            >
              <Clock size={28} style={{ marginBottom: 10, opacity: .4 }} />
              <p style={{ margin: 0 }}>No hay creaciones todavía</p>
              <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                Genera algo arriba y aparecerá aquí
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tk-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {creations.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span style={{ color: '#fff', fontWeight: 600 }}>
                          {ACTION_LABEL[c.action_type] ?? c.action_type}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                      <td>
                        {c.result_url && !c.result_url.startsWith('data:') ? (
                          <a
                            href={c.result_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: 'var(--tk-gold)',
                              textDecoration: 'none',
                              fontSize: 12,
                            }}
                          >
                            Ver <ExternalLink size={11} />
                          </a>
                        ) : c.result_url && c.result_url.startsWith('data:audio') ? (
                          <audio controls src={c.result_url} style={{ height: 28, maxWidth: 180 }} />
                        ) : c.content?.html ? (
                          <span style={{ fontSize: 12, color: 'var(--tk-t2)' }}>HTML listo</span>
                        ) : c.content?.job_id ? (
                          <span style={{ fontSize: 12, color: 'var(--tk-t2)' }}>
                            Job: {String(c.content.job_id).slice(0, 12)}…
                          </span>
                        ) : (
                          <span style={{ color: 'var(--tk-t3)', fontSize: 12 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {openModal && currentAction && (
        <div className="tk-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="tk-modal">
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="tk-action-icon" style={{ width: 36, height: 36, borderRadius: 8 }}>
                  {currentAction.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{currentAction.title}</h3>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--tk-t2)' }}>{currentAction.desc}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--tk-t2)',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            {!result ? (
              <>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,.7)' }}>
                  {currentAction.promptLabel}
                </label>
                <textarea
                  className="tk-textarea"
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  placeholder={currentAction.promptPlaceholder}
                  autoFocus
                  disabled={loading}
                />

                {error && (
                  <div className="tk-result tk-result-error" style={{ marginTop: 12 }}>
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
                  <button className="tk-btn-ghost" onClick={closeModal} disabled={loading}>
                    Cancelar
                  </button>
                  <button
                    className="tk-btn-primary"
                    onClick={handleGenerate}
                    disabled={loading || !promptValue.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                        Generando…
                      </>
                    ) : (
                      'Generar'
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Result */
              <>
                <div
                  className={`tk-result ${
                    result.status === 'success' || result.status === 'completed'
                      ? 'tk-result-success'
                      : result.status === 'processing'
                      ? 'tk-result-processing'
                      : 'tk-result-error'
                  }`}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {result.status === 'success' || result.status === 'completed'
                      ? '✅ ¡Listo!'
                      : result.status === 'processing'
                      ? '⏳ En proceso…'
                      : '❌ Error'}
                  </div>
                  {result.message && <div style={{ fontSize: 12 }}>{result.message}</div>}
                  {result.job_id && (
                    <div style={{ fontSize: 11, marginTop: 4, opacity: .7 }}>Job ID: {result.job_id}</div>
                  )}
                </div>

                {/* Result URL */}
                {result.result_url && !result.result_url.startsWith('data:') && (
                  <a
                    href={result.result_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tk-btn-primary"
                    style={{ display: 'inline-flex', marginTop: 14, textDecoration: 'none' }}
                  >
                    <ExternalLink size={14} />
                    Ver resultado
                  </a>
                )}

                {/* Audio result */}
                {result.result_url && result.result_url.startsWith('data:audio') && (
                  <div style={{ marginTop: 14 }}>
                    <audio controls src={result.result_url} style={{ width: '100%' }} />
                  </div>
                )}

                {/* HTML preview */}
                {result.html_content && (
                  <div className="tk-html-preview">
                    {result.html_content.slice(0, 200)}…
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
                  <button
                    className="tk-btn-ghost"
                    onClick={() => {
                      setResult(null);
                      setPromptValue('');
                    }}
                  >
                    Generar otro
                  </button>
                  <button className="tk-btn-primary" onClick={closeModal}>
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

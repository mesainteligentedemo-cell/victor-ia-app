'use client';

import { useState } from 'react';
import { Mail, Loader2, Copy, Check } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface EmailGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMAIL_TYPES = [
  { id: 'cold', label: 'Prospección en frío' },
  { id: 'follow-up', label: 'Seguimiento propuesta' },
  { id: 'closing', label: 'Cierre de venta' },
  { id: 'thanks', label: 'Agradecimiento' },
  { id: 'support', label: 'Soporte' },
];

interface EmailResult {
  subject: string;
  html: string;
  bodyText: string;
}

export default function EmailGeneratorModal({ isOpen, onClose }: EmailGeneratorModalProps) {
  const [type, setType] = useState('cold');
  const [clientName, setClientName] = useState('');
  const [project, setProject] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, clientName, project, value, date, context }),
      });
      if (!res.ok) throw new Error('No se pudo generar el email. Intenta de nuevo.');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el email.');
    } finally {
      setLoading(false);
    }
  };

  const copyHtml = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Email Generator"
      icon={<Mail size={18} />}
      maxWidth={680}
      footer={
        <>
          <button className="sm-btn" onClick={onClose} disabled={loading} style={{ flex: 1 }}>Cerrar</button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading} style={{ flex: 2 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            {loading ? 'Redactando…' : 'Generar email'}
          </button>
        </>
      }
    >
      {error && <div className="sm-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ marginBottom: 14 }}>
        <label className="sm-label">Tipo</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EMAIL_TYPES.map((t) => (
            <button key={t.id} type="button"
              className={`sm-chip ${type === t.id ? 'active' : ''}`}
              onClick={() => setType(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sm-row sm-row-2" style={{ marginBottom: 14 }}>
        <div>
          <label className="sm-label">{'{nombre_cliente}'}</label>
          <input className="sm-input" value={clientName} onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej: Aldo Rendón" />
        </div>
        <div>
          <label className="sm-label">{'{proyecto}'}</label>
          <input className="sm-input" value={project} onChange={(e) => setProject(e.target.value)}
            placeholder="Ej: Rediseño web" />
        </div>
      </div>

      <div className="sm-row sm-row-2" style={{ marginBottom: 14 }}>
        <div>
          <label className="sm-label">{'{valor}'}</label>
          <input className="sm-input" value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="Ej: $68,000 MXN" />
        </div>
        <div>
          <label className="sm-label">{'{fecha}'}</label>
          <input className="sm-input" value={date} onChange={(e) => setDate(e.target.value)}
            placeholder="Ej: 30 de junio" />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="sm-label">Contexto adicional</label>
        <textarea className="sm-textarea" value={context} onChange={(e) => setContext(e.target.value)}
          placeholder="Cualquier detalle que deba incluir el correo…" />
      </div>

      {result && (
        <div style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--p)', marginBottom: 4 }}>
            Asunto: <span style={{ fontWeight: 400, color: 'var(--t2)' }}>{result.subject}</span>
          </div>
          <iframe
            title="email-preview"
            srcDoc={result.html}
            style={{ width: '100%', height: 320, border: '1px solid var(--b)', borderRadius: 8, margin: '10px 0', background: '#060609' }}
          />
          <button className="sm-btn primary" onClick={copyHtml} style={{ width: '100%' }}>
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'HTML copiado' : 'Copiar HTML'}
          </button>
        </div>
      )}
    </StudioModalShell>
  );
}

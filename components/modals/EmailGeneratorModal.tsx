'use client';

import { useState } from 'react';
import { Mail, Loader2, Copy, Check } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface EmailGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPES = [
  { value: 'cold', label: 'Prospección en frío' },
  { value: 'follow-up', label: 'Seguimiento' },
  { value: 'closing', label: 'Cierre de venta' },
  { value: 'thanks', label: 'Agradecimiento' },
  { value: 'support', label: 'Soporte' },
] as const;

interface EmailResult {
  type: string;
  subject: string;
  bodyText: string;
  html: string;
}

export default function EmailGeneratorModal({ isOpen, onClose }: EmailGeneratorModalProps) {
  const [type, setType] = useState('cold');
  const [clientName, setClientName] = useState('');
  const [project, setProject] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setError(null);
    setResult(null);
    setCopied(false);
    onClose();
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch('/api/generate/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, clientName, project, context }),
      });
      if (!res.ok) throw new Error('No se pudo generar el email. Intenta de nuevo.');
      const data = (await res.json()) as EmailResult;
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
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('No se pudo copiar al portapapeles.');
    }
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Email Generator"
      subtitle="Emails HTML luxury · estilo Victor IA"
      icon={<Mail size={19} />}
      maxWidth={620}
      footer={
        <>
          <button className="sm-btn" onClick={handleClose} disabled={loading}>
            Cerrar
          </button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <Mail size={16} />}
            {loading ? 'Escribiendo…' : 'Generar email'}
          </button>
        </>
      }
    >
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {error && <div className="sm-error">{error}</div>}

      {!result && (
        <>
          <div className="sm-row">
            <div className="sm-field">
              <label className="sm-label" htmlFor="em-type">Tipo</label>
              <select
                id="em-type"
                className="sm-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm-field">
              <label className="sm-label" htmlFor="em-client">Cliente</label>
              <input
                id="em-client"
                className="sm-input"
                value={clientName}
                maxLength={120}
                placeholder="Ej. Aldo Rendón"
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>
          <div className="sm-field">
            <label className="sm-label" htmlFor="em-proj">Proyecto (opcional)</label>
            <input
              id="em-proj"
              className="sm-input"
              value={project}
              maxLength={200}
              placeholder="Ej. Sitio web Remi Creative"
              onChange={(e) => setProject(e.target.value)}
            />
          </div>
          <div className="sm-field">
            <label className="sm-label" htmlFor="em-ctx">Contexto adicional (opcional)</label>
            <textarea
              id="em-ctx"
              className="sm-textarea"
              value={context}
              maxLength={1000}
              placeholder="Detalles que el email debe mencionar…"
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
        </>
      )}

      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: 'var(--green)' }}>✅ Email generado</div>
            <button className="sm-btn" onClick={copyHtml}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copiado' : 'Copiar HTML'}
            </button>
          </div>
          <div className="sm-field">
            <label className="sm-label">Asunto</label>
            <div
              style={{
                padding: '10px 13px',
                borderRadius: 10,
                background: 'var(--bg)',
                border: '1px solid var(--b)',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {result.subject}
            </div>
          </div>
          <div className="sm-field">
            <label className="sm-label">Vista previa</label>
            <iframe
              title="Email preview"
              srcDoc={result.html}
              style={{
                width: '100%',
                height: 320,
                border: '1px solid var(--b)',
                borderRadius: 10,
                background: '#060609',
              }}
            />
          </div>
          <button className="sm-btn" style={{ marginTop: 4 }} onClick={() => setResult(null)}>
            Crear otro
          </button>
        </div>
      )}
    </StudioModalShell>
  );
}

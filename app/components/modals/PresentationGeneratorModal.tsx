'use client';

import { useState } from 'react';
import { Presentation, Loader2, Download, ExternalLink, Copy, Check } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface PresentationGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  title: string;
  bullets: string[];
  speakerNotes: string;
  backgroundImagePrompt: string;
}

const STYLES = [
  { id: 'dark-luxury', label: 'Dark luxury' },
  { id: 'minimal-white', label: 'Minimalista blanco' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'creative', label: 'Creative' },
];

export default function PresentationGeneratorModal({ isOpen, onClose }: PresentationGeneratorModalProps) {
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [audience, setAudience] = useState('');
  const [slides, setSlides] = useState(8);
  const [style, setStyle] = useState('dark-luxury');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Slide[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (topic.trim().length < 3) {
      setError('Escribe el tema de la presentación.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate/presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, objective, audience, slides, style }),
      });
      if (!res.ok) throw new Error('No se pudo generar la presentación. Intenta de nuevo.');
      const data = await res.json();
      setResult(data.slides ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la presentación.');
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify({ topic, style, slides: result }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentacion-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyForFigma = async () => {
    if (!result) return;
    // Figma-friendly structured text (importable via Figma plugins / Code Connect).
    const text = result
      .map(
        (s, i) =>
          `Slide ${i + 1}: ${s.title}\n${s.bullets.map((b) => `  • ${b}`).join('\n')}\nNotes: ${s.speakerNotes}`
      )
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const openInFigma = () => {
    copyForFigma();
    window.open('https://www.figma.com/files/recent', '_blank', 'noopener');
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Presentation Generator"
      icon={<Presentation size={18} />}
      maxWidth={680}
      footer={
        <>
          <button className="sm-btn" onClick={onClose} disabled={loading} style={{ flex: 1 }}>Cerrar</button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading} style={{ flex: 2 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Presentation size={16} />}
            {loading ? 'Generando…' : 'Generar slides'}
          </button>
        </>
      }
    >
      {error && <div className="sm-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="sm-row sm-row-2" style={{ marginBottom: 14 }}>
        <div>
          <label className="sm-label">Tema</label>
          <input className="sm-input" value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Propuesta de marca para Seabird" />
        </div>
        <div>
          <label className="sm-label">Audiencia</label>
          <input className="sm-input" value={audience} onChange={(e) => setAudience(e.target.value)}
            placeholder="Ej: Director de Marketing" />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label className="sm-label">Objetivo</label>
        <input className="sm-input" value={objective} onChange={(e) => setObjective(e.target.value)}
          placeholder="Ej: Cerrar contrato de rediseño web" />
      </div>

      <div className="sm-row sm-row-2" style={{ marginBottom: 16 }}>
        <div>
          <label className="sm-label">Slides: {slides}</label>
          <input className="sm-range" type="range" min={6} max={20} step={1}
            value={slides} onChange={(e) => setSlides(Number(e.target.value))} />
        </div>
        <div>
          <label className="sm-label">Estilo</label>
          <select className="sm-select" value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {result && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <button className="sm-btn" onClick={downloadJson}><Download size={15} /> JSON</button>
            <button className="sm-btn" onClick={copyForFigma}>
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button className="sm-btn primary" onClick={openInFigma}>
              <ExternalLink size={15} /> Abrir en Figma
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
            {result.map((s, i) => (
              <div key={i} style={{ padding: 12, background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--p)', marginBottom: 6 }}>
                  {i + 1}. {s.title}
                </div>
                <ul style={{ margin: '0 0 6px 16px', padding: 0, color: 'var(--t2)', fontSize: 12 }}>
                  {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>🎤 {s.speakerNotes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </StudioModalShell>
  );
}

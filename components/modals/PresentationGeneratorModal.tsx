'use client';

import { useState } from 'react';
import { Presentation, Loader2, FileDown } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface PresentationGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STYLES = [
  { value: 'dark-luxury', label: 'Dark Luxury' },
  { value: 'minimal-white', label: 'Minimal White' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'creative', label: 'Creative' },
] as const;

interface Slide {
  title: string;
  bullets: string[];
  speakerNotes: string;
}

interface PresentationResult {
  topic: string;
  style: string;
  slides: Slide[];
}

export default function PresentationGeneratorModal({
  isOpen,
  onClose,
}: PresentationGeneratorModalProps) {
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [audience, setAudience] = useState('');
  const [slides, setSlides] = useState(8);
  const [style, setStyle] = useState('dark-luxury');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PresentationResult | null>(null);

  const handleClose = () => {
    setError(null);
    setResult(null);
    onClose();
  };

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
      const data = (await res.json()) as PresentationResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la presentación.');
    } finally {
      setLoading(false);
    }
  };

  const printDeck = () => window.print();

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Presentation Generator"
      subtitle="Slides con notas del presentador"
      icon={<Presentation size={19} />}
      maxWidth={640}
      footer={
        <>
          <button className="sm-btn" onClick={handleClose} disabled={loading}>
            Cerrar
          </button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <Presentation size={16} />}
            {loading ? 'Generando…' : 'Generar slides'}
          </button>
        </>
      }
    >
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {error && <div className="sm-error">{error}</div>}

      {!result && (
        <>
          <div className="sm-field">
            <label className="sm-label" htmlFor="pg-topic">Tema</label>
            <input
              id="pg-topic"
              className="sm-input"
              value={topic}
              maxLength={300}
              placeholder="Ej. Estrategia de IA para retail 2027"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="sm-field">
            <label className="sm-label" htmlFor="pg-obj">Objetivo (opcional)</label>
            <input
              id="pg-obj"
              className="sm-input"
              value={objective}
              maxLength={500}
              placeholder="Ej. Convencer al comité de inversión"
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>
          <div className="sm-field">
            <label className="sm-label" htmlFor="pg-aud">Audiencia (opcional)</label>
            <input
              id="pg-aud"
              className="sm-input"
              value={audience}
              maxLength={300}
              placeholder="Ej. C-level, no técnicos"
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <div className="sm-row">
            <div className="sm-field">
              <label className="sm-label">Slides · {slides}</label>
              <input
                className="sm-range"
                type="range"
                min={6}
                max={20}
                step={1}
                value={slides}
                onChange={(e) => setSlides(parseInt(e.target.value, 10))}
              />
            </div>
            <div className="sm-field">
              <label className="sm-label" htmlFor="pg-style">Estilo</label>
              <select
                id="pg-style"
                className="sm-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: 'var(--green)' }}>
              ✅ {result.slides.length} slides · {result.style}
            </div>
            <button className="sm-btn" onClick={printDeck}>
              <FileDown size={15} /> Exportar
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 380, overflowY: 'auto' }}>
            {result.slides.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: 'var(--bg)',
                  border: '1px solid var(--b)',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Slide {i + 1}</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <ul style={{ margin: '0 0 8px', paddingLeft: 18, fontSize: 13, color: 'var(--t2)' }}>
                  {s.bullets?.map((b, j) => (
                    <li key={j} style={{ marginBottom: 3 }}>{b}</li>
                  ))}
                </ul>
                {s.speakerNotes && (
                  <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic' }}>
                    🎤 {s.speakerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="sm-btn" style={{ marginTop: 14 }} onClick={() => setResult(null)}>
            Crear otra
          </button>
        </div>
      )}
    </StudioModalShell>
  );
}

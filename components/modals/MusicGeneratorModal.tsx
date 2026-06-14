'use client';

import { useState } from 'react';
import { Music, Download, Loader2 } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface MusicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS = [
  { value: 'cinematic', label: 'Cinematográfico' },
  { value: 'energetic', label: 'Enérgico' },
  { value: 'ambient', label: 'Ambiental' },
  { value: 'indie', label: 'Indie' },
  { value: 'hip-hop', label: 'Hip-Hop' },
] as const;

interface MusicResult {
  audio: string;
  metadata: { mood: string; durationSec: number; bpm: number; key: string };
}

export default function MusicGeneratorModal({ isOpen, onClose }: MusicGeneratorModalProps) {
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState<string>('cinematic');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MusicResult | null>(null);

  const handleClose = () => {
    setDescription('');
    setError(null);
    setResult(null);
    onClose();
  };

  const handleGenerate = async () => {
    if (description.trim().length < 3) {
      setError('Describe la pista que quieres crear.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, mood, duration }),
      });
      if (!res.ok) throw new Error('No se pudo generar la música. Intenta de nuevo.');
      const data = (await res.json()) as MusicResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la música.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Music Generator"
      subtitle="Pistas originales por mood · ElevenLabs Music"
      icon={<Music size={19} />}
      footer={
        <>
          <button className="sm-btn" onClick={handleClose} disabled={loading}>
            Cerrar
          </button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <Music size={16} />}
            {loading ? 'Componiendo…' : 'Generar música'}
          </button>
        </>
      }
    >
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {error && <div className="sm-error">{error}</div>}

      <div className="sm-field">
        <label className="sm-label" htmlFor="mg-desc">Descripción</label>
        <textarea
          id="mg-desc"
          className="sm-textarea"
          value={description}
          maxLength={1000}
          placeholder="Ej. Intro épica para video corporativo, con cuerdas y percusión creciente…"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="sm-row">
        <div className="sm-field">
          <label className="sm-label" htmlFor="mg-mood">Mood</label>
          <select
            id="mg-mood"
            className="sm-select"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            {MOODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm-field">
          <label className="sm-label">Duración · {duration}s</label>
          <input
            className="sm-range"
            type="range"
            min={10}
            max={180}
            step={5}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      {result && (
        <div
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(34,197,94,.1)',
            border: '1px solid rgba(34,197,94,.25)',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>
            ✅ {result.metadata.mood} · {result.metadata.bpm} BPM · {result.metadata.key}
          </div>
          <audio controls src={result.audio} style={{ width: '100%', marginTop: 8 }} />
          <a
            className="sm-btn"
            href={result.audio}
            download={`musica-${Date.now()}.mp3`}
            style={{ textDecoration: 'none', marginTop: 12 }}
          >
            <Download size={15} /> Descargar
          </a>
        </div>
      )}
    </StudioModalShell>
  );
}

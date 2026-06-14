'use client';

import { useState } from 'react';
import { Mic, Play, Download, Loader2 } from 'lucide-react';
import StudioModalShell from './StudioModalShell';
import { VOICE_CATALOG, DEFAULT_VOICE_ID } from '@/lib/studio/voices';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VoiceResult {
  audio: string; // data URL
  duration: number;
  voiceName: string;
}

const MX = VOICE_CATALOG.filter((v) => v.region === 'MX');
const USA = VOICE_CATALOG.filter((v) => v.region === 'USA');

export default function VoiceStudioModal({ isOpen, onClose }: VoiceStudioModalProps) {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [style, setStyle] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VoiceResult | null>(null);

  const reset = () => {
    setText('');
    setError(null);
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Escribe el texto a convertir en voz.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId, stability, similarity, style }),
      });
      if (!res.ok) throw new Error('No se pudo generar la voz. Intenta de nuevo.');
      const data = (await res.json()) as VoiceResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la voz.');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!result) return;
    const audio = new Audio(result.audio);
    void audio.play();
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Voice Studio"
      subtitle="Texto a voz con ElevenLabs · México y USA"
      icon={<Mic size={19} />}
      footer={
        <>
          <button className="sm-btn" onClick={handleClose} disabled={loading}>
            Cerrar
          </button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <Mic size={16} />}
            {loading ? 'Generando…' : 'Generar voz'}
          </button>
        </>
      }
    >
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {error && <div className="sm-error">{error}</div>}

      <div className="sm-field">
        <label className="sm-label" htmlFor="vs-text">Texto</label>
        <textarea
          id="vs-text"
          className="sm-textarea"
          value={text}
          maxLength={5000}
          placeholder="Escribe el guion que quieres convertir a voz…"
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'right' }}>
          {text.length}/5000
        </div>
      </div>

      <div className="sm-field">
        <label className="sm-label" htmlFor="vs-voice">Voz</label>
        <select
          id="vs-voice"
          className="sm-select"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
        >
          <optgroup label="México">
            {MX.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.description}
              </option>
            ))}
          </optgroup>
          <optgroup label="USA">
            {USA.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.description}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="sm-field">
        <label className="sm-label">Estabilidad · {stability.toFixed(2)}</label>
        <input
          className="sm-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={stability}
          onChange={(e) => setStability(parseFloat(e.target.value))}
        />
      </div>

      <div className="sm-field">
        <label className="sm-label">Similitud · {similarity.toFixed(2)}</label>
        <input
          className="sm-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={similarity}
          onChange={(e) => setSimilarity(parseFloat(e.target.value))}
        />
      </div>

      <div className="sm-field">
        <label className="sm-label">Estilo · {style.toFixed(2)}</label>
        <input
          className="sm-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={style}
          onChange={(e) => setStyle(parseFloat(e.target.value))}
        />
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
            ✅ {result.voiceName} · ~{result.duration}s
          </div>
          <audio controls src={result.audio} style={{ width: '100%', marginTop: 8 }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="sm-btn" onClick={playAudio}>
              <Play size={15} /> Reproducir
            </button>
            <a
              className="sm-btn"
              href={result.audio}
              download={`voz-${Date.now()}.mp3`}
              style={{ textDecoration: 'none' }}
            >
              <Download size={15} /> Descargar
            </a>
          </div>
        </div>
      )}
    </StudioModalShell>
  );
}

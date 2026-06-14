'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Play, Download, Loader2, History } from 'lucide-react';
import StudioModalShell from './StudioModalShell';
import { VOICE_OPTIONS, DEFAULT_VOICE_ID } from '@/lib/studio/voices';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryItem {
  id: string;
  prompt: string | null;
  metadata: { voiceName?: string; durationSec?: number } | null;
  created_at: string;
}

const MAX_CHARS = 5000;

export default function VoiceStudioModal({ isOpen, onClose }: VoiceStudioModalProps) {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [style, setStyle] = useState(0.3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/studio/history?type=voice&limit=5');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.items ?? []);
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen, loadHistory]);

  const mxVoices = VOICE_OPTIONS.filter((v) => v.region === 'MX');
  const usaVoices = VOICE_OPTIONS.filter((v) => v.region === 'USA');

  const handleGenerate = async () => {
    if (text.trim().length < 1) {
      setError('Escribe el texto a sintetizar.');
      return;
    }
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const res = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId, stability, similarity, style }),
      });
      if (!res.ok) {
        throw new Error('No se pudo generar el audio. Intenta de nuevo.');
      }
      const data = await res.json();
      setAudioUrl(data.audio);
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el audio.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => undefined);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `voz-victor-ia-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Voice Studio"
      icon={<Mic size={18} />}
      footer={
        <>
          <button className="sm-btn" onClick={onClose} disabled={loading} style={{ flex: 1 }}>
            Cerrar
          </button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading} style={{ flex: 2 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
            {loading ? 'Generando…' : 'Generar voz'}
          </button>
        </>
      }
    >
      {error && <div className="sm-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="sm-row" style={{ marginBottom: 16 }}>
        <div>
          <label className="sm-label">Texto ({text.length}/{MAX_CHARS})</label>
          <textarea
            className="sm-textarea"
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe lo que quieres que diga la voz…"
          />
        </div>

        <div>
          <label className="sm-label">Voz</label>
          <select className="sm-select" value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
            <optgroup label="México">
              {mxVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="USA">
              {usaVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.description}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="sm-row sm-row-2" style={{ marginBottom: 8 }}>
        <div>
          <label className="sm-label">Estabilidad: {stability.toFixed(2)}</label>
          <input className="sm-range" type="range" min={0} max={1} step={0.05}
            value={stability} onChange={(e) => setStability(Number(e.target.value))} />
        </div>
        <div>
          <label className="sm-label">Similitud: {similarity.toFixed(2)}</label>
          <input className="sm-range" type="range" min={0} max={1} step={0.05}
            value={similarity} onChange={(e) => setSimilarity(Number(e.target.value))} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="sm-label">Estilo / expresividad: {style.toFixed(2)}</label>
        <input className="sm-range" type="range" min={0} max={1} step={0.05}
          value={style} onChange={(e) => setStyle(Number(e.target.value))} />
      </div>

      {audioUrl && (
        <div style={{ marginBottom: 16, padding: 14, background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 12 }}>
          <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%', marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="sm-btn" onClick={handlePlay} style={{ flex: 1 }}>
              <Play size={15} /> Reproducir
            </button>
            <button className="sm-btn primary" onClick={handleDownload} style={{ flex: 1 }}>
              <Download size={15} /> Descargar MP3
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 8 }}>
            <History size={14} /> Últimas síntesis
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map((h) => (
              <div key={h.id} style={{ fontSize: 12, color: 'var(--t2)', padding: '8px 10px', background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 8 }}>
                <span style={{ color: 'var(--p)', fontWeight: 600 }}>{h.metadata?.voiceName ?? 'Voz'}</span>
                {' · '}
                {(h.prompt ?? '').slice(0, 60)}
                {(h.prompt ?? '').length > 60 ? '…' : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </StudioModalShell>
  );
}

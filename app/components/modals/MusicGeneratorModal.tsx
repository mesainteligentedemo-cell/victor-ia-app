'use client';

import { useEffect, useRef, useState } from 'react';
import { Music, Download, Loader2, Play, Pause } from 'lucide-react';
import StudioModalShell from './StudioModalShell';

interface MusicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'indie', label: 'Indie' },
  { id: 'hip-hop', label: 'Hip-Hop' },
];

interface MusicMeta {
  mood: string;
  durationSec: number;
  bpm: number;
  key: string;
  model: string;
}

export default function MusicGeneratorModal({ isOpen, onClose }: MusicGeneratorModalProps) {
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('cinematic');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<MusicMeta | null>(null);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  // Wire up Web Audio analyser when an audio element + url exist.
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audioEl = audioRef.current;

    const setup = () => {
      if (ctxRef.current) return;
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
    };

    audioEl.addEventListener('play', setup);
    return () => audioEl.removeEventListener('play', setup);
  }, [audioUrl]);

  const drawWave = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const cctx = canvas.getContext('2d');
    if (!cctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteFrequencyData(data);
      const w = canvas.width;
      const h = canvas.height;
      cctx.clearRect(0, 0, w, h);
      const barWidth = (w / bufferLength) * 1.6;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (data[i] / 255) * h;
        cctx.fillStyle = `rgba(59,130,246,${0.4 + (data[i] / 255) * 0.6})`;
        cctx.fillRect(x, h - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
      rafRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const stopWave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  useEffect(() => () => stopWave(), []);

  const handleGenerate = async () => {
    if (description.trim().length < 3) {
      setError('Describe la música que quieres.');
      return;
    }
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setMeta(null);
    try {
      const res = await fetch('/api/generate/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, mood, duration }),
      });
      if (!res.ok) throw new Error('No se pudo generar la música. Intenta de nuevo.');
      const data = await res.json();
      setAudioUrl(data.audio);
      setMeta(data.metadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la música.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      ctxRef.current?.resume();
      a.play().then(() => { setPlaying(true); drawWave(); }).catch(() => undefined);
    } else {
      a.pause();
      setPlaying(false);
      stopWave();
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `musica-victor-ia-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <StudioModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Music Generator"
      icon={<Music size={18} />}
      footer={
        <>
          <button className="sm-btn" onClick={onClose} disabled={loading} style={{ flex: 1 }}>Cerrar</button>
          <button className="sm-btn primary" onClick={handleGenerate} disabled={loading} style={{ flex: 2 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Music size={16} />}
            {loading ? 'Componiendo…' : 'Generar música'}
          </button>
        </>
      }
    >
      {error && <div className="sm-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <label className="sm-label">Descripción</label>
        <textarea
          className="sm-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: track épico para intro de marca de lujo, tensión que crece…"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="sm-label">Mood</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`sm-chip ${mood === m.id ? 'active' : ''}`}
              onClick={() => setMood(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="sm-label">Duración: {duration}s</label>
        <input className="sm-range" type="range" min={10} max={180} step={5}
          value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
      </div>

      {audioUrl && (
        <div style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 12 }}>
          <canvas
            ref={canvasRef}
            width={560}
            height={80}
            style={{ width: '100%', height: 80, background: 'var(--bg1)', borderRadius: 8, marginBottom: 10 }}
          />
          <audio ref={audioRef} src={audioUrl} onEnded={() => { setPlaying(false); stopWave(); }} hidden />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="sm-btn" onClick={togglePlay} style={{ flex: 1 }}>
              {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? 'Pausar' : 'Reproducir'}
            </button>
            <button className="sm-btn primary" onClick={handleDownload} style={{ flex: 1 }}>
              <Download size={15} /> Descargar MP3
            </button>
          </div>
          {meta && (
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--t3)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span>Mood: {meta.mood}</span>
              <span>Dur: {meta.durationSec}s</span>
              <span>BPM: {meta.bpm}</span>
              <span>Key: {meta.key}</span>
            </div>
          )}
        </div>
      )}
    </StudioModalShell>
  );
}

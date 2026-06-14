'use client';

import { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Mic,
  Music,
  Mail,
  Presentation,
  FileText,
} from 'lucide-react';
import { useAnalytics, ANALYTICS_EVENTS } from '@/lib/hooks/useAnalytics';
import ImageGeneratorModal from '@/components/prospeccion/ImageGeneratorModal';
import VideoGeneratorModal from '@/components/prospeccion/VideoGeneratorModal';
import VoiceStudioModal from '@/components/modals/VoiceStudioModal';
import MusicGeneratorModal from '@/components/modals/MusicGeneratorModal';
import PresentationGeneratorModal from '@/components/modals/PresentationGeneratorModal';
import ProposalGeneratorModal from '@/components/modals/ProposalGeneratorModal';
import EmailGeneratorModal from '@/components/modals/EmailGeneratorModal';
import type { ImageGenerationParams, VideoGenerationParams } from '@/lib/prospeccion-types';

type ModalKey =
  | 'image'
  | 'video'
  | 'voice'
  | 'music'
  | 'presentation'
  | 'proposal'
  | 'email'
  | null;

interface GenItem {
  key: Exclude<ModalKey, null>;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const GROUPS: { group: string; items: GenItem[] }[] = [
  {
    group: 'Imágenes',
    items: [
      { key: 'image', icon: <ImageIcon size={22} />, title: 'Generar Imagen', desc: 'Imágenes 4K con IA' },
    ],
  },
  {
    group: 'Videos',
    items: [
      { key: 'video', icon: <Video size={22} />, title: 'Generar Video', desc: 'Video con VO, música y efectos' },
    ],
  },
  {
    group: 'Voz & Música',
    items: [
      { key: 'voice', icon: <Mic size={22} />, title: 'Voice Studio', desc: 'Voces MX/USA con ElevenLabs' },
      { key: 'music', icon: <Music size={22} />, title: 'Music Generator', desc: 'Pistas originales por mood' },
    ],
  },
  {
    group: 'Documentos & Presentaciones',
    items: [
      { key: 'email', icon: <Mail size={22} />, title: 'Email Generator', desc: 'Emails HTML luxury' },
      { key: 'presentation', icon: <Presentation size={22} />, title: 'Presentation Generator', desc: 'Slides con notas' },
      { key: 'proposal', icon: <FileText size={22} />, title: 'Proposal Generator', desc: 'Propuestas en PDF' },
    ],
  },
];

export default function GeneratorsPage() {
  const { track } = useAnalytics();
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  // image/video keep their dedicated handlers
  const [imageGenerating, setImageGenerating] = useState(false);
  const [videoGenerating, setVideoGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{ type: string; jobId?: string; url?: string } | null>(null);

  const open = (key: Exclude<ModalKey, null>) => {
    setImageError(null);
    setVideoError(null);
    setOpenModal(key);
  };
  const close = () => setOpenModal(null);

  const handleGenerateImage = async (params: ImageGenerationParams) => {
    setImageGenerating(true);
    setImageError(null);
    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('No se pudo generar la imagen.');
      const result = await response.json();
      setLastResult({ type: 'image', ...result });
      await track(ANALYTICS_EVENTS.GENERATOR_USED, { generatorType: 'images', jobId: result.jobId });
      close();
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Error al generar imagen');
    } finally {
      setImageGenerating(false);
    }
  };

  const handleGenerateVideo = async (params: VideoGenerationParams) => {
    setVideoGenerating(true);
    setVideoError(null);
    try {
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('No se pudo generar el video.');
      const result = await response.json();
      setLastResult({ type: 'video', ...result });
      await track(ANALYTICS_EVENTS.GENERATOR_USED, { generatorType: 'videos', jobId: result.jobId });
      close();
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : 'Error al generar video');
    } finally {
      setVideoGenerating(false);
    }
  };

  return (
    <div style={{ padding: 24, color: 'var(--p)' }}>
      <style>{`
        .gen-card {
          text-align:left; padding:20px; border:1px solid var(--b); border-radius:14px;
          background:var(--bg2); cursor:pointer; transition:all .15s; width:100%;
          display:flex; flex-direction:column; gap:10px;
        }
        .gen-card:hover { border-color:var(--blue); transform:translateY(-2px); }
        .gen-icon {
          width:44px; height:44px; border-radius:11px; background:var(--gd);
          display:flex; align-items:center; justify-content:center; color:var(--blue);
        }
        .gen-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
        .gen-group-title { font-size:13px; font-weight:700; color:var(--t2); text-transform:uppercase; letter-spacing:.05em; margin:24px 0 12px; }
      `}</style>

      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Generadores de Contenido</h1>
        <p style={{ color: 'var(--t2)', marginTop: 6, fontSize: 14 }}>
          Crea contenido profesional en minutos
        </p>
      </div>

      {GROUPS.map((g) => (
        <div key={g.group}>
          <div className="gen-group-title">{g.group}</div>
          <div className="gen-grid">
            {g.items.map((item) => (
              <button key={item.key} className="gen-card" onClick={() => open(item.key)}>
                <div className="gen-icon">{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--p)' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--t2)' }}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {lastResult && (
        <div style={{ marginTop: 32, padding: 20, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 14 }}>
          <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>
            ✅ {lastResult.type === 'image' ? 'Imagen' : 'Video'} en proceso
          </div>
          {lastResult.jobId && <div style={{ fontSize: 12, color: 'var(--t2)' }}>Job ID: {lastResult.jobId}</div>}
          {lastResult.url && (
            <a href={lastResult.url} target="_blank" rel="noopener noreferrer" className="sm-btn primary"
              style={{ display: 'inline-flex', marginTop: 10, textDecoration: 'none' }}>
              Ver resultado
            </a>
          )}
        </div>
      )}

      {/* Image / Video (existing modals) */}
      <ImageGeneratorModal
        isOpen={openModal === 'image'}
        onClose={close}
        onGenerate={handleGenerateImage}
        isGenerating={imageGenerating}
        error={imageError}
      />
      <VideoGeneratorModal
        isOpen={openModal === 'video'}
        onClose={close}
        onGenerate={handleGenerateVideo}
        isGenerating={videoGenerating}
        error={videoError}
      />

      {/* Voice & Music */}
      <VoiceStudioModal isOpen={openModal === 'voice'} onClose={close} />
      <MusicGeneratorModal isOpen={openModal === 'music'} onClose={close} />

      {/* Documents & Presentations */}
      <EmailGeneratorModal isOpen={openModal === 'email'} onClose={close} />
      <PresentationGeneratorModal isOpen={openModal === 'presentation'} onClose={close} />
      <ProposalGeneratorModal isOpen={openModal === 'proposal'} onClose={close} />
    </div>
  );
}

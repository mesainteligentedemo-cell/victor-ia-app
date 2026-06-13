'use client';

import React, { useState, useCallback } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface VideoConfig {
  preset: string;
  duration: string;
  aspect: string;
  motion: string;
  speed: string;
  smoothness: string;
  colorGrade: string;
  contrastLevel: string;
  saturation: string;
  brightness: string;
  audioType: string;
  audioVolume: string;
  socialNetworks: string[];
  effects: string[];
  features: string[];
  marketTrends: boolean;
}

interface ConfigureVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: VideoConfig) => void;
}

const PRESETS = [
  { id: 'cinema-studio', label: 'Cinema Studio 5.1', icon: '🎬' },
  { id: 'storyboard', label: 'Storyboard 2.0', icon: '📋' },
  { id: 'kling', label: 'Kling 2.0', icon: '⚡' },
  { id: 'veo', label: 'Veo 2.7', icon: '🎥' },
];

const DURATIONS = ['6s', '8s', '10s', '15s', '20s', '30s', 'Unlimited'];
const ASPECTS = ['16:9', '9:16', '1:1', '4:5', '21:9'];
const MOTIONS = ['Low', 'Medium', 'High', 'Very High'];
const SPEEDS = ['Slow (0.5x)', 'Normal (1x)', 'Fast (1.5x)', 'Ultra (2x)'];
const SMOOTHNESS_LEVELS = ['Low', 'Medium', 'High', 'Ultra'];
const COLOR_GRADES = ['Neutral', 'Warm', 'Cool', 'Cinematic', 'Vintage'];
const CONTRAST_LEVELS = ['Low', 'Medium', 'High', 'Very High'];
const AUDIO_TYPES = ['Voiceover', 'Music', 'Ambient', 'Mix', 'Silent'];
const AUDIO_VOLUMES = ['0%', '25%', '50%', '75%', '100%'];
const SOCIAL_NETWORKS = [
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'instagram', label: 'Instagram', icon: '📷' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'facebook', label: 'Facebook', icon: '👍' },
  { id: 'twitter', label: 'Twitter', icon: '𝕏' },
];
const EFFECTS = [
  'Documentario',
  'Cinematic',
  'Storytelling',
  'Motion Graphics',
  'Kinetic Typography',
  'Glitch Effect',
  'Film Grain',
  'Color Bloom',
  'Lens Flare',
  'Parallax',
];
const FEATURES = [
  'Transiciones',
  'VFX',
  'Color Grading',
  'Audio Sync',
  'Subtítulos',
  'Watermark',
  'Ken Burns',
  'Morphing',
];

export default function ConfigureVideoModal({
  isOpen,
  onClose,
  onGenerate,
}: ConfigureVideoModalProps) {
  const [config, setConfig] = useState<VideoConfig>({
    preset: 'cinema-studio',
    duration: '10s',
    aspect: '16:9',
    motion: 'Medium',
    speed: 'Normal (1x)',
    smoothness: 'High',
    colorGrade: 'Cinematic',
    contrastLevel: 'Medium',
    saturation: '100%',
    brightness: '100%',
    audioType: 'Mix',
    audioVolume: '100%',
    socialNetworks: ['youtube'],
    effects: ['Cinematic', 'Motion Graphics'],
    features: ['Transiciones', 'Color Grading', 'Subtítulos'],
    marketTrends: true,
  });

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    video: true,
    audio: false,
    effects: false,
  });

  const handleConfigChange = useCallback(
    (key: keyof VideoConfig, value: any) => {
      setConfig((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const toggleSocialNetwork = useCallback(
    (networkId: string) => {
      setConfig((prev) => ({
        ...prev,
        socialNetworks: prev.socialNetworks.includes(networkId)
          ? prev.socialNetworks.filter((id) => id !== networkId)
          : [...prev.socialNetworks, networkId],
      }));
    },
    []
  );

  const toggleEffect = useCallback(
    (effect: string) => {
      setConfig((prev) => ({
        ...prev,
        effects: prev.effects.includes(effect)
          ? prev.effects.filter((e) => e !== effect)
          : [...prev.effects, effect],
      }));
    },
    []
  );

  const toggleFeature = useCallback(
    (feature: string) => {
      setConfig((prev) => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      }));
    },
    []
  );

  const handleGenerate = () => {
    // Validación básica
    if (!config.preset) {
      alert('Por favor selecciona un preset');
      return;
    }
    if (!config.duration) {
      alert('Por favor selecciona una duración');
      return;
    }
    if (!config.aspect) {
      alert('Por favor selecciona un aspecto');
      return;
    }

    onGenerate(config);
    onClose();
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
      maxWidth: '600px',
      width: '90vw',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column' as const,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'slideUp 0.3s ease-out',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#fff',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#999',
      cursor: 'pointer',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      transition: 'all 0.2s',
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '20px 24px',
    },
    section: {
      marginBottom: '24px',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      padding: '12px',
      marginLeft: '-12px',
      marginRight: '-12px',
      borderRadius: '6px',
      transition: 'background 0.2s',
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#999',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    sectionContent: {
      marginTop: '12px',
    },
    label: {
      fontSize: '13px',
      fontWeight: 500,
      color: '#ccc',
      marginBottom: '8px',
      display: 'block',
    },
    buttonGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '8px',
      marginBottom: '16px',
    },
    button: (isSelected: boolean) => ({
      padding: '10px 12px',
      borderRadius: '6px',
      border: isSelected
        ? '2px solid #00d9ff'
        : '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: isSelected ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
      color: isSelected ? '#00d9ff' : '#aaa',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 500,
      transition: 'all 0.2s',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    presetButton: (isSelected: boolean) => ({
      padding: '16px 12px',
      borderRadius: '8px',
      border: isSelected
        ? '2px solid #00d9ff'
        : '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: isSelected
        ? 'rgba(0, 217, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.05)',
      color: isSelected ? '#00d9ff' : '#bbb',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 500,
      transition: 'all 0.2s',
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '8px',
    }),
    presetIcon: {
      fontSize: '24px',
    },
    sliderGroup: {
      marginBottom: '16px',
    },
    sliderLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '12px',
      color: '#aaa',
    },
    slider: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      background: 'linear-gradient(to right, #333, #555)',
      outline: 'none',
      WebkitAppearance: 'none',
      appearance: 'none',
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      cursor: 'pointer',
    },
    checkboxInput: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#00d9ff',
    },
    checkboxLabel: {
      color: '#bbb',
      cursor: 'pointer',
      fontSize: '13px',
    },
    tagGroup: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px',
    },
    tag: (isSelected: boolean) => ({
      padding: '8px 12px',
      borderRadius: '20px',
      border: isSelected
        ? '2px solid #00d9ff'
        : '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: isSelected
        ? 'rgba(0, 217, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.05)',
      color: isSelected ? '#00d9ff' : '#aaa',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 500,
      transition: 'all 0.2s',
    }),
    description: {
      fontSize: '12px',
      color: '#888',
      lineHeight: '1.5',
      marginBottom: '16px',
    },
    durationPreview: {
      padding: '12px',
      backgroundColor: 'rgba(0, 217, 255, 0.05)',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#00d9ff',
      marginBottom: '16px',
    },
    footer: {
      padding: '20px 24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      gap: '12px',
    },
    generateButton: {
      flex: 1,
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#00d9ff',
      color: '#000',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    cancelButton: {
      padding: '12px 24px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'transparent',
      color: '#aaa',
      fontWeight: 500,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  };

  const durationSeconds: { [key: string]: number } = {
    '6s': 6,
    '8s': 8,
    '10s': 10,
    '15s': 15,
    '20s': 20,
    '30s': 30,
    Unlimited: 0,
  };

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            cursor: pointer;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #00d9ff;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #00d9ff;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
          }

          input[type="range"]:hover {
            box-shadow: 0 0 0 6px rgba(0, 217, 255, 0.1);
            border-radius: 3px;
          }

          button:hover {
            transform: translateY(-2px);
          }

          @media (max-width: 640px) {
            ${Object.entries(styles)
              .filter(([key]) => key.includes('Grid'))
              .map(([key]) => `${key} { grid-template-columns: repeat(2, 1fr) !important; }`)
              .join('\n')}
          }
        `}
      </style>

      <div style={styles.overlay} onClick={onClose}>
        <div
          style={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Configurar video</h2>
            <button
              style={styles.closeButton}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#999';
              }}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={styles.content}>
            {/* Descripción */}
            <div style={styles.section}>
              <p style={styles.description}>
                Genera un vídeo corto para redes sociales con configuración
                personalizada. Selecciona un preset y ajusta los parámetros
                según tus necesidades.
              </p>
            </div>

            {/* Presets */}
            <div style={styles.section}>
              <label style={styles.label}>Presets</label>
              <div
                style={{
                  ...styles.buttonGroup,
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(140px, 1fr))',
                }}
              >
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    style={styles.presetButton(config.preset === preset.id)}
                    onClick={() => handleConfigChange('preset', preset.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = config.preset ===
                        preset.id
                        ? 'rgba(0, 217, 255, 0.15)'
                        : 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = config.preset ===
                        preset.id
                        ? 'rgba(0, 217, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <span style={styles.presetIcon}>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duración */}
            <div style={styles.section}>
              <label style={styles.label}>Duración</label>
              <div style={styles.buttonGroup}>
                {DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    style={styles.button(config.duration === duration)}
                    onClick={() => handleConfigChange('duration', duration)}
                    onMouseEnter={(e) => {
                      const button = e.currentTarget;
                      if (config.duration === duration) {
                        button.style.borderColor = '#00d9ff';
                        button.style.boxShadow =
                          '0 0 12px rgba(0, 217, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const button = e.currentTarget;
                      if (config.duration === duration) {
                        button.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {duration}
                  </button>
                ))}
              </div>
              {config.duration !== 'Unlimited' && (
                <div style={styles.durationPreview}>
                  {durationSeconds[config.duration]} segundos de contenido
                </div>
              )}
            </div>

            {/* Aspecto */}
            <div style={styles.section}>
              <label style={styles.label}>Aspecto</label>
              <div
                style={{
                  ...styles.buttonGroup,
                  gridTemplateColumns: 'repeat(5, 1fr)',
                }}
              >
                {ASPECTS.map((aspect) => (
                  <button
                    key={aspect}
                    style={styles.button(config.aspect === aspect)}
                    onClick={() => handleConfigChange('aspect', aspect)}
                    onMouseEnter={(e) => {
                      if (config.aspect === aspect) {
                        e.currentTarget.style.boxShadow =
                          '0 0 12px rgba(0, 217, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (config.aspect === aspect) {
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {aspect}
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración Video */}
            <div style={styles.section}>
              <div
                style={{
                  ...styles.sectionHeader,
                  backgroundColor: expandedSections.video
                    ? 'rgba(0, 217, 255, 0.05)'
                    : 'transparent',
                }}
                onClick={() => toggleSection('video')}
              >
                <h3 style={styles.sectionTitle}>Configuración Video</h3>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedSections.video
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    marginLeft: 'auto',
                    color: '#00d9ff',
                  }}
                />
              </div>

              {expandedSections.video && (
                <div style={styles.sectionContent}>
                  {/* Motion */}
                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Movimiento</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(4, 1fr)',
                      }}
                    >
                      {MOTIONS.map((motion) => (
                        <button
                          key={motion}
                          style={styles.button(config.motion === motion)}
                          onClick={() =>
                            handleConfigChange('motion', motion)
                          }
                        >
                          {motion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed */}
                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Velocidad</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(2, 1fr)',
                      }}
                    >
                      {SPEEDS.map((speed) => (
                        <button
                          key={speed}
                          style={styles.button(config.speed === speed)}
                          onClick={() => handleConfigChange('speed', speed)}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoothness */}
                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Suavidad</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(4, 1fr)',
                      }}
                    >
                      {SMOOTHNESS_LEVELS.map((level) => (
                        <button
                          key={level}
                          style={styles.button(config.smoothness === level)}
                          onClick={() =>
                            handleConfigChange('smoothness', level)
                          }
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Grade */}
                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Grado de Color</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      }}
                    >
                      {COLOR_GRADES.map((grade) => (
                        <button
                          key={grade}
                          style={styles.button(config.colorGrade === grade)}
                          onClick={() =>
                            handleConfigChange('colorGrade', grade)
                          }
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast */}
                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Contraste</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(4, 1fr)',
                      }}
                    >
                      {CONTRAST_LEVELS.map((level) => (
                        <button
                          key={level}
                          style={styles.button(
                            config.contrastLevel === level
                          )}
                          onClick={() =>
                            handleConfigChange('contrastLevel', level)
                          }
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saturation Slider */}
                  <div style={styles.sliderGroup}>
                    <div style={styles.sliderLabel}>
                      <span>Saturación</span>
                      <span style={{ color: '#00d9ff' }}>
                        {config.saturation}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={parseInt(config.saturation)}
                      onChange={(e) =>
                        handleConfigChange('saturation', `${e.target.value}%`)
                      }
                      style={{
                        ...styles.slider,
                        width: '100%',
                      }}
                    />
                  </div>

                  {/* Brightness Slider */}
                  <div style={styles.sliderGroup}>
                    <div style={styles.sliderLabel}>
                      <span>Brillo</span>
                      <span style={{ color: '#00d9ff' }}>
                        {config.brightness}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={parseInt(config.brightness)}
                      onChange={(e) =>
                        handleConfigChange('brightness', `${e.target.value}%`)
                      }
                      style={{
                        ...styles.slider,
                        width: '100%',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Configuración Audio */}
            <div style={styles.section}>
              <div
                style={{
                  ...styles.sectionHeader,
                  backgroundColor: expandedSections.audio
                    ? 'rgba(0, 217, 255, 0.05)'
                    : 'transparent',
                }}
                onClick={() => toggleSection('audio')}
              >
                <h3 style={styles.sectionTitle}>Configuración Audio</h3>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedSections.audio
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    marginLeft: 'auto',
                    color: '#00d9ff',
                  }}
                />
              </div>

              {expandedSections.audio && (
                <div style={styles.sectionContent}>
                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Tipo de Audio</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      }}
                    >
                      {AUDIO_TYPES.map((type) => (
                        <button
                          key={type}
                          style={styles.button(config.audioType === type)}
                          onClick={() =>
                            handleConfigChange('audioType', type)
                          }
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.sliderGroup}>
                    <label style={styles.label}>Volumen</label>
                    <div
                      style={{
                        ...styles.buttonGroup,
                        gridTemplateColumns: 'repeat(5, 1fr)',
                      }}
                    >
                      {AUDIO_VOLUMES.map((volume) => (
                        <button
                          key={volume}
                          style={styles.button(config.audioVolume === volume)}
                          onClick={() =>
                            handleConfigChange('audioVolume', volume)
                          }
                        >
                          {volume}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Redes Sociales */}
            <div style={styles.section}>
              <label style={styles.label}>Optimizar para Redes Sociales</label>
              <div style={styles.tagGroup}>
                {SOCIAL_NETWORKS.map((network) => (
                  <button
                    key={network.id}
                    style={styles.tag(config.socialNetworks.includes(network.id))}
                    onClick={() => toggleSocialNetwork(network.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span>{network.icon}</span>
                    <span>{network.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Efectos */}
            <div style={styles.section}>
              <div
                style={{
                  ...styles.sectionHeader,
                  backgroundColor: expandedSections.effects
                    ? 'rgba(0, 217, 255, 0.05)'
                    : 'transparent',
                }}
                onClick={() => toggleSection('effects')}
              >
                <h3 style={styles.sectionTitle}>Efectos</h3>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedSections.effects
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    marginLeft: 'auto',
                    color: '#00d9ff',
                  }}
                />
              </div>

              {expandedSections.effects && (
                <div style={styles.sectionContent}>
                  <div style={styles.tagGroup}>
                    {EFFECTS.map((effect) => (
                      <button
                        key={effect}
                        style={styles.tag(config.effects.includes(effect))}
                        onClick={() => toggleEffect(effect)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Características */}
            <div style={styles.section}>
              <label style={styles.label}>Características</label>
              <div style={styles.tagGroup}>
                {FEATURES.map((feature) => (
                  <button
                    key={feature}
                    style={styles.tag(config.features.includes(feature))}
                    onClick={() => toggleFeature(feature)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <div style={styles.section}>
              <div style={styles.checkbox}>
                <input
                  type="checkbox"
                  id="trends"
                  checked={config.marketTrends}
                  onChange={(e) =>
                    handleConfigChange('marketTrends', e.target.checked)
                  }
                  style={styles.checkboxInput}
                />
                <label htmlFor="trends" style={styles.checkboxLabel}>
                  Analizar tendencias del mercado
                </label>
              </div>
              {config.marketTrends && (
                <p style={styles.description}>
                  Se analizarán tendencias actuales en tu nicho para optimizar
                  el video.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button
              style={styles.cancelButton}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.color = '#ccc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#aaa';
              }}
            >
              Cancelar
            </button>
            <button
              style={styles.generateButton}
              onClick={handleGenerate}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00e6ff';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00d9ff';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Generar video
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface ConfigureImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: ImageConfig) => void;
}

interface ImageConfig {
  size: string;
  width: number;
  materials: string[];
  colors: {
    r: number;
    g: number;
    b: number;
    hex: string;
  };
  styles: string[];
  advancedOptions: {
    [key: string]: boolean;
  };
  socialPlatforms: {
    [key: string]: boolean;
  };
  formats: string[];
}

const ASPECT_RATIOS = [
  { label: '5:3', value: '5-3' },
  { label: '16:9', value: '16-9' },
  { label: '1:1', value: '1-1' },
  { label: '4:3', value: '4-3' },
  { label: '7:5', value: '7-5' },
  { label: '21:9', value: '21-9' },
  { label: '2:1', value: '2-1' },
];

const MATERIALS = ['Tech', 'Dark Mode', 'Foto Real'];

const STYLES = [
  'Audio',
  'Nano Genomic Pro',
  'Blur 2.0',
  'Blur Cinema',
  'GPI Image 2',
];

const ADVANCED_OPTIONS = [
  'Auto-adjust contrast',
  'Enhanced saturation',
  'Noise reduction',
  'Smart compression',
  'HDR simulation',
];

const SOCIAL_PLATFORMS = ['Facebook', 'LinkedIn', 'TikTok', 'Twitter', 'YouTube'];

const FORMATS = [
  'Post',
  'Carousel',
  'Story',
  'Reel',
  'Poster',
  'Flyer',
  'Mockup',
  'Merch',
];

const ConfigureImageModal: React.FC<ConfigureImageModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('16-9');
  const [width, setWidth] = useState<number>(1200);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Tech']);
  const [colors, setColors] = useState({
    r: 100,
    g: 150,
    b: 200,
    hex: '#6496C8',
  });
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['GPI Image 2']);
  const [advancedOptions, setAdvancedOptions] = useState<{
    [key: string]: boolean;
  }>({
    'Auto-adjust contrast': false,
    'Enhanced saturation': false,
    'Noise reduction': false,
    'Smart compression': false,
    'HDR simulation': false,
  });
  const [socialPlatforms, setSocialPlatforms] = useState<{
    [key: string]: boolean;
  }>({
    Facebook: false,
    LinkedIn: false,
    TikTok: false,
    Twitter: false,
    YouTube: false,
  });
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['Post']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar entrada de ancho
  const handleWidthChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setErrors((prev) => ({
        ...prev,
        width: 'Debe ser un número válido',
      }));
      setWidth(0);
      return;
    }
    if (num < 100 || num > 4000) {
      setErrors((prev) => ({
        ...prev,
        width: 'El ancho debe estar entre 100 y 4000px',
      }));
      return;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.width;
      return newErrors;
    });
    setWidth(num);
  };

  // Manejar cambios de slider de ancho
  const handleWidthSliderChange = (value: string) => {
    const num = parseInt(value, 10);
    setWidth(num);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.width;
      return newErrors;
    });
  };

  // Convertir RGB a HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  // Convertir HEX a RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Manejar cambios de color RGB
  const handleColorChange = (component: 'r' | 'g' | 'b', value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      setErrors((prev) => ({
        ...prev,
        [`color_${component}`]: 'Debe estar entre 0 y 255',
      }));
      return;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`color_${component}`];
      return newErrors;
    });

    const newColors = { ...colors, [component]: num };
    const hex = rgbToHex(newColors.r, newColors.g, newColors.b);
    setColors({ ...newColors, hex });
  };

  // Manejar cambios de color HEX
  const handleHexChange = (value: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(value)) {
      setErrors((prev) => ({
        ...prev,
        hex: 'Formato inválido. Use #RRGGBB',
      }));
      return;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.hex;
      return newErrors;
    });

    const rgb = hexToRgb(value);
    if (rgb) {
      setColors({ ...rgb, hex: value });
    }
  };

  // Toggle de materiales
  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  // Toggle de estilos
  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  // Toggle de opciones avanzadas
  const toggleAdvancedOption = (option: string) => {
    setAdvancedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // Toggle de plataformas sociales
  const toggleSocialPlatform = (platform: string) => {
    setSocialPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  // Toggle de formatos
  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  // Validar y generar
  const handleGenerateClick = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (width < 100 || width > 4000) {
      newErrors.width = 'Ancho inválido';
    }

    if (selectedMaterials.length === 0) {
      newErrors.materials = 'Selecciona al menos un material';
    }

    if (selectedStyles.length === 0) {
      newErrors.styles = 'Selecciona al menos un estilo';
    }

    if (selectedFormats.length === 0) {
      newErrors.formats = 'Selecciona al menos un formato';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const config: ImageConfig = {
        size: selectedSize,
        width,
        materials: selectedMaterials,
        colors,
        styles: selectedStyles,
        advancedOptions,
        socialPlatforms,
        formats: selectedFormats,
      };
      onGenerate(config);
    }
  }, [
    selectedSize,
    width,
    selectedMaterials,
    colors,
    selectedStyles,
    advancedOptions,
    socialPlatforms,
    selectedFormats,
    onGenerate,
  ]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflowY: 'auto',
        paddingTop: '20px',
        paddingBottom: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid #eee',
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            zIndex: 10,
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000',
              margin: 0,
            }}
          >
            Configurar imagen
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = '#000';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color = '#666';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Descripción */}
          <div>
            <p
              style={{
                color: '#666',
                fontSize: '14px',
                margin: '0 0 12px 0',
                lineHeight: '1.5',
              }}
            >
              Genera una imagen para tus campañas de marketing, redes sociales y más.
              Personaliza cada aspecto según tus necesidades.
            </p>
          </div>

          {/* Tamaños de Aspecto */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Tamaño de Aspecto
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '10px',
              }}
            >
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setSelectedSize(ratio.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: selectedSize === ratio.value ? '2px solid #2563eb' : '1px solid #ddd',
                    backgroundColor: selectedSize === ratio.value ? '#eff6ff' : '#f9f9f9',
                    color: selectedSize === ratio.value ? '#2563eb' : '#666',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (selectedSize !== ratio.value) {
                      btn.style.borderColor = '#bbb';
                      btn.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (selectedSize !== ratio.value) {
                      btn.style.borderColor = '#ddd';
                      btn.style.backgroundColor = '#f9f9f9';
                    }
                  }}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </section>

          {/* Ancho */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Ancho (px)
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  value={width}
                  onChange={(e) => handleWidthSliderChange(e.target.value)}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '4px',
                    background: 'linear-gradient(to right, #2563eb 0%, #2563eb ' + ((width - 100) / 39) + '%, #e5e7eb ' + ((width - 100) / 39) + '%, #e5e7eb 100%)',
                    outline: 'none',
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  } as React.CSSProperties}
                />
                <style>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                `}</style>
              </div>
              <div style={{ width: '100px' }}>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: errors.width ? '1px solid #dc2626' : '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            {errors.width && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.width}
              </p>
            )}
          </section>

          {/* Materiales */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              De Materia
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {MATERIALS.map((material) => (
                <button
                  key={material}
                  onClick={() => toggleMaterial(material)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: selectedMaterials.includes(material)
                      ? '2px solid #2563eb'
                      : '1px solid #ddd',
                    backgroundColor: selectedMaterials.includes(material) ? '#eff6ff' : '#f9f9f9',
                    color: selectedMaterials.includes(material) ? '#2563eb' : '#666',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (!selectedMaterials.includes(material)) {
                      btn.style.borderColor = '#bbb';
                      btn.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (!selectedMaterials.includes(material)) {
                      btn.style.borderColor = '#ddd';
                      btn.style.backgroundColor = '#f9f9f9';
                    }
                  }}
                >
                  {material}
                </button>
              ))}
            </div>
            {errors.materials && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.materials}
              </p>
            )}
          </section>

          {/* Colores */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Colores
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '6px',
                  }}
                >
                  Rojo (R)
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={colors.r}
                  onChange={(e) => handleColorChange('r', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: errors.color_r ? '1px solid #dc2626' : '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '6px',
                  }}
                >
                  Verde (G)
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={colors.g}
                  onChange={(e) => handleColorChange('g', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: errors.color_g ? '1px solid #dc2626' : '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '6px',
                  }}
                >
                  Azul (B)
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={colors.b}
                  onChange={(e) => handleColorChange('b', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: errors.color_b ? '1px solid #dc2626' : '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '6px',
                  }}
                >
                  HEX
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={colors.hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: errors.hex ? '1px solid #dc2626' : '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'monospace',
                    }}
                  />
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      backgroundColor: colors.hex,
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
              </div>
            </div>
            {(errors.color_r || errors.color_g || errors.color_b || errors.hex) && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.color_r || errors.color_g || errors.color_b || errors.hex}
              </p>
            )}
          </section>

          {/* Estilos */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Estilos
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: selectedStyles.includes(style)
                      ? '2px solid #2563eb'
                      : '1px solid #ddd',
                    backgroundColor: selectedStyles.includes(style) ? '#eff6ff' : '#f9f9f9',
                    color: selectedStyles.includes(style) ? '#2563eb' : '#666',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (!selectedStyles.includes(style)) {
                      btn.style.borderColor = '#bbb';
                      btn.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (!selectedStyles.includes(style)) {
                      btn.style.borderColor = '#ddd';
                      btn.style.backgroundColor = '#f9f9f9';
                    }
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
            {errors.styles && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.styles}
              </p>
            )}
          </section>

          {/* Opciones Avanzadas */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Opciones Avanzadas
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ADVANCED_OPTIONS.map((option) => (
                <label
                  key={option}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLLabelElement).style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLLabelElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={advancedOptions[option]}
                    onChange={() => toggleAdvancedOption(option)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#2563eb',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#333' }}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Redes Sociales */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Redes Sociales
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {SOCIAL_PLATFORMS.map((platform) => (
                <label
                  key={platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: socialPlatforms[platform] ? '2px solid #2563eb' : '1px solid #ddd',
                    backgroundColor: socialPlatforms[platform] ? '#eff6ff' : '#f9f9f9',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const lbl = e.currentTarget as HTMLLabelElement;
                    if (!socialPlatforms[platform]) {
                      lbl.style.borderColor = '#bbb';
                      lbl.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const lbl = e.currentTarget as HTMLLabelElement;
                    if (!socialPlatforms[platform]) {
                      lbl.style.borderColor = '#ddd';
                      lbl.style.backgroundColor = '#f9f9f9';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={socialPlatforms[platform]}
                    onChange={() => toggleSocialPlatform(platform)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#2563eb',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: socialPlatforms[platform] ? '#2563eb' : '#666' }}>
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Formatos */}
          <section>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px',
              }}
            >
              Formatos
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
              {FORMATS.map((format) => (
                <button
                  key={format}
                  onClick={() => toggleFormat(format)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: selectedFormats.includes(format)
                      ? '2px solid #2563eb'
                      : '1px solid #ddd',
                    backgroundColor: selectedFormats.includes(format) ? '#eff6ff' : '#f9f9f9',
                    color: selectedFormats.includes(format) ? '#2563eb' : '#666',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (!selectedFormats.includes(format)) {
                      btn.style.borderColor = '#bbb';
                      btn.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    if (!selectedFormats.includes(format)) {
                      btn.style.borderColor = '#ddd';
                      btn.style.backgroundColor = '#f9f9f9';
                    }
                  }}
                >
                  {format}
                </button>
              ))}
            </div>
            {errors.formats && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.formats}
              </p>
            )}
          </section>

          {/* Botones de Acción */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '12px',
              borderTop: '1px solid #eee',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#fff';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateClick}
              style={{
                padding: '10px 32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
              }}
            >
              Generar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureImageModal;

'use client';

import { useState } from 'react';
import { Search, Download, Heart, Grid3x3, Eye } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'web';
  thumbnail: string;
  size: string;
  date: string;
  isFavorite: boolean;
}

const SAMPLE_ASSETS: Asset[] = [
  { id: '1', name: 'Hero Banner Costa Negra', type: 'image', thumbnail: '🖼️', size: '2.4MB', date: '2026-06-10', isFavorite: true },
  { id: '2', name: 'Presentación Q2 Victor IA', type: 'video', thumbnail: '🎬', size: '145MB', date: '2026-06-09', isFavorite: false },
  { id: '3', name: 'Background Music - Luxury', type: 'audio', thumbnail: '🎵', size: '8.2MB', date: '2026-06-08', isFavorite: true },
  { id: '4', name: 'Propuesta Comercial Template', type: 'document', thumbnail: '📄', size: '1.1MB', date: '2026-06-07', isFavorite: false },
  { id: '5', name: 'Victor IA Landing Page', type: 'web', thumbnail: '🌐', size: 'N/A', date: '2026-06-06', isFavorite: false },
  { id: '6', name: 'Seabird Resort Banner', type: 'image', thumbnail: '🖼️', size: '3.2MB', date: '2026-06-05', isFavorite: true },
  { id: '7', name: 'Product Demo Video', type: 'video', thumbnail: '🎬', size: '89MB', date: '2026-06-04', isFavorite: false },
  { id: '8', name: 'Brand Guidelines Audio', type: 'audio', thumbnail: '🎵', size: '5.6MB', date: '2026-06-03', isFavorite: false },
];

export default function LibraryPage() {
  const [assets, setAssets] = useState(SAMPLE_ASSETS);
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const typeEmoji = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    document: '📄',
    web: '🌐',
  };

  const tabs = [
    { id: 'todos', label: 'Todos', count: assets.length },
    { id: 'images', label: 'Imágenes', count: assets.filter((a) => a.type === 'image').length },
    { id: 'videos', label: 'Videos', count: assets.filter((a) => a.type === 'video').length },
    { id: 'audio', label: 'Audio', count: assets.filter((a) => a.type === 'audio').length },
    { id: 'documents', label: 'Documentos', count: assets.filter((a) => a.type === 'document').length },
    { id: 'favorites', label: '♥ Favoritos', count: assets.filter((a) => a.isFavorite).length },
  ];

  const getFilteredAssets = () => {
    let filtered = assets;

    if (activeTab === 'images') filtered = filtered.filter((a) => a.type === 'image');
    else if (activeTab === 'videos') filtered = filtered.filter((a) => a.type === 'video');
    else if (activeTab === 'audio') filtered = filtered.filter((a) => a.type === 'audio');
    else if (activeTab === 'documents') filtered = filtered.filter((a) => a.type === 'document');
    else if (activeTab === 'favorites') filtered = filtered.filter((a) => a.isFavorite);

    if (searchTerm) {
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return filtered;
  };

  const filtered = getFilteredAssets();

  const toggleFavorite = (id: string) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, isFavorite: !a.isFavorite } : a)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Biblioteca</h1>
        <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
          {assets.length} assets · {assets.reduce((sum, a) => sum + (a.size !== 'N/A' ? parseInt(a.size) : 0), 0).toFixed(1)}GB total
        </p>
      </div>

      {/* Search & View Mode */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }} />
          <input
            type="text"
            placeholder="Buscar assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: '8px',
              color: 'var(--t1)',
              fontSize: '13px',
            }}
          />
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          style={{
            padding: '8px 12px',
            background: 'var(--bg2)',
            border: '1px solid var(--b)',
            borderRadius: '8px',
            color: 'var(--t2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Grid3x3 size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--b)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 12px',
              background: activeTab === tab.id ? 'var(--blue)' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--t2)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--b)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label} <span style={{ fontSize: '10px', opacity: 0.7 }}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {filtered.map((asset) => (
            <div
              key={asset.id}
              style={{
                padding: '12px',
                background: 'var(--bg2)',
                border: '1px solid var(--b)',
                borderRadius: 'var(--r)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--blue)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--b)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'var(--bg3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                }}
              >
                {asset.thumbnail}
              </div>

              {/* Info */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {asset.name}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--t3)' }}>{asset.size}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: 'transparent',
                    border: '1px solid var(--b)',
                    borderRadius: '6px',
                    color: 'var(--t2)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <Eye size={12} /> Ver
                </button>
                <button
                  onClick={() => toggleFavorite(asset.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: '6px 8px',
                    background: 'transparent',
                    border: '1px solid var(--b)',
                    borderRadius: '6px',
                    color: asset.isFavorite ? 'var(--red)' : 'var(--t2)',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {asset.isFavorite ? '♥' : '♡'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((asset) => (
            <div
              key={asset.id}
              style={{
                padding: '12px',
                background: 'var(--bg2)',
                border: '1px solid var(--b)',
                borderRadius: 'var(--r)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '24px' }}>{asset.thumbnail}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700 }}>{asset.name}</h3>
                <p style={{ fontSize: '11px', color: 'var(--t3)' }}>{asset.size} · {asset.date}</p>
              </div>
              <button
                style={{
                  padding: '6px 12px',
                  background: 'var(--blue)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Usar
              </button>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t3)' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>No se encontraron assets</p>
          <p style={{ fontSize: '12px' }}>Intenta otro término de búsqueda o tab</p>
        </div>
      )}

      {/* Preview Modal */}
      {selectedAsset && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelectedAsset(null)}
        >
          <div style={{ fontSize: '80px' }}>{selectedAsset.thumbnail}</div>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#FFFFFF' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{selectedAsset.name}</h2>
            <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{selectedAsset.size} · {selectedAsset.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
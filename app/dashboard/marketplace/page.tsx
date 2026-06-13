'use client';

import { useState } from 'react';
import { Search, Star, Download, Eye, Heart, TrendingUp, Filter, Plus } from 'lucide-react';

const PROMPT_TEMPLATES = [
  {
    id: 'tmpl_1',
    name: 'LinkedIn B2B Copy Formula',
    category: 'Copywriting',
    author: 'Sarah Johnson',
    rating: 4.9,
    reviews: 284,
    downloads: 1240,
    trend: '+45%',
    description: 'Proven formula for professional LinkedIn posts with high engagement',
    version: '2.3',
    tags: ['linkedin', 'b2b', 'engagement', 'professional'],
    successRate: 0.96,
    price: 0,
  },
  {
    id: 'tmpl_2',
    name: 'E-commerce Product Photography Prompt',
    category: 'Design',
    author: 'Alex Chen',
    rating: 4.8,
    reviews: 156,
    downloads: 892,
    trend: '+28%',
    description: 'Professional product photo prompt with lighting, composition, and styling',
    version: '1.9',
    tags: ['product', 'photography', 'ecommerce', 'design'],
    successRate: 0.92,
    price: 0,
  },
  {
    id: 'tmpl_3',
    name: 'YouTube Short Hook Generator',
    category: 'Content',
    author: 'Marcus Rodriguez',
    rating: 4.7,
    reviews: 198,
    downloads: 756,
    trend: '+52%',
    description: 'Generates scroll-stopping hooks for YouTube Shorts with proven psychology',
    version: '2.1',
    tags: ['youtube', 'shorts', 'hook', 'viral'],
    successRate: 0.88,
    price: 0,
  },
  {
    id: 'tmpl_4',
    name: 'Newsletter Opening Lines [Premium]',
    category: 'Email',
    author: 'Jessica Li',
    rating: 4.9,
    reviews: 412,
    downloads: 2340,
    trend: '+67%',
    description: 'Premium collection: 20 opening formulas that increase click-through rate 34%',
    version: '3.0',
    tags: ['email', 'newsletter', 'conversion', 'premium'],
    successRate: 0.97,
    price: 9.99,
  },
  {
    id: 'tmpl_5',
    name: 'Twitter Thread Storytelling',
    category: 'Social',
    author: 'David Kim',
    rating: 4.6,
    reviews: 87,
    downloads: 423,
    trend: '+18%',
    description: 'Structure your thoughts into compelling Twitter threads that convert',
    version: '1.5',
    tags: ['twitter', 'storytelling', 'viral', 'engagement'],
    successRate: 0.84,
    price: 0,
  },
  {
    id: 'tmpl_6',
    name: 'Blog Post SEO Blueprint',
    category: 'SEO',
    author: 'Emily Zhang',
    rating: 4.8,
    reviews: 321,
    downloads: 1890,
    trend: '+34%',
    description: 'Complete SEO-optimized blog structure with keyword targeting and schema',
    version: '2.4',
    tags: ['blog', 'seo', 'content', 'optimization'],
    successRate: 0.91,
    price: 0,
  },
];

const CATEGORIES = [
  { name: 'All', count: PROMPT_TEMPLATES.length },
  { name: 'Copywriting', count: 1 },
  { name: 'Design', count: 1 },
  { name: 'Content', count: 1 },
  { name: 'Email', count: 1 },
  { name: 'Social', count: 1 },
  { name: 'SEO', count: 1 },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'rating' | 'downloads' | 'newest'>('trending');
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROMPT_TEMPLATES[0] | null>(null);

  const filtered = PROMPT_TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'newest':
        return 0;
      case 'trending':
      default:
        return parseInt(b.trend) - parseInt(a.trend);
    }
  });

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .search-box {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 10px 16px;
          border: 1px solid var(--b);
          border-radius: 8px;
          background: var(--bg2);
          color: var(--p);
          font-size: 14px;
        }
        .category-btn {
          padding: 8px 16px;
          border: 1px solid var(--b);
          background: var(--bg2);
          color: var(--p);
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .category-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }
        .template-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .template-card:hover {
          border-color: #000;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .template-card.premium {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        .rating-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.08);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .trend-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .btn {
          background: var(--bg3);
          border: 1px solid var(--b);
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          color: var(--p);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn:hover {
          border-color: #000;
        }
        .btn.primary {
          background: #000;
          color: white;
          border-color: #000;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal {
          background: var(--bg);
          border: 1px solid var(--b);
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Marketplace de Prompts</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Descubre y comparte templates de prompts de alta efectividad</p>
        </div>
        <button className="btn primary" onClick={() => setShowNewTemplate(true)}>
          <Plus size={16} /> Crear Template
        </button>
      </div>

      {/* Search & Filter */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar templates por nombre o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          style={{ flex: 1 }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="search-input"
          style={{ flex: 0.2, minWidth: '120px' }}
        >
          <option value="trending">Trending</option>
          <option value="rating">Rating</option>
          <option value="downloads">Downloads</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Total Templates</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700 }}>{PROMPT_TEMPLATES.length}</p>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Total Downloads</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700 }}>
            {(PROMPT_TEMPLATES.reduce((sum, t) => sum + t.downloads, 0) / 1000).toFixed(1)}K
          </p>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Avg Rating</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700 }}>
            {(PROMPT_TEMPLATES.reduce((sum, t) => sum + t.rating, 0) / PROMPT_TEMPLATES.length).toFixed(1)} ⭐
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {sorted.map((template) => (
          <div key={template.id} className={`template-card ${template.price > 0 ? 'premium' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{template.name}</h3>
                {template.price > 0 && (
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>
                    💎 PREMIUM - ${template.price.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="trend-badge">{template.trend}</span>
            </div>

            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--t2)', lineHeight: '1.5' }}>
              {template.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{
                  background: 'rgba(0,0,0,0.08)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: 'var(--t2)',
                }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px' }}>
              <div className="rating-badge">
                <Star size={12} fill="#fbbf24" color="#fbbf24" />
                {template.rating} ({template.reviews})
              </div>
              <span style={{ color: 'var(--t3)' }}>
                ⬇️ {(template.downloads / 1000).toFixed(1)}K downloads
              </span>
            </div>

            {/* Author & Version */}
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--b)' }}>
              <p style={{ margin: 0 }}>Por {template.author}</p>
              <p style={{ margin: '2px 0 0 0' }}>v{template.version} • {template.successRate * 100}% éxito</p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn primary" style={{ flex: 1 }} onClick={() => setSelectedTemplate(template)}>
                <Download size={12} /> Usar
              </button>
              <button className="btn">
                <Heart size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Template Details */}
      {selectedTemplate && (
        <div className="modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{selectedTemplate.name}</h2>
                {selectedTemplate.price > 0 && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#f59e0b', fontWeight: 600 }}>
                    💎 ${selectedTemplate.price.toFixed(2)}
                  </p>
                )}
              </div>
              <button
                className="btn"
                onClick={() => setSelectedTemplate(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'var(--bg2)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{selectedTemplate.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--t2)', fontWeight: 600 }}>Rating</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 700 }}>{selectedTemplate.rating} ⭐</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--t2)', fontWeight: 600 }}>Success Rate</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 700 }}>{(selectedTemplate.successRate * 100).toFixed(0)}%</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--t2)', fontWeight: 600 }}>Downloads</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 700 }}>{selectedTemplate.downloads.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--t2)', fontWeight: 600 }}>Trending</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{selectedTemplate.trend}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn primary" style={{ flex: 1 }}>
                <Download size={14} /> Descargar Template
              </button>
              {selectedTemplate.price > 0 && (
                <button className="btn primary" style={{ flex: 1 }}>
                  Comprar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Template Modal */}
      {showNewTemplate && (
        <div className="modal-overlay" onClick={() => setShowNewTemplate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 700 }}>Crear Nuevo Template</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Nombre del Template</label>
              <input type="text" placeholder="Mi prompt increíble..." style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--b)', borderRadius: '6px', background: 'var(--bg2)', color: 'var(--p)', fontSize: '13px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Categoría</label>
              <select style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--b)', borderRadius: '6px', background: 'var(--bg2)', color: 'var(--p)', fontSize: '13px' }}>
                <option>Copywriting</option>
                <option>Design</option>
                <option>Content</option>
                <option>Email</option>
                <option>Social</option>
                <option>SEO</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Contenido del Prompt</label>
              <textarea placeholder="Pega el contenido de tu prompt aquí..." style={{ width: '100%', height: '120px', padding: '8px 12px', border: '1px solid var(--b)', borderRadius: '6px', background: 'var(--bg2)', color: 'var(--p)', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn primary" style={{ flex: 1 }}>Publicar Template</button>
              <button className="btn" style={{ flex: 1 }} onClick={() => setShowNewTemplate(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
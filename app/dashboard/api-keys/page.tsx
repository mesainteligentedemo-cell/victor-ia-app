'use client';

import { useState } from 'react';
import { Copy, Eye, EyeOff, Trash2, Plus, ExternalLink } from 'lucide-react';

const API_KEYS_DEMO = [
  {
    id: 'key_1',
    name: 'Production API Key',
    key: 'vctria_live_4a8f9c2e1b3d5f7g9h1j3k5l7m9n0p2',
    status: 'active',
    rateLimit: 1000,
    usage: 487,
    created: '2024-03-15',
    lastUsed: '2024-05-17 14:32:00',
    permissions: ['generate', 'chat', 'analytics'],
  },
  {
    id: 'key_2',
    name: 'Staging API Key',
    key: 'vctria_test_9x8w7v6u5t4s3r2q1p0o9n8m7l6k5j',
    status: 'active',
    rateLimit: 100,
    usage: 23,
    created: '2024-05-10',
    lastUsed: '2024-05-17 09:12:00',
    permissions: ['generate', 'analytics'],
  },
  {
    id: 'key_3',
    name: 'Old Integration',
    key: 'vctria_old_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o',
    status: 'inactive',
    rateLimit: 500,
    usage: 0,
    created: '2024-01-20',
    lastUsed: null,
    permissions: ['generate'],
  },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/v1/generate', name: 'Generate Content', description: 'Create images, videos, copy, etc' },
  { method: 'GET', path: '/api/v1/generations', name: 'List Generations', description: 'Retrieve past generations' },
  { method: 'POST', path: '/api/v1/workflows', name: 'Trigger Workflow', description: 'Execute automated workflows' },
  { method: 'POST', path: '/api/v1/batch', name: 'Batch Generate', description: 'Generate 100+ items at once' },
  { method: 'GET', path: '/api/v1/agents', name: 'List Agents', description: 'Get available specialists' },
  { method: 'POST', path: '/api/v1/webhooks', name: 'Register Webhook', description: 'Receive completion events' },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(API_KEYS_DEMO);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev =>
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
    if (selectedKey === id) setSelectedKey(null);
  };

  const createNewKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `vctria_live_${Math.random().toString(36).substr(2, 28)}`,
      status: 'active' as const,
      rateLimit: 1000,
      usage: 0,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
      permissions: ['generate', 'chat', 'analytics'],
    };
    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowNewKey(false);
  };

  const activeKey = selectedKey ? keys.find(k => k.id === selectedKey) : keys[0];

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .key-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .key-card.active {
          border-color: #000;
          background: var(--bg3);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .endpoint-row {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .method-badge {
          background: #000;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          width: 50px;
          text-align: center;
        }
        .method-badge.get {
          background: #0ea5e9;
        }
        .method-badge.post {
          background: #10b981;
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
        .usage-bar {
          width: 100%;
          height: 6px;
          background: var(--b);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-badge.active {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .status-badge.inactive {
          background: rgba(107, 114, 128, 0.2);
          color: #6b7280;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>API & Integraciones</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Conecta Victor IA con tus sistemas</p>
        </div>
        <button className="btn primary" onClick={() => setShowNewKey(!showNewKey)}>
          <Plus size={16} /> Nueva API Key
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        {/* Keys List */}
        <div>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--t2)' }}>API Keys</p>

          {showNewKey && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Nombre de la key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--b)',
                  borderRadius: '6px',
                  background: 'var(--bg)',
                  color: 'var(--p)',
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                <button className="btn primary" onClick={createNewKey}>Crear</button>
                <button className="btn" onClick={() => setShowNewKey(false)}>Cancelar</button>
              </div>
            </div>
          )}

          {keys.map((key) => (
            <div
              key={key.id}
              className={`key-card ${selectedKey === key.id ? 'active' : ''}`}
              onClick={() => setSelectedKey(key.id)}
            >
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>{key.name}</h4>
              <div style={{ marginBottom: '8px' }}>
                <span className={`status-badge ${key.status}`}>{key.status}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--t3)' }}>
                <p style={{ margin: 0, marginBottom: '4px' }}>Créada: {key.created}</p>
                <p style={{ margin: 0 }}>Uso: {key.usage} / {key.rateLimit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Key Details */}
        {activeKey && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600 }}>{activeKey.name}</h2>
              <p style={{ margin: 0, color: 'var(--t2)', fontSize: '14px' }}>Creada: {activeKey.created}</p>
            </div>

            {/* Key Display */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 600, color: 'var(--t2)' }}>API Key Secret</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <code style={{
                  flex: 1,
                  background: 'var(--bg)',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  border: '1px solid var(--b)',
                  color: visibleKeys.includes(activeKey.id) ? 'var(--p)' : 'var(--t3)',
                }}>
                  {visibleKeys.includes(activeKey.id) ? activeKey.key : '•'.repeat(activeKey.key.length)}
                </code>
                <button className="btn" onClick={() => toggleKeyVisibility(activeKey.id)}>
                  {visibleKeys.includes(activeKey.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button className="btn" onClick={() => copyToClipboard(activeKey.key)}>
                  <Copy size={14} />
                </button>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>
                🔒 Nunca compartas esta clave con nadie
              </p>
            </div>

            {/* Usage */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Uso (últimas 24h)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Rate Limit</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700 }}>{activeKey.rateLimit}/hora</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Usado</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700 }}>{activeKey.usage} ({Math.round((activeKey.usage / activeKey.rateLimit) * 100)}%)</p>
                </div>
              </div>
              <div className="usage-bar">
                <div style={{
                  height: '100%',
                  width: `${(activeKey.usage / activeKey.rateLimit) * 100}%`,
                  background: (activeKey.usage / activeKey.rateLimit) > 0.8 ? '#ef4444' : '#10b981',
                }} />
              </div>
              {activeKey.lastUsed && (
                <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>
                  Última vez: {activeKey.lastUsed}
                </p>
              )}
            </div>

            {/* Permissions */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Permisos</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {activeKey.permissions.map((perm) => (
                  <span key={perm} style={{
                    background: 'rgba(0,0,0,0.08)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    ✓ {perm.charAt(0).toUpperCase() + perm.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Delete */}
            {activeKey.status === 'inactive' && (
              <button className="btn" style={{ color: '#ef4444' }} onClick={() => deleteKey(activeKey.id)}>
                <Trash2 size={14} /> Eliminar API Key
              </button>
            )}
          </div>
        )}
      </div>

      {/* API Endpoints Documentation */}
      <div style={{ marginTop: '64px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700 }}>API Endpoints</h2>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <a href="#" style={{ textDecoration: 'none' }}>
            <button className="btn primary">
              <ExternalLink size={14} /> Documentación Completa
            </button>
          </a>
          <a href="#" style={{ textDecoration: 'none' }}>
            <button className="btn">
              <ExternalLink size={14} /> SDKs (JS, Python, Go)
            </button>
          </a>
        </div>

        <div>
          {API_ENDPOINTS.map((endpoint, i) => (
            <div key={i} className="endpoint-row">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                <span className={`method-badge ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{endpoint.name}</p>
                  <code style={{ margin: '4px 0 0 0', display: 'block', fontSize: '12px', color: 'var(--t2)', fontFamily: 'monospace' }}>
                    {endpoint.path}
                  </code>
                </div>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '250px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>{endpoint.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div style={{ marginTop: '64px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700 }}>Webhooks</h2>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Webhook URL</label>
            <input
              type="text"
              placeholder="https://tu-dominio.com/webhooks/victor-ia"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--b)',
                borderRadius: '6px',
                background: 'var(--bg)',
                color: 'var(--p)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Eventos a Recibir</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['generation.completed', 'workflow.executed', 'credit.used', 'error.occurred'].map((event) => (
                <label key={event} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                  {event}
                </label>
              ))}
            </div>
          </div>

          <button className="btn primary" style={{ marginTop: '16px' }}>Guardar Webhook</button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Save, Lock, CreditCard, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'billing' | 'security' | 'integrations'>('profile');
  const [formData, setFormData] = useState({
    name: 'Tu Nombre',
    email: 'tu-email@ejemplo.com',
    company: 'Tu Empresa',
  });

  const handleSave = () => {
    console.log('Guardando:', formData);
  };

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .tab-item { padding: 12px 16px; background: var(--bg2); border: 1px solid var(--b); border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .tab-item.active { background: #000; color: white; border-color: #000; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 10px 12px; border: 1px solid var(--b); border-radius: 8px; background: var(--bg2); color: var(--p); font-size: 13px; }
        .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg2); border: 1px solid var(--b); border-radius: 8px; margin-bottom: 12px; }
        .toggle-switch { width: 40px; height: 24px; background: #d1d5db; border-radius: 12px; cursor: pointer; position: relative; transition: all 0.2s; }
        .toggle-switch.active { background: #10b981; }
        .toggle-dot { position: absolute; width: 20px; height: 20px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: all 0.2s; }
        .toggle-switch.active .toggle-dot { left: 18px; }
        .plan-card { background: var(--bg2); border: 2px solid var(--b); border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; cursor: pointer; }
        .plan-card.active { border-color: #000; background: var(--bg3); }
        .btn { background: var(--bg3); border: 1px solid var(--b); padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--p); transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn:hover { border-color: #000; }
        .btn.primary { background: #000; color: white; }
        .btn.danger { color: #ef4444; }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Configuración</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Administra tu perfil, preferencias y seguridad</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['profile', 'preferences', 'billing', 'security', 'integrations'].map((tab) => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'profile' ? '👤 Perfil' : tab === 'preferences' ? '⚙️ Preferencias' : tab === 'billing' ? '💳 Facturación' : tab === 'security' ? '🔒 Seguridad' : '🔌 Integraciones'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'profile' && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Tu Perfil</h2>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Empresa</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="form-input" />
              </div>
              <button className="btn primary" onClick={handleSave}><Save size={14} /> Guardar Cambios</button>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Preferencias</h2>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Notificaciones</h3>
              <div className="setting-row"><span>Alertas de generación</span><div className="toggle-switch active"><div className="toggle-dot" /></div></div>
              <div className="setting-row"><span>Actualizaciones semanales</span><div className="toggle-switch active"><div className="toggle-dot" /></div></div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Plan PRO</h2>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: 0, color: 'var(--t2)', fontSize: '13px' }}>Facturación mensual: <strong>$49/mes</strong></p>
                <p style={{ margin: '4px 0 0 0', color: 'var(--t2)', fontSize: '13px' }}>Próxima renovación: 5 de Junio 2024</p>
              </div>
              <button className="btn primary">Cambiar Plan</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Seguridad</h2>
              <button className="btn primary" style={{ marginBottom: '12px' }}><Lock size={14} /> Cambiar Contraseña</button>
              <button className="btn danger">Cerrar Sesión</button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Integraciones</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[{ name: 'Slack', logo: '💬' }, { name: 'GitHub', logo: '🐙' }, { name: 'Make', logo: '⚡' }, { name: 'Google Drive', logo: '☁️' }].map((int) => (
                  <div key={int.name} style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{int.logo}</div>
                    <p style={{ margin: '0 0 12px 0', fontWeight: 600 }}>{int.name}</p>
                    <button className="btn primary" style={{ width: '100%' }}>Conectar</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

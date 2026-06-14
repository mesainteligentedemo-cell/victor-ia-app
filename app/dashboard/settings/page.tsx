'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Save, Loader2, Upload, Check } from 'lucide-react';

interface Settings {
  fullName: string;
  email: string;
  avatarUrl: string;
  currency: 'MXN' | 'USD';
  timezone: string;
  language: 'es' | 'en';
  theme: 'dark' | 'light';
}

const TIMEZONES = [
  'America/Mexico_City',
  'America/Tijuana',
  'America/Cancun',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/Madrid',
  'UTC',
];

export default function SettingsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [s, setS] = useState<Settings>({
    fullName: '',
    email: '',
    avatarUrl: '',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    language: 'es',
    theme: 'dark',
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/user/settings');
        if (res.ok) {
          const data = await res.json();
          if (active && data.settings) setS((prev) => ({ ...prev, ...data.settings }));
        }
      } catch {
        /* fall back to defaults / clerk */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Seed from Clerk if API didn't return values.
  useEffect(() => {
    if (loading || !user) return;
    setS((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || '',
      email: prev.email || user.primaryEmailAddress?.emailAddress || '',
      avatarUrl: prev.avatarUrl || user.imageUrl || '',
    }));
  }, [loading, user]);

  const validate = (): string | null => {
    if (s.fullName.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) return 'Email inválido.';
    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) { setError(v); return; }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: s.fullName,
          avatarUrl: s.avatarUrl,
          currency: s.currency,
          timezone: s.timezone,
          language: s.language,
          theme: s.theme,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo guardar la configuración.');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/user/avatar', { method: 'POST', body: form });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo subir la imagen.');
      }
      const data = await res.json();
      setS((prev) => ({ ...prev, avatarUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div style={{ padding: 32, color: 'var(--p)', maxWidth: 720 }}>
      <style>{`
        .st-label{display:block;font-size:12px;font-weight:600;color:var(--t1);margin-bottom:6px;}
        .st-input,.st-select{width:100%;padding:10px 12px;border:1px solid var(--b);border-radius:10px;background:var(--bg2);color:var(--p);font-size:13px;outline:none;}
        .st-input:focus,.st-select:focus{border-color:var(--blue);}
        .st-input:disabled{opacity:.6;}
        .st-group{margin-bottom:18px;}
        .st-row{display:grid;gap:14px;}
        @media(min-width:560px){.st-row-2{grid-template-columns:1fr 1fr;}}
        .st-btn{padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--b);background:var(--bg3);color:var(--p);display:inline-flex;align-items:center;gap:8px;}
        .st-btn.primary{background:var(--blue);border-color:var(--blue);color:#fff;}
        .st-btn:disabled{opacity:.5;cursor:not-allowed;}
      `}</style>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Configuración</h1>
      <p style={{ color: 'var(--t2)', marginBottom: 28, fontSize: 14 }}>Gestiona tu perfil y preferencias</p>

      {error && (
        <div style={{ padding: 12, background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', color: 'var(--red)', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--t3)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 14, padding: 24 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg3)', border: '1px solid var(--b)', flexShrink: 0 }}>
              {s.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleUpload} />
              <button className="st-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploading ? 'Subiendo…' : 'Cambiar foto'}
              </button>
              <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 6 }}>PNG, JPG o WebP · máx 5MB</p>
            </div>
          </div>

          <div className="st-row st-row-2 st-group">
            <div>
              <label className="st-label">Nombre completo</label>
              <input className="st-input" value={s.fullName} onChange={(e) => setS({ ...s, fullName: e.target.value })} placeholder="Tu nombre" />
            </div>
            <div>
              <label className="st-label">Email</label>
              <input className="st-input" value={s.email} disabled title="Editable desde el panel de Clerk" />
            </div>
          </div>

          <div className="st-row st-row-2 st-group">
            <div>
              <label className="st-label">Moneda por defecto</label>
              <select className="st-select" value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value as 'MXN' | 'USD' })}>
                <option value="MXN">MXN — Peso mexicano</option>
                <option value="USD">USD — Dólar</option>
              </select>
            </div>
            <div>
              <label className="st-label">Zona horaria</label>
              <select className="st-select" value={s.timezone} onChange={(e) => setS({ ...s, timezone: e.target.value })}>
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </div>

          <div className="st-row st-row-2 st-group">
            <div>
              <label className="st-label">Lenguaje</label>
              <select className="st-select" value={s.language} onChange={(e) => setS({ ...s, language: e.target.value as 'es' | 'en' })}>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="st-label">Tema</label>
              <select className="st-select" value={s.theme} onChange={(e) => setS({ ...s, theme: e.target.value as 'dark' | 'light' })}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <button className="st-btn primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
              {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

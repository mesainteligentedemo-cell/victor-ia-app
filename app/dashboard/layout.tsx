'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';
import LaserOverlay from '@/components/panels/LaserOverlay';

const DESKTOP_MENU = [
  { id: 'brain-tracker', label: 'Brain Tracker', icon: '🧠', href: '/dashboard' },
  { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard/chat' },
  { id: 'agentes', label: 'Agentes', icon: '🤖', href: '/dashboard/agents' },
  { id: 'biblioteca', label: 'Biblioteca', icon: '📚', href: '/dashboard/library' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
  { id: 'capacitaciones', label: 'Capacitaciones', icon: '🎓', href: '/dashboard/training' },
  { id: 'rh', label: 'RH', icon: '👥', href: '/dashboard/hr' },
  { id: 'marketing', label: 'Marketing', icon: '📢', href: '/dashboard/marketing' },
  { id: 'ventas', label: 'Ventas', icon: '💰', href: '/dashboard/sales' },
  { id: 'servicio', label: 'Servicio al Cliente', icon: '🎧', href: '/dashboard/support' },
  { id: 'config', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
  { id: 'legal', label: 'Legal y Finanzas', icon: '⚖️', href: '/dashboard/finance' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [laserOpen, setLaserOpen] = useState(false);
  const [laserContent, setLaserContent] = useState('');

  const handleOpenLaser = (content: string) => {
    setLaserContent(content);
    setLaserOpen(true);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      {/* DESKTOP SIDEBAR (900px+) */}
      <div
        id="deskbar"
        style={{
          display: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          width: '220px',
          height: '100vh',
          background: 'var(--bg1)',
          borderRight: '1px solid var(--b)',
          flexDirection: 'column',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--b)' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Victor IA
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>Brain Tracker</p>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {DESKTOP_MENU.map((item) => {
            const isActive = pathname === item.href || (item.id === 'dashboard' && pathname === '/dashboard');
            return (
              <Link
                key={item.id}
                href={item.href}
                className="dk-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 13px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--t1)' : 'var(--t2)',
                  background: isActive ? 'var(--bg2)' : 'transparent',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.12s, color 0.12s',
                  borderLeft: isActive ? '2px solid var(--blue)' : 'transparent',
                  paddingLeft: isActive ? '11px' : '13px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg2)';
                  e.currentTarget.style.color = 'var(--t1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--t2)';
                  }
                }}
              >
                <span style={{ width: '22px', fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '15px',
            borderTop: '1px solid var(--b)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: '8px',
              color: 'var(--t2)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            🌓 Tema
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: '8px',
              color: 'var(--t2)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            👤 Perfil
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main
        style={{
          marginLeft: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'var(--nav-h)',
        }}
      >
        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>{children}</div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION (Mobile < 600px) */}
      <BottomNav />

      {/* LASER OVERLAY */}
      <LaserOverlay
        isOpen={laserOpen}
        onClose={() => setLaserOpen(false)}
        title="Vista Previa"
        content={laserContent}
      />

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          main {
            margin-left: 220px !important;
          }
          #deskbar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

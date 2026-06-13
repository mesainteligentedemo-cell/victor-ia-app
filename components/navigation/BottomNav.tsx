'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Zap, Library, BarChart3, BookOpen, Users, Megaphone, TrendingUp, Headphones, Settings, Scale, Trophy, Cpu } from 'lucide-react';

const NAVIGATION = [
  { id: 'inicio', label: 'Inicio', icon: Home, href: '/dashboard' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
  { id: 'separator1', label: '', icon: null, href: '#' },
  { id: 'agentes', label: 'Agentes', icon: Zap, href: '/dashboard/agents' },
  { id: 'biblioteca', label: 'Biblioteca', icon: Library, href: '/dashboard/library' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard/analytics' },
  { id: 'separator2', label: '', icon: null, href: '#' },
  { id: 'capacitaciones', label: 'Capacitaciones', icon: BookOpen, href: '/dashboard/training' },
  { id: 'recursos', label: 'Recursos Humanos', icon: Users, href: '/dashboard/hr' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, href: '/dashboard/marketing' },
  { id: 'ventas', label: 'Ventas', icon: TrendingUp, href: '/dashboard/sales' },
  { id: 'servicio', label: 'Servicio al Cliente', icon: Headphones, href: '/dashboard/support' },
  { id: 'separator3', label: '', icon: null, href: '#' },
  { id: 'config', label: 'Configuración', icon: Settings, href: '/dashboard/settings' },
  { id: 'legal', label: 'Legal y Finanzas', icon: Scale, href: '/dashboard/finance' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      id="sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '240px',
        height: '100vh',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
        borderRight: '1px solid var(--b)',
        overflowY: 'auto',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        gap: '8px',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            V
          </div>
          Victor IA
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>BRAIN TRACKER</p>
      </div>

      {/* Navigation Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAVIGATION.map((item) => {
          if (!item.icon) {
            return (
              <div key={item.id} style={{ height: '1px', background: 'var(--b)', margin: '8px 0', marginLeft: '20px', marginRight: '20px' }} />
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: isActive ? 'var(--blue)' : 'var(--t2)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--blue)' : '3px solid transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              <Icon size={18} style={{ opacity: isActive ? 1 : 0.6 }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--b)' }}>
        <p style={{ fontSize: '11px', color: 'var(--t3)', textAlign: 'center' }}>v1.0.0</p>
      </div>
    </nav>
  );
}
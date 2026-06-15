'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VictorIcon } from '@/components/Icons/victor-icons/VictorIcons';

// Inline SVG renderer for icons without a Victor equivalent
function NavIcon({ id, size }: { id: string; size: number }) {
  const s = size;
  const sw = 2;
  const base = { width: s, height: s, viewBox: '0 0 24 24', stroke: 'currentColor', fill: 'none', strokeWidth: sw, strokeLinecap: 'butt' as const, strokeLinejoin: 'miter' as const };
  switch (id) {
    case 'chat': // MessageCircle — speech bubble
      return <svg {...base}><polygon points="3 6 21 6 21 17 13 17 9 21 9 17 3 17"/></svg>;
    case 'agentes': // Zap — lightning bolt angular Z
      return <svg {...base}><polyline points="13 3 7 13 12 13 11 21 17 11 12 11"/></svg>;
    case 'biblioteca': // Library — 3 stacked horizontal bars
      return <svg {...base}><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/><line x1="6" y1="5" x2="6" y2="19"/></svg>;
    case 'dashboard': // BarChart3 — 3 vertical bars of different heights
      return <svg {...base}><line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="3" y1="20" x2="21" y2="20"/></svg>;
    case 'capacitaciones': // BookOpen — open book with spine
      return <svg {...base}><polyline points="3 5 12 8 21 5"/><polyline points="3 5 3 19 12 22 21 19 21 5"/><line x1="12" y1="8" x2="12" y2="22"/></svg>;
    case 'recursos': // Users — 2 overlapping person silhouettes
      return <svg {...base}><polygon points="9 3 12 7 9 11 6 7"/><polyline points="2 21 6 13 12 13 16 21"/><polygon points="15 4 18 8 15 12 12 8"/><polyline points="12 13 18 13 22 21"/></svg>;
    case 'marketing': // Megaphone — angular megaphone
      return <svg {...base}><polygon points="4 9 13 5 13 19 4 15"/><line x1="13" y1="9" x2="19" y2="7"/><line x1="13" y1="15" x2="19" y2="17"/><line x1="19" y1="7" x2="19" y2="17"/></svg>;
    case 'ventas': // TrendingUp — line going up-right with arrowhead
      return <svg {...base}><polyline points="3 17 9 11 14 15 21 7"/><polyline points="17 7 21 7 21 11"/></svg>;
    case 'servicio': // Headphones — arc + 2 vertical stubs
      return <svg {...base}><path d="M4 15 L4 12 A8 8 0 0 1 20 12 L20 15"/><rect x="2" y="15" width="4" height="5"/><rect x="18" y="15" width="4" height="5"/></svg>;
    case 'legal': // Scale — balance scale
      return <svg {...base}><line x1="12" y1="4" x2="12" y2="20"/><line x1="5" y1="8" x2="19" y2="8"/><polyline points="5 8 3 14 7 14 5 8"/><polyline points="19 8 17 14 21 14 19 8"/><line x1="8" y1="20" x2="16" y2="20"/></svg>;
    case 'generadores': // Wand2 — diagonal stick with sparkle lines
      return <svg {...base}><line x1="4" y1="20" x2="16" y2="8"/><polyline points="13 5 16 8"/><line x1="19" y1="3" x2="19" y2="7"/><line x1="17" y1="5" x2="21" y2="5"/></svg>;
    case 'crm': // Contact — person silhouette
      return <svg {...base}><polygon points="12 3 15 8 9 8"/><polyline points="4 21 8 12 16 12 20 21"/></svg>;
    case 'graphify': // Network — 3 nodes connected by lines
      return <svg {...base}><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/><line x1="7" y1="19" x2="17" y2="19"/></svg>;
    case 'help': // HelpCircle — circle with ? mark
      return <svg {...base}><polygon points="12 2 22 7 22 17 12 22 2 17 2 7"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="16" x2="12" y2="17"/></svg>;
    default:
      return null;
  }
}

const NAVIGATION = [
  { id: 'inicio', label: 'Inicio', href: '/dashboard' },
  { id: 'chat', label: 'Chat', href: '/dashboard/chat' },
  { id: 'separator1', label: '', href: '#' },
  { id: 'agentes', label: 'Agentes', href: '/dashboard/agents' },
  { id: 'generadores', label: 'Generadores', href: '/dashboard/generators' },
  { id: 'biblioteca', label: 'Biblioteca', href: '/dashboard/library' },
  { id: 'crm', label: 'CRM', href: '/dashboard/crm' },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard/analytics' },
  { id: 'graphify', label: 'Graphify', href: '/dashboard/graphify' },
  { id: 'separator2', label: '', href: '#' },
  { id: 'capacitaciones', label: 'Capacitaciones', href: '/dashboard/training' },
  { id: 'recursos', label: 'Recursos Humanos', href: '/dashboard/hr' },
  { id: 'marketing', label: 'Marketing', href: '/dashboard/marketing' },
  { id: 'ventas', label: 'Ventas', href: '/dashboard/sales' },
  { id: 'servicio', label: 'Servicio al Cliente', href: '/dashboard/support' },
  { id: 'separator3', label: '', href: '#' },
  { id: 'config', label: 'Configuración', href: '/dashboard/settings' },
  { id: 'legal', label: 'Legal y Finanzas', href: '/dashboard/finance' },
  { id: 'separator4', label: '', href: '#' },
  { id: 'help', label: 'Centro de Ayuda', href: '/dashboard/help' },
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
          if (!item.label) {
            return (
              <div key={item.id} style={{ height: '1px', background: 'var(--b)', margin: '8px 0', marginLeft: '20px', marginRight: '20px' }} />
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const iconStyle = { opacity: isActive ? 1 : 0.6 };

          const renderIcon = () => {
            if (item.id === 'inicio') return <VictorIcon name="home" size={18} style={iconStyle} />;
            if (item.id === 'config') return <VictorIcon name="settings" size={18} style={iconStyle} />;
            return <NavIcon id={item.id} size={18} />;
          };

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
              <span style={iconStyle}>{renderIcon()}</span>
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
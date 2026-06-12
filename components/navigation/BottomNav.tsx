'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Bot, Library, Menu } from 'lucide-react';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: Home, href: '/dashboard' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
  { id: 'agentes', label: 'Agentes', icon: Bot, href: '/dashboard/agents' },
  { id: 'biblioteca', label: 'Biblioteca', icon: Library, href: '/dashboard/library' },
  { id: 'mas', label: 'Más', icon: Menu, href: '#' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <nav
        id="bnav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--nav-h)',
          paddingTop: '10px',
          background: 'rgba(10, 10, 10, 0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--b)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          zIndex: 30,
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.id === 'inicio' && pathname === '/dashboard');

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="ntab"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '3px',
                cursor: 'pointer',
                textDecoration: 'none',
                position: 'relative',
                color: isActive ? 'var(--blue)' : 'var(--t3)',
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                transition: 'color 0.2s',
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '24px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #3B82F6, #D8B4FE)',
                    borderRadius: '1px',
                  }}
                />
              )}
              <Icon size={20} style={{ color: 'inherit' }} />
              <span style={{ color: 'inherit' }}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Dropdown menu for "Más" */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(var(--nav-h) + 10px)',
            right: 10,
            background: 'var(--bg2)',
            border: '1px solid var(--b)',
            borderRadius: 'var(--r)',
            padding: '8px',
            zIndex: 31,
            minWidth: '160px',
          }}
        >
          <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-gray-700 rounded">
            Configuración
          </Link>
          <Link href="/dashboard/finance" className="block px-4 py-2 text-sm hover:bg-gray-700 rounded">
            Finanzas
          </Link>
        </div>
      )}
    </>
  );
}
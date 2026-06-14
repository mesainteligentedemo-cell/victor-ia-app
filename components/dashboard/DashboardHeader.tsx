'use client';

/**
 * DashboardHeader — top navigation bar of the dashboard.
 * Contains: section nav (Home / Customers / Organizations / Upgrade),
 * a search bar, the current date, and a "Filter date" button.
 *
 * Pure presentational component. Active nav item + search handler are
 * driven by props so the parent page owns the state.
 */

import { useMemo } from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';

export interface DashboardHeaderNavItem {
  id: string;
  label: string;
}

export interface DashboardHeaderProps {
  /** Items rendered in the top navigation row */
  navItems?: DashboardHeaderNavItem[];
  /** Currently selected nav item id */
  activeNav?: string;
  /** Fired when a nav item is clicked */
  onNavChange?: (id: string) => void;
  /** Search input value (controlled) */
  search?: string;
  /** Fired on every search keystroke */
  onSearchChange?: (value: string) => void;
  /** Fired when the "Filter date" button is pressed */
  onFilterDate?: () => void;
}

const DEFAULT_NAV: DashboardHeaderNavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'customers', label: 'Customers' },
  { id: 'organizations', label: 'Organizations' },
  { id: 'upgrade', label: 'Upgrade account' },
];

export default function DashboardHeader({
  navItems = DEFAULT_NAV,
  activeNav = 'home',
  onNavChange,
  search = '',
  onSearchChange,
  onFilterDate,
}: DashboardHeaderProps) {
  // Formatted "March 30, 2023" style date, locale-aware, memoized per render day.
  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  );

  return (
    <header className="vi-dash-header">
      {/* Row 1 — section nav + search */}
      <div className="vi-dash-header__top">
        <nav className="vi-dash-header__nav" aria-label="Secciones del dashboard">
          {navItems.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavChange?.(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`vi-dash-header__nav-item${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="vi-dash-header__search" role="search">
          <Search size={15} aria-hidden style={{ color: 'var(--t3)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Buscar…"
            aria-label="Buscar en el dashboard"
            className="vi-dash-header__search-input"
          />
        </div>
      </div>

      {/* Row 2 — title + date + filter */}
      <div className="vi-dash-header__bottom">
        <h1 className="vi-dash-header__title">Dashboard</h1>

        <div className="vi-dash-header__meta">
          <span className="vi-dash-header__date">{today}</span>
          <button
            type="button"
            onClick={onFilterDate}
            className="vi-dash-header__filter"
            aria-label="Filtrar por fecha"
          >
            <Calendar size={14} aria-hidden />
            <span>Filter date</span>
            <ChevronDown size={14} aria-hidden style={{ opacity: 0.6 }} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .vi-dash-header {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .vi-dash-header__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .vi-dash-header__nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .vi-dash-header__nav-item {
          appearance: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          color: var(--t2);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .vi-dash-header__nav-item:hover {
          color: var(--p);
          background: var(--bg2);
        }
        .vi-dash-header__nav-item.is-active {
          color: var(--p);
          background: var(--bg2);
          box-shadow: inset 0 0 0 1px var(--b);
        }
        .vi-dash-header__search {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          min-width: 220px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 999px;
          transition: border-color 0.18s ease;
        }
        .vi-dash-header__search:focus-within {
          border-color: var(--blue);
        }
        .vi-dash-header__search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--p);
          font-size: 13px;
          min-width: 0;
        }
        .vi-dash-header__search-input::placeholder {
          color: var(--t3);
        }
        .vi-dash-header__bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .vi-dash-header__title {
          font-family: var(--font-display);
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--p);
          margin: 0;
        }
        .vi-dash-header__meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vi-dash-header__date {
          font-size: 13px;
          color: var(--t3);
        }
        .vi-dash-header__filter {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 10px;
          color: var(--t1);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease;
        }
        .vi-dash-header__filter:hover {
          border-color: var(--blue);
        }

        @media (max-width: 640px) {
          .vi-dash-header__search {
            order: -1;
            width: 100%;
          }
          .vi-dash-header__title {
            font-size: 24px;
          }
        }
      `}</style>
    </header>
  );
}

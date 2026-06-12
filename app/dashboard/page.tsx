'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TrendingUp, Users, Zap, Target } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
          ¡Bienvenido a tu agencia!
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--t2)' }}>155 especialistas trabajando 24/7</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
        {[
          { icon: TrendingUp, label: 'Velocidad', value: '40%', subtitle: 'Más rápido que agencia', color: 'var(--green)' },
          { icon: Users, label: 'Equipo', value: '155', subtitle: 'Especialistas activos', color: 'var(--blue)' },
          { icon: Zap, label: 'Eficiencia', value: '95%', subtitle: 'Automatización', color: 'var(--orange)' },
          { icon: Target, label: 'Costo', value: '-85%', subtitle: 'vs agencia tradicional', color: 'var(--green)' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              style={{
                padding: '20px',
                background: 'var(--bg2)',
                border: '1px solid var(--b)',
                borderRadius: 'var(--r)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {kpi.label}
                </p>
                <Icon size={18} style={{ color: kpi.color, opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                {kpi.value}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{kpi.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Activity Timeline */}
      <div style={{ padding: '20px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 'var(--r)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Actividad esta Semana
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '120px' }}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'].map((day, i) => (
            <div
              key={day}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${30 + Math.random() * 70}px`,
                  background: 'linear-gradient(180deg, var(--blue), var(--accent2))',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                }}
              />
              <p style={{ fontSize: '10px', color: 'var(--t3)' }}>{day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div style={{ padding: '20px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: 'var(--r)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Pipeline de Generación
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          {[
            { stage: 'Prospectos', count: 12, width: '100%' },
            { stage: 'Propuestas', count: 8, width: '67%' },
            { stage: 'Autorizado', count: 4, width: '33%' },
            { stage: 'Completado', count: 2, width: '17%' },
          ].map((stage) => (
            <div key={stage.stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  width: stage.width,
                  height: '60px',
                  background: 'linear-gradient(90deg, var(--blue), var(--accent2))',
                  borderRadius: '8px',
                  opacity: 0.7,
                }}
              />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>{stage.stage}</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--blue)' }}>{stage.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <Link
          href="/dashboard/chat"
          style={{
            padding: '16px',
            background: 'var(--blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--r)',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,130,246,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          💬 Ir al Chat
        </Link>
        <Link
          href="/dashboard/agents"
          style={{
            padding: '16px',
            background: 'var(--bg2)',
            color: 'var(--t1)',
            border: '1px solid var(--b)',
            borderRadius: 'var(--r)',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--blue)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--b)';
          }}
        >
          🤖 Ver Agentes
        </Link>
        <Link
          href="/dashboard/generators"
          style={{
            padding: '16px',
            background: 'var(--bg2)',
            color: 'var(--t1)',
            border: '1px solid var(--b)',
            borderRadius: 'var(--r)',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--blue)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--b)';
          }}
        >
          ✨ Generar Contenido
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {[
          { emoji: '🎨', name: 'Diseño', count: '40', label: 'especialistas' },
          { emoji: '🎬', name: 'Video', count: '15', label: 'especialistas' },
          { emoji: '💻', name: 'Desarrollo', count: '25', label: 'especialistas' },
          { emoji: '📝', name: 'Copywriting', count: '8', label: 'especialistas' },
          { emoji: '🔐', name: 'Seguridad', count: '38', label: 'especialistas' },
          { emoji: '⚙️', name: 'Automatización', count: '15', label: 'especialistas' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              padding: '16px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: 'var(--r)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.emoji}</p>
            <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{stat.name}</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--blue)' }}>{stat.count}</p>
            <p style={{ fontSize: '10px', color: 'var(--t3)' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
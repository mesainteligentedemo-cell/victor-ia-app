'use client';

import { useState } from 'react';
import { AlertCircle, Zap } from 'lucide-react';

const PROJECTS = [
  { id: 1, name: 'Victor IA Website', desc: 'Sitio web principal de la agencia', icon: '🌐' },
  { id: 2, name: 'Costa Negra', desc: 'Landing HubSpot luxury lotes Quintana Roo', icon: '🏖️' },
  { id: 3, name: 'Brandbook Victor IA', desc: 'Manual de identidad visual - 21 secciones', icon: '📚' },
  { id: 4, name: 'Dashboard BI', desc: 'Dashboard Next.js con KPIs de la agencia', icon: '📊' },
  { id: 5, name: 'Influence IA Awards', desc: 'Premio anual a la innovación con IA', icon: '🏆' },
];

const URGENTS = [
  { id: 1, person: 'Jimena Rodriguez', task: 'URGENTE: elaborar y enviar propuesta hoy', type: 'propuesta' },
  { id: 2, person: 'Rosa Laura Ubeda', task: 'Vigencia propuesta: 31 mayo 2026', type: 'propuesta' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Sábado 13 de Junio · 2026
        </p>
        <h1 style={{ fontSize: '42px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
          Buenos días, Victor
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--b)' }}>
        {['Inicio', 'Actividad', 'CRM'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: activeTab === tab.toLowerCase() ? 600 : 400,
              color: activeTab === tab.toLowerCase() ? 'var(--fg)' : 'var(--t3)',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--blue)' : 'none',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'inicio' && (
        <>
          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
            {[
              { icon: '✏️', label: 'Studio' },
              { icon: '🖼️', label: 'Image Lab' },
              { icon: '🎬', label: 'Video' },
              { icon: '🌐', label: 'Web / CMS' },
              { icon: '⚡', label: 'Estudio IA' },
              { icon: '👥', label: 'CRM' },
            ].map((action) => (
              <button
                key={action.label}
                style={{
                  padding: '16px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '28px',
                }}
              >
                {action.icon}
                <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>EN PRODUCCIÓN</p>
              <p style={{ fontSize: '36px', fontWeight: 700 }}>6</p>
              <p style={{ fontSize: '11px', color: 'var(--t3)' }}>2 pendientes</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>EN PIPELINE</p>
              <p style={{ fontSize: '36px', fontWeight: 700 }}>4</p>
              <p style={{ fontSize: '11px', color: 'var(--t3)' }}>2 urgentes</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>POR COBRAR</p>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>$41k</p>
              <p style={{ fontSize: '11px', color: 'var(--t3)' }}>MXN + USD</p>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <p style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Proyectos Activos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PROJECTS.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '12px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--b)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{p.icon}</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgentes Section */}
          <div>
            <p style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '12px' }}>
              🚨 Urgentes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {URGENTS.map((u) => (
                <div
                  key={u.id}
                  style={{
                    padding: '12px',
                    background: 'var(--bg2)',
                    border: '2px solid #FF6B6B',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <AlertCircle size={20} style={{ color: '#FF6B6B', marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{u.person}</p>
                    <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{u.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* "¿Qué Hacemos?" Quick Generators */}
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              ¿Qué hacemos hoy?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {[
                { icon: '🤖', label: 'Chat IA' },
                { icon: '🤔', label: '¿Qué hice?' },
                { icon: '🎓', label: 'Estudio' },
                { icon: '🎤', label: 'Voz' },
              ].map((gen) => (
                <button
                  key={gen.label}
                  style={{
                    padding: '16px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--b)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{gen.icon}</span>
                  <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{gen.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'actividad' && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--t3)' }}>
          <p>📊 Actividad - Próximamente</p>
        </div>
      )}

      {activeTab === 'crm' && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--t3)' }}>
          <p>📋 CRM - Próximamente</p>
        </div>
      )}
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
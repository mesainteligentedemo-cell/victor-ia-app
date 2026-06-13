'use client';

import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'available';
  connectedAt?: string;
}

const ALL_INTEGRATIONS: Integration[] = [
  { id: 'slack', name: 'Slack', description: 'Envía notificaciones a tus canales', icon: '💬', status: 'connected', connectedAt: 'Jun 1, 2026' },
  { id: 'github', name: 'GitHub', description: 'Sincroniza repositorios y deployments', icon: '🐙', status: 'available' },
  { id: 'zapier', name: 'Zapier', description: 'Conecta con 5000+ apps', icon: '⚡', status: 'available' },
  { id: 'stripe', name: 'Stripe', description: 'Procesa pagos automáticamente', icon: '💳', status: 'connected', connectedAt: 'May 15, 2026' },
  { id: 'twilio', name: 'Twilio', description: 'SMS y llamadas de voz', icon: '📱', status: 'available' },
  { id: 'hubspot', name: 'HubSpot', description: 'Integración completa con CRM', icon: '🔗', status: 'available' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Sincroniza datos en spreadsheets', icon: '📊', status: 'available' },
  { id: 'openai', name: 'OpenAI', description: 'Acceso a GPT y Embeddings', icon: '🤖', status: 'connected', connectedAt: 'Apr 10, 2026' },
  { id: 'vercel', name: 'Vercel', description: 'Deploy automático de proyectos', icon: '▲', status: 'available' },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing y newsletters', icon: '📧', status: 'available' },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(ALL_INTEGRATIONS);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const connected = integrations.filter((i) => i.status === 'connected');
  const available = integrations.filter((i) => i.status === 'available');

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowModal(true);
  };

  const handleConfirmConnect = () => {
    if (selectedIntegration) {
      setIntegrations(
        integrations.map((i) =>
          i.id === selectedIntegration.id
            ? { ...i, status: 'connected' as const, connectedAt: new Date().toLocaleDateString() }
            : i
        )
      );
      setShowModal(false);
      setSelectedIntegration(null);
    }
  };

  const handleDisconnect = (id: string) => {
    if (confirm('¿Desconectar esta integración?')) {
      setIntegrations(
        integrations.map((i) =>
          i.id === id
            ? { ...i, status: 'available' as const, connectedAt: undefined }
            : i
        )
      );
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>🔌 Integraciones</h1>
          <p style={{ fontSize: '14px', color: 'var(--t3)' }}>Conecta tus herramientas favoritas</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Conectadas', value: connected.length, color: 'var(--green)' },
          { label: 'Disponibles', value: available.length, color: 'var(--blue)' },
          { label: 'Total', value: integrations.length, color: 'var(--t2)' },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--b)' }}>
            <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Connected Integrations */}
      {connected.length > 0 && (
        <>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Integración Activas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {connected.map((integration) => (
              <div
                key={integration.id}
                style={{
                  padding: '20px',
                  background: 'var(--bg2)',
                  border: '2px solid var(--green)',
                  borderRadius: '12px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px' }}>{integration.icon}</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '4px',
                    color: 'var(--green)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    <Check size={14} />
                    Conectado
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{integration.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--t3)', marginBottom: '12px' }}>{integration.description}</p>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '12px' }}>
                  Conectado el {integration.connectedAt}
                </p>

                <button
                  onClick={() => handleDisconnect(integration.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    border: '1px solid #EF4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  Desconectar
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Available Integrations */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Integraciones Disponibles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {available.map((integration) => (
          <div
            key={integration.id}
            style={{
              padding: '20px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: '12px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{integration.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{integration.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--t3)' }}>{integration.description}</p>
            </div>

            <button
              onClick={() => handleConnect(integration)}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Conectar
            </button>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {showModal && selectedIntegration && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '32px',
              width: '90%',
              maxWidth: '500px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{selectedIntegration.icon}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
              Conectar {selectedIntegration.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '24px' }}>
              {selectedIntegration.description}
            </p>

            <div style={{
              padding: '16px',
              background: 'var(--bg2)',
              borderRadius: '8px',
              marginBottom: '24px',
              textAlign: 'left',
              fontSize: '13px',
              color: 'var(--t2)',
            }}>
              <p style={{ marginBottom: '8px', fontWeight: 600 }}>Esta integración te permitirá:</p>
              <ul style={{ marginLeft: '16px' }}>
                <li>✓ Sincronizar datos automáticamente</li>
                <li>✓ Recibir notificaciones en tiempo real</li>
                <li>✓ Automatizar flujos de trabajo</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--bg2)',
                  color: 'var(--t2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmConnect}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

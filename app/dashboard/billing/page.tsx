'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Perfecto para probar',
    features: [
      '1 agente activo',
      '5 chats/mes',
      '100 assets',
      'Dashboard básico',
      'Soporte por email',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    description: 'Para negocios en crecimiento',
    recommended: true,
    features: [
      '5 agentes activos',
      'Chats ilimitados',
      '10,000 assets',
      'Analytics avanzado',
      'Integraciones',
      'Soporte prioritario',
      'API access',
      'Webhooks personalizados',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    description: 'Solución completa',
    features: [
      '∞ agentes activos',
      'Chats ilimitados',
      '45,000+ assets',
      'Analytics AI',
      'Integraciones ilimitadas',
      'Soporte 24/7',
      'API dedicada',
      'SSO y SAML',
      'SLA garantizado',
      'Onboarding personalizado',
    ],
  },
];

const INVOICES = [
  { id: 'INV-001', date: 'Jun 1, 2026', amount: '$99', status: 'Paid', plan: 'Professional' },
  { id: 'INV-002', date: 'May 1, 2026', amount: '$99', status: 'Paid', plan: 'Professional' },
  { id: 'INV-003', date: 'Apr 1, 2026', amount: '$99', status: 'Paid', plan: 'Professional' },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('professional');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = (planId: string) => {
    if (planId !== currentPlan) {
      setSelectedPlan(planId);
      // En producción aquí iría a Stripe
      alert(`Redirigiendo a Stripe para upgraar a ${planId}...`);
      setCurrentPlan(planId);
      setSelectedPlan(null);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>💳 Billing & Planes</h1>

      {/* Current Plan */}
      <div style={{
        padding: '24px',
        background: 'var(--bg2)',
        border: '1px solid var(--blue)',
        borderRadius: '12px',
        marginBottom: '32px',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
          Plan Actual
        </p>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          {PLANS.find((p) => p.id === currentPlan)?.name}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '16px' }}>
          ${PLANS.find((p) => p.id === currentPlan)?.price}/mes
        </p>
        <p style={{ fontSize: '13px', color: 'var(--t3)' }}>
          Próximo pago: <strong>Jul 1, 2026</strong> · Se renuvela automáticamente
        </p>
      </div>

      {/* Plans Grid */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Planes Disponibles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: '24px',
              background: plan.recommended ? 'linear-gradient(180deg, var(--blue), var(--purple))' : 'var(--bg2)',
              borderRadius: '12px',
              border: plan.recommended ? 'none' : '1px solid var(--b)',
              color: plan.recommended ? 'white' : 'var(--fg)',
              position: 'relative',
            }}
          >
            {plan.recommended && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                background: '#FFD700',
                color: 'black',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
              }}>
                ⭐ RECOMENDADO
              </div>
            )}

            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              {plan.name}
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '16px' }}>
              {plan.description}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700 }}>
                ${plan.price}
              </span>
              {plan.price > 0 && <span style={{ fontSize: '14px', opacity: 0.8, marginLeft: '8px' }}>/mes</span>}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={currentPlan === plan.id}
              style={{
                width: '100%',
                padding: '12px',
                background: currentPlan === plan.id ? 'rgba(255,255,255,0.2)' : plan.recommended ? 'white' : 'var(--blue)',
                color: currentPlan === plan.id ? 'currentColor' : plan.recommended ? 'var(--blue)' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              {currentPlan === plan.id ? '✓ Plan Actual' : `Cambiar a ${plan.name}`}
            </button>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                  }}
                >
                  <Check size={16} style={{ flexShrink: 0 }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Historial de Facturas</h2>
      <div style={{ background: 'var(--bg2)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--b)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          gap: '16px',
          padding: '16px',
          background: 'var(--bg)',
          borderBottom: '1px solid var(--b)',
          fontWeight: 600,
          fontSize: '12px',
          textTransform: 'uppercase',
        }}>
          <div>Factura</div>
          <div>Fecha</div>
          <div>Plan</div>
          <div>Monto</div>
          <div>Estado</div>
        </div>

        {INVOICES.map((invoice) => (
          <div
            key={invoice.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '16px',
              borderBottom: '1px solid var(--b)',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <div style={{ fontWeight: 600 }}>{invoice.id}</div>
            <div>{invoice.date}</div>
            <div>{invoice.plan}</div>
            <div style={{ fontWeight: 600 }}>{invoice.amount}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }} />
              {invoice.status}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginTop: '40px', marginBottom: '20px' }}>Métodos de Pago</h2>
      <div style={{
        padding: '24px',
        background: 'var(--bg2)',
        borderRadius: '8px',
        border: '1px solid var(--b)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px' }}>💳</div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Visa terminada en 4242</p>
            <p style={{ fontSize: '12px', color: 'var(--t3)' }}>Vence 12/27</p>
          </div>
          <button style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            background: 'var(--bg)',
            color: 'var(--t2)',
            border: '1px solid var(--b)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

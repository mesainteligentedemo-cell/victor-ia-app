import { PricingPlans } from '@/components/billing/PricingPlans';

export const metadata = {
  title: 'Precios · Victor IA',
  description: 'Planes y precios de Victor IA — elige el plan que se adapta a tu agencia.',
};

export default function PricingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', padding: '64px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
            Planes y Precios
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--t3)', maxWidth: '600px', margin: '0 auto' }}>
            Elige el plan que se adapta a tu agencia. Sin contratos forzosos, cancela cuando quieras.
          </p>
        </div>
        <PricingPlans />
      </div>
    </main>
  );
}

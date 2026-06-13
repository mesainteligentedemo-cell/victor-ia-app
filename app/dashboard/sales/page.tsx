'use client';

const PIPELINE = [
  { stage: 'Prospect', count: 12, value: 180000, color: '#6B7280' },
  { stage: 'Proposal', count: 8, value: 240000, color: 'var(--orange)' },
  { stage: 'Authorized', count: 5, value: 300000, color: 'var(--blue)' },
  { stage: 'Completed', count: 3, value: 150000, color: 'var(--green)' },
];

const totalValue = PIPELINE.reduce((sum, p) => sum + p.value, 0);

export default function SalesPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>💰 Ventas</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>OPORTUNIDADES TOTALES</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>{PIPELINE.reduce((sum, p) => sum + p.count, 0)}</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>VALOR EN PIPELINE</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>${(totalValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {PIPELINE.map((stage) => (
          <div key={stage.stage} style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--b)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stage.color }} />
              <p style={{ fontSize: '14px', fontWeight: 600 }}>{stage.stage}</p>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{stage.count}</p>
            <p style={{ fontSize: '12px', color: 'var(--t3)' }}>${(stage.value / 1000).toFixed(0)}k valor</p>
          </div>
        ))}
      </div>
    </div>
  );
}

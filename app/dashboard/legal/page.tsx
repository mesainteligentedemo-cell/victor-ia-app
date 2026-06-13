'use client';
export default function LegalPage() {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>⚖️ Legal y Finanzas</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>DOCUMENTOS</p>
          <p style={{ fontSize: '28px', fontWeight: 700' }}>4</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>CUMPLIMIENTO</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)' }}>100%</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>RIESGO</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)' }}>Bajo</p>
        </div>
      </div>
      <p style={{ color: 'var(--t3)', textAlign: 'center', padding: '40px' }}>Compliance y gestión financiera</p>
    </div>
  );
}

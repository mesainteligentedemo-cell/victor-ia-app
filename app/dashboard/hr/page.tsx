'use client';

import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Super Agente', role: 'Director Ejecutivo', status: 'active', utilization: 95 },
  { id: 2, name: 'Diseñador Web', role: 'Frontend Lead', status: 'active', utilization: 88 },
  { id: 3, name: 'Copywriter', role: 'Content Lead', status: 'active', utilization: 92 },
  { id: 4, name: 'SEO Specialist', role: 'Growth Lead', status: 'idle', utilization: 45 },
  { id: 5, name: 'Desarrollador', role: 'Backend Lead', status: 'active', utilization: 85 },
  { id: 6, name: 'Gerente Proyectos', role: 'Operations Lead', status: 'active', utilization: 90 },
];

export default function HRPage() {
  const [employees] = useState(TEAM_MEMBERS);
  const activeCount = employees.filter(e => e.status === 'active').length;
  const avgUtilization = Math.round(employees.reduce((sum, e) => sum + e.utilization, 0) / employees.length);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>👥 Recursos Humanos</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>EQUIPO TOTAL</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>{employees.length}</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>ACTIVOS</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#10B981' }}>{activeCount}</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>UTILIZACIÓN PROMEDIO</p>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>{avgUtilization}%</p>
        </div>
        <button style={{ padding: '16px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <UserPlus size={18} /> Agregar Especialista
        </button>
      </div>

      {/* Team Table */}
      <div style={{ background: 'var(--bg2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--b)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--b)' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Nombre</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Rol</th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Estado</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Utilización</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--b)' }}>
                <td style={{ padding: '16px', fontWeight: 500 }}>{emp.name}</td>
                <td style={{ padding: '16px', color: 'var(--t3)' }}>{emp.role}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: emp.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: emp.status === 'active' ? '#10B981' : '#6B7280' }}>
                    {emp.status === 'active' ? '🟢 Activo' : '🔴 Idle'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <div style={{ width: '60px', height: '4px', background: 'var(--bg)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: emp.utilization + '%', height: '100%', background: 'var(--blue)' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '30px' }}>{emp.utilization}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'prospect' | 'proposal' | 'authorized' | 'completed';
}

interface PipelineStage {
  stage: 'prospect' | 'proposal' | 'authorized' | 'completed';
  count: number;
  value: number;
  color: string;
  label: string;
}

const STAGE_CONFIG: Record<string, { color: string; label: string }> = {
  prospect: { color: '#6B7280', label: 'Prospect' },
  proposal: { color: 'var(--orange)', label: 'Proposal' },
  authorized: { color: 'var(--blue)', label: 'Authorized' },
  completed: { color: 'var(--green)', label: 'Completed' },
};

export default function SalesPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Modal form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'prospect' as const,
  });

  // Cargar deals al montar
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/sales');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar los deals`);
      }

      const data = await response.json();
      setDeals(Array.isArray(data) ? data : data.deals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.value) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          value: parseFloat(formData.value),
          stage: formData.stage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al crear deal`);
      }

      await fetchDeals();
      setShowForm(false);
      setFormData({ name: '', company: '', value: '', stage: 'prospect' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleChangeDeal = async (id: string) => {
    if (!formData.name || !formData.company || !formData.value) {
      setError('Completa los campos requeridos');
      return;
    }

    try {
      setEditingId(id);
      setError(null);

      const response = await fetch(`/api/sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          value: parseFloat(formData.value),
          stage: formData.stage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al actualizar`);
      }

      await fetchDeals();
      setShowForm(false);
      setFormData({ name: '', company: '', value: '', stage: 'prospect' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setEditingId(null);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm('¿Eliminar este deal?')) return;

    try {
      setDeleteLoading(id);
      setError(null);

      const response = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al eliminar`);
      }

      await fetchDeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Calcular pipeline
  const pipeline: PipelineStage[] = [
    {
      stage: 'prospect',
      count: deals.filter(d => d.stage === 'prospect').length,
      value: deals.filter(d => d.stage === 'prospect').reduce((sum, d) => sum + d.value, 0),
      color: STAGE_CONFIG.prospect.color,
      label: STAGE_CONFIG.prospect.label,
    },
    {
      stage: 'proposal',
      count: deals.filter(d => d.stage === 'proposal').length,
      value: deals.filter(d => d.stage === 'proposal').reduce((sum, d) => sum + d.value, 0),
      color: STAGE_CONFIG.proposal.color,
      label: STAGE_CONFIG.proposal.label,
    },
    {
      stage: 'authorized',
      count: deals.filter(d => d.stage === 'authorized').length,
      value: deals.filter(d => d.stage === 'authorized').reduce((sum, d) => sum + d.value, 0),
      color: STAGE_CONFIG.authorized.color,
      label: STAGE_CONFIG.authorized.label,
    },
    {
      stage: 'completed',
      count: deals.filter(d => d.stage === 'completed').length,
      value: deals.filter(d => d.stage === 'completed').reduce((sum, d) => sum + d.value, 0),
      color: STAGE_CONFIG.completed.color,
      label: STAGE_CONFIG.completed.label,
    },
  ];

  const totalOpportunities = pipeline.reduce((sum, p) => sum + p.count, 0);
  const totalValue = pipeline.reduce((sum, p) => sum + p.value, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700 }}>💰 Ventas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            background: 'var(--blue)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Deal'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreateDeal} style={{
          padding: '20px',
          background: 'var(--bg2)',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          <input
            type="text"
            placeholder="Nombre del deal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: '6px',
              color: 'var(--t)',
              fontSize: '14px',
            }}
          />
          <input
            type="text"
            placeholder="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: '6px',
              color: 'var(--t)',
              fontSize: '14px',
            }}
          />
          <input
            type="number"
            placeholder="Valor ($)"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: '6px',
              color: 'var(--t)',
              fontSize: '14px',
            }}
          />
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: '6px',
              color: 'var(--t)',
              fontSize: '14px',
            }}
          >
            <option value="prospect">Prospect</option>
            <option value="proposal">Proposal</option>
            <option value="authorized">Authorized</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            disabled={createLoading}
            style={{
              padding: '8px 16px',
              background: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: createLoading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              opacity: createLoading ? 0.6 : 1,
              gridColumn: '1 / -1',
            }}
          >
            {createLoading ? '⏳ Creando...' : 'Crear Deal'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--t3)' }}>
          ⏳ Cargando deals...
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--t3)' }}>OPORTUNIDADES TOTALES</p>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>{totalOpportunities}</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--t3)' }}>VALOR EN PIPELINE</p>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>${(totalValue / 1000).toFixed(0)}k</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {pipeline.map((stage) => (
              <div key={stage.stage} style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--b)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stage.color }} />
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{stage.label}</p>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{stage.count}</p>
                <p style={{ fontSize: '12px', color: 'var(--t3)' }}>${(stage.value / 1000).toFixed(0)}k valor</p>
              </div>
            ))}
          </div>

          {deals.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg2)',
              borderRadius: '8px',
              color: 'var(--t3)',
            }}>
              <p>Sin deals creados</p>
            </div>
          ) : (
            <div style={{ background: 'var(--bg2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--b)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--b)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Deal</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Empresa</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Stage</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Valor</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} style={{ borderBottom: '1px solid var(--b)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{deal.name}</td>
                      <td style={{ padding: '16px' }}>{deal.company}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          background: STAGE_CONFIG[deal.stage].color === '#6B7280'
                            ? 'rgba(107, 114, 128, 0.1)'
                            : STAGE_CONFIG[deal.stage].color === 'var(--green)'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : STAGE_CONFIG[deal.stage].color === 'var(--blue)'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : 'rgba(251, 146, 60, 0.1)',
                          color: STAGE_CONFIG[deal.stage].color,
                        }}>
                          {STAGE_CONFIG[deal.stage].label}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>${deal.value.toLocaleString()}</td>
                      <td style={{ padding: '16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            setFormData({
                              name: deal.name,
                              company: deal.company,
                              value: deal.value.toString(),
                              stage: deal.stage,
                            });
                            setEditingId(deal.id);
                            setShowForm(true);
                          }}
                          style={{
                            padding: '4px 8px',
                            background: 'var(--orange)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          disabled={deleteLoading === deal.id}
                          style={{
                            padding: '4px 8px',
                            background: deleteLoading === deal.id ? 'rgba(239, 68, 68, 0.5)' : '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: deleteLoading === deal.id ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          {deleteLoading === deal.id ? '⏳' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

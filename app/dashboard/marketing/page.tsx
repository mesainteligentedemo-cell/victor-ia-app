'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'planning';
  reach: number;
  engagement: number;
  roi: string;
  budget: number;
  startDate: string;
  endDate: string;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Modal form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
  });

  // Cargar campañas al montar
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/marketing');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar las campañas`);
      }

      const data = await response.json();
      setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.budget || !formData.startDate || !formData.endDate) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);

      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          budget: parseFloat(formData.budget),
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al crear campaña`);
      }

      await fetchCampaigns();
      setShowForm(false);
      setFormData({ name: '', budget: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditCampaign = async (id: string) => {
    if (!formData.name || !formData.budget) {
      setError('Completa los campos requeridos');
      return;
    }

    try {
      setEditingId(id);
      setError(null);

      const response = await fetch(`/api/marketing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          budget: parseFloat(formData.budget),
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al editar`);
      }

      await fetchCampaigns();
      setShowForm(false);
      setFormData({ name: '', budget: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al editar');
    } finally {
      setEditingId(null);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('¿Eliminar esta campaña?')) return;

    try {
      setDeleteLoading(id);
      setError(null);

      const response = await fetch(`/api/marketing/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al eliminar`);
      }

      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeleteLoading(null);
    }
  };

  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const avgEngagement = campaigns.length > 0
    ? (campaigns.reduce((sum, c) => sum + c.engagement, 0) / campaigns.length).toFixed(1)
    : '0';

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700 }}>📢 Marketing</h1>
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
          {showForm ? 'Cancelar' : '+ Nueva Campaña'}
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
        <form onSubmit={handleCreateCampaign} style={{
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
            placeholder="Nombre de campaña"
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
            type="number"
            placeholder="Presupuesto ($)"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: '6px',
              color: 'var(--t)',
              fontSize: '14px',
            }}
          />
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
            {createLoading ? '⏳ Creando...' : 'Crear Campaña'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--t3)' }}>
          ⏳ Cargando campañas...
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--t3)' }}>ALCANCE TOTAL</p>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>{(totalReach / 1000).toFixed(0)}k</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--t3)' }}>ENGAGEMENT PROMEDIO</p>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>{avgEngagement}%</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--t3)' }}>CAMPAÑAS ACTIVAS</p>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>{campaigns.filter(c => c.status === 'active').length}</p>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg2)',
              borderRadius: '8px',
              color: 'var(--t3)',
            }}>
              <p>Sin campañas creadas</p>
            </div>
          ) : (
            <div style={{ background: 'var(--bg2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--b)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--b)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Campaña</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Estado</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Alcance</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Engagement</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>ROI</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} style={{ borderBottom: '1px solid var(--b)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{campaign.name}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          background: campaign.status === 'active'
                            ? 'rgba(59, 130, 246, 0.1)'
                            : campaign.status === 'completed'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(107, 114, 128, 0.1)',
                          color: campaign.status === 'active'
                            ? 'var(--blue)'
                            : campaign.status === 'completed'
                              ? '#10B981'
                              : '#6B7280',
                        }}>
                          {campaign.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>{campaign.reach.toLocaleString()}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>{campaign.engagement}%</td>
                      <td style={{ padding: '16px', textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>{campaign.roi}</td>
                      <td style={{ padding: '16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            setFormData({
                              name: campaign.name,
                              budget: campaign.budget.toString(),
                              startDate: campaign.startDate,
                              endDate: campaign.endDate,
                            });
                            setEditingId(campaign.id);
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
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          disabled={deleteLoading === campaign.id}
                          style={{
                            padding: '4px 8px',
                            background: deleteLoading === campaign.id ? 'rgba(239, 68, 68, 0.5)' : '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: deleteLoading === campaign.id ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          {deleteLoading === campaign.id ? '⏳' : '🗑️'}
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

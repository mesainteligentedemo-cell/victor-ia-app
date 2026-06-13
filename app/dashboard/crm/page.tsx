'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  createdAt: string;
  notes: string;
}

const PIPELINE_STAGES = ['lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

export default function CRMPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    notes: '',
  });

  // Cargar prospectos al montar
  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/crm');
      if (!response.ok) {
        throw new Error('Error al cargar prospectos');
      }
      const data = await response.json();
      setProspects(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('Error loading prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProspects = stageFilter
    ? prospects.filter((p) => p.stage === stageFilter)
    : prospects;

  const metrics = {
    total: prospects.length,
    avgValue: Math.round(prospects.reduce((sum, p) => sum + p.value, 0) / prospects.length),
    won: prospects.filter((p) => p.stage === 'won').length,
    wonValue: prospects.filter((p) => p.stage === 'won').reduce((sum, p) => sum + p.value, 0),
  };

  const handleNewProspect = () => {
    setFormData({ name: '', company: '', email: '', phone: '', value: '', notes: '' });
    setError(null);
    setShowNewModal(true);
  };

  const handleSaveNew = async () => {
    if (!formData.name || !formData.company) {
      setError('Nombre y empresa son requeridos');
      return;
    }

    try {
      setLoadingAction('creating');
      setError(null);

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          value: parseInt(formData.value) || 0,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear prospecto');
      }

      const newProspect = await response.json();
      setProspects([newProspect, ...prospects]);
      setShowNewModal(false);
      setFormData({ name: '', company: '', email: '', phone: '', value: '', notes: '' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('Error creating prospect:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect);
    setFormData({
      name: prospect.name,
      company: prospect.company,
      email: prospect.email,
      phone: prospect.phone,
      value: prospect.value.toString(),
      notes: prospect.notes,
    });
    setError(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProspect || !formData.name || !formData.company) {
      setError('Nombre y empresa son requeridos');
      return;
    }

    try {
      setLoadingAction('editing');
      setError(null);

      const response = await fetch(`/api/crm/${editingProspect.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          value: parseInt(formData.value) || 0,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar prospecto');
      }

      const updatedProspect = await response.json();
      setProspects(
        prospects.map((p) =>
          p.id === editingProspect.id ? updatedProspect : p
        )
      );
      setShowEditModal(false);
      setEditingProspect(null);
      setFormData({ name: '', company: '', email: '', phone: '', value: '', notes: '' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('Error updating prospect:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteProspect = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este prospecto?')) {
      return;
    }

    try {
      setLoadingAction(`deleting-${id}`);
      setError(null);

      const response = await fetch(`/api/crm/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar prospecto');
      }

      setProspects(prospects.filter((p) => p.id !== id));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('Error deleting prospect:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChangeStage = async (prospectId: string, newStage: string) => {
    try {
      setLoadingAction(`stage-${prospectId}`);
      setError(null);

      const response = await fetch(`/api/crm/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar etapa');
      }

      const updatedProspect = await response.json();
      setProspects(
        prospects.map((p) =>
          p.id === prospectId ? updatedProspect : p
        )
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('Error changing stage:', err);
      // Recargar para asegurar consistencia
      fetchProspects();
    } finally {
      setLoadingAction(null);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      lead: 'var(--t3)',
      contacted: 'var(--blue)',
      qualified: 'var(--orange)',
      proposal: 'var(--purple)',
      negotiation: 'var(--pink)',
      won: 'var(--green)',
      lost: '#EF4444',
    };
    return colors[stage] || 'var(--t3)';
  };

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      lead: 'Lead',
      contacted: 'Contactado',
      qualified: 'Calificado',
      proposal: 'Propuesta',
      negotiation: 'Negociación',
      won: 'Ganado',
      lost: 'Perdido',
    };
    return labels[stage] || stage;
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Error Alert */}
      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          color: '#DC2626',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>💼 CRM</h1>
          <p style={{ fontSize: '14px', color: 'var(--t3)' }}>
            {loading ? 'Cargando...' : `Gestiona tu pipeline de ${prospects.length} prospectos`}
          </p>
        </div>
        <button
          onClick={handleNewProspect}
          disabled={loading || loadingAction !== null}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: loading || loadingAction !== null ? 'var(--t3)' : 'var(--blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || loadingAction !== null ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            opacity: loading || loadingAction !== null ? 0.6 : 1,
          }}
        >
          <Plus size={16} />
          Nuevo Prospecto
        </button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total', value: metrics.total },
          { label: 'Valor Promedio', value: `$${metrics.avgValue.toLocaleString()}` },
          { label: 'Ganados', value: metrics.won },
          { label: 'Valor Ganado', value: `$${metrics.wonValue.toLocaleString()}` },
        ].map((metric) => (
          <div key={metric.label} style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--b)' }}>
            <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
              {metric.label}
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Stages */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Pipeline por Etapa</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStageFilter(null)}
            style={{
              padding: '8px 14px',
              background: !stageFilter ? 'var(--blue)' : 'var(--bg2)',
              color: !stageFilter ? 'white' : 'var(--t2)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Todos ({prospects.length})
          </button>
          {PIPELINE_STAGES.map((stage) => {
            const count = prospects.filter((p) => p.stage === stage).length;
            return (
              <button
                key={stage}
                onClick={() => setStageFilter(stageFilter === stage ? null : stage)}
                style={{
                  padding: '8px 14px',
                  background: stageFilter === stage ? 'var(--blue)' : 'var(--bg2)',
                  color: stageFilter === stage ? 'white' : 'var(--t2)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {getStageLabel(stage)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Prospects Table */}
      <div style={{ background: 'var(--bg2)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--b)' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>
            <p>Cargando prospectos...</p>
          </div>
        ) : filteredProspects.length > 0 ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 120px',
              gap: '16px',
              padding: '16px',
              background: 'var(--bg)',
              borderBottom: '1px solid var(--b)',
              fontWeight: 600,
              fontSize: '12px',
              textTransform: 'uppercase',
            }}>
              <div>Prospecto</div>
              <div>Contacto</div>
              <div>Valor</div>
              <div>Etapa</div>
              <div>Acciones</div>
            </div>

            {filteredProspects.map((prospect) => (
              <div
                key={prospect.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 120px',
                  gap: '16px',
                  padding: '16px',
                  borderBottom: '1px solid var(--b)',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600 }}>{prospect.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>{prospect.company}</p>
                  {prospect.notes && <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>📝 {prospect.notes}</p>}
                </div>
                <div>
                  <p style={{ fontSize: '12px' }}>{prospect.email}</p>
                  <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{prospect.phone}</p>
                </div>
                <div style={{ fontWeight: 600 }}>${prospect.value.toLocaleString()}</div>
                <select
                  value={prospect.stage}
                  onChange={(e) => handleChangeStage(prospect.id, e.target.value)}
                  disabled={loadingAction !== null}
                  style={{
                    padding: '6px 8px',
                    background: 'var(--bg2)',
                    color: getStageColor(prospect.stage),
                    border: `1px solid ${getStageColor(prospect.stage)}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: loadingAction !== null ? 'not-allowed' : 'pointer',
                    opacity: loadingAction !== null ? 0.6 : 1,
                  }}
                >
                  {PIPELINE_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {getStageLabel(stage)}
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleEditProspect(prospect)}
                    disabled={loadingAction !== null}
                    style={{
                      padding: '6px',
                      background: 'var(--bg)',
                      border: '1px solid var(--b)',
                      borderRadius: '4px',
                      cursor: loadingAction !== null ? 'not-allowed' : 'pointer',
                      color: 'var(--t2)',
                      opacity: loadingAction !== null ? 0.6 : 1,
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteProspect(prospect.id)}
                    disabled={loadingAction !== null}
                    style={{
                      padding: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #EF4444',
                      borderRadius: '4px',
                      cursor: loadingAction !== null ? 'not-allowed' : 'pointer',
                      color: '#EF4444',
                      opacity: loadingAction !== null ? 0.6 : 1,
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>
            <p>No hay prospectos en esta etapa</p>
          </div>
        )}
      </div>

      {/* New Prospect Modal */}
      {showNewModal && (
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
          onClick={() => !loadingAction && setShowNewModal(false)}
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Nuevo Prospecto</h2>
            {error && (
              <div style={{
                marginBottom: '16px',
                padding: '10px 12px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '6px',
                color: '#DC2626',
                fontSize: '13px',
              }}>
                {error}
              </div>
            )}
            {['name', 'company', 'email', 'phone', 'value', 'notes'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={loadingAction === 'creating'}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  marginBottom: '12px',
                  opacity: loadingAction === 'creating' ? 0.6 : 1,
                  cursor: loadingAction === 'creating' ? 'not-allowed' : 'text',
                }}
              />
            ))}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveNew}
                disabled={loadingAction === 'creating'}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: loadingAction === 'creating' ? 'var(--t3)' : 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingAction === 'creating' ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: loadingAction === 'creating' ? 0.6 : 1,
                }}
              >
                {loadingAction === 'creating' ? 'Creando...' : 'Crear'}
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                disabled={loadingAction === 'creating'}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--bg2)',
                  color: 'var(--t2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  cursor: loadingAction === 'creating' ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: loadingAction === 'creating' ? 0.6 : 1,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProspect && (
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
          onClick={() => !loadingAction && setShowEditModal(false)}
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Editar Prospecto</h2>
            {error && (
              <div style={{
                marginBottom: '16px',
                padding: '10px 12px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '6px',
                color: '#DC2626',
                fontSize: '13px',
              }}>
                {error}
              </div>
            )}
            {['name', 'company', 'email', 'phone', 'value', 'notes'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={loadingAction === 'editing'}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  marginBottom: '12px',
                  opacity: loadingAction === 'editing' ? 0.6 : 1,
                  cursor: loadingAction === 'editing' ? 'not-allowed' : 'text',
                }}
              />
            ))}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveEdit}
                disabled={loadingAction === 'editing'}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: loadingAction === 'editing' ? 'var(--t3)' : 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingAction === 'editing' ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: loadingAction === 'editing' ? 0.6 : 1,
                }}
              >
                {loadingAction === 'editing' ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                disabled={loadingAction === 'editing'}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--bg2)',
                  color: 'var(--t2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  cursor: loadingAction === 'editing' ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: loadingAction === 'editing' ? 0.6 : 1,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

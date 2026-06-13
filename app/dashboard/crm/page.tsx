'use client';

import { useState } from 'react';
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

const MOCK_PROSPECTS: Prospect[] = [
  { id: '1', name: 'Juan García', company: 'TechCorp MX', email: 'juan@techcorp.mx', phone: '+52 55 1234 5678', stage: 'proposal', value: 50000, createdAt: 'Hoy', notes: 'Propuesta enviada, espera feedback' },
  { id: '2', name: 'María López', company: 'Innovatech', email: 'maria@innovatech.com', phone: '+52 33 9876 5432', stage: 'qualified', value: 75000, createdAt: 'Ayer', notes: 'Reunión positiva, datos técnicos' },
  { id: '3', name: 'Carlos Rodríguez', company: 'Digital Solutions', email: 'carlos@digital.com', phone: '+1 408 123 4567', stage: 'won', value: 100000, createdAt: 'Hace 2 días', notes: 'Contrato firmado' },
  { id: '4', name: 'Ana Martínez', company: 'CreativeAgency', email: 'ana@creative.mx', phone: '+52 55 5555 5555', stage: 'lead', value: 30000, createdAt: 'Hace 3 días', notes: 'Primer contacto, mostrar demo' },
  { id: '5', name: 'Roberto Sánchez', company: 'StartupHub', email: 'roberto@startuphub.com', phone: '+52 81 1111 2222', stage: 'contacted', value: 45000, createdAt: 'Hace 4 días', notes: 'Llamada programada para mañana' },
  { id: '6', name: 'Sofia Gómez', company: 'BrandCo', email: 'sofia@brandco.com', phone: '+52 33 3333 3333', stage: 'lost', value: 20000, createdAt: 'Hace 5 días', notes: 'Budget insuficiente' },
];

const PIPELINE_STAGES = ['lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

export default function CRMPage() {
  const [prospects, setProspects] = useState<Prospect[]>(MOCK_PROSPECTS);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    notes: '',
  });

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
    setShowNewModal(true);
  };

  const handleSaveNew = () => {
    if (formData.name && formData.company) {
      const newProspect: Prospect = {
        id: Math.random().toString(36),
        ...formData,
        stage: 'lead',
        value: parseInt(formData.value) || 0,
        createdAt: 'Hoy',
      };
      setProspects([newProspect, ...prospects]);
      setShowNewModal(false);
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
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingProspect) {
      setProspects(
        prospects.map((p) =>
          p.id === editingProspect.id
            ? { ...p, ...formData, value: parseInt(formData.value) || 0 }
            : p
        )
      );
      setShowEditModal(false);
    }
  };

  const handleDeleteProspect = (id: string) => {
    setProspects(prospects.filter((p) => p.id !== id));
  };

  const handleChangeStage = (prospectId: string, newStage: string) => {
    setProspects(
      prospects.map((p) =>
        p.id === prospectId ? { ...p, stage: newStage as any } : p
      )
    );
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>💼 CRM</h1>
          <p style={{ fontSize: '14px', color: 'var(--t3)' }}>Gestiona tu pipeline de {prospects.length} prospectos</p>
        </div>
        <button
          onClick={handleNewProspect}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
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
        {filteredProspects.length > 0 ? (
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
                  style={{
                    padding: '6px 8px',
                    background: 'var(--bg2)',
                    color: getStageColor(prospect.stage),
                    border: `1px solid ${getStageColor(prospect.stage)}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
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
                    style={{
                      padding: '6px',
                      background: 'var(--bg)',
                      border: '1px solid var(--b)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'var(--t2)',
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteProspect(prospect.id)}
                    style={{
                      padding: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #EF4444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#EF4444',
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
          onClick={() => setShowNewModal(false)}
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
            {['name', 'company', 'email', 'phone', 'value', 'notes'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              />
            ))}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveNew}
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
                Crear
              </button>
              <button
                onClick={() => setShowNewModal(false)}
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
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - similar structure */}
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
          onClick={() => setShowEditModal(false)}
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
            {['name', 'company', 'email', 'phone', 'value', 'notes'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--b)',
                  borderRadius: '8px',
                  color: 'var(--fg)',
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              />
            ))}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveEdit}
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
                Guardar
              </button>
              <button
                onClick={() => setShowEditModal(false)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

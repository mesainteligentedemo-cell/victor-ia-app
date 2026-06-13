'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Ticket {
  id: number;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  created: string;
  hours: number;
}

const MOCK_TICKETS: Ticket[] = [
  { id: 1, subject: 'Problema con generador de imágenes', priority: 'high', status: 'open', created: 'Hoy', hours: 2 },
  { id: 2, subject: 'Consulta sobre plan Pro', priority: 'medium', status: 'in-progress', created: 'Ayer', hours: 18 },
  { id: 3, subject: 'Error en dashboard analytics', priority: 'high', status: 'resolved', created: 'Hace 2 días', hours: 6 },
  { id: 4, subject: 'Integración con Slack no funciona', priority: 'high', status: 'open', created: 'Hace 1 día', hours: 24 },
  { id: 5, subject: 'Solicitud de feature: Dark Mode', priority: 'low', status: 'resolved', created: 'Hace 3 días', hours: 4 },
  { id: 6, subject: 'Error al descargar reportes', priority: 'medium', status: 'in-progress', created: 'Hoy', hours: 1 },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');

  const filteredTickets = tickets.filter(
    (t) =>
      (filterStatus === 'all' || t.status === filterStatus) &&
      (filterPriority === 'all' || t.priority === filterPriority)
  );

  const handleCreateTicket = () => {
    if (newTicketSubject.trim()) {
      const newTicket: Ticket = {
        id: Math.max(...tickets.map((t) => t.id)) + 1,
        subject: newTicketSubject,
        priority: 'medium',
        status: 'open',
        created: 'Ahora',
        hours: 0,
      };
      setTickets([newTicket, ...tickets]);
      setNewTicketSubject('');
      setShowNewTicket(false);
    }
  };

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const avgHours = Math.round(tickets.reduce((sum, t) => sum + t.hours, 0) / tickets.length);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return 'var(--orange)';
      default:
        return 'var(--green)';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'var(--orange)';
      case 'in-progress':
        return 'var(--blue)';
      default:
        return 'var(--green)';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700 }}>🎧 Servicio al Cliente</h1>
        <button
          onClick={() => setShowNewTicket(true)}
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
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <Plus size={16} /> Nuevo Ticket
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'TOTAL', value: tickets.length, color: 'var(--t2)' },
          { label: 'ABIERTOS', value: openCount, color: '#EF4444' },
          { label: 'EN PROGRESO', value: inProgressCount, color: 'var(--blue)' },
          { label: 'RESUELTOS', value: resolvedCount, color: 'var(--green)' },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{stat.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{
            padding: '8px 12px',
            background: 'var(--bg2)',
            color: 'var(--fg)',
            border: '1px solid var(--b)',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="open">Abierto</option>
          <option value="in-progress">En progreso</option>
          <option value="resolved">Resuelto</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          style={{
            padding: '8px 12px',
            background: 'var(--bg2)',
            color: 'var(--fg)',
            border: '1px solid var(--b)',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <option value="all">Todas las prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div style={{ background: 'var(--bg2)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', padding: '16px', borderBottom: '1px solid var(--b)', background: 'var(--bg)', fontWeight: 600, fontSize: '12px' }}>
          <div>ASUNTO</div>
          <div>PRIORIDAD</div>
          <div>ESTADO</div>
          <div>TIEMPO ABIERTO</div>
        </div>

        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '16px',
              borderBottom: '1px solid var(--b)',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <div>
              <p style={{ fontWeight: 500 }}>{ticket.subject}</p>
              <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>{ticket.created}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getPriorityColor(ticket.priority) }} />
              {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Media' : 'Baja'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(ticket.status) }} />
              {ticket.status === 'open' ? 'Abierto' : ticket.status === 'in-progress' ? 'En progreso' : 'Resuelto'}
            </div>
            <div style={{ color: 'var(--t3)' }}>{ticket.hours}h</div>
          </div>
        ))}
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
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
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Crear Nuevo Ticket</h2>
              <button
                onClick={() => setShowNewTicket(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--t3)',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Asunto del ticket..."
              value={newTicketSubject}
              onChange={(e) => setNewTicketSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg2)',
                border: '1px solid var(--b)',
                borderRadius: '8px',
                color: 'var(--fg)',
                fontSize: '14px',
                marginBottom: '20px',
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCreateTicket}
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
                Crear Ticket
              </button>
              <button
                onClick={() => setShowNewTicket(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--bg2)',
                  color: 'var(--fg)',
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

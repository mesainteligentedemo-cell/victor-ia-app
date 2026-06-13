'use client';

import { useState, useEffect } from 'react';
import { Users, Send, MessageCircle, Clock, CheckCircle2, Eye } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 'u1', name: 'Tú (Owner)', avatar: '👤', status: 'online', role: 'Admin', lastActive: 'now' },
  { id: 'u2', name: 'Alex Chen', avatar: '👨‍💼', status: 'online', role: 'Editor', lastActive: '2m ago' },
  { id: 'u3', name: 'Maria Garcia', avatar: '👩‍💼', status: 'idle', role: 'Viewer', lastActive: '15m ago' },
];

const PROJECTS = [
  {
    id: 'p1',
    name: 'Q2 Campaign 2024',
    status: 'in-progress',
    members: 3,
    outputs: 24,
    created: '2024-05-01',
    lastUpdated: '2024-05-17 14:32',
  },
  {
    id: 'p2',
    name: 'Product Launch Video',
    status: 'in-progress',
    members: 2,
    outputs: 8,
    created: '2024-05-10',
    lastUpdated: '2024-05-17 13:15',
  },
  {
    id: 'p3',
    name: 'Social Media Assets',
    status: 'completed',
    members: 1,
    outputs: 45,
    created: '2024-04-20',
    lastUpdated: '2024-05-15 09:20',
  },
];

const ACTIVITY = [
  { id: '1', user: 'Alex Chen', action: 'Generó', target: 'LinkedIn Copy (3 variants)', time: '2m ago', emoji: '✍️' },
  { id: '2', user: 'You', action: 'Aprobó', target: 'Product Photo v2', time: '5m ago', emoji: '👍' },
  { id: '3', user: 'Maria Garcia', action: 'Comentó en', target: 'YouTube Script', time: '12m ago', emoji: '💬' },
  { id: '4', user: 'Alex Chen', action: 'Generó', target: '20 Instagram Captions', time: '28m ago', emoji: '✍️' },
];

export default function CollaborationPage() {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [activeTab, setActiveTab] = useState<'projects' | 'team' | 'activity'>('projects');
  const [message, setMessage] = useState('');
  const [comments] = useState<any[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .project-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .project-card.active {
          border-color: #000;
          background: var(--bg3);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .team-member {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
        }
        .status-dot.idle {
          background: #f59e0b;
        }
        .status-dot.offline {
          background: #6b7280;
        }
        .activity-item {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          display: flex;
          gap: 12px;
          align-items: start;
        }
        .tab-btn {
          padding: 8px 16px;
          border: 1px solid var(--b);
          background: var(--bg2);
          color: var(--p);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }
        .btn {
          background: var(--bg3);
          border: 1px solid var(--b);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: var(--p);
          transition: all 0.2s;
        }
        .btn:hover {
          border-color: #000;
        }
        .btn.primary {
          background: #000;
          color: white;
          border-color: #000;
        }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Colaboración en Equipo</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Trabaja con tu equipo en tiempo real</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(['projects', 'team', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'projects' ? '📁 Proyectos' : tab === 'team' ? '👥 Equipo' : '⏱️ Actividad'}
          </button>
        ))}
      </div>

      {/* Proyectos */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }}>
          {/* Lista de Proyectos */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--t2)' }}>
              Proyectos ({PROJECTS.length})
            </h3>
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className={`project-card ${selectedProject.id === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>{project.name}</h4>
                <div style={{ fontSize: '11px', color: 'var(--t3)', lineHeight: '1.6' }}>
                  <p style={{ margin: 0 }}>👥 {project.members} miembros</p>
                  <p style={{ margin: '4px 0 0 0' }}>📊 {project.outputs} outputs</p>
                  <p style={{ margin: '4px 0 0 0' }}>🕐 {project.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detalles del Proyecto */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600 }}>{selectedProject.name}</h2>
              <p style={{ margin: 0, color: 'var(--t2)', fontSize: '13px' }}>
                Creado: {selectedProject.created} • Actualizado: {selectedProject.lastUpdated}
              </p>
            </div>

            {/* Team in Project */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Miembros del Equipo ({selectedProject.members})</h3>
              {TEAM_MEMBERS.slice(0, selectedProject.members).map((member) => (
                <div key={member.id} className="team-member">
                  <div style={{ fontSize: '20px' }}>{member.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{member.name}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>{member.role}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`status-dot ${member.status}`} />
                    <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: 'var(--t3)' }}>{member.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Outputs */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Outputs Recientes ({selectedProject.outputs})</h3>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Output #{selectedProject.outputs - i + 1}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>Generado por Alex • 2h ago</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn">👁️ Ver</button>
                    <button className="btn">💬 Comentar</button>
                    <button className="btn">👍 Aprobar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipo */}
      {activeTab === 'team' && (
        <div>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Tu Equipo ({TEAM_MEMBERS.length})</h2>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Miembros Activos</h3>
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--b)', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '20px' }}>{member.avatar}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{member.name}</p>
                  </div>
                </div>
                <div>
                  <div className={`status-dot ${member.status}`} style={{ marginBottom: '4px' }} />
                  {member.status === 'online' ? '🟢 En línea' : member.status === 'idle' ? '🟡 Inactivo' : '⚫ Offline'}
                </div>
                <div>{member.role}</div>
                <div style={{ color: 'var(--t2)' }}>{member.lastActive}</div>
              </div>
            ))}
          </div>

          {/* Invite Members */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Invitar Nuevos Miembros</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px' }}>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--b)',
                  borderRadius: '6px',
                  background: 'var(--bg)',
                  color: 'var(--p)',
                  fontSize: '13px',
                }}
              />
              <button className="btn primary">Invitar</button>
            </div>
          </div>
        </div>
      )}

      {/* Actividad */}
      {activeTab === 'activity' && (
        <div>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Historial de Actividad</h2>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button className="btn primary">Todas</button>
            <button className="btn">Generaciones</button>
            <button className="btn">Comentarios</button>
            <button className="btn">Aprobaciones</button>
          </div>

          {ACTIVITY.map((item) => (
            <div key={item.id} className="activity-item">
              <div style={{ fontSize: '24px' }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  <span style={{ fontWeight: 600 }}>{item.user}</span>
                  {' '}{item.action}{' '}
                  <span style={{ fontWeight: 600 }}>{item.target}</span>
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>⏱️ {item.time}</p>
              </div>
              <button className="btn">Ver</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
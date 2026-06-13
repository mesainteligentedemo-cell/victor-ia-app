'use client';

import { useState } from 'react';
import { Plus, Play, Pause, Trash2, Copy } from 'lucide-react';

const WORKFLOW_TEMPLATES = [
  { id: 'content-pipeline', name: 'Content Creation Pipeline', icon: '🎬', description: 'Photo → Video → Copy → Social Posts' },
  { id: 'weekly-content', name: 'Weekly Content Calendar', icon: '📅', description: 'Every Monday 9am - 5 social posts' },
  { id: 'lead-nurture', name: 'Lead Nurture Sequence', icon: '📧', description: '3 emails over 7 days' },
  { id: 'product-launch', name: 'Product Launch Campaign', icon: '🚀', description: 'Landing + Video + 20 social posts' },
];

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'library' | 'workflows' | 'executions'>('library');
  const [showBuilder, setShowBuilder] = useState(false);
  const [executions] = useState<any[]>([
    { id: '1', name: 'Weekly Content', status: 'completed', runAt: '2024-05-17 09:00', duration: '2m 34s', credits: 45 },
    { id: '2', name: 'Product Launch', status: 'running', runAt: '2024-05-17 14:32', duration: 'En progreso...', credits: 0 },
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const duplicateWorkflow = (workflow: any) => {
    const newWf = { ...workflow, id: `wf_${Date.now()}`, name: `${workflow.name} (copia)` };
    setWorkflows([...workflows, newWf]);
  };

  const createFromTemplate = (template: any) => {
    const newWf = { ...template, id: `wf_${Date.now()}`, enabled: true, steps: ['step1', 'step2', 'step3'] };
    setWorkflows([...workflows, newWf]);
    setActiveTab('workflows');
  };

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .tab-btn { padding: 8px 16px; border: 1px solid var(--b); background: var(--bg2); color: var(--p); border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .tab-btn.active { background: #000; color: white; border-color: #000; }
        .template-card { background: var(--bg2); border: 1px solid var(--b); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; }
        .template-card:hover { border-color: #000; transform: translateY(-2px); }
        .workflow-row { background: var(--bg2); border: 1px solid var(--b); border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .btn { background: var(--bg3); border: 1px solid var(--b); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--p); transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn:hover { border-color: #000; }
        .btn.primary { background: #000; color: white; border-color: #000; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: rgba(0,0,0,0.08); }
        .status-badge.running { background: #0ea5e9; color: white; }
        .status-badge.completed { background: #10b981; color: white; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Automatización</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Crea workflows que se ejecuten automáticamente</p>
        </div>
        {workflows.length > 0 && (
          <button className="btn primary" onClick={() => setShowBuilder(!showBuilder)}>
            <Plus size={16} /> Nuevo Workflow
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(['library', 'workflows', 'executions'] as const).map((tab) => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'library' ? '📚 Templates' : tab === 'workflows' ? '⚙️ Mis Workflows' : '⏱️ Ejecuciones'}
          </button>
        ))}
      </div>

      {activeTab === 'library' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600 }}>Workflows Predefinidos</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {WORKFLOW_TEMPLATES.map((template) => (
              <div key={template.id} className="template-card" onClick={() => createFromTemplate(template)}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{template.icon}</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>{template.name}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)' }}>{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'workflows' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{workflows.length} Workflows Activos</h2>
            <button className="btn primary" onClick={() => setActiveTab('library')}>
              <Plus size={16} /> Nuevo Workflow
            </button>
          </div>
          {workflows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--b)' }}>
              <p style={{ margin: 0, color: 'var(--t2)' }}>No hay workflows creados</p>
            </div>
          ) : (
            workflows.map((wf) => (
              <div key={wf.id} className="workflow-row">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                  <button className="btn" onClick={() => toggleWorkflow(wf.id)} style={{ background: wf.enabled ? '#10b981' : 'var(--bg3)', color: wf.enabled ? 'white' : 'var(--p)' }}>
                    {wf.enabled ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                  <div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{wf.name}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--t3)' }}>{wf.steps.length} pasos</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => duplicateWorkflow(wf)}><Copy size={14} /></button>
                  <button className="btn" onClick={() => deleteWorkflow(wf.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'executions' && (
        <div>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Historial de Ejecuciones</h2>
          {executions.map((exec) => (
            <div key={exec.id} className="workflow-row">
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{exec.name}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--t3)' }}>{exec.runAt}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>⏱️ {exec.duration}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--t3)' }}>{exec.credits} créditos</p>
                </div>
                <span className={`status-badge ${exec.status}`}>{exec.status === 'completed' ? '✓ Completado' : '⟳ En progreso'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

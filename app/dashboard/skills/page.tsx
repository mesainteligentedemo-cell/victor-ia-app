'use client';

import { useState } from 'react';
import { Zap, Lock, Award, TrendingUp, Target } from 'lucide-react';

const SKILL_TREES = [
  {
    id: 'copywriter',
    name: 'Copywriter Mastery',
    icon: '✍️',
    levels: [
      { level: 'Novice', xp: 0, unlocks: ['Basic prompts', 'Simple CTAs'], completed: true },
      { level: 'Intermediate', xp: 20, unlocks: ['Custom tone', 'A/B testing variants', 'Template library'], completed: true },
      { level: 'Advanced', xp: 50, unlocks: ['Brand voice cloning', 'SEO optimization', 'Psychological triggers'], completed: true },
      { level: 'Expert', xp: 100, unlocks: ['Conversions tracking', 'Multi-language', 'Team training'], completed: true },
      { level: 'Master', xp: 200, unlocks: ['Custom AI model fine-tune', 'Lifetime learning', 'Mentor status'], completed: false },
    ],
    currentLevel: 'Expert',
    currentXp: 85,
    nextLevelXp: 100,
  },
  {
    id: 'designer',
    name: 'Designer Mastery',
    icon: '🎨',
    levels: [
      { level: 'Novice', xp: 0, unlocks: ['Basic layouts'], completed: true },
      { level: 'Intermediate', xp: 20, unlocks: ['Custom colors', 'Typography', '3D basics'], completed: true },
      { level: 'Advanced', xp: 50, unlocks: ['Animation suite', 'Component library', 'Dark mode auto'], completed: false },
      { level: 'Expert', xp: 100, unlocks: ['AR preview', 'Team design systems', 'AI enhancement'], completed: false },
      { level: 'Master', xp: 200, unlocks: ['Custom GPU rendering', 'Real-time collaboration', 'Pattern library'], completed: false },
    ],
    currentLevel: 'Intermediate',
    currentXp: 35,
    nextLevelXp: 50,
  },
  {
    id: 'videographer',
    name: 'Videographer Mastery',
    icon: '🎬',
    levels: [
      { level: 'Novice', xp: 0, unlocks: ['30s videos'], completed: true },
      { level: 'Intermediate', xp: 20, unlocks: ['60s videos', 'Custom music', 'Ken Burns'], completed: false },
      { level: 'Advanced', xp: 50, unlocks: ['4K rendering', 'Effect library', '3D integration'], completed: false },
      { level: 'Expert', xp: 100, unlocks: ['Cinema effects', 'Real-time preview', 'Batch rendering'], completed: false },
      { level: 'Master', xp: 200, unlocks: ['Studio quality output', 'Team editing', 'Custom codecs'], completed: false },
    ],
    currentLevel: 'Novice',
    currentXp: 12,
    nextLevelXp: 20,
  },
];

const ACHIEVEMENTS = [
  { id: '100-outputs', name: 'Generador de Contenido', description: 'Generó 100 items', earned: true, icon: '💯', date: '2024-05-01' },
  { id: '50-stars', name: 'Obra Maestra', description: '50 outputs de 5 estrellas', earned: true, icon: '⭐', date: '2024-05-10' },
  { id: 'speedrunner', name: 'Speedrunner', description: '1000 items en 1 semana', earned: false, icon: '⚡', progress: 650 },
  { id: 'collaborator', name: 'Team Player', description: '5 proyectos colaborativos', earned: false, icon: '🤝', progress: 3 },
  { id: 'quality-master', name: 'Quality Master', description: 'Average 4.8+ stars', earned: false, icon: '🏆', progress: 0 },
  { id: 'rare-combo', name: 'Secret Finder', description: 'Encontró combo secreto', earned: false, icon: '🔐', progress: 0 },
];

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState(SKILL_TREES[0]);
  const [activeTab, setActiveTab] = useState<'trees' | 'achievements' | 'leaderboard'>('trees');

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .skill-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .skill-card.active {
          border-color: #000;
          background: var(--bg3);
        }
        .level-node {
          background: var(--bg2);
          border: 2px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.2s;
          position: relative;
        }
        .level-node.completed {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.08);
        }
        .level-node.current {
          border-color: #000;
          background: var(--bg3);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .level-node.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .level-badge {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .achievement-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
        }
        .achievement-card.earned {
          border-color: #fbbf24;
          background: rgba(251, 191, 36, 0.08);
        }
        .achievement-card.locked {
          opacity: 0.6;
        }
        .xp-bar {
          width: 100%;
          height: 12px;
          background: var(--b);
          border-radius: 6px;
          overflow: hidden;
          margin-top: 8px;
        }
        .unlock-item {
          background: rgba(0,0,0,0.05);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: '12px';
          margin-top: 4px;
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
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Skill Trees</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Domina cada especialidad y desbloquea nuevas capacidades</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(['trees', 'achievements', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'trees' ? '🌲 Skill Trees' : tab === 'achievements' ? '🏅 Logros' : '📊 Leaderboard'}
          </button>
        ))}
      </div>

      {/* Skill Trees */}
      {activeTab === 'trees' && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px' }}>
          {/* Skill List */}
          <div>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--t2)' }}>Especialidades</p>
            {SKILL_TREES.map((skill) => (
              <div
                key={skill.id}
                className={`skill-card ${selectedSkill.id === skill.id ? 'active' : ''}`}
                onClick={() => setSelectedSkill(skill)}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{skill.icon}</div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>{skill.name}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--t2)' }}>{skill.currentLevel}</p>
                <div className="xp-bar">
                  <div style={{
                    height: '100%',
                    width: `${(skill.currentXp / skill.nextLevelXp) * 100}%`,
                    background: '#000',
                  }} />
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>
                  {skill.currentXp}/{skill.nextLevelXp} XP
                </p>
              </div>
            ))}
          </div>

          {/* Skill Tree Detail */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>{selectedSkill.name}</h2>
              <p style={{ margin: 0, color: 'var(--t2)', fontSize: '14px' }}>Domina este árbol para desbloquear capacidades avanzadas</p>
            </div>

            {/* Level Progression */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              {selectedSkill.levels.map((level, i) => (
                <div
                  key={i}
                  className={`level-node ${level.completed ? 'completed' : selectedSkill.currentLevel === level.level ? 'current' : 'locked'}`}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {level.completed ? '✓' : level.level === selectedSkill.currentLevel ? '◉' : '○'}
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>{level.level}</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: 'var(--t2)' }}>
                    {level.xp} XP {level.xp > 0 && <span style={{ color: 'var(--t3)', fontWeight: 400 }}>req.</span>}
                  </p>

                  {level.unlocks.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--t2)' }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Desbloquea:</p>
                      {level.unlocks.map((unlock, j) => (
                        <div key={j} className="unlock-item">🔓 {unlock}</div>
                      ))}
                    </div>
                  )}

                  {level.level === selectedSkill.currentLevel && (
                    <div style={{ marginTop: '12px' }}>
                      <div className="xp-bar">
                        <div style={{
                          height: '100%',
                          width: `${(selectedSkill.currentXp / selectedSkill.nextLevelXp) * 100}%`,
                          background: '#000',
                        }} />
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>
                        {selectedSkill.currentXp}/{selectedSkill.nextLevelXp}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Current Progress */}
            <div style={{ marginTop: '32px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Target size={20} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Progreso Actual</h3>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Nivel: {selectedSkill.currentLevel}</p>
              <div className="xp-bar" style={{ height: '16px' }}>
                <div style={{
                  height: '100%',
                  width: `${(selectedSkill.currentXp / selectedSkill.nextLevelXp) * 100}%`,
                  background: '#10b981',
                }} />
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--t2)' }}>
                {selectedSkill.nextLevelXp - selectedSkill.currentXp} XP más para el siguiente nivel
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      {activeTab === 'achievements' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600 }}>Logros Desbloqueados</h2>
            <p style={{ margin: 0, color: 'var(--t2)', fontSize: '14px' }}>
              {ACHIEVEMENTS.filter(a => a.earned).length} / {ACHIEVEMENTS.length} logros completados
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{achievement.icon}</div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>{achievement.name}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--t2)' }}>{achievement.description}</p>

                {achievement.earned && achievement.date && (
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--t3)' }}>Desbloqueado: {achievement.date}</p>
                )}

                {!achievement.earned && achievement.progress !== undefined && (
                  <div>
                    <div className="xp-bar" style={{ height: '6px', marginBottom: '4px' }}>
                      <div style={{
                        height: '100%',
                        width: `${(achievement.progress / 100) * 100}%`,
                        background: '#f59e0b',
                      }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--t3)' }}>Progreso: {achievement.progress}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Leaderboard Global</h2>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--b)', display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px', gap: '16px', fontWeight: 600, fontSize: '12px', color: 'var(--t2)', textTransform: 'uppercase' }}>
              <div>Puesto</div>
              <div>Usuario</div>
              <div>XP Total</div>
              <div>Logros</div>
            </div>

            {[
              { position: 1, name: 'You (TÚ)', xp: 8450, achievements: 24, highlight: true },
              { position: 2, name: 'Alex Chen', xp: 9200, achievements: 28 },
              { position: 3, name: 'Maria Garcia', xp: 8950, achievements: 26 },
              { position: 4, name: 'Jake Wilson', xp: 8720, achievements: 25 },
              { position: 5, name: 'Sofia Rodriguez', xp: 8600, achievements: 23 },
            ].map((entry, i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  borderBottom: i < 4 ? '1px solid var(--b)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 120px 100px',
                  gap: '16px',
                  alignItems: 'center',
                  background: entry.highlight ? 'rgba(0,0,0,0.05)' : 'transparent',
                  fontWeight: entry.highlight ? 600 : 500,
                }}
              >
                <div style={{ fontSize: entry.position === 1 ? '28px' : '18px' }}>
                  {entry.position === 1 ? '🥇' : entry.position === 2 ? '🥈' : entry.position === 3 ? '🥉' : `#${entry.position}`}
                </div>
                <div>{entry.name}</div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{entry.xp.toLocaleString()}</div>
                <div>{entry.achievements} 🏆</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
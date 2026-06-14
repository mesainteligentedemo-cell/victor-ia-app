'use client';

import { useState } from 'react';
import { BookOpen, Play, CheckCircle, Lock } from 'lucide-react';

const COURSES = [
  { id: 1, title: 'Introducción a Victor IA', progress: 100, lessons: 5, icon: BookOpen, status: 'completed' },
  { id: 2, title: '155 Especialistas - Cómo Usarlos', progress: 65, lessons: 12, icon: Play, status: 'in-progress' },
  { id: 3, title: 'Generación de Contenido Avanzada', progress: 0, lessons: 8, icon: Lock, status: 'locked' },
  { id: 4, title: 'Automatizaciones con n8n', progress: 30, lessons: 10, icon: Play, status: 'in-progress' },
  { id: 5, title: 'Análisis y Reportes', progress: 0, lessons: 6, icon: Lock, status: 'locked' },
  { id: 6, title: 'Mentoría 1-a-1 con Victor', progress: 0, lessons: 4, icon: Lock, status: 'locked' },
];

export default function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const completedCourses = COURSES.filter(c => c.status === 'completed').length;
  const totalProgress = Math.round(COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
          📚 Capacitaciones
        </h1>
        <p style={{ color: 'var(--t3)' }}>Aprende a dominar Victor IA con nuestros cursos</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>PROGRESO TOTAL</p>
          <p style={{ fontSize: '32px', fontWeight: 700 }}>{totalProgress}%</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>COMPLETADOS</p>
          <p style={{ fontSize: '32px', fontWeight: 700 }}>{completedCourses}/{COURSES.length}</p>
        </div>
        <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>EN PROGRESO</p>
          <p style={{ fontSize: '32px', fontWeight: 700 }}>{COURSES.filter(c => c.status === 'in-progress').length}</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {COURSES.map((course) => (
          <div
            key={course.id}
            onClick={() => course.status !== 'locked' && setSelectedCourse(course.id)}
            style={{
              padding: '20px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: '12px',
              cursor: course.status === 'locked' ? 'not-allowed' : 'pointer',
              opacity: course.status === 'locked' ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (course.status !== 'locked') {
                e.currentTarget.style.borderColor = 'var(--blue)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--b)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>
                {course.status === 'completed' && <CheckCircle size={28} style={{ color: '#10B981' }} />}
                {course.status === 'in-progress' && <Play size={28} style={{ color: 'var(--blue)' }} />}
                {course.status === 'locked' && <Lock size={28} />}
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{course.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '12px' }}>{course.lessons} lecciones</p>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: course.progress + '%',
                height: '100%',
                background: 'linear-gradient(90deg, var(--blue), var(--green))',
                transition: 'width 0.3s',
              }} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '8px' }}>{course.progress}% completado</p>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }} onClick={() => setSelectedCourse(null)}>
          <div style={{
            background: 'var(--bg)',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              {COURSES.find(c => c.id === selectedCourse)?.title}
            </h2>
            <p style={{ color: 'var(--t3)', marginBottom: '24px' }}>
              {COURSES.find(c => c.id === selectedCourse)?.lessons} lecciones · {COURSES.find(c => c.id === selectedCourse)?.progress}% completado
            </p>
            <button
              onClick={() => setSelectedCourse(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--blue)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continuar Aprendiendo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  hint: string;
  route?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a Victor IA!',
    description: 'Tu agencia IA de 155 especialistas está lista. Te mostraremos cómo funciona.',
    hint: 'Esta es tu primera vez. Vamos a hacer un tour rápido.',
  },
  {
    id: 'chat',
    title: '💬 Chat Inteligente',
    description: 'Conversa con agentes IA en tiempo real. Soporte inmediato 24/7.',
    hint: 'Haz click en "Chat" para comenzar una conversación.',
    route: '/dashboard/chat',
  },
  {
    id: 'agents',
    title: '🤖 Agentes Especializados',
    description: '8 agentes expertos: Lead Qualifier, Pitch Generator, Content Strategist, SEO Expert, etc.',
    hint: 'Selecciona un agente y haz click en "Ejecutar" para ver cómo trabaja.',
    route: '/dashboard/agents',
  },
  {
    id: 'library',
    title: '📚 Biblioteca de Assets',
    description: '45,000+ recursos: imágenes, videos, audios, documentos, componentes web.',
    hint: 'Busca y filtra assets. Puedes exportar o compartir.',
    route: '/dashboard/library',
  },
  {
    id: 'analytics',
    title: '📊 Dashboard Analytics',
    description: 'Métricas en tiempo real con gráficas interactivas.',
    hint: 'Monitorea usuarios, chats, generaciones e ingresos.',
    route: '/dashboard/analytics',
  },
  {
    id: 'sales',
    title: '💰 Pipeline de Ventas',
    description: 'Gestión de oportunidades en 4 etapas.',
    hint: 'Prospect → Proposal → Authorized → Completed.',
    route: '/dashboard/sales',
  },
  {
    id: 'marketing',
    title: '📣 Marketing Avanzado',
    description: '4 campañas activas con tracking de reach, engagement y ROI.',
    hint: 'Automatiza flujos y monitorea resultados en tiempo real.',
    route: '/dashboard/marketing',
  },
  {
    id: 'finance',
    title: '⚖️ Finanzas & Legal',
    description: 'Dashboard financiero: ingresos, gastos, utilidad y transacciones detalladas.',
    hint: 'Consulta reportes y proyecciones de cashflow.',
    route: '/dashboard/finance',
  },
  {
    id: 'support',
    title: '🎧 Servicio al Cliente',
    description: 'Sistema de tickets con priorización y SLA tracking.',
    hint: 'Crea tickets, asigna prioridades, resuelve problemas.',
    route: '/dashboard/support',
  },
  {
    id: 'done',
    title: '🎉 ¡Ya conoces todos los módulos!',
    description: 'Ahora eres experto. Explora, crea, automatiza. Tu agencia IA está lista.',
    hint: 'Haz click en "Completar" para cerrar este tour.',
  },
];

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Verificar si el onboarding ya fue completado en localStorage
    const hasCompleted = localStorage.getItem('onboarding_completed');
    if (!hasCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Si el paso tiene una ruta, navegar ahí
      const step = ONBOARDING_STEPS[nextStep];
      if (step.route) {
        window.location.href = step.route;
      }
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsOpen(false);
    setCompleted(true);
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleSkip}
    >
      <div
        style={{
          background: 'var(--bg)',
          borderRadius: '16px',
          padding: '40px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
              Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 700 }}>
              {step.title}
            </h2>
          </div>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--t3)',
              padding: '8px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: '15px', color: 'var(--t2)', marginBottom: '16px', lineHeight: 1.6 }}>
          {step.description}
        </p>

        {/* Hint Box */}
        <div
          style={{
            padding: '16px',
            background: 'var(--bg2)',
            borderLeft: '4px solid var(--blue)',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          <p style={{ fontSize: '14px', color: 'var(--t2)' }}>
            <strong>💡 Tip:</strong> {step.hint}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'var(--b)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--blue)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '8px', textAlign: 'right' }}>
            {Math.round(progress)}%
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i <= currentStep ? 'var(--blue)' : 'var(--b)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--bg2)',
              color: 'var(--t2)',
              border: '1px solid var(--b)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Saltar tour
          </button>
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--blue)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                <CheckCircle size={16} />
                Completar
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

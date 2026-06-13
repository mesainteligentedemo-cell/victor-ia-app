'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  MessageSquare,
  Zap,
  BookOpen,
  BarChart3,
  TrendingUp,
  Megaphone,
  Headphones,
  DollarSign,
  Rocket,
} from 'lucide-react';

const STORAGE_KEY = 'victor_onboarding_done';

const onboardingSteps = [
  {
    id: 1,
    title: 'Bienvenido a Victor IA',
    description: 'Tu asistente inteligente para gestionar clientes, proyectos y ventas en tiempo real.',
    hint: '💡 Tip: Presiona ESC en cualquier momento para cerrar este tour.',
    icon: Rocket,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Chat en Tiempo Real',
    description: 'Comunícate con tu equipo y clientes desde un único lugar. Historial completo y búsqueda avanzada.',
    hint: '💡 Tip: Usa @menciones para notificar a específicas personas.',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Agentes IA Inteligentes',
    description: 'Delega tareas repetitivas. Nuestros agentes trabajan 24/7 en automatización y análisis.',
    hint: '💡 Tip: Crea workflows personalizados sin código con el generador visual.',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    title: 'Biblioteca de Recursos',
    description: 'Accede a plantillas, componentes y activos digitales listos para usar en tus proyectos.',
    hint: '💡 Tip: Busca por etiqueta o categoría para encontrar exactamente lo que necesitas.',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 5,
    title: 'Analytics & Reportes',
    description: 'Visualiza KPIs en tiempo real. Dashboards personalizables con exportación a PDF/Excel.',
    hint: '💡 Tip: Crea alertas automáticas cuando las métricas cruzen umbrales críticos.',
    icon: BarChart3,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 6,
    title: 'Pipeline de Ventas',
    description: 'Gestiona leads, propuestas y cierres. Visualización tipo Kanban con predicción de ingresos.',
    hint: '💡 Tip: Arrastra tarjetas entre columnas para actualizar estados automáticamente.',
    icon: TrendingUp,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 7,
    title: 'Campañas de Marketing',
    description: 'Planifica, ejecuta y mide campañas multicanal. Email, SMS, social media integrados.',
    hint: '💡 Tip: Usa A/B testing automático para optimizar tus CTAs.',
    icon: Megaphone,
    color: 'from-rose-500 to-orange-500',
  },
  {
    id: 8,
    title: 'Centro de Soporte',
    description: 'Gestiona tickets de clientes, FAQs y documentación. SLA automático y asignación inteligente.',
    hint: '💡 Tip: Responde en menos de 2 minutos promedio con templates IA.',
    icon: Headphones,
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 9,
    title: 'Finanzas & Facturación',
    description: 'Emite facturas, controla gastos y reconcilia pagos. Integraciones bancarias automáticas.',
    hint: '💡 Tip: Configura ciclos de facturación recurrente para clientes fijos.',
    icon: DollarSign,
    color: 'from-lime-500 to-green-500',
  },
  {
    id: 10,
    title: '¡Listo para despegar!',
    description: 'Ya tienes acceso completo. Explora, crea y crece sin límites. Soporte 24/7 siempre disponible.',
    hint: '🚀 Comienza ahora: ve a Dashboard o crea tu primer proyecto.',
    icon: CheckCircle2,
    color: 'from-violet-500 to-purple-500',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Verificar si el tour ya fue completado
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        setIsVisible(true);
      }
    }

    // Listener para ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        closeTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const closeTour = () => {
    setIsAnimating(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const goToStep = (stepIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsAnimating(false);
    }, 200);
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
        opacity: isAnimating ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}
      onClick={closeTour}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg, #ffffff)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '90%',
          maxWidth: '640px',
          overflow: 'hidden',
          transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div
          style={{
            background: `linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)`,
            padding: '32px 24px 24px',
            color: 'white',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={28} strokeWidth={2} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  margin: '0 0 4px 0',
                  lineHeight: '1.2',
                }}
              >
                {step.title}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  opacity: 0.9,
                  margin: 0,
                }}
              >
                Paso {currentStep + 1} de {onboardingSteps.length}
              </p>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={closeTour}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')
            }
          >
            <X size={20} />
          </button>
        </div>

        {/* Barra de progreso */}
        <div
          style={{
            height: '4px',
            backgroundColor: 'var(--border, #e5e7eb)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundImage: 'linear-gradient(90deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)',
              width: `${progress}%`,
              transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>

        {/* Contenido principal */}
        <div
          style={{
            padding: '32px 24px',
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {/* Descripción */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'var(--text, #1f2937)',
              margin: '0 0 16px 0',
              fontWeight: 400,
            }}
          >
            {step.description}
          </p>

          {/* Hint/Tip */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary, #f3f4f6)',
              borderLeft: '4px solid rgb(59, 130, 246)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              color: 'var(--text-secondary, #6b7280)',
              lineHeight: '1.5',
            }}
          >
            {step.hint}
          </div>
        </div>

        {/* Indicadores de paso */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            padding: '16px 24px',
            flexWrap: 'wrap',
          }}
        >
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor:
                  index <= currentStep
                    ? 'rgb(59, 130, 246)'
                    : 'var(--border, #e5e7eb)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: index <= currentStep ? 1 : 0.5,
              }}
              title={`Paso ${index + 1}`}
            />
          ))}
        </div>

        {/* Botones de acción */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '0 24px 24px 24px',
            borderTop: '1px solid var(--border, #e5e7eb)',
            paddingTop: '24px',
          }}
        >
          {/* Botón anterior */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: '1px solid var(--border, #e5e7eb)',
              backgroundColor: 'transparent',
              color: 'var(--text, #1f2937)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 0) {
                (e.currentTarget.style.backgroundColor = 'var(--bg-secondary, #f3f4f6)');
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.backgroundColor = 'transparent');
            }}
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {/* Botón saltar */}
          <button
            onClick={closeTour}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid var(--border, #e5e7eb)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary, #6b7280)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.backgroundColor = 'var(--bg-secondary, #f3f4f6)');
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.backgroundColor = 'transparent');
            }}
          >
            Saltar tour
          </button>

          {/* Botón siguiente/completar */}
          <button
            onClick={nextStep}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 24px',
              backgroundColor: 'rgb(59, 130, 246)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.backgroundColor = 'rgb(37, 99, 235)');
              (e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)');
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.backgroundColor = 'rgb(59, 130, 246)');
              (e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)');
            }}
          >
            {currentStep === onboardingSteps.length - 1 ? 'Completar' : 'Siguiente'}
            {currentStep < onboardingSteps.length - 1 && <ChevronRight size={16} />}
          </button>
        </div>

        {/* Footer info */}
        <div
          style={{
            borderTop: '1px solid var(--border, #e5e7eb)',
            padding: '12px 24px',
            backgroundColor: 'var(--bg-secondary, #f3f4f6)',
            fontSize: '12px',
            color: 'var(--text-secondary, #6b7280)',
            textAlign: 'center',
          }}
        >
          Presiona <kbd style={{ padding: '2px 6px', background: 'var(--bg, #ffffff)', borderRadius: '4px' }}>ESC</kbd> para cerrar
        </div>
      </div>
    </div>
  );
}

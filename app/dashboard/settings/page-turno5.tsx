'use client'

import { useState } from 'react'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { ScrollReveal } from '@/components/scroll/ScrollReveal'
import { Icon } from '@/components/Icon'

/**
 * SETTINGS PAGE — TURNO 5 REFACTORED
 * Configuración de usuario, preferencias, integraciones
 */

const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    title: 'Perfil',
    icon: 'Home' as const,
    settings: [
      { id: 'name', label: 'Nombre Completo', value: 'Victor IA User', type: 'text' },
      { id: 'email', label: 'Email', value: 'user@victor-ia.com', type: 'email' },
      { id: 'phone', label: 'Teléfono', value: '+52 1234567890', type: 'tel' },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferencias',
    icon: 'Settings' as const,
    settings: [
      { id: 'theme', label: 'Tema', value: 'Oscuro', type: 'select', options: ['Claro', 'Oscuro', 'Auto'] },
      { id: 'language', label: 'Idioma', value: 'Español', type: 'select', options: ['Español', 'English', 'Português'] },
      { id: 'timezone', label: 'Zona Horaria', value: 'América/México_City', type: 'select' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: 'Bell' as const,
    settings: [
      { id: 'email_notifications', label: 'Email de generaciones', value: true, type: 'toggle' },
      { id: 'daily_digest', label: 'Resumen diario', value: true, type: 'toggle' },
      { id: 'alerts', label: 'Alertas de límites', value: true, type: 'toggle' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integraciones',
    icon: 'Code' as const,
    settings: [
      { id: 'zapier', label: 'Zapier', value: 'Conectado', type: 'integration' },
      { id: 'make', label: 'Make.com', value: 'Conectado', type: 'integration' },
      { id: 'n8n', label: 'n8n', value: 'No conectado', type: 'integration' },
    ],
  },
]

export default function SettingsPageTurno5() {
  const [formData, setFormData] = useState({
    name: 'Victor IA User',
    email: 'user@victor-ia.com',
    theme: 'Oscuro',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <ScrollReveal direction="up" delay={0}>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              Configuración
            </p>
            <div className="flex items-center gap-4">
              <Icon name="Settings" size={48} animated animation="scalePop" />
              <h1 className="text-hero font-display italic font-bold">
                Ajustes
              </h1>
            </div>
            <p className="text-text-secondary mt-4">
              Personaliza tu experiencia con Victor IA
            </p>
          </div>
        </ScrollReveal>

        {/* SETTINGS SECTIONS */}
        {SETTINGS_SECTIONS.map((section, idx) => (
          <ScrollReveal key={section.id} direction="up" delay={0.1 + idx * 0.05}>
            <DashboardSection
              title={section.title}
              delay={0.2 + idx * 0.05}
            >
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="card flex items-center justify-between">
                    <label className="text-sm font-body font-600 flex-1">
                      {setting.label}
                    </label>

                    {setting.type === 'text' || setting.type === 'email' || setting.type === 'tel' ? (
                      <input
                        type={setting.type}
                        name={setting.id}
                        value={formData[setting.id as keyof typeof formData] || setting.value}
                        onChange={handleChange}
                        className="bg-white bg-opacity-10 border border-border-secondary rounded px-3 py-2 text-sm max-w-xs"
                      />
                    ) : setting.type === 'select' ? (
                      <select
                        name={setting.id}
                        value={formData[setting.id as keyof typeof formData] || setting.value}
                        onChange={handleChange}
                        className="bg-white bg-opacity-10 border border-border-secondary rounded px-3 py-2 text-sm max-w-xs"
                      >
                        {(setting as any).options?.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : setting.type === 'toggle' ? (
                      <button className="w-12 h-6 bg-white bg-opacity-20 rounded-full transition-all hover:bg-opacity-30" />
                    ) : setting.type === 'integration' ? (
                      <div className="flex items-center gap-2">
                        <Icon
                          name={
                            setting.value === 'Conectado' ? 'CheckCircle' : 'AlertCircle'
                          }
                          size={20}
                          className={setting.value === 'Conectado' ? 'text-green-400' : 'text-text-muted'}
                        />
                        <span className="text-sm text-text-secondary">
                          {setting.value}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </DashboardSection>
          </ScrollReveal>
        ))}

        {/* SAVE BUTTON */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="flex gap-4">
            <button className="btn btn-primary">
              Guardar Cambios
            </button>
            <button className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </ScrollReveal>

        {/* DANGER ZONE */}
        <ScrollReveal direction="up" delay={0.45}>
          <div className="card border border-red-500 border-opacity-20 bg-red-500 bg-opacity-5">
            <h3 className="text-lg font-body font-600 mb-4 text-red-400">
              Zona Peligrosa
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Estas acciones no se pueden deshacer
            </p>
            <div className="space-y-2">
              <button className="btn btn-ghost border border-red-500 border-opacity-30 text-red-400 hover:text-red-300 w-full">
                Exportar Datos
              </button>
              <button className="btn btn-ghost border border-red-500 border-opacity-30 text-red-400 hover:text-red-300 w-full">
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

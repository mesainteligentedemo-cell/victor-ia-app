'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { ScrollReveal } from '@/components/scroll/ScrollReveal'
import { Icon } from '@/components/Icon'

/**
 * CHAT PAGE — TURNO 5 REFACTORED
 * Conversación con agente IA
 */

const CHAT_TEMPLATES = [
  { icon: 'Palette' as const, name: 'Crear imagen', prompt: 'Crea una imagen de...' },
  { icon: 'FileText' as const, name: 'Escribir copy', prompt: 'Escribe copy para...' },
  { icon: 'Zap' as const, name: 'Brainstorm', prompt: 'Brainstorm sobre...' },
  { icon: 'Send' as const, name: 'Email', prompt: 'Redacta email para...' },
]

export default function ChatPageTurno5() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant' as const,
      text: '¡Hola! Soy el asistente IA de Victor. ¿Cómo puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: messages.length + 1,
      role: 'user' as const,
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'assistant' as const,
          text: '✨ Entiendo. Procesando tu solicitud...',
          timestamp: new Date(),
        },
      ])
    }, 500)

    setInputValue('')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex flex-col h-full">
        {/* HEADER */}
        <ScrollReveal direction="up" delay={0}>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              Conversación
            </p>
            <div className="flex items-center gap-4">
              <Icon name="Chat" size={48} animated animation="scalePop" />
              <h1 className="text-hero font-display italic font-bold">
                Chat IA
              </h1>
            </div>
            <p className="text-text-secondary mt-4">
              Conversa con tu asistente IA. Crea, edita, analiza y más.
            </p>
          </div>
        </ScrollReveal>

        {/* MESSAGES AREA */}
        <ScrollReveal direction="up" delay={0.1} className="flex-1 overflow-y-auto mb-6">
          <div className="space-y-4">
            {messages.length === 1 ? (
              <div className="space-y-4 mt-8">
                <DashboardSection title="Prueba algo" delay={0.2}>
                  <div className="grid grid-cols-2 gap-3">
                    {CHAT_TEMPLATES.map((template) => (
                      <button
                        key={template.name}
                        onClick={() => setInputValue(template.prompt)}
                        className="card hover:bg-elevated text-left"
                      >
                        <Icon name={template.icon} size={32} className="mb-2" />
                        <p className="text-sm font-body font-600">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </DashboardSection>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <Icon name="Chat" size={24} className="flex-shrink-0" />
                  )}
                  <div
                    className={`max-w-2xl p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-white bg-opacity-10 text-white'
                        : 'bg-white bg-opacity-5 text-text-secondary'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-text-muted mt-2">
                      {msg.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollReveal>

        {/* INPUT AREA */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="sticky bottom-0 bg-gradient-to-t from-black via-black to-transparent pt-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 bg-white bg-opacity-5 border border-border-secondary rounded-lg px-4 py-3 text-white placeholder-text-muted focus:border-white focus:outline-none transition-colors"
              />
              <button
                onClick={handleSendMessage}
                className="btn btn-primary flex-shrink-0"
              >
                <Icon name="Send" size={20} />
              </button>
            </div>
            <p className="text-xs text-text-dim mt-2 text-center">
              Presiona Enter o haz clic en enviar
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

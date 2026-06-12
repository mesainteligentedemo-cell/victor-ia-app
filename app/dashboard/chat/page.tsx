'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import InputBar from '@/components/chat/InputBar';
import LaserOverlay from '@/components/panels/LaserOverlay';
import { Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy Victor IA. ¿En qué puedo ayudarte hoy? Puedo ayudarte con generación de contenido, análisis, codificación y mucho más.',
      timestamp: 'Ahora',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [laserOpen, setLaserOpen] = useState(false);
  const [narrative, setNarrative] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const narrativeText = `> Procesando: "${text}"
> Modelo: Claude 3.5 Sonnet
> Tokens: 1,250 → 3,850
> Latencia: 1.24s
> Temperatura: 0.7
> Tokens/seg: ~2,088`;

      setNarrative(narrativeText);
      setLaserOpen(true);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `He procesado tu solicitud usando 155 especialistas en paralelo. El sistema ha generado:

• Análisis conceptual completado
• 3 variantes de solución evaluadas
• Plan de ejecución optimizado
• Recursos asignados a 12 agentes

Próximo paso: ¿Quieres que genere contenido específico o que profundice en algún aspecto?`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'calc(100vh - 120px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid var(--b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Chat con IA
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
            ⭐ Sonnet 4.6 · 155 especialistas disponibles
          </p>
        </div>
        <button
          onClick={() => setLaserOpen(!laserOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <Zap size={16} />
          ⚡ Lanzar en paralelo
        </button>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        {isLoading && (
          <ChatMessage
            role="assistant"
            content=""
            isLoading={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <InputBar
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />

      {/* Laser Overlay (Narrative) */}
      <LaserOverlay
        isOpen={laserOpen}
        onClose={() => setLaserOpen(false)}
        title="📊 Narrativa de Generación"
        content={narrative || 'Esperando procesamiento...'}
      />
    </div>
  );
}
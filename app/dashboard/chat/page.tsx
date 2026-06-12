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

    try {
      const startTime = Date.now();

      // Call Claude API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          systemPrompt: 'Eres Victor IA, una agencia de inteligencia artificial con 155 especialistas. Responde con precisión, genera ideas innovadoras y estructura tus respuestas para ser claras y accionables.',
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const latencyMs = Date.now() - startTime;
      const latency = (latencyMs / 1000).toFixed(2);
      const latencyNum = parseFloat(latency);

      const narrativeText = `> Procesando: "${text.substring(0, 50)}..."
> Modelo: ⭐ Sonnet 4.6
> Tokens: ~${Math.floor(text.length / 4)} → ~${Math.floor(data.response.length / 3)}
> Latencia: ${latency}s
> Temperatura: 0.7
> Tokens/seg: ~${Math.floor(data.response.length / (latencyNum * 4))}`;

      setNarrative(narrativeText);
      setLaserOpen(true);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Hubo un error procesando tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
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
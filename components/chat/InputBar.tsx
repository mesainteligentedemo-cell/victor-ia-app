'use client';

import { useState, useRef } from 'react';
import { Send, Mic, X } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function InputBar({ onSendMessage, isLoading }: InputBarProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition no disponible en este navegador');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.language = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(transcript);
        setMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div
      style={{
        padding: '16px',
        borderTop: '1px solid var(--b)',
        background: 'var(--bg)',
      }}
    >
      {/* Transcript display */}
      {transcript && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--t3)',
            marginBottom: '8px',
            padding: '8px 12px',
            background: 'var(--bg2)',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          🎤 {transcript}
        </div>
      )}

      {/* Input Area */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
        }}
      >
        {/* Mic Button */}
        <button
          onClick={startVoiceInput}
          disabled={isLoading}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isListening ? 'var(--red)' : 'var(--bg2)',
            border: '1px solid var(--b)',
            color: isListening ? '#FFFFFF' : 'var(--t2)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            opacity: isLoading ? 0.5 : 1,
            animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
          title={isListening ? 'Detener grabación' : 'Iniciar grabación de voz'}
        >
          {isListening ? <X size={18} /> : <Mic size={18} />}
        </button>

        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje o usa el micrófono..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 12px',
            background: 'var(--bg2)',
            border: '1px solid var(--b)',
            borderRadius: '12px',
            color: 'var(--t1)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            resize: 'none',
            maxHeight: '80px',
            minHeight: '40px',
            outline: 'none',
            transition: 'border-color 0.2s',
            cursor: isLoading ? 'not-allowed' : 'text',
            opacity: isLoading ? 0.6 : 1,
          }}
          rows={1}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--blue)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--b)';
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: message.trim() && !isLoading ? 'var(--blue)' : 'var(--bg2)',
            border: 'none',
            color: message.trim() && !isLoading ? '#FFFFFF' : 'var(--t3)',
            cursor: message.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          title="Enviar mensaje (Enter)"
        >
          {isLoading ? (
            <div className="spin" style={{ width: '18px', height: '18px' }}>
              ⟳
            </div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      {/* Helper text */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--t4)',
          marginTop: '8px',
          paddingLeft: '44px',
        }}
      >
        Shift + Enter para nueva línea
      </div>
    </div>
  );
}
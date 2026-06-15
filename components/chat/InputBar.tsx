'use client';

import { useState, useRef } from 'react';
import { VictorIcon } from '@/components/Icons/victor-icons/VictorIcons';

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
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech Recognition no disponible');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.language = 'es-ES';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setMessage((prev) => (prev + ' ' + finalTranscript).trim());
          setTranscript('');
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
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
      setTranscript('');
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
          {isListening ? <VictorIcon name="close" size={18} /> : <svg width={18} height={18} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter"><rect x="9" y="2" width="6" height="11"/><path d="M5 11 A7 7 0 0 0 19 11"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>}
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
            <VictorIcon name="send" size={18} />
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
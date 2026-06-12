'use client';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isLoading?: boolean;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
  isLoading,
}: ChatMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        animation: 'fadeUp 0.3s ease-out',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          backgroundColor: role === 'user' ? 'var(--blue)' : 'var(--bg2)',
          color: role === 'user' ? '#FFFFFF' : 'var(--t1)',
          padding: '12px 16px',
          borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          border: role === 'assistant' ? '1px solid var(--b)' : 'none',
          wordBreak: 'break-word',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        {isLoading ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', animation: 'sdot 1.4s infinite' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', animation: 'sdot 1.4s infinite 0.2s' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', animation: 'sdot 1.4s infinite 0.4s' }} />
          </div>
        ) : (
          content
        )}
      </div>

      {timestamp && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--t3)',
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'flex-end',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {timestamp}
        </div>
      )}
    </div>
  );
}
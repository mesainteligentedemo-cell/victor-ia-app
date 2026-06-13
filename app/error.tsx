'"'"'use client'"'"';

import { useEffect } from '"'"'react'"'"';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: '"'"'flex'"'"',
        flexDirection: '"'"'column'"'"',
        alignItems: '"'"'center'"'"',
        justifyContent: '"'"'center'"'"',
        minHeight: '"'"'100vh'"'"',
        backgroundColor: '"'"'var(--bg)'"'"',
        color: '"'"'var(--fg)'"'"',
        padding: '"'"'20px'"'"',
      }}
    >
      <h1 style={{ fontSize: '"'"'32px'"'"', fontWeight: '"'"'bold'"'"', marginBottom: '"'"'16px'"'"' }}>
        ❌ Algo salió mal
      </h1>
      <p
        style={{
          fontSize: '"'"'16px'"'"',
          color: '"'"'var(--t3)'"'"',
          maxWidth: '"'"'500px'"'"',
          textAlign: '"'"'center'"'"',
          marginBottom: '"'"'32px'"'"',
        }}
      >
        Lo sentimos, ocurrió un error inesperado. Intenta nuevamente.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '"'"'12px 24px'"'"',
          backgroundColor: '"'"'var(--blue)'"'"',
          color: '"'"'#FFFFFF'"'"',
          border: '"'"'none'"'"',
          borderRadius: '"'"'8px'"'"',
          fontSize: '"'"'14px'"'"',
          fontWeight: '"'"'600'"'"',
          cursor: '"'"'pointer'"'"',
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}

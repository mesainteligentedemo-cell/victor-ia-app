// Environment variable access utility
// For Next.js, client-side env vars need NEXT_PUBLIC_ prefix

export const ELEVENLABS_AGENT_ID =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '')
    : (process.env.ELEVENLABS_AGENT_ID || '');

if (!ELEVENLABS_AGENT_ID) {
  console.warn('⚠️ ELEVENLABS_AGENT_ID environment variable not set');
}

export default {
  ELEVENLABS_AGENT_ID,
};

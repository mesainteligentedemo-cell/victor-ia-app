/**
 * ElevenLabs voice catalogue for the Voice Studio.
 * Region-restricted to MX + USA per project standard (vtc_voces_simplificadas).
 *
 * The Mexican "Enrique M. Nieto" voice is Victor's canonical voice and is used
 * as the default. The remaining IDs are stable ElevenLabs public/library voices.
 */

export type VoiceRegion = 'MX' | 'USA';

export interface VoiceOption {
  id: string;
  name: string;
  region: VoiceRegion;
  gender: 'male' | 'female';
  description: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  // ---- México ----
  {
    id: 'iDEmt5MnqUotdwCIVplo',
    name: 'Enrique M. Nieto',
    region: 'MX',
    gender: 'male',
    description: 'Voz oficial Victor IA · cálida, profesional',
  },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Mateo', region: 'MX', gender: 'male', description: 'Joven, enérgico' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Diego', region: 'MX', gender: 'male', description: 'Narrador, grave' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Valentina', region: 'MX', gender: 'female', description: 'Cálida, comercial' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Renata', region: 'MX', gender: 'female', description: 'Clara, corporativa' },
  { id: 'oWAxZDx7w5VEj9dCyTzz', name: 'Sofía', region: 'MX', gender: 'female', description: 'Suave, conversacional' },

  // ---- USA ----
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', region: 'USA', gender: 'female', description: 'Calm, narration' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', region: 'USA', gender: 'female', description: 'Confident, strong' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', region: 'USA', gender: 'female', description: 'Young, emotional' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', region: 'USA', gender: 'male', description: 'Articulate, neutral' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', region: 'USA', gender: 'male', description: 'Crisp, authoritative' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', region: 'USA', gender: 'male', description: 'Raspy, casual' },
];

/** Map of id → option for fast server-side validation. */
export const VOICE_ID_MAP: Record<string, VoiceOption> = VOICE_OPTIONS.reduce(
  (acc, v) => {
    acc[v.id] = v;
    return acc;
  },
  {} as Record<string, VoiceOption>
);

export const DEFAULT_VOICE_ID = 'iDEmt5MnqUotdwCIVplo';

export function isValidVoiceId(id: unknown): id is string {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(VOICE_ID_MAP, id);
}

/* ---- Convenience aliases (stable public API) ---- */

/** Full catalogue (alias of VOICE_OPTIONS). */
export const VOICE_CATALOG = VOICE_OPTIONS;

/** Look up a voice by id, or undefined. */
export function getVoiceById(id: unknown): VoiceOption | undefined {
  return typeof id === 'string' ? VOICE_ID_MAP[id] : undefined;
}

/** True when the id maps to a known voice (alias of isValidVoiceId). */
export function validateVoiceId(id: unknown): id is string {
  return isValidVoiceId(id);
}

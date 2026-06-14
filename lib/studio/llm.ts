import { logger } from '@/lib/logger';

/**
 * Minimal Claude (Anthropic) text helper used by the studio generators
 * (presentation / proposal / email copy). Talks to the Messages API directly
 * so no extra SDK is required. Returns plain text; callers parse JSON when they
 * requested JSON in the prompt.
 *
 * On any failure it throws a generic Error — callers map this to a sanitized
 * 502 response.
 */
export async function generateText(opts: {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    logger.error('LLM misconfigured: missing ANTHROPIC_API_KEY');
    throw new Error('LLM_UNAVAILABLE');
  }

  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

  let response: Response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 2000,
        temperature: opts.temperature ?? 0.7,
        system: opts.system,
        messages: [{ role: 'user', content: opts.prompt }],
      }),
    });
  } catch (err) {
    logger.error('LLM request failed', err instanceof Error ? err : undefined);
    throw new Error('LLM_UNAVAILABLE');
  }

  if (!response.ok) {
    logger.error('LLM provider error', undefined, { status: response.status });
    throw new Error('LLM_UNAVAILABLE');
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text =
    data.content?.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n').trim() ?? '';

  if (!text) {
    logger.error('LLM returned empty content');
    throw new Error('LLM_UNAVAILABLE');
  }

  return text;
}

/**
 * Extract the first JSON object/array from a text blob (handles ```json fences).
 */
export function extractJson<T = unknown>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error('NO_JSON');
  const slice = candidate.slice(start).trim();
  return JSON.parse(slice) as T;
}

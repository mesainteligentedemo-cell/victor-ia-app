import { createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const runtime = "edge";
export const maxDuration = 60;

// Cadena de fallback nativa de OpenRouter: si un modelo falla
// (rate limit, créditos, caída), enruta automáticamente al siguiente.
// OPENROUTER_MODEL (env) permite anteponer un modelo premium cuando haya créditos.
// OpenRouter acepta máximo 3 modelos en el array de fallback
const FALLBACK_MODELS = [
  ...(process.env.OPENROUTER_MODEL ? [process.env.OPENROUTER_MODEL] : []),
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
].slice(0, 3);

// Inyecta el array `models` (routing con fallback) en cada request a OpenRouter
const fetchWithFallback: typeof fetch = async (input, init) => {
  if (init?.body && typeof init.body === "string") {
    try {
      const body = JSON.parse(init.body);
      body.models = FALLBACK_MODELS;
      return fetch(input, { ...init, body: JSON.stringify(body) });
    } catch {
      /* body no-JSON: seguir sin tocar */
    }
  }
  return fetch(input, init);
};

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  fetch: fetchWithFallback,
  headers: {
    "HTTP-Referer": "https://victor-ia-app.vercel.app",
    "X-Title": "Victor IA App",
  },
});

export async function POST(req: Request) {
  const { messages, activeSkill, activeProject } = await req.json();
  const system = buildSystemPrompt(activeSkill, activeProject);

  // OPENROUTER_API_KEY es el principal; ANTHROPIC_API_KEY queda como fallback
  const model = process.env.OPENROUTER_API_KEY
    ? openrouter(FALLBACK_MODELS[0])
    : anthropic("claude-sonnet-4-6");

  const result = await streamText({
    model,
    system,
    messages,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) =>
      error instanceof Error ? error.message : JSON.stringify(error),
  });
}

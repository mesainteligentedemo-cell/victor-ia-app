import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, activeSkill, activeProject } = await req.json();
  const system = buildSystemPrompt(activeSkill, activeProject);

  const result = await streamText({
    model: anthropic("claude-sonnet-4-6"),
    system,
    messages,
    maxTokens: 8096,
  });

  return result.toDataStreamResponse();
}

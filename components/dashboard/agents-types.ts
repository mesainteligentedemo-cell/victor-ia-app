/**
 * Shared types for the Agents dashboard (155 skills as interactive agents).
 *
 * The runtime data lives in `lib/agents-manifest.json` and is imported with
 * `resolveJsonModule`. These types describe that exact shape so every component
 * (card, modal, section, grid) and the page consume the same contract.
 */

export interface Agent {
  /** Unique kebab-case id, also the basis for the slash invocation. */
  id: string;
  /** Category slug, e.g. "agente-maestro". */
  category: string;
  /** Human-readable category label with emoji, e.g. "🤖 Agente Maestro". */
  categoryLabel: string;
  /** Display name, e.g. "CEO — Director General". */
  name: string;
  /** Single representative emoji (legacy, kept for backward compat). */
  emoji: string;
  /** Monochrome SVG icon ID from AgentIcons.tsx (replaces emoji in UI). */
  iconId?: string;
  /** ~60 char tagline shown on the card. */
  shortDesc: string;
  /** "QUÉ HACE" — 4–5 lines. */
  whatItDoes: string;
  /** "CÓMO LO HACE" — 4–5 lines. */
  howItDoes: string;
  /** "PARA QUÉ LO HACE" — 3–4 lines. */
  whyItDoes: string;
  /** Slash command, e.g. "/director-general". */
  invocation: string;
  /** Model assignment. */
  model: string;
  /** Lowercase spanish tags. */
  tags: string[];
}

export interface AgentCategoryMeta {
  slug: string;
  label: string;
  count: number;
}

export interface AgentsManifest {
  version: string;
  total: number;
  categories: AgentCategoryMeta[];
  agents: Agent[];
}
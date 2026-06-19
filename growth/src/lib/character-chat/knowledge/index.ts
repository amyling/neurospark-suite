import { ENTREPRENEUR_KNOWLEDGE } from "./entrepreneurs";
import { RELIGIOUS_KNOWLEDGE } from "./religious";
import type { CharacterKnowledge } from "./types";
import type { Locale } from "@/types/locale";

const ALL_KNOWLEDGE: CharacterKnowledge[] = [
  ...RELIGIOUS_KNOWLEDGE,
  ...ENTREPRENEUR_KNOWLEDGE,
];

const BY_ID = new Map<string, CharacterKnowledge>(
  ALL_KNOWLEDGE.map((entry) => [entry.characterId, entry])
);

/**
 * Returns structured knowledge for a built-in character, if available.
 */
export function getCharacterKnowledge(
  characterId: string
): CharacterKnowledge | undefined {
  return BY_ID.get(characterId);
}

/**
 * Scores topic relevance against user text.
 */
function scoreTopic(text: string, keywords: RegExp): number {
  return keywords.test(text) ? 2 : 0;
}

/**
 * Selects topic-matched teaching points for RAG-lite prompt injection.
 */
export function selectRelevantPoints(
  knowledge: CharacterKnowledge,
  userMessage: string,
  locale: Locale,
  limit = 4
): string[] {
  const matched: string[] = [];
  for (const topic of knowledge.topics) {
    if (scoreTopic(userMessage, topic.keywords) > 0) {
      matched.push(...topic.points[locale]);
    }
  }

  if (matched.length < limit) {
    matched.push(...knowledge.signatureQuotes[locale].slice(0, 2));
  }
  if (matched.length < limit) {
    matched.push(...knowledge.coreTeachings[locale].slice(0, 2));
  }

  return [...new Set(matched)].slice(0, limit);
}

/**
 * Builds a knowledge block for LLM system prompts.
 */
export function buildKnowledgePromptBlock(
  characterId: string,
  userMessage: string,
  locale: Locale
): string {
  const knowledge = getCharacterKnowledge(characterId);
  if (!knowledge) {
    return "";
  }

  const relevant = selectRelevantPoints(knowledge, userMessage, locale);
  const lines = [
    "--- AUTHENTIC VOICE KNOWLEDGE BASE (public sources; stay in character) ---",
    knowledge.sourceNote[locale],
    "",
    "Core teachings:",
    ...knowledge.coreTeachings[locale].map((t) => `- ${t}`),
    "",
    "Rhetoric / tone:",
    ...knowledge.rhetoricPatterns[locale].map((t) => `- ${t}`),
    "",
    "Use these for THIS reply (most relevant first):",
    ...relevant.map((t) => `- ${t}`),
    "",
    "Rules: weave teachings naturally; do not list like a textbook; match documented tone; never claim to be the real person.",
    "--- END KNOWLEDGE BASE ---",
  ];

  return lines.join("\n");
}

/**
 * Builds a knowledge-aware mock reply when LLM is unavailable.
 */
export function buildKnowledgeMockReply(
  characterId: string,
  characterName: string,
  userMessage: string,
  replyLang: Locale
): string | null {
  const knowledge = getCharacterKnowledge(characterId);
  if (!knowledge) {
    return null;
  }

  const points = selectRelevantPoints(knowledge, userMessage, replyLang, 2);
  const quote = knowledge.signatureQuotes[replyLang][0] ?? "";
  const rhetoric = knowledge.rhetoricPatterns[replyLang][0] ?? "";
  const point = points[0] ?? knowledge.coreTeachings[replyLang][0];

  if (replyLang === "zh") {
    return `（${characterName}）${point} 记得：${quote} ${rhetoric ? `——${rhetoric}` : ""}`;
  }

  return `(${characterName}) ${point} Remember: ${quote}${rhetoric ? ` — ${rhetoric}` : ""}`;
}

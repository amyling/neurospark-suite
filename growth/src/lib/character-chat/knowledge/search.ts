import { getChunksForCharacter } from "./chunks";
import type { KnowledgeChunk } from "./chunks";
import type { Locale } from "@/types/locale";

/**
 * Tokenizes text for lexical scoring (CJK + Latin).
 */
function tokenize(text: string): string[] {
  const latin = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const cjk = text.match(/[\u4e00-\u9fff]{1,2}/g) ?? [];
  return [...latin, ...cjk];
}

/**
 * Scores a chunk against a query using weighted token overlap (RAG-lite).
 */
function scoreChunk(chunk: KnowledgeChunk, queryTokens: string[]): number {
  const chunkTokens = tokenize(chunk.text);
  let score = 0;
  for (const qt of queryTokens) {
    if (chunkTokens.some((ct) => ct.includes(qt) || qt.includes(ct))) {
      score += 1;
    }
  }
  return score * chunk.weight;
}

/**
 * Retrieves top knowledge chunks for a character and user query.
 */
export function searchKnowledgeChunks(
  characterId: string,
  query: string,
  locale: Locale,
  limit = 5,
  intimacyLevel: 1 | 2 | 3 = 1
): KnowledgeChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return getChunksForCharacter(characterId)
      .filter((c) => c.locale === locale)
      .slice(0, limit);
  }

  const pool = getChunksForCharacter(characterId).filter(
    (c) => c.locale === locale || c.locale === "en"
  );

  const ranked = pool
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const base = ranked.slice(0, limit).map((r) => r.chunk);
  if (intimacyLevel >= 3 && base.length < limit) {
    const extra = getChunksForCharacter(characterId)
      .filter((c) => c.locale === locale && !base.includes(c))
      .slice(0, limit - base.length);
    return [...base, ...extra];
  }
  return base.length > 0
    ? base
    : getChunksForCharacter(characterId).filter((c) => c.locale === locale).slice(0, limit);
}

/**
 * Formats retrieved chunks for LLM injection.
 */
export function buildRagPromptBlock(
  characterId: string,
  query: string,
  locale: Locale,
  intimacyLevel: 1 | 2 | 3
): string {
  const chunks = searchKnowledgeChunks(
    characterId,
    query,
    locale,
    intimacyLevel >= 2 ? 6 : 4,
    intimacyLevel
  );
  if (chunks.length === 0) {
    return "";
  }
  return [
    "--- RETRIEVED KNOWLEDGE (ground replies in these themes; paraphrase naturally) ---",
    ...chunks.map((c) => `- ${c.text}`),
    "--- END RETRIEVED KNOWLEDGE ---",
  ].join("\n");
}

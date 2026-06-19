import { getCharacterKnowledge } from "@/lib/character-chat/knowledge";
import { searchKnowledgeChunks } from "@/lib/character-chat/knowledge/search";
import type { Locale } from "@/types/locale";

/**
 * Returns a short source attribution line for user-visible footnotes.
 */
export function getKnowledgeAttribution(
  characterId: string,
  userMessage: string,
  locale: Locale
): string | null {
  const knowledge = getCharacterKnowledge(characterId);
  if (!knowledge) {
    return null;
  }
  const chunks = searchKnowledgeChunks(characterId, userMessage, locale, 1);
  if (chunks.length === 0) {
    return knowledge.sourceNote[locale];
  }
  return knowledge.sourceNote[locale];
}

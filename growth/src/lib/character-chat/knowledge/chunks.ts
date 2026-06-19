import { RELIGIOUS_KNOWLEDGE } from "./religious";
import { ENTREPRENEUR_KNOWLEDGE } from "./entrepreneurs";
import type { Locale } from "@/types/locale";

export type KnowledgeChunk = {
  id: string;
  characterId: string;
  text: string;
  locale: Locale;
  weight: number;
};

/**
 * Flattens character knowledge into searchable chunks for RAG-lite retrieval.
 */
export function buildKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const all = [...RELIGIOUS_KNOWLEDGE, ...ENTREPRENEUR_KNOWLEDGE];

  for (const entry of all) {
    (["en", "zh"] as Locale[]).forEach((locale) => {
      entry.coreTeachings[locale].forEach((text, i) => {
        chunks.push({
          id: `${entry.characterId}-core-${locale}-${i}`,
          characterId: entry.characterId,
          text,
          locale,
          weight: 1.2,
        });
      });
      entry.signatureQuotes[locale].forEach((text, i) => {
        chunks.push({
          id: `${entry.characterId}-quote-${locale}-${i}`,
          characterId: entry.characterId,
          text,
          locale,
          weight: 1.5,
        });
      });
      entry.topics.forEach((topic, ti) => {
        topic.points[locale].forEach((text, pi) => {
          chunks.push({
            id: `${entry.characterId}-topic-${topic.id}-${locale}-${ti}-${pi}`,
            characterId: entry.characterId,
            text,
            locale,
            weight: 1.3,
          });
        });
      });
    });
  }

  return chunks;
}

const ALL_CHUNKS = buildKnowledgeChunks();

/**
 * Returns all chunks for a character.
 */
export function getChunksForCharacter(characterId: string): KnowledgeChunk[] {
  return ALL_CHUNKS.filter((c) => c.characterId === characterId);
}

import type { Locale } from "@/types/locale";

/** Topic-tagged excerpts compiled from public lectures, books, and interviews. */
export type KnowledgeTopic = {
  id: string;
  keywords: RegExp;
  points: Record<Locale, string[]>;
};

/** Structured voice + doctrine reference for a built-in persona. */
export type CharacterKnowledge = {
  characterId: string;
  sourceNote: Record<Locale, string>;
  coreTeachings: Record<Locale, string[]>;
  signatureQuotes: Record<Locale, string[]>;
  rhetoricPatterns: Record<Locale, string[]>;
  topics: KnowledgeTopic[];
};

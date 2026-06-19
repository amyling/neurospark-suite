import { getBuiltinCharacter } from "@/lib/character-chat/presets";
import type { Locale } from "@/types/locale";

/**
 * Returns a deterministic daily quote for a character (same per day).
 */
export function getDailyQuote(
  characterId: string,
  locale: Locale
): { characterName: string; quote: string; avatar: string } | null {
  const character = getBuiltinCharacter(characterId, locale);
  if (!character) {
    return null;
  }

  const daySeed = new Date().toISOString().slice(0, 10);
  const hash = `${characterId}-${daySeed}`.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const knowledge = character.greeting;
  const parts = knowledge.split(/[。.!?\n]/).filter((p) => p.trim().length > 8);
  const quote = parts[hash % Math.max(parts.length, 1)]?.trim() || character.greeting;

  return {
    characterName: character.name,
    quote,
    avatar: character.avatar,
  };
}

/**
 * Picks favorite or default character for daily quote.
 */
export function resolveDailyQuoteCharacterId(
  favoriteId: string | null
): string {
  return favoriteId ?? "jingkong_master";
}

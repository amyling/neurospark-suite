import type { CharacterRelationship, IntimacyLevel } from "@/types/character-growth";
import {
  getRelationships,
  saveRelationships,
} from "@/lib/character-chat/growth-storage";

/**
 * Computes intimacy level from engagement metrics.
 */
export function computeIntimacyLevel(
  messageCount: number,
  streakDays: number
): IntimacyLevel {
  if (messageCount >= 30 || streakDays >= 7) {
    return 3;
  }
  if (messageCount >= 10 || streakDays >= 3) {
    return 2;
  }
  return 1;
}

/**
 * Records a chat activity day for a character and updates streak.
 */
export function recordCharacterActivity(characterId: string): CharacterRelationship {
  const map = getRelationships();
  const today = new Date().toISOString().slice(0, 10);
  const existing = map[characterId];
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let streakDays = 1;
  if (existing) {
    if (existing.lastActiveDate === today) {
      streakDays = existing.streakDays;
    } else if (existing.lastActiveDate === yesterday) {
      streakDays = existing.streakDays + 1;
    }
  }

  const messageCount = (existing?.messageCount ?? 0) + 1;
  const intimacyLevel = computeIntimacyLevel(messageCount, streakDays);

  const next: CharacterRelationship = {
    characterId,
    messageCount,
    streakDays,
    lastActiveDate: today,
    intimacyLevel,
    unlockedDepth: intimacyLevel >= 2,
  };
  map[characterId] = next;
  saveRelationships(map);
  return next;
}

/**
 * Returns relationship stats for a character.
 */
export function getCharacterRelationship(
  characterId: string
): CharacterRelationship {
  const map = getRelationships();
  return (
    map[characterId] ?? {
      characterId,
      messageCount: 0,
      streakDays: 0,
      lastActiveDate: "",
      intimacyLevel: 1,
      unlockedDepth: false,
    }
  );
}

/**
 * Deep teachings unlocked at intimacy level 2+.
 */
export function getIntimacyUnlockNote(
  level: IntimacyLevel,
  locale: "en" | "zh"
): string {
  if (level >= 3) {
    return locale === "zh"
      ? "亲密度 Lv.3：可分享更深层的开示与长期陪伴建议。"
      : "Intimacy Lv.3: deeper teachings and long-term companionship unlocked.";
  }
  if (level >= 2) {
    return locale === "zh"
      ? "亲密度 Lv.2：已解锁进阶话题与更个性化的回应。"
      : "Intimacy Lv.2: advanced topics and more personalized replies unlocked.";
  }
  return locale === "zh"
    ? "亲密度 Lv.1：继续对话以解锁更深内容。"
    : "Intimacy Lv.1: keep chatting to unlock deeper content.";
}

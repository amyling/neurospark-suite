import type {
  AnonymousInsightStats,
  CharacterMemory,
  CharacterRelationship,
  CoachingPackProgress,
  DailyUsage,
  GrowthSettings,
  MessageFeedback,
  ReflectionDebriefPayload,
  UserProfile,
} from "@/types/character-growth";

const KEYS = {
  profile: "youthmentor_user_profile",
  relationships: "youthmentor_character_relationships",
  memories: "youthmentor_character_memories",
  usage: "youthmentor_daily_usage",
  settings: "youthmentor_growth_settings",
  feedback: "youthmentor_message_feedback",
  stats: "youthmentor_anonymous_stats",
  debrief: "youthmentor_reflection_debrief",
  coachingPack: "youthmentor_coaching_pack",
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const DEFAULT_SETTINGS: GrowthSettings = {
  isPremium: false,
  parentModeEnabled: false,
  quietHoursStart: 22,
  quietHoursEnd: 7,
  dailyLimitOverride: null,
};

const DEFAULT_STATS: AnonymousInsightStats = {
  totalMessages: 0,
  scenarioStarts: {},
  topStressTags: {},
  feedbackUp: 0,
  feedbackDown: 0,
  activeDays: 0,
};

/**
 * Loads user profile for memory personalization.
 */
export function getUserProfile(): UserProfile {
  return readJson<UserProfile>(KEYS.profile, {
    displayName: "",
    gradeOrRole: "",
    favoriteCharacterId: null,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Saves user profile.
 */
export function saveUserProfile(profile: UserProfile): void {
  writeJson(KEYS.profile, profile);
}

/**
 * Loads all character relationships.
 */
export function getRelationships(): Record<string, CharacterRelationship> {
  return readJson<Record<string, CharacterRelationship>>(KEYS.relationships, {});
}

/**
 * Saves relationship map.
 */
export function saveRelationships(
  map: Record<string, CharacterRelationship>
): void {
  writeJson(KEYS.relationships, map);
}

/**
 * Loads memory for one character.
 */
export function getCharacterMemory(characterId: string): CharacterMemory {
  const all = readJson<Record<string, CharacterMemory>>(KEYS.memories, {});
  return (
    all[characterId] ?? {
      characterId,
      facts: [],
      lastTopics: [],
      pendingGoal: null,
      llmSummary: null,
      updatedAt: new Date().toISOString(),
    }
  );
}

/**
 * Persists memory for one character.
 */
export function saveCharacterMemory(memory: CharacterMemory): void {
  const all = readJson<Record<string, CharacterMemory>>(KEYS.memories, {});
  all[memory.characterId] = memory;
  writeJson(KEYS.memories, all);
}

/**
 * Returns today's usage counter.
 */
export function getDailyUsage(): DailyUsage {
  const today = new Date().toISOString().slice(0, 10);
  const usage = readJson<DailyUsage>(KEYS.usage, { date: today, messageCount: 0 });
  if (usage.date !== today) {
    return { date: today, messageCount: 0 };
  }
  return usage;
}

/**
 * Increments daily message count.
 */
export function incrementDailyUsage(): DailyUsage {
  const usage = getDailyUsage();
  const next = { ...usage, messageCount: usage.messageCount + 1 };
  writeJson(KEYS.usage, next);
  return next;
}

/**
 * Loads growth settings (premium, parent mode).
 */
export function getGrowthSettings(): GrowthSettings {
  return readJson<GrowthSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

/**
 * Saves growth settings.
 */
export function saveGrowthSettings(settings: GrowthSettings): void {
  writeJson(KEYS.settings, settings);
}

/**
 * Appends message feedback.
 */
export function addMessageFeedback(entry: MessageFeedback): void {
  const list = readJson<MessageFeedback[]>(KEYS.feedback, []);
  list.push(entry);
  writeJson(KEYS.feedback, list.slice(-200));
}

/**
 * Loads anonymous aggregate stats (B2B-style local dashboard).
 */
export function getInsightStats(): AnonymousInsightStats {
  return readJson<AnonymousInsightStats>(KEYS.stats, DEFAULT_STATS);
}

/**
 * Updates anonymous stats after an event.
 */
export function recordInsightEvent(
  patch: Partial<AnonymousInsightStats> & {
    scenarioId?: string;
    stressTag?: string;
    feedback?: "up" | "down";
  }
): void {
  const stats = getInsightStats();
  if (patch.scenarioId) {
    stats.scenarioStarts[patch.scenarioId] =
      (stats.scenarioStarts[patch.scenarioId] ?? 0) + 1;
  }
  if (patch.stressTag) {
    stats.topStressTags[patch.stressTag] =
      (stats.topStressTags[patch.stressTag] ?? 0) + 1;
  }
  if (patch.feedback === "up") {
    stats.feedbackUp += 1;
  }
  if (patch.feedback === "down") {
    stats.feedbackDown += 1;
  }
  if (typeof patch.totalMessages === "number") {
    stats.totalMessages = patch.totalMessages;
  }
  if (typeof patch.activeDays === "number") {
    stats.activeDays = patch.activeDays;
  }
  writeJson(KEYS.stats, stats);
}

/**
 * Stores reflection debrief payload for character chat bridge.
 */
export function setReflectionDebrief(payload: ReflectionDebriefPayload): void {
  writeJson(KEYS.debrief, payload);
}

/**
 * Reads and optionally clears reflection debrief payload.
 */
export function consumeReflectionDebrief(): ReflectionDebriefPayload | null {
  const payload = readJson<ReflectionDebriefPayload | null>(KEYS.debrief, null);
  if (payload) {
    localStorage.removeItem(KEYS.debrief);
  }
  return payload;
}

/**
 * Exports all growth data for backup/sync.
 */
export function exportGrowthData(): string {
  const bundle = {
    profile: getUserProfile(),
    relationships: getRelationships(),
    memories: readJson(KEYS.memories, {}),
    settings: getGrowthSettings(),
    stats: getInsightStats(),
    coachingPack: getCoachingPackProgress(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(bundle, null, 2);
}

/**
 * Loads active coaching pack progress.
 */
export function getCoachingPackProgress(): CoachingPackProgress | null {
  return readJson<CoachingPackProgress | null>(KEYS.coachingPack, null);
}

/**
 * Saves coaching pack progress.
 */
export function saveCoachingPackProgress(
  progress: CoachingPackProgress | null
): void {
  if (progress) {
    writeJson(KEYS.coachingPack, progress);
  } else if (typeof window !== "undefined") {
    localStorage.removeItem(KEYS.coachingPack);
  }
}

/**
 * Imports growth data from a JSON backup (merge-safe).
 */
export function importGrowthData(json: string): boolean {
  try {
    const data = JSON.parse(json) as {
      profile?: UserProfile;
      relationships?: Record<string, CharacterRelationship>;
      memories?: Record<string, CharacterMemory>;
      settings?: GrowthSettings;
      stats?: AnonymousInsightStats;
      coachingPack?: CoachingPackProgress | null;
    };
    if (data.profile) {
      saveUserProfile(data.profile);
    }
    if (data.relationships) {
      saveRelationships(data.relationships);
    }
    if (data.memories) {
      writeJson(KEYS.memories, data.memories);
    }
    if (data.settings) {
      saveGrowthSettings(data.settings);
    }
    if (data.stats) {
      writeJson(KEYS.stats, data.stats);
    }
    if (data.coachingPack !== undefined) {
      saveCoachingPackProgress(data.coachingPack);
    }
    return true;
  } catch {
    return false;
  }
}

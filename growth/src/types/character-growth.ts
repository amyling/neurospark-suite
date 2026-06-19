export type IntimacyLevel = 1 | 2 | 3;

export type UserProfile = {
  displayName: string;
  gradeOrRole: string;
  favoriteCharacterId: string | null;
  updatedAt: string;
};

export type CharacterRelationship = {
  characterId: string;
  messageCount: number;
  streakDays: number;
  lastActiveDate: string;
  intimacyLevel: IntimacyLevel;
  unlockedDepth: boolean;
};

export type CharacterMemory = {
  characterId: string;
  facts: string[];
  lastTopics: string[];
  pendingGoal: string | null;
  /** LLM-generated rolling summary (updated every N turns). */
  llmSummary: string | null;
  updatedAt: string;
};

export type DailyUsage = {
  date: string;
  messageCount: number;
};

export type GrowthSettings = {
  isPremium: boolean;
  parentModeEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
  dailyLimitOverride: number | null;
};

export type MessageFeedback = {
  messageId: string;
  characterId: string;
  rating: "up" | "down";
  createdAt: string;
};

export type AnonymousInsightStats = {
  totalMessages: number;
  scenarioStarts: Record<string, number>;
  topStressTags: Record<string, number>;
  feedbackUp: number;
  feedbackDown: number;
  activeDays: number;
};

export type ReflectionDebriefPayload = {
  mood: string;
  stressSource: string;
  summary: string;
  suggestedCharacterId: string;
  createdAt: string;
};

export type ScenarioId =
  | "anxiety_sleep"
  | "exam_stress"
  | "friend_conflict"
  | "startup_fear"
  | "money_basics"
  | "work_ethics"
  | "practice_discipline"
  | "find_peace";

export type CoachingPackId =
  | "exam_30_inamori"
  | "buddha_21_jingkong"
  | "startup_21_jack_ma";

export type CoachingPackProgress = {
  packId: CoachingPackId;
  characterId: string;
  startedAt: string;
  currentDay: number;
  completedDays: number[];
};

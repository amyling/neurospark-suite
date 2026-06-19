export type Mood =
  | "happy"
  | "calm"
  | "stressed"
  | "anxious"
  | "sad"
  | "angry"
  | "tired"
  | "confused";

export type StressSource =
  | "exam"
  | "homework"
  | "friendship"
  | "family"
  | "teacher"
  | "cca"
  | "future"
  | "self_confidence"
  | "other";

export type MentorPersona =
  | "study_coach"
  | "mindful_mentor"
  | "scientist_mentor"
  | "kindness_mentor"
  | "wisdom_mode";

export type SafetyLevel = "normal" | "watch" | "high_risk";

export type MoodCheckIn = {
  id: string;
  mood: Mood;
  intensity: number;
  stressSource: StressSource;
  freeText: string;
  createdAt: string;
};

export type ReflectionAnswers = {
  whatHappened: string;
  whatFelt: string;
  worseThought: string;
  anotherView: string;
  smallAction: string;
  trustedPerson: string;
};

export type MentorResponse = {
  emotionalValidation: string;
  reflectionSummary: string;
  reframedThought: string;
  smallActionSteps: string[];
  encouragement: string;
  whenToSeekHelp: string;
  safetyLevel: SafetyLevel;
  suggestedTrustedAdult?: string;
  followUpPrompt: string;
};

export type ActionPlanItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type SavedReflection = {
  id: string;
  checkIn: MoodCheckIn;
  mentorPersona: MentorPersona;
  answers: ReflectionAnswers;
  response: MentorResponse | null;
  actionPlan: ActionPlanItem[];
  isHighRiskBlocked: boolean;
  locale?: "en" | "zh";
  createdAt: string;
};

export type RiskClassification = {
  safetyLevel: SafetyLevel;
  matchedKeywords: string[];
  classifierReason: string;
};

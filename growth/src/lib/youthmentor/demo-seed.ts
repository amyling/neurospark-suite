import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/locale";
import type {
  MentorPersona,
  Mood,
  MoodCheckIn,
  ReflectionAnswers,
  StressSource,
} from "@/types/youthmentor";

export type DemoCaseId =
  | "exam_stress"
  | "friendship_conflict"
  | "procrastination"
  | "low_confidence"
  | "high_risk";

export type DemoCase = {
  id: DemoCaseId;
  title: string;
  description: string;
  checkIn: Omit<MoodCheckIn, "id" | "createdAt">;
  mentorPersona: MentorPersona;
  answers: ReflectionAnswers;
};

const DEMO_IDS: DemoCaseId[] = [
  "exam_stress",
  "friendship_conflict",
  "procrastination",
  "low_confidence",
  "high_risk",
];

const DEMO_META: Record<
  DemoCaseId,
  { mood: Mood; intensity: number; stressSource: StressSource; mentorPersona: MentorPersona }
> = {
  exam_stress: {
    mood: "stressed",
    intensity: 7,
    stressSource: "exam",
    mentorPersona: "study_coach",
  },
  friendship_conflict: {
    mood: "sad",
    intensity: 6,
    stressSource: "friendship",
    mentorPersona: "kindness_mentor",
  },
  procrastination: {
    mood: "tired",
    intensity: 5,
    stressSource: "homework",
    mentorPersona: "study_coach",
  },
  low_confidence: {
    mood: "confused",
    intensity: 6,
    stressSource: "self_confidence",
    mentorPersona: "scientist_mentor",
  },
  high_risk: {
    mood: "sad",
    intensity: 9,
    stressSource: "other",
    mentorPersona: "kindness_mentor",
  },
};

const MOOD_EMOJI: Record<Mood, string> = {
  happy: "😊",
  calm: "😌",
  stressed: "😣",
  anxious: "😰",
  sad: "😢",
  angry: "😠",
  tired: "😴",
  confused: "😕",
};

/**
 * Returns localized demo cases.
 */
export function getDemoCases(locale: Locale): DemoCase[] {
  const cases = getDictionary(locale).demo.cases;
  return DEMO_IDS.map((id) => {
    const content = cases[id];
    const meta = DEMO_META[id];
    return {
      id,
      title: content.title,
      description: content.description,
      checkIn: {
        mood: meta.mood,
        intensity: meta.intensity,
        stressSource: meta.stressSource,
        freeText: content.freeText,
      },
      mentorPersona: meta.mentorPersona,
      answers: { ...content.answers },
    };
  });
}

/**
 * Localized mood options with emoji.
 */
export function getMoodOptions(locale: Locale) {
  const moods = getDictionary(locale).moods;
  return (Object.keys(moods) as Mood[]).map((value) => ({
    value,
    label: moods[value],
    emoji: MOOD_EMOJI[value],
  }));
}

/**
 * Localized stress source options.
 */
export function getStressOptions(locale: Locale) {
  const stress = getDictionary(locale).stress;
  return (Object.keys(stress) as StressSource[]).map((value) => ({
    value,
    label: stress[value],
  }));
}

/**
 * Localized mentor persona cards.
 */
export function getMentorPersonas(locale: Locale) {
  const personas = getDictionary(locale).personas;
  return (Object.keys(personas) as MentorPersona[]).map((value) => ({
    value,
    ...personas[value],
  }));
}

export function createCheckInFromDemo(
  partial: Omit<MoodCheckIn, "id" | "createdAt">
): MoodCheckIn {
  return {
    ...partial,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

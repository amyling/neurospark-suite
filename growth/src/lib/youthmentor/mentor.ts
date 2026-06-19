import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/locale";
import type {
  MentorPersona,
  MentorResponse,
  MoodCheckIn,
  ReflectionAnswers,
  RiskClassification,
  SafetyLevel,
} from "@/types/youthmentor";

function interpolate(
  template: string,
  vars: Record<string, string>
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template
  );
}

/**
 * Builds a structured mentor response for demo / prototype use.
 */
export async function generateMentorResponse(
  checkIn: MoodCheckIn,
  answers: ReflectionAnswers,
  persona: MentorPersona,
  risk: RiskClassification,
  locale: Locale
): Promise<MentorResponse> {
  const dict = getDictionary(locale);
  const g = dict.mentorGen;
  const safetyLevel: SafetyLevel =
    risk.safetyLevel === "high_risk" ? "high_risk" : risk.safetyLevel;

  const personaLabel = dict.personas[persona].title;
  const moodLabel = dict.moods[checkIn.mood];
  const stressLabel = dict.stress[checkIn.stressSource];

  const trusted =
    answers.trustedPerson.trim() ||
    checkIn.freeText.match(
      /teacher|parent|counsellor|friend|老师|父母|妈妈|爸爸|辅导员|朋友/i
    )?.[0] ||
    g.defaultTrusted;

  const reflectionSummary = [
    interpolate(g.sharedHappened, {
      what: answers.whatHappened || g.somethingDifficult,
    }),
    interpolate(g.felt, {
      feeling: answers.whatFelt || moodLabel,
    }),
    answers.worseThought
      ? interpolate(g.toughThought, { thought: answers.worseThought })
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const reframedByPersona: Record<MentorPersona, string> = {
    study_coach: answers.anotherView || g.reframe.study_coach,
    mindful_mentor: answers.anotherView || g.reframe.mindful_mentor,
    scientist_mentor: answers.anotherView || g.reframe.scientist_mentor,
    kindness_mentor: answers.anotherView || g.reframe.kindness_mentor,
    wisdom_mode: answers.anotherView || g.reframe.wisdom_mode,
  };

  const steps = buildActionSteps(answers, persona, checkIn, locale);

  const watchHelp =
    safetyLevel === "watch" ? g.watchHelp : g.normalHelp;

  return {
    emotionalValidation: interpolate(g.validation, {
      persona: personaLabel,
      mood: moodLabel,
      stress: stressLabel,
    }),
    reflectionSummary,
    reframedThought: reframedByPersona[persona],
    smallActionSteps: steps,
    encouragement: g.encouragement[persona],
    whenToSeekHelp: watchHelp,
    safetyLevel,
    suggestedTrustedAdult: trusted,
    followUpPrompt: g.followUp,
  };
}

function buildActionSteps(
  answers: ReflectionAnswers,
  persona: MentorPersona,
  checkIn: MoodCheckIn,
  locale: Locale
): string[] {
  const g = getDictionary(locale).mentorGen;
  const base = answers.smallAction.trim();
  const steps: string[] = [];

  if (base) {
    steps.push(base);
  }

  for (const item of g.actionExtras[persona]) {
    if (steps.length < 4) {
      steps.push(item);
    }
  }

  if (checkIn.stressSource === "exam" && steps.length < 4) {
    steps.push(g.examPackBag);
  }

  return steps.slice(0, 4);
}

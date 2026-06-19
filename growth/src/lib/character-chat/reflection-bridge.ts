import type { ReflectionAnswers, MoodCheckIn } from "@/types/youthmentor";
import type { ReflectionDebriefPayload } from "@/types/character-growth";
import {
  mentorPersonaToCharacterId,
  stressSourceToCharacterId,
} from "@/lib/character-chat/scenarios";
import type { MentorPersona } from "@/types/youthmentor";

/**
 * Builds a reflection summary text for character debrief.
 */
export function buildReflectionSummary(
  checkIn: MoodCheckIn,
  answers: ReflectionAnswers
): string {
  return [
    `Mood: ${checkIn.mood}, intensity ${checkIn.intensity}/10`,
    `Stress: ${checkIn.stressSource}`,
    checkIn.freeText ? `Note: ${checkIn.freeText}` : "",
    `What happened: ${answers.whatHappened}`,
    `Feelings: ${answers.whatFelt}`,
    answers.worseThought ? `Hard thought: ${answers.worseThought}` : "",
    answers.anotherView ? `Another view: ${answers.anotherView}` : "",
    answers.smallAction ? `Small action: ${answers.smallAction}` : "",
    answers.trustedPerson ? `Trusted person: ${answers.trustedPerson}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Creates debrief payload from YouthMentor session data.
 */
export function createReflectionDebriefPayload(
  checkIn: MoodCheckIn,
  answers: ReflectionAnswers,
  mentorPersona: MentorPersona
): ReflectionDebriefPayload {
  const characterId =
    mentorPersonaToCharacterId(mentorPersona) ||
    stressSourceToCharacterId(checkIn.stressSource);

  return {
    mood: checkIn.mood,
    stressSource: checkIn.stressSource,
    summary: buildReflectionSummary(checkIn, answers),
    suggestedCharacterId: characterId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Builds LLM context block from reflection debrief.
 */
export function buildReflectionDebriefBlock(
  payload: ReflectionDebriefPayload,
  locale: "en" | "zh"
): string {
  const header =
    locale === "zh"
      ? "用户刚完成一次 YouthMentor 结构化反思。请以角色身份给予温暖总结与 2-3 条可执行建议："
      : "The user just completed a YouthMentor structured reflection. Respond in character with a warm summary and 2-3 actionable steps:";

  return `${header}\n${payload.summary}`;
}

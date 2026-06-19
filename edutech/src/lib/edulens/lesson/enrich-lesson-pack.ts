import type { Locale } from "@/lib/i18n/types";
import type { LessonOutputPayload } from "../ai/validator";
import type { TopicKnowledgeContext } from "../knowledge/types";
import type { LessonRequest } from "../types";
import {
  buildKnowledgeTeachingBlocks,
  isAutoPaddingBlock,
  sanitizeLessonOutputPayload,
} from "./sanitize-lesson-content";
import {
  buildPaddingTeachingBlock,
  sanitizeTeachingContentForSubject,
} from "./lesson-subject-rules";

/**
 * Minimum content targets scaled to lesson duration.
 */
export function getLessonDepthTargets(durationMinutes: number) {
  return {
    minPhases: Math.max(4, Math.ceil(durationMinutes / 12)),
    minTeachingBlocks: Math.max(6, Math.ceil(durationMinutes / 7)),
    minWorksheet: Math.max(4, Math.ceil(durationMinutes / 10)),
    minWorkedExamples: Math.max(2, Math.ceil(durationMinutes / 25)),
    minVisualSteps: Math.max(5, Math.ceil(durationMinutes / 12)),
    minObjectives: Math.max(3, Math.ceil(durationMinutes / 15)),
    minKeyConcepts: Math.max(4, Math.ceil(durationMinutes / 15)),
  };
}

/**
 * Scales phase durations so they sum to the requested lesson length.
 */
function normalizeLessonPlanDurations(
  phases: LessonOutputPayload["lessonPlan"],
  targetMinutes: number
) {
  if (!phases.length) {
    return phases;
  }

  const sum = phases.reduce((total, phase) => total + phase.durationMinutes, 0);
  if (sum === targetMinutes) {
    return phases;
  }

  if (sum <= 0) {
    const base = Math.floor(targetMinutes / phases.length);
    return phases.map((phase, index) => ({
      ...phase,
      durationMinutes:
        index === phases.length - 1
          ? targetMinutes - base * (phases.length - 1)
          : base,
    }));
  }

  const scaled = phases.map((phase) => ({
    ...phase,
    durationMinutes: Math.max(
      3,
      Math.round((phase.durationMinutes * targetMinutes) / sum)
    ),
  }));

  const scaledSum = scaled.reduce((total, phase) => total + phase.durationMinutes, 0);
  scaled[scaled.length - 1] = {
    ...scaled[scaled.length - 1],
    durationMinutes:
      scaled[scaled.length - 1].durationMinutes + (targetMinutes - scaledSum),
  };

  return scaled;
}

/**
 * Builds duration-scaled depth requirements for the lesson prompt.
 */
export function buildLessonDepthPromptBlock(durationMinutes: number): string {
  const t = getLessonDepthTargets(durationMinutes);
  return `DURATION ${durationMinutes} MIN — depth requirements:
- lessonPlan: ${t.minPhases}+ phases; durationMinutes MUST sum to exactly ${durationMinutes}.
- Each phase: teacherScript 4+ sentences; activities 3+ concrete items.
- teachingContent: ${t.minTeachingBlocks}+ blocks (mix text, formula, diagram, table).
- workedExamples: ${t.minWorkedExamples}+ with full solutions in answerKey.
- worksheet: ${t.minWorksheet}+ complete questions; answerKey with working for each.
- learningVisualLessons: ${t.minVisualSteps}+ steps; each body 3-5 sentences (120+ chars).
- learningObjectives: ${t.minObjectives}+; keyConcepts: ${t.minKeyConcepts}+.`;
}

/**
 * Post-processes validated lesson JSON to match requested duration and depth floors.
 */
export function enrichLessonPackPayload(
  payload: LessonOutputPayload,
  request: LessonRequest,
  locale: Locale,
  knowledge?: TopicKnowledgeContext
): LessonOutputPayload {
  const sanitized = sanitizeLessonOutputPayload(payload, locale);
  const targets = getLessonDepthTargets(request.durationMinutes);
  const isZh = locale === "zh";

  const lessonPlan = normalizeLessonPlanDurations(
    sanitized.lessonPlan,
    request.durationMinutes
  );

  let learningObjectives = [...sanitized.learningObjectives];
  while (learningObjectives.length < targets.minObjectives) {
    const idx = learningObjectives.length + 1;
    learningObjectives.push(
      isZh
        ? `目标 ${idx}：能结合实例解释「${request.topic}」的关键思想。`
        : `Objective ${idx}: Explain key ideas of "${request.topic}" with examples.`
    );
  }

  let keyConcepts = [...sanitized.keyConcepts];
  while (keyConcepts.length < targets.minKeyConcepts) {
    const kbConcept = knowledge?.matches[0]?.entry.keyConcepts[keyConcepts.length];
    keyConcepts.push(
      kbConcept ??
        (isZh
          ? `${request.topic} 核心概念 ${keyConcepts.length + 1}`
          : `${request.topic} core idea ${keyConcepts.length + 1}`)
    );
  }

  let teachingContent = [
    ...(sanitizeTeachingContentForSubject(
      sanitized.teachingContent,
      request.subject,
      request.topic
    ) ?? []),
  ].filter((block) => !isAutoPaddingBlock(block));

  const minBlocks = Math.min(targets.minTeachingBlocks, 8);
  if (teachingContent.length < minBlocks && knowledge?.matches.length) {
    const needed = minBlocks - teachingContent.length;
    teachingContent.push(
      ...buildKnowledgeTeachingBlocks(
        knowledge,
        request.topic,
        locale,
        needed
      )
    );
  }

  while (teachingContent.length < Math.min(minBlocks, 6)) {
    const n = teachingContent.length + 1;
    teachingContent.push(
      buildPaddingTeachingBlock(
        request.subject,
        request.topic,
        n,
        lessonPlan.length,
        isZh ? "zh" : "en"
      )
    );
  }

  return {
    ...sanitized,
    lessonPlan,
    learningObjectives,
    keyConcepts,
    teachingContent,
  };
}

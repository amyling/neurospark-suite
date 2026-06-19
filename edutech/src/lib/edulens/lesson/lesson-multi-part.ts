import type { Locale } from "@/lib/i18n/types";
import type { LessonOutputPayload } from "../ai/validator";
import { parseJSONFromLLM } from "../ai/json-parser";
import { completeJSON } from "../ai/provider";
import { validateLessonOutput } from "../ai/validator";
import {
  buildLessonAssessmentPrompt,
  buildLessonStructurePrompt,
  buildLessonTeachingPrompt,
} from "../ai/prompt-builder";
import type { LessonRequest } from "../types";
import type { LessonRagContext } from "../knowledge/rag/types";
import { buildTopicKnowledgeContext } from "../knowledge/retrieve-topic-knowledge";
import { sanitizeLessonOutputPayload } from "./sanitize-lesson-content";

type LessonStructurePart = Pick<
  LessonOutputPayload,
  "learningObjectives" | "keyConcepts" | "lessonPlan" | "commonMisconceptions"
>;

type LessonTeachingPart = Pick<
  LessonOutputPayload,
  "teachingContent" | "workedExamples" | "revisionNotes"
>;

type LessonAssessmentPart = Pick<
  LessonOutputPayload,
  "worksheet" | "answerKey" | "learningVisualLessons" | "contentSource"
>;

/**
 * Parses and validates a partial lesson JSON slice.
 */
function parsePart<T extends object>(
  raw: string,
  label: string
): T | null {
  if (!raw.trim()) {
    console.error(`[EduLens] Multi-part ${label}: empty response`);
    return null;
  }
  const parsed = parseJSONFromLLM<T>(raw);
  if (!parsed) {
    console.error(
      `[EduLens] Multi-part ${label}: invalid JSON`,
      raw.slice(0, 300)
    );
  }
  return parsed;
}

/**
 * Generates a lesson pack in three structured API calls grounded in syllabus knowledge.
 */
export async function fetchLessonPackMultiPart(
  request: LessonRequest,
  locale: Locale,
  ragContext?: LessonRagContext
): Promise<LessonOutputPayload | null> {
  const knowledge = buildTopicKnowledgeContext(
    request.subject,
    request.level,
    request.topic
  );

  const structureRaw = await completeJSON({
    ...buildLessonStructurePrompt(request, locale, knowledge, ragContext),
    jsonMode: true,
  });
  const structure = parsePart<LessonStructurePart>(structureRaw, "structure");
  if (
    !structure?.learningObjectives?.length ||
    !structure.lessonPlan?.length
  ) {
    return null;
  }

  const teachingRaw = await completeJSON({
    ...buildLessonTeachingPrompt(
      request,
      locale,
      structure,
      knowledge,
      ragContext
    ),
    jsonMode: true,
  });
  const teaching = parsePart<LessonTeachingPart>(teachingRaw, "teaching");

  const assessmentRaw = await completeJSON({
    ...buildLessonAssessmentPrompt(
      request,
      locale,
      structure,
      knowledge,
      ragContext
    ),
    jsonMode: true,
  });
  const assessment = parsePart<LessonAssessmentPart>(assessmentRaw, "assessment");

  if (!teaching?.teachingContent?.length || !assessment?.worksheet?.length) {
    return null;
  }

  const merged: LessonOutputPayload = {
    learningObjectives: structure.learningObjectives,
    keyConcepts: structure.keyConcepts ?? [],
    lessonPlan: structure.lessonPlan,
    commonMisconceptions: structure.commonMisconceptions ?? [],
    teachingContent: teaching.teachingContent,
    workedExamples: teaching.workedExamples ?? [],
    revisionNotes: teaching.revisionNotes ?? "",
    worksheet: assessment.worksheet,
    answerKey: assessment.answerKey ?? [],
    learningVisualLessons: assessment.learningVisualLessons,
    contentSource: assessment.contentSource ?? "mixed",
  };

  const sanitized = sanitizeLessonOutputPayload(merged, locale);
  return validateLessonOutput(sanitized);
}

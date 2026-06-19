import type { Locale } from "@/lib/i18n/types";
import type { LessonRequest } from "../types";
import type { LessonOutputPayload } from "../ai/validator";
import { detectLessonTopicCategory } from "../lesson/detect-lesson-topic";
import { buildCalculusMockLesson } from "./mock-lesson-calculus";
import { buildGenericMockLesson } from "./mock-lesson-generic";
import { buildQuadraticMockLesson } from "./mock-lesson-quadratic";

/**
 * Detailed demo lesson pack routed by topic (calculus, quadratic, or generic).
 */
export function buildDetailedMockLesson(
  request: LessonRequest,
  locale: Locale
): LessonOutputPayload {
  const category = detectLessonTopicCategory(
    request.topic,
    request.subject,
    request.teacherContent
  );

  if (category === "calculus") {
    return buildCalculusMockLesson(request, locale);
  }
  if (category === "quadratic") {
    return buildQuadraticMockLesson(request, locale);
  }
  return buildGenericMockLesson(request, locale);
}

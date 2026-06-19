"use client";

import { LearningVisualLesson } from "./LearningVisualLesson";
import { useLocale } from "@/lib/i18n/locale-context";
import { downloadLessonAnimationHtml } from "@/lib/edulens/lesson/export-lesson-animation";
import type { LearningVisualLesson as LessonType } from "@/lib/edulens/types";

/**
 * Animated lesson block with downloadable HTML slideshow.
 */
export function LessonAnimationSection({
  lessons,
}: {
  lessons: LessonType[];
}) {
  const { t } = useLocale();

  if (!lessons.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {lessons.map((lesson, index) => (
        <div key={`${lesson.title}-${index}`} className="space-y-3">
          <LearningVisualLesson lesson={lesson} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                downloadLessonAnimationHtml(
                  lesson,
                  `lesson-${index + 1}-animation`
                )
              }
              className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-xs font-medium text-indigo-700 shadow-sm hover:bg-indigo-50"
            >
              {t.lesson.downloadAnimation}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

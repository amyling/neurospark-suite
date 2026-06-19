"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Persistent safety disclaimers for EduLens */
export function SafetyBanner() {
  const { t } = useLocale();

  return (
    <div
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="note"
    >
      <p className="font-medium">{t.safety.title}</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-amber-900/90">
        <li>{t.safety.teacherReview}</li>
        <li>{t.safety.openEndedScore}</li>
        <li>{t.safety.classroomMaterial}</li>
      </ul>
    </div>
  );
}

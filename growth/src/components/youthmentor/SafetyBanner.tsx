"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * Persistent disclaimer banner for bounded wellbeing support.
 */
export function SafetyBanner() {
  const { t } = useLocale();

  return (
    <aside
      className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-900"
      role="note"
    >
      <strong className="font-semibold">{t.safetyBanner.important}:</strong>{" "}
      {t.safetyBanner.text}
    </aside>
  );
}

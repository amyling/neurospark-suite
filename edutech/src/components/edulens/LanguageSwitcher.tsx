"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { Locale } from "@/lib/i18n/types";

const OPTIONS: { value: Locale; shortLabel: string }[] = [
  { value: "en", shortLabel: "EN" },
  { value: "zh", shortLabel: "中文" },
];

/**
 * Sliding segmented language toggle (EN / 中文).
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="relative inline-grid grid-cols-2 rounded-full bg-slate-200/80 p-0.5"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-sm ring-1 ring-slate-200/60 transition-transform duration-200 ease-out ${
          locale === "zh" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {OPTIONS.map((opt) => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLocale(opt.value)}
            className={`relative z-10 min-w-[3.25rem] px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

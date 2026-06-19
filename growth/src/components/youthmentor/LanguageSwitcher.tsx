"use client";

import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/types/locale";

/**
 * Toggle between English and Chinese UI.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: t.lang.en },
    { value: "zh", label: t.lang.zh },
  ];

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label={t.lang.switchLabel}
    >
      <span className="text-xs font-medium text-slate-500">
        {t.lang.switchLabel}
      </span>
      <div className="flex rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              locale === opt.value
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

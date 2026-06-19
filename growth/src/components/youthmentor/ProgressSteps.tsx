"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * Shows structured flow progress (not open-ended chat).
 */
export function ProgressSteps({ current }: { current: number }) {
  const { t } = useLocale();

  return (
    <ol className="mb-6 flex flex-wrap gap-2" aria-label={t.layout.navAria}>
      {t.flow.steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              active
                ? "bg-violet-500 text-white"
                : done
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-white text-slate-500 ring-1 ring-slate-200"
            }`}
          >
            {index + 1}. {label}
          </li>
        );
      })}
    </ol>
  );
}

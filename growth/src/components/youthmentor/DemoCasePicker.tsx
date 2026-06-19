"use client";

import { useLocale } from "@/context/LocaleContext";
import { getDemoCases } from "@/lib/youthmentor/demo-seed";
import type { DemoCaseId } from "@/lib/youthmentor/demo-seed";

/**
 * Loads seeded demo scenarios into the active session.
 */
export function DemoCasePicker({
  onSelect,
}: {
  onSelect: (id: DemoCaseId) => void;
}) {
  const { t, locale } = useLocale();
  const demos = getDemoCases(locale);

  return (
    <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-violet-100">
      <h2 className="text-sm font-semibold text-violet-800">{t.demo.title}</h2>
      <p className="mt-1 text-xs text-slate-500">{t.demo.subtitle}</p>
      <ul className="mt-3 space-y-2">
        {demos.map((demo) => (
          <li key={demo.id}>
            <button
              type="button"
              onClick={() => onSelect(demo.id)}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                demo.id === "high_risk"
                  ? "bg-rose-50 text-rose-900 ring-1 ring-rose-200 hover:bg-rose-100"
                  : "bg-violet-50 text-violet-900 ring-1 ring-violet-100 hover:bg-violet-100"
              }`}
            >
              <span className="font-medium">{demo.title}</span>
              <span className="mt-0.5 block text-xs opacity-80">
                {demo.description}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

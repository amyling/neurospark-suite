"use client";

import { translateMistakeType, useLocale } from "@/lib/i18n/locale-context";

const COLORS: Record<string, string> = {
  "Sign error": "bg-rose-100 text-rose-800",
  "Calculation error": "bg-orange-100 text-orange-800",
  "Conceptual misunderstanding": "bg-purple-100 text-purple-800",
  "Incomplete explanation": "bg-amber-100 text-amber-800",
  "Procedural slip": "bg-sky-100 text-sky-800",
  "Informal vocabulary": "bg-teal-100 text-teal-800",
  "Unit error": "bg-fuchsia-100 text-fuchsia-800",
  "Unsupported inference": "bg-violet-100 text-violet-800",
};

/** Mistake type badge */
export function MistakeTypeBadge({ type }: { type: string }) {
  const { t } = useLocale();
  const color = COLORS[type] ?? "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${color}`}>
      {translateMistakeType(type, t)}
    </span>
  );
}

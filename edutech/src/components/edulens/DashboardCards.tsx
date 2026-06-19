"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { DashboardStats } from "@/lib/edulens/types";

/** Summary stat cards for dashboard */
export function DashboardCards({ stats }: { stats: DashboardStats }) {
  const { t } = useLocale();
  const cards = [
    { label: t.dashboard.cards.analyses, value: stats.totalAnalyses },
    { label: t.dashboard.cards.lessons, value: stats.totalLessons },
    { label: t.dashboard.cards.mistakes, value: stats.mistakeBookCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{c.label}</p>
          <p className="mt-1 text-3xl font-semibold text-indigo-700">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

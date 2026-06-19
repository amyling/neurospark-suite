"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getInsightStats } from "@/lib/character-chat/growth-storage";

/**
 * Local anonymous insights dashboard (B2B-style prototype).
 */
export function InsightsDashboard() {
  const { t } = useLocale();
  const [stats, setStats] = useState(getInsightStats());

  useEffect(() => {
    setStats(getInsightStats());
  }, []);

  const topScenarios = Object.entries(stats.scenarioStarts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topStress = Object.entries(stats.topStressTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">{t.characterGrowth.statMessages}</p>
          <p className="text-2xl font-semibold text-slate-800">{stats.totalMessages}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">{t.characterGrowth.statFeedback}</p>
          <p className="text-2xl font-semibold text-slate-800">
            👍 {stats.feedbackUp} / 👎 {stats.feedbackDown}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">{t.characterGrowth.statActiveDays}</p>
          <p className="text-2xl font-semibold text-slate-800">{stats.activeDays}</p>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">
          {t.characterGrowth.topScenarios}
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {topScenarios.length === 0 && <li>{t.characterGrowth.noData}</li>}
          {topScenarios.map(([id, count]) => (
            <li key={id}>
              {id}: {count}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">
          {t.characterGrowth.topStress}
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {topStress.length === 0 && <li>{t.characterGrowth.noData}</li>}
          {topStress.map(([tag, count]) => (
            <li key={tag}>
              {tag}: {count}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-500">{t.characterGrowth.insightsNote}</p>
    </div>
  );
}

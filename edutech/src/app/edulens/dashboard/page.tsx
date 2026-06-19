"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardCards } from "@/components/edulens/DashboardCards";
import {
  HistoryTable,
  type HistoryRow,
} from "@/components/edulens/HistoryTable";
import { LoadingState } from "@/components/edulens/LoadingState";
import { ProgressChart } from "@/components/edulens/ProgressChart";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";
import type { DashboardStats } from "@/lib/edulens/types";

export default function DashboardPage() {
  const { locale, t } = useLocale();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardRes, historyRes] = await Promise.all([
        fetchEdulens("/api/edulens/dashboard", locale),
        fetchEdulens("/api/edulens/history", locale),
      ]);
      const [dashboard, hist] = await Promise.all([
        dashboardRes.json(),
        historyRes.json(),
      ]);
      setStats(dashboard);
      setHistory(hist.history ?? []);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t.dashboard.heading}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.dashboard.subtitle}</p>
      </header>

      {loading ? <LoadingState /> : null}
      {stats ? (
        <>
          <DashboardCards stats={stats} />
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">
                {t.dashboard.topicWeakness}
              </h2>
              <ProgressChart data={stats.topicWeakness} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">
                {t.dashboard.recentActivity}
              </h2>
              <ul className="space-y-2 text-sm">
                {stats.recentActivity.map((a) => (
                  <li
                    key={a.id}
                    className="flex justify-between border-b border-slate-100 py-2 last:border-0"
                  >
                    <span className="text-slate-800">{a.title}</span>
                    <span className="text-slate-400">
                      {t.activityType[a.type]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mt-8">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              {t.dashboard.savedHistory}
            </h2>
            <HistoryTable rows={history} />
          </section>
        </>
      ) : null}
    </div>
  );
}

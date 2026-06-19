"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/edulens/EmptyState";
import { LoadingState } from "@/components/edulens/LoadingState";
import { MistakeTypeBadge } from "@/components/edulens/MistakeTypeBadge";
import Link from "next/link";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { formatLocaleDate, useLocale } from "@/lib/i18n/locale-context";
import type { MistakeBookEntry } from "@/lib/edulens/types";

export default function MistakeBookPage() {
  const { locale, t } = useLocale();
  const [entries, setEntries] = useState<MistakeBookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchEdulens("/api/edulens/mistake-book", locale);
      const data = await res.json();
      setEntries(data.entries ?? []);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t.mistakeBook.heading}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.mistakeBook.subtitle}</p>
      </header>

      {loading ? <LoadingState /> : null}
      {!loading && entries.length === 0 ? (
        <EmptyState
          title={t.mistakeBook.emptyTitle}
          description={t.mistakeBook.emptyDescription}
        />
      ) : null}
      {!loading && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-slate-900">{entry.topic}</h2>
                  <p className="text-sm text-slate-500">
                    {t.subjects[entry.subject as keyof typeof t.subjects] ??
                      entry.subject}{" "}
                    · {t.levels[entry.level as keyof typeof t.levels] ?? entry.level}
                  </p>
                </div>
                <time className="text-xs text-slate-400">
                  {formatLocaleDate(entry.savedAt, locale)}
                </time>
              </div>
              <p className="mt-3 text-sm text-slate-700">{entry.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.mistakeTypes.map((type) => (
                  <MistakeTypeBadge key={type} type={type} />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {entry.knowledgePoints.map((kp) => (
                  <span
                    key={kp}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {kp}
                  </span>
                ))}
              </div>
              {entry.analysisId.startsWith("demo-") ? null : (
                <Link
                  href={`/edulens/reports/${entry.analysisId}`}
                  className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
                >
                  {t.mistakeBook.viewReport}
                </Link>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

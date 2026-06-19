"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getMentorPersonas } from "@/lib/youthmentor/demo-seed";
import { deleteReflection, getReflectionHistory } from "@/lib/youthmentor/reflection-storage";
import { generateMentorResponse } from "@/lib/youthmentor/mentor";
import { classifyRisk } from "@/lib/youthmentor/risk";
import type { SavedReflection } from "@/types/youthmentor";

/**
 * Lists saved reflections with delete support.
 */
export function ReflectionHistoryList() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<SavedReflection[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const refresh = () => setItems(getReflectionHistory());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const entry of items) {
        if (entry.isHighRiskBlocked) {
          next[entry.id] = t.history.blockedSummary;
          continue;
        }
        if (entry.response && entry.locale === locale) {
          next[entry.id] = entry.response.reflectionSummary;
          continue;
        }
        if (!entry.response) {
          next[entry.id] = entry.answers.whatHappened;
          continue;
        }
        const risk = await classifyRisk(
          [
            entry.checkIn.freeText,
            entry.answers.whatHappened,
            entry.answers.whatFelt,
            entry.answers.worseThought,
          ].join(" "),
          locale
        );
        const regen = await generateMentorResponse(
          entry.checkIn,
          entry.answers,
          entry.mentorPersona,
          risk,
          locale
        );
        next[entry.id] = regen.reflectionSummary;
      }
      if (!cancelled) {
        setSummaries(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items, locale, t.history.blockedSummary]);

  const handleDelete = (id: string) => {
    if (deleteReflection(id)) {
      refresh();
    }
  };

  const personas = getMentorPersonas(locale);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
        {t.history.empty}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((entry) => {
        const persona = personas.find((p) => p.value === entry.mentorPersona);
        const moodLabel = t.moods[entry.checkIn.mood];
        return (
          <li
            key={entry.id}
            className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {moodLabel} · {t.history.intensity}{" "}
                  {entry.checkIn.intensity}/10
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(entry.createdAt).toLocaleString(
                    locale === "zh" ? "zh-CN" : "en-US"
                  )}{" "}
                  · {persona?.title ?? entry.mentorPersona}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(entry.id)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                {t.common.delete}
              </button>
            </div>
            {entry.isHighRiskBlocked ? (
              <p className="mt-2 text-sm text-rose-700">{t.history.highRiskNote}</p>
            ) : (
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {summaries[entry.id] ?? entry.answers.whatHappened}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

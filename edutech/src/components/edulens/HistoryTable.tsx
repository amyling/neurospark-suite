"use client";

import Link from "next/link";
import { formatLocaleDate, useLocale } from "@/lib/i18n/locale-context";

export type HistoryRow = {
  id: string;
  kind: "homework" | "lesson";
  title: string;
  subject: string;
  level: string;
  result?: string;
  createdAt: string;
};

/** Saved analysis / lesson history table */
export function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  const { locale, t } = useLocale();

  if (!rows.length) {
    return <p className="text-sm text-slate-500">{t.dashboard.noHistory}</p>;
  }

  const kindLabel = (kind: HistoryRow["kind"]) =>
    kind === "homework" ? t.history.homework : t.history.lessonPack;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">{t.common.title}</th>
            <th className="px-4 py-3">{t.common.type}</th>
            <th className="px-4 py-3">{t.common.subject}</th>
            <th className="px-4 py-3">{t.common.level}</th>
            <th className="px-4 py-3">{t.common.date}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium text-slate-800">{row.title}</td>
              <td className="px-4 py-3 text-slate-600">{kindLabel(row.kind)}</td>
              <td className="px-4 py-3 text-slate-600">
                {t.subjects[row.subject as keyof typeof t.subjects] ?? row.subject}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {t.levels[row.level as keyof typeof t.levels] ?? row.level}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {formatLocaleDate(row.createdAt, locale)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/edulens/reports/${row.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  {t.common.view}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

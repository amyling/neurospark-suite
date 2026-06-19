"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Topic weakness bar chart */
export function ProgressChart({
  data,
}: {
  data: { topic: string; subject: string; count: number; percentage: number }[];
}) {
  const { t } = useLocale();

  if (!data.length) {
    return <p className="text-sm text-slate-500">{t.dashboard.noWeakness}</p>;
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.topic}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-slate-700">{item.topic}</span>
            <span className="text-slate-500">
              {t.subjects[item.subject as keyof typeof t.subjects] ?? item.subject} ·{" "}
              {item.percentage}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

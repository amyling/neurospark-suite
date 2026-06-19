"use client";

import type { QuestionItem } from "@/lib/edulens/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { MathRichText } from "./MathRichText";

/** Card for similar / remedial / extension questions */
export function SimilarQuestionCard({
  item,
  variant = "similar",
}: {
  item: QuestionItem;
  variant?: "similar" | "remedial" | "extension";
}) {
  const { t } = useLocale();
  const border =
    variant === "remedial"
      ? "border-emerald-200"
      : variant === "extension"
        ? "border-violet-200"
        : "border-slate-200";

  const diffLabel = item.difficulty
    ? t.difficulty[item.difficulty]
    : null;

  return (
    <article className={`rounded-lg border bg-white p-4 ${border}`}>
      <div className="flex items-start justify-between gap-2">
        <MathRichText text={item.question} className="font-medium" />
        {diffLabel ? (
          <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {diffLabel}
          </span>
        ) : null}
      </div>
      {item.answer ? (
        <div className="mt-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">{t.common.answer}: </span>
          <MathRichText text={item.answer} className="mt-0.5" />
        </div>
      ) : null}
    </article>
  );
}

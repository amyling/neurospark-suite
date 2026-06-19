"use client";

import { MathRichText } from "./MathRichText";
import { useLocale } from "@/lib/i18n/locale-context";
import type { HomeworkAnalysis } from "@/lib/edulens/types";

const STATUS_STYLES: Record<string, string> = {
  present: "border-emerald-200 bg-emerald-50",
  partial: "border-amber-200 bg-amber-50",
  missing: "border-rose-200 bg-rose-50",
  uncertain: "border-slate-200 bg-slate-50",
};

const STATUS_ICON: Record<string, string> = {
  present: "✓",
  partial: "△",
  missing: "✗",
  uncertain: "?",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-rose-100 text-rose-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-emerald-100 text-emerald-800",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  low: "low",
  medium: "medium",
  high: "high",
};

/** Detailed scoring-point breakdown, mistake categories, and score forecast */
export function HomeworkDetailedAnalysis({
  analysis,
}: {
  analysis: HomeworkAnalysis;
}) {
  const { t } = useLocale();
  const hasRubric = analysis.rubricAnalysis.length > 0;
  const hasBreakdown = (analysis.mistakeBreakdown?.length ?? 0) > 0;
  const hasForecast = Boolean(analysis.scoreForecast);
  if (!hasRubric && !hasBreakdown && !hasForecast) {
    return null;
  }

  const forecast = analysis.scoreForecast;

  return (
    <div className="space-y-4">
      {hasForecast && forecast ? (
        <section className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            {t.homework.scoreForecast}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label={t.homework.predictedGain}
              value={`+${forecast.conservativeGain} ~ +${forecast.sprintGain}`}
              sub={`${forecast.nextTestMin} ~ ${forecast.nextTestMax} / ${forecast.maxScore}`}
              accent="text-indigo-600"
            />
            <MetricCard
              label={t.homework.currentScoreRate}
              value={`${Math.round((forecast.currentScore / forecast.maxScore) * 100)}%`}
              sub={`${forecast.currentScore} / ${forecast.maxScore}`}
            />
            <MetricCard
              label={t.homework.recoverableRatio}
              value={`${forecast.recoverablePercentage}%`}
              sub={t.homework.recoverableHint}
            />
            <MetricCard
              label={t.homework.executionDifficulty}
              value={t.homework.difficultyLevel[forecast.executionDifficulty]}
              sub={DIFFICULTY_LABELS[forecast.executionDifficulty]}
            />
          </div>
        </section>
      ) : null}

      {hasBreakdown ? (
        <section className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            {t.homework.mistakeBreakdown}
          </h3>
          <div className="space-y-4">
            {analysis.mistakeBreakdown!.map((item) => (
              <div
                key={item.category}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-rose-600">
                        {item.percentage}%
                      </span>
                      <span className="font-medium text-slate-800">
                        {item.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[item.priority]}`}
                      >
                        {t.homework.priority[item.priority]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.homework.questionsInvolved}: {item.questionCount} ·{" "}
                      {t.homework.lostMarks}: {item.lostMarks} ·{" "}
                      {t.homework.recoverableMarks}: {item.recoverableMarks}
                    </p>
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${Math.min(100, (item.recoverableMarks / Math.max(item.lostMarks, 0.1)) * 100)}%`,
                    }}
                  />
                </div>
                {item.actionPlan.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-600">
                      {t.homework.actionPlan}
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-slate-700">
                      {item.actionPlan.map((step) => (
                        <li key={step}>
                          <MathRichText text={step} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasRubric ? (
        <section className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            {t.homework.scoringPoints}
          </h3>
          <div className="space-y-3">
            {analysis.rubricAnalysis.map((point, i) => (
              <div
                key={`${point.point}-${i}`}
                className={`rounded-lg border p-4 ${STATUS_STYLES[point.status]}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      point.status === "present"
                        ? "bg-emerald-500 text-white"
                        : point.status === "partial"
                          ? "bg-amber-500 text-white"
                          : "bg-rose-500 text-white"
                    }`}
                  >
                    {STATUS_ICON[point.status]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <MathRichText text={point.point} className="font-medium" />
                      {point.maxMarks != null ? (
                        <span className="text-xs text-slate-500">
                          {point.earnedMarks ?? 0}/{point.maxMarks}{" "}
                          {t.homework.marks}
                        </span>
                      ) : null}
                    </div>
                    <MathRichText text={point.explanation} className="mt-1" />
                    {point.standardAnswer ? (
                      <div className="mt-2 rounded bg-white/60 p-2">
                        <p className="text-xs font-medium text-slate-500">
                          {t.homework.standardAnswerLabel}
                        </p>
                        <MathRichText
                          text={point.standardAnswer}
                          className="mt-0.5"
                        />
                      </div>
                    ) : null}
                    {point.improvementSuggestion ? (
                      <div className="mt-2 rounded bg-amber-50/80 p-2">
                        <p className="text-xs font-medium text-amber-700">
                          💡 {t.homework.improvementSuggestion}
                        </p>
                        <MathRichText
                          text={point.improvementSuggestion}
                          className="mt-0.5 text-amber-900"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${accent ?? "text-slate-800"}`}>
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-slate-400">{sub}</p> : null}
    </div>
  );
}

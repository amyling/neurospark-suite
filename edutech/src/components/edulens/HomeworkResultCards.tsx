"use client";

import Link from "next/link";
import { useState } from "react";
import { HomeworkDetailedAnalysis } from "./HomeworkDetailedAnalysis";
import { LearningVisualLesson } from "./LearningVisualLesson";
import { MathRichText } from "./MathRichText";
import { wrapAsDisplayMath } from "@/lib/edulens/math/normalize-math-text";
import { KnowledgePointTags } from "./KnowledgePointTags";
import { MistakeTypeBadge } from "./MistakeTypeBadge";
import { SimilarQuestionCard } from "./SimilarQuestionCard";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { translateResult, useLocale } from "@/lib/i18n/locale-context";
import type { HomeworkAnalysis, HomeworkSubmission } from "@/lib/edulens/types";

const RESULT_STYLES: Record<string, string> = {
  correct: "bg-emerald-100 text-emerald-800",
  partially_correct: "bg-amber-100 text-amber-800",
  incorrect: "bg-rose-100 text-rose-800",
  uncertain: "bg-slate-100 text-slate-700",
};

type ResultTab = "overview" | "scoring" | "learn" | "improve" | "practice";

/** Homework analysis with tabbed structured sections */
export function HomeworkResultCards({
  analysis,
  submission,
  source = "ai",
}: {
  analysis: HomeworkAnalysis;
  submission: HomeworkSubmission;
  source?: "ai" | "mock";
}) {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<ResultTab>("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveToMistakeBook = async () => {
    setSaving(true);
    try {
      const res = await fetchEdulens("/api/edulens/mistake-book", locale, {
        method: "POST",
        body: JSON.stringify({ analysisId: analysis.id }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const hasLearn =
    analysis.result === "incorrect" ||
    analysis.result === "partially_correct" ||
    (analysis.learningVisualLessons?.length ?? 0) > 0 ||
    (analysis.nextKnowledgeUnits?.length ?? 0) > 0;

  const tabs: { id: ResultTab; label: string }[] = [
    { id: "overview", label: t.homework.tabOverview },
    { id: "scoring", label: t.homework.tabScoring },
    ...(hasLearn ? [{ id: "learn" as const, label: t.homework.tabLearn }] : []),
    { id: "improve", label: t.homework.tabImprove },
    { id: "practice", label: t.homework.tabPractice },
  ];

  return (
    <div className="space-y-4">
      {source === "mock" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {t.homework.analysisMockBanner}
        </p>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${RESULT_STYLES[analysis.result]}`}
          >
            {translateResult(analysis.result, t)}
          </span>
          {analysis.estimatedScore ? (
            <span className="text-sm text-slate-600">
              {t.homework.score}: {analysis.estimatedScore.score}/
              {analysis.estimatedScore.maxScore}{" "}
              <span className="text-slate-400">
                ({t.confidence[analysis.estimatedScore.confidence]})
              </span>
            </span>
          ) : null}
          {analysis.teacherReviewRecommended ? (
            <span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">
              {t.homework.teacherReviewRecommended}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-1 border-b border-slate-100 pb-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-indigo-100 text-indigo-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "overview" ? (
            <OverviewTab analysis={analysis} submission={submission} />
          ) : null}
          {tab === "scoring" ? <ScoringTab analysis={analysis} /> : null}
          {tab === "learn" ? <LearnTab analysis={analysis} /> : null}
          {tab === "improve" ? <ImproveTab analysis={analysis} /> : null}
          {tab === "practice" ? <PracticeTab analysis={analysis} /> : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={saveToMistakeBook}
            disabled={saving || saved}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saved
              ? t.homework.savedMistakeBook
              : saving
                ? t.homework.saving
                : t.homework.saveMistakeBook}
          </button>
          <Link
            href={`/edulens/reports/${analysis.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.homework.fullReport}
          </Link>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  analysis,
  submission,
}: {
  analysis: HomeworkAnalysis;
  submission: HomeworkSubmission;
}) {
  const { t } = useLocale();
  const cmp = analysis.answerComparison;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <ContentBox title={t.homework.questionLabel} content={submission.questionText} />
        <ContentBox title={t.homework.answerLabel} content={submission.studentAnswer} />
      </div>

      {cmp ? (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
          <h4 className="text-sm font-semibold text-indigo-900">
            {t.homework.answerComparison}
          </h4>
          <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
            <MiniBlock label={t.homework.questionRecap} text={cmp.questionRecap} />
            <MiniBlock label={t.homework.studentRecap} text={cmp.studentAnswerRecap} />
          </div>
          <MiniBlock label={t.homework.modelAnswer} text={cmp.modelAnswer} className="mt-3" />
          {cmp.keyDifferences.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-600">
                {t.homework.keyDifferences}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-700">
                {cmp.keyDifferences.map((d) => (
                  <li key={d}>
                    <MathRichText text={d} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <ContentBox title={t.homework.feedbackLabel} content={analysis.feedback} />
    </div>
  );
}

function ScoringTab({ analysis }: { analysis: HomeworkAnalysis }) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <HomeworkDetailedAnalysis analysis={analysis} />
      <ContentBox title={t.homework.correctSolution} content={analysis.correctSolution} />
    </div>
  );
}

function LearnTab({ analysis }: { analysis: HomeworkAnalysis }) {
  const { t } = useLocale();
  const hasVisualLessons = (analysis.learningVisualLessons?.length ?? 0) > 0;
  const hasNextUnits = (analysis.nextKnowledgeUnits?.length ?? 0) > 0;
  const fallbackPlans =
    !hasVisualLessons && !hasNextUnits
      ? (analysis.mistakeBreakdown ?? []).flatMap((item) => item.actionPlan)
      : [];

  return (
    <div className="space-y-5">
      {analysis.learningVisualLessons?.map((lesson) => (
        <LearningVisualLesson key={lesson.title} lesson={lesson} />
      ))}

      {analysis.nextKnowledgeUnits?.map((unit) => (
        <div
          key={unit.topic}
          className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4"
        >
          <MathRichText text={unit.topic} className="font-semibold text-emerald-900" />
          <MathRichText text={unit.whyNeeded} className="mt-1 text-sm text-emerald-800" />
          {unit.keyIdeas.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-600">
                {t.homework.keyIdeasLabel}
              </p>
              <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
                {unit.keyIdeas.map((idea) => (
                  <li key={idea}>
                    <MathRichText text={idea} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {unit.formulas.length > 0 ? (
            <div className="mt-3 space-y-2">
              {unit.formulas.map((f) => (
                <MathRichText key={f} text={wrapAsDisplayMath(f)} />
              ))}
            </div>
          ) : null}
          {unit.studySteps.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-600">
                {t.homework.studyStepsLabel}
              </p>
              <ol className="mt-1 list-decimal pl-4 text-sm text-slate-700">
                {unit.studySteps.map((step) => (
                  <li key={step}>
                    <MathRichText text={step} />
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      ))}

      {fallbackPlans.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
          <h4 className="font-semibold text-amber-900">{t.homework.learningPlan}</h4>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            {fallbackPlans.map((step) => (
              <li key={step}>
                <MathRichText text={step} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ImproveTab({ analysis }: { analysis: HomeworkAnalysis }) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {analysis.mistakeTypes.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800">
            {t.homework.mistakeTypes}
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.mistakeTypes.map((type) => (
              <MistakeTypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-800">
          {t.homework.knowledgePoints}
        </h4>
        <KnowledgePointTags {...analysis.knowledgePoints} />
      </div>

      {analysis.improvementTips && analysis.improvementTips.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800">
            {t.homework.improvementTips}
          </h4>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {analysis.improvementTips.map((tip) => (
              <li key={tip}>
                <MathRichText text={tip} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {analysis.perfectAnswerTemplate ? (
        <ContentBox
          title={t.homework.perfectAnswerTemplate}
          content={analysis.perfectAnswerTemplate}
        />
      ) : null}

      {analysis.learningPlan.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800">
            {t.homework.learningPlan}
          </h4>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {analysis.learningPlan.map((step) => (
              <li key={step}>
                <MathRichText text={step} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function PracticeTab({ analysis }: { analysis: HomeworkAnalysis }) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <QuestionGrid title={t.homework.similarQuestions} items={analysis.similarQuestions} />
      <QuestionGrid
        title={t.homework.remedialPractice}
        items={analysis.remedialQuestions}
        variant="remedial"
      />
      <QuestionGrid
        title={t.homework.extension}
        items={analysis.extensionQuestions}
        variant="extension"
      />
    </div>
  );
}

function ContentBox({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h4>
      <MathRichText text={content} className="mt-2" />
    </div>
  );
}

function MiniBlock({
  label,
  text,
  className = "",
}: {
  label: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <MathRichText text={text} className="mt-0.5" />
    </div>
  );
}

function QuestionGrid({
  title,
  items,
  variant,
}: {
  title: string;
  items: HomeworkAnalysis["similarQuestions"];
  variant?: "remedial" | "extension";
}) {
  if (!items.length) return null;

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-800">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((q) => (
          <SimilarQuestionCard key={q.id} item={q} variant={variant} />
        ))}
      </div>
    </div>
  );
}

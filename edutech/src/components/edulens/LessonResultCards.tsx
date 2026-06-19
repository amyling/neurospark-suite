"use client";

import Link from "next/link";
import { LessonAnimationSection } from "./LessonAnimationSection";
import { RichContentBlocks } from "./RichContentBlocks";
import { useLocale } from "@/lib/i18n/locale-context";
import type { LessonOutput, LessonRequest } from "@/lib/edulens/types";

/** Lesson pack result display */
export function LessonResultCards({
  output,
  request,
  source,
}: {
  output: LessonOutput;
  request: LessonRequest;
  source?: "ai" | "mock";
}) {
  const { t } = useLocale();
  const subjectLabel =
    t.subjects[request.subject as keyof typeof t.subjects] ?? request.subject;
  const levelLabel =
    t.levels[request.level as keyof typeof t.levels] ?? request.level;

  const sourceLabel =
    output.contentSource === "teacher_input"
      ? t.lesson.sourceTeacher
      : output.contentSource === "mixed"
        ? t.lesson.sourceMixed
        : t.lesson.sourceAi;

  return (
    <div className="space-y-6">
      {source === "mock" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t.lesson.lessonMockBanner}
        </p>
      ) : null}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{request.topic}</h2>
        <p className="text-sm text-slate-500">
          {subjectLabel} · {levelLabel} · {request.durationMinutes}{" "}
          {t.common.min}
        </p>
        <p className="mt-1 text-xs text-slate-400">{sourceLabel}</p>
        <Link
          href={`/edulens/reports/${output.id}`}
          className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
        >
          {t.lesson.viewFullReport}
        </Link>
      </div>

      {output.teachingContent?.length ? (
        <Section title={t.lesson.teachingContent}>
          <RichContentBlocks blocks={output.teachingContent} />
        </Section>
      ) : null}

      {output.learningVisualLessons?.length ? (
        <Section title={t.lesson.animationSection}>
          <LessonAnimationSection lessons={output.learningVisualLessons} />
        </Section>
      ) : null}

      <Section title={t.lesson.learningObjectives}>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {output.learningObjectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title={t.lesson.keyConcepts}>
        <div className="flex flex-wrap gap-2">
          {output.keyConcepts.map((c) => (
            <span
              key={c}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-800"
            >
              {c}
            </span>
          ))}
        </div>
      </Section>

      <Section title={t.lesson.lessonPlan}>
        <div className="space-y-3">
          {output.lessonPlan.map((phase) => (
            <div
              key={phase.phase}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <p className="font-medium text-slate-800">
                {phase.phase}{" "}
                <span className="font-normal text-slate-500">
                  ({phase.durationMinutes} {t.common.min})
                </span>
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                {phase.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              {phase.teacherScript ? (
                <p className="mt-2 rounded bg-indigo-50/50 px-2 py-1.5 text-sm italic text-indigo-900/90">
                  <span className="font-medium not-italic">
                    {t.lesson.teacherScript}:{" "}
                  </span>
                  {phase.teacherScript}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.lesson.commonMisconceptions}>
        <ul className="list-disc space-y-1 pl-5 text-sm text-rose-800/90">
          {output.commonMisconceptions.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Section>

      <Section title={t.lesson.worksheet}>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {output.worksheet.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ol>
      </Section>

      {output.workedExamples.length > 0 ? (
        <Section title={t.lesson.workedExamples}>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {output.workedExamples.map((q) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ol>
        </Section>
      ) : null}

      {output.answerKey.length > 0 ? (
        <Section title={t.lesson.answerKey}>
          <ul className="space-y-2 text-sm text-slate-700">
            {output.answerKey.map((a) => (
              <li key={a.questionId} className="rounded-lg bg-slate-50 p-2">
                <span className="font-medium text-slate-800">{a.questionId}: </span>
                {a.answer}
                {a.working ? (
                  <p className="mt-1 text-xs text-slate-500">{a.working}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {output.homework?.length ? (
        <Section title={t.lesson.homeworkSection}>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {output.homework.map((q) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section title={t.lesson.revisionNotes}>
        <p className="text-sm leading-relaxed text-slate-700">{output.revisionNotes}</p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">{title}</h3>
      {children}
    </section>
  );
}

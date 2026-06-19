"use client";

import { useCallback, useEffect, useState } from "react";
import { LessonStepVisual } from "./LessonStepVisual";
import { MathRichText } from "./MathRichText";
import { useLocale } from "@/lib/i18n/locale-context";
import type { LearningVisualLesson as LessonType } from "@/lib/edulens/types";

const STEP_MS = 9000;

/**
 * Typewriter-style teacher narration for step body text.
 */
function TeacherNarration({ text }: { text: string }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    setVisible("");
    let index = 0;
    const chunk = Math.max(2, Math.floor(text.length / 50));
    const timer = window.setInterval(() => {
      index += chunk;
      setVisible(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <MathRichText
      text={visible || " "}
      className="mt-2 text-sm leading-relaxed text-slate-700"
    />
  );
}

/**
 * Step-by-step animated micro-lesson with coordinate-graph visuals.
 */
export function LearningVisualLesson({ lesson }: { lesson: LessonType }) {
  const { t } = useLocale();
  const steps = lesson.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const current = steps[stepIndex];

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    if (!playing || stepIndex >= steps.length - 1) {
      return;
    }
    const timer = window.setTimeout(goNext, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, steps.length, goNext]);

  if (!steps.length || !current) {
    return null;
  }

  return (
    <div className="learning-visual-lesson overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold text-violet-900">{lesson.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-violet-700">
              {lesson.knowledgeGap}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
            >
              {playing ? t.homework.lessonPause : t.homework.lessonPlay}
            </button>
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={goPrev}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 disabled:opacity-40"
            >
              ←
            </button>
            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
              >
                {t.homework.lessonNext} →
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex gap-1">
          {steps.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-violet-500" : "bg-violet-200"
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-0">
        <LessonStepVisual step={current} stepIndex={stepIndex} />

        <div
          key={current.id ?? stepIndex}
          className="lesson-step-enter border-t border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5"
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {t.homework.lessonStepLabel} {stepIndex + 1} / {steps.length}
            </p>
            <h5 className="mt-1 text-base font-semibold text-slate-900">
              {current.title}
            </h5>
            <TeacherNarration key={`${stepIndex}-${current.title}`} text={current.body} />

            {current.highlightVars && current.highlightVars.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {current.highlightVars.map((v, i) => (
                  <span
                    key={v}
                    className={`var-pulse rounded-full bg-amber-100 px-2 py-0.5 font-mono text-xs text-amber-900 lesson-delay-${Math.min(i + 1, 4)}`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            ) : null}

            {stepIndex >= steps.length - 1 ? (
              <p className="mt-4 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-900">
                ✓ {lesson.summary}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

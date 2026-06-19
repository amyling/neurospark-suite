"use client";

import { useEffect, useState } from "react";
import { AiProviderBadge } from "@/components/edulens/AiProviderBadge";
import { LessonResultCards } from "@/components/edulens/LessonResultCards";
import { LoadingState } from "@/components/edulens/LoadingState";
import { SyllabusSelectors } from "@/components/edulens/SyllabusSelectors";
import { UploadPanel } from "@/components/edulens/UploadPanel";
import type { SyllabusSchoolLevel } from "@/lib/edulens/knowledge/syllabus-options-types";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";
import type { LessonOutput, LessonRequest } from "@/lib/edulens/types";

const OUTPUT_OPTIONS = [
  "lesson_plan",
  "worksheet",
  "answer_key",
  "misconceptions",
  "revision_notes",
  "exit_ticket",
  "homework",
] as const;

export default function LessonGeneratorPage() {
  const { locale, t } = useLocale();
  const [userMode, setUserMode] = useState<"teacher" | "student">("teacher");
  const [schoolLevel, setSchoolLevel] = useState<SyllabusSchoolLevel>("secondary");
  const [subject, setSubject] = useState("Mathematics");
  const [level, setLevel] = useState("Sec 4");
  const [topic, setTopic] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState<
    "basic" | "standard" | "challenge" | "mixed"
  >("mixed");
  const [teacherContent, setTeacherContent] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [outputTypes, setOutputTypes] = useState<string[]>([
    "lesson_plan",
    "worksheet",
    "answer_key",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    request: LessonRequest;
    output: LessonOutput;
    meta?: { source: "ai" | "mock"; provider: string };
  } | null>(null);

  useEffect(() => {
    setResult(null);
    setError(null);
    setReferenceImages([]);
  }, [locale]);

  const toggleOutput = (type: string) => {
    setOutputTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const generate = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetchEdulens("/api/edulens/lesson/generate", locale, {
        method: "POST",
        body: JSON.stringify({
          userMode,
          subject,
          level,
          topic,
          durationMinutes,
          difficulty,
          outputTypes,
          teacherContent: teacherContent || undefined,
          learningGoals: learningGoals || undefined,
          referenceImageDataUrls:
            referenceImages.length > 0 ? referenceImages : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data.errorCode === "no_ai_provider"
            ? t.lesson.errors.noAiProvider
            : data.errorCode === "validation_failed"
              ? t.lesson.errors.validationFailed
              : data.errorCode === "ai_failed"
                ? t.lesson.errors.aiFailed
                : data.error ?? t.lesson.errors.failed;
        setError(message);
        return;
      }
      setResult(data);
    } catch {
      setError(t.common.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.lesson.heading}</h1>
          <p className="mt-1 text-sm text-slate-600">{t.lesson.subtitle}</p>
        </div>
        <AiProviderBadge />
      </header>

      <form
        className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <div className="space-y-5">
          <fieldset className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
            <legend className="px-1 text-sm font-medium text-slate-700">
              {t.common.teacher} / {t.common.student}
            </legend>
            <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-700">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={userMode === "teacher"}
                  onChange={() => setUserMode("teacher")}
                />
                {t.common.teacher}
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={userMode === "student"}
                  onChange={() => setUserMode("student")}
                />
                {t.common.student}
              </label>
            </div>
          </fieldset>

          <SyllabusSelectors
            schoolLevel={schoolLevel}
            subject={subject}
            grade={level}
            topic={topic}
            onSchoolLevelChange={setSchoolLevel}
            onSubjectChange={setSubject}
            onGradeChange={setLevel}
            onTopicChange={setTopic}
          />

          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t.lesson.learningGoalsLabel}</span>
            <input
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              placeholder={t.lesson.learningGoalsPlaceholder}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t.lesson.teacherContentLabel}</span>
            <p className="mt-0.5 text-xs text-slate-500">{t.lesson.teacherContentHint}</p>
            <textarea
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              rows={5}
              value={teacherContent}
              onChange={(e) => setTeacherContent(e.target.value)}
              placeholder={t.lesson.teacherContentPlaceholder}
            />
          </label>

          <UploadPanel
            label={t.lesson.referenceImagesLabel}
            hint={t.lesson.referenceImagesHint}
            chooseFileLabel={t.homework.chooseFile}
            subject={subject}
            topic={topic}
            purpose="lesson"
            images={referenceImages}
            onImagesChange={setReferenceImages}
            onTextExtracted={(text, meta) => {
              if (meta?.dataUrl) {
                setReferenceImages((prev) =>
                  prev.includes(meta.dataUrl!)
                    ? prev
                    : [...prev, meta.dataUrl!]
                );
              }
              if (text.trim()) {
                setTeacherContent((prev) =>
                  prev.trim() ? `${prev.trim()}\n\n${text}` : text
                );
              }
            }}
          />
          {referenceImages.length > 0 ? (
            <p className="text-xs text-slate-500">
              {referenceImages.length} image(s) attached for multimodal generation
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t.lesson.duration}</span>
              <input
                type="number"
                min={20}
                max={120}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t.lesson.difficulty}</span>
              <select
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value as "basic" | "standard" | "challenge" | "mixed"
                  )
                }
              >
                <option value="basic">{t.difficulty.basic}</option>
                <option value="standard">{t.difficulty.standard}</option>
                <option value="challenge">{t.difficulty.challenge}</option>
                <option value="mixed">{t.difficulty.mixed}</option>
              </select>
            </label>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">{t.lesson.outputs}</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {OUTPUT_OPTIONS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleOutput(type)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    outputTypes.includes(type)
                      ? "border-indigo-200 bg-indigo-100 text-indigo-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {t.lesson.outputTypes[type]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? t.lesson.generating : t.lesson.generate}
          </button>
          {error ? (
            <p className="text-sm text-rose-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      <section className="mt-8 w-full">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {t.lesson.resultsHeading}
        </h2>
        {loading ? <LoadingState label={t.lesson.generatingState} /> : null}
        {!loading && result ? (
          <LessonResultCards
            output={result.output}
            request={result.request}
            source={result.meta?.source}
          />
        ) : (
          !loading ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              {t.lesson.resultsPlaceholder}
            </p>
          ) : null
        )}
      </section>
    </div>
  );
}

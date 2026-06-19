"use client";

import { useEffect, useState } from "react";
import { AiProviderBadge } from "@/components/edulens/AiProviderBadge";
import { HomeworkResultCards } from "@/components/edulens/HomeworkResultCards";
import { LoadingState } from "@/components/edulens/LoadingState";
import { OcrTextBox } from "@/components/edulens/OcrTextBox";
import { UploadPanel } from "@/components/edulens/UploadPanel";
import { SUBJECTS, LEVELS } from "@/lib/edulens/constants";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";
import type { HomeworkAnalysis, HomeworkSubmission } from "@/lib/edulens/types";

type UploadMode = "separate" | "combined";

function getDemoData(locale: "en" | "zh") {
  if (locale === "zh") {
    return {
      subject: "Mathematics",
      level: "Sec 4",
      topic: "二次方程",
      questionText: "用因式分解法解 x² - 5x + 6 = 0，写出完整步骤。",
      studentAnswer: "x = 2 和 x = 3，但中间步骤略写",
      standardAnswer: "(x-2)(x-3)=0，x=2,3",
    };
  }
  return {
    subject: "Mathematics",
    level: "Sec 4",
    topic: "Quadratic equations",
    questionText: "Solve x² - 5x + 6 = 0 by factorisation. Show your working.",
    studentAnswer: "x = 2 and x = 3 but I skipped steps",
    standardAnswer: "(x-2)(x-3)=0, x=2,3",
  };
}

export default function HomeworkAnalyzerPage() {
  const { locale, t } = useLocale();
  const [subject, setSubject] = useState("Mathematics");
  const [level, setLevel] = useState("Sec 4");
  const [topic, setTopic] = useState("");
  const [uploadMode, setUploadMode] = useState<UploadMode>("combined");
  const [questionText, setQuestionText] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [standardAnswer, setStandardAnswer] = useState("");
  const [questionImages, setQuestionImages] = useState<string[]>([]);
  const [answerImages, setAnswerImages] = useState<string[]>([]);
  const [combinedImages, setCombinedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    submission: HomeworkSubmission;
    analysis: HomeworkAnalysis;
    meta?: { source: "ai" | "mock" };
  } | null>(null);

  useEffect(() => {
    setResult(null);
    setError(null);
  }, [locale]);

  const loadDemo = () => {
    const demo = getDemoData(locale);
    setSubject(demo.subject);
    setLevel(demo.level);
    setTopic(demo.topic);
    setQuestionText(demo.questionText);
    setStudentAnswer(demo.studentAnswer);
    setStandardAnswer(demo.standardAnswer);
    setQuestionImages([]);
    setAnswerImages([]);
    setCombinedImages([]);
  };

  const handleCombinedExtract = (
    _text: string,
    meta?: { questionText?: string; studentAnswer?: string }
  ) => {
    if (meta?.questionText) setQuestionText(meta.questionText);
    if (meta?.studentAnswer) setStudentAnswer(meta.studentAnswer);
  };

  const allImages =
    uploadMode === "combined"
      ? combinedImages
      : [...questionImages, ...answerImages];

  const canAnalyze =
    questionText.trim().length > 0 && studentAnswer.trim().length > 0;

  const analyze = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetchEdulens("/api/edulens/homework/analyze", locale, {
        method: "POST",
        body: JSON.stringify({
          subject,
          level,
          topic: topic || undefined,
          questionText,
          studentAnswer,
          standardAnswer: standardAnswer || undefined,
          imageUrls: allImages.length > 0 ? allImages : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.homework.errors.failed);
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
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.homework.heading}</h1>
          <p className="mt-1 text-sm text-slate-600">{t.homework.subtitle}</p>
        </div>
        <AiProviderBadge />
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t.common.subject}</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {t.subjects[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t.common.level}</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {t.levels[l]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">
              {t.common.topic} ({t.common.optional})
            </span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.homework.topicPlaceholder}
            />
          </label>

          <fieldset className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <legend className="px-1 text-sm font-medium text-slate-700">
              {t.homework.uploadModeLabel}
            </legend>
            <div className="mt-1 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="uploadMode"
                  checked={uploadMode === "separate"}
                  onChange={() => setUploadMode("separate")}
                />
                {t.homework.uploadModeSeparate}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="uploadMode"
                  checked={uploadMode === "combined"}
                  onChange={() => setUploadMode("combined")}
                />
                {t.homework.uploadModeCombined}
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">{t.homework.uploadModeHint}</p>
          </fieldset>

          {uploadMode === "combined" ? (
            <UploadPanel
              label={t.homework.uploadCombined}
              hint={t.homework.uploadHint}
              chooseFileLabel={t.homework.chooseFile}
              dragDropHint={t.homework.dragDropHint}
              pasteHint={t.homework.pasteHint}
              subject={subject}
              topic={topic}
              purpose="homework"
              extractRole="combined"
              images={combinedImages}
              onImagesChange={setCombinedImages}
              onTextExtracted={handleCombinedExtract}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <UploadPanel
                label={t.homework.uploadQuestion}
                hint={t.homework.uploadHint}
                chooseFileLabel={t.homework.chooseFile}
                dragDropHint={t.homework.dragDropHint}
                pasteHint={t.homework.pasteHint}
                subject={subject}
                topic={topic}
                purpose="homework"
                images={questionImages}
                onImagesChange={setQuestionImages}
                onTextExtracted={(text) => setQuestionText(text)}
              />
              <UploadPanel
                label={t.homework.uploadAnswer}
                hint={t.homework.uploadHint}
                chooseFileLabel={t.homework.chooseFile}
                dragDropHint={t.homework.dragDropHint}
                pasteHint={t.homework.pasteHint}
                subject={subject}
                topic={topic}
                purpose="homework"
                images={answerImages}
                onImagesChange={setAnswerImages}
                onTextExtracted={(text) => setStudentAnswer(text)}
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <OcrTextBox
              label={t.homework.questionLabel}
              value={questionText}
              onChange={setQuestionText}
              placeholder={t.homework.questionPlaceholder}
            />
            <OcrTextBox
              label={t.homework.answerLabel}
              value={studentAnswer}
              onChange={setStudentAnswer}
              placeholder={t.homework.answerPlaceholder}
            />
          </div>

          <OcrTextBox
            label={t.homework.standardLabel}
            value={standardAnswer}
            onChange={setStandardAnswer}
            rows={2}
            placeholder={t.homework.standardPlaceholder}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={analyze}
              disabled={loading || !canAnalyze}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? t.homework.analyzing : t.homework.analyze}
            </button>
            <button
              type="button"
              onClick={loadDemo}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              {t.homework.loadDemo}
            </button>
          </div>

          {error ? (
            <p className="text-sm text-rose-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      {loading ? (
        <div className="mt-8">
          <LoadingState label={t.homework.analyzingState} />
        </div>
      ) : null}

      {!loading && result ? (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {t.homework.resultsHeading}
          </h2>
          <HomeworkResultCards
            analysis={result.analysis}
            submission={result.submission}
            source={result.meta?.source}
          />
        </section>
      ) : null}
    </div>
  );
}

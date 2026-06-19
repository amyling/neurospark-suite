"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HomeworkResultCards } from "@/components/edulens/HomeworkResultCards";
import { LessonResultCards } from "@/components/edulens/LessonResultCards";
import { LoadingState } from "@/components/edulens/LoadingState";
import { ReportExportButton } from "@/components/edulens/ReportExportButton";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";
import type {
  HomeworkAnalysis,
  HomeworkSubmission,
  LessonOutput,
  LessonRequest,
} from "@/lib/edulens/types";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const { locale, t } = useLocale();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homework, setHomework] = useState<{
    analysis: HomeworkAnalysis;
    submission: HomeworkSubmission;
  } | null>(null);
  const [lesson, setLesson] = useState<{
    lesson: LessonOutput;
    request?: LessonRequest;
  } | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHomework(null);
    setLesson(null);
    try {
      const res = await fetchEdulens(`/api/edulens/reports/${id}`, locale);
      const data = await res.json();
      if (data.error) {
        setError(t.report.notFound);
        return;
      }
      if (data.type === "homework") {
        setHomework({ analysis: data.analysis, submission: data.submission });
      } else if (data.type === "lesson") {
        setLesson({ lesson: data.lesson, request: data.request });
      }
    } catch {
      setError(t.report.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [id, locale, t.report.loadFailed, t.report.notFound]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <div className="report-print">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/edulens/dashboard" className="text-sm text-indigo-600 hover:underline">
          {t.common.backDashboard}
        </Link>
        <ReportExportButton />
      </div>

      <header className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{t.report.heading}</h1>
        <p className="mt-2 text-xs text-slate-500">
          {t.safety.noPerfectMarking} · {t.safety.teacherReview}
        </p>
      </header>

      {loading ? <LoadingState /> : null}
      {error ? (
        <p className="text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
      {homework ? (
        <HomeworkResultCards
          analysis={homework.analysis}
          submission={homework.submission}
        />
      ) : null}
      {lesson?.lesson && lesson.request ? (
        <LessonResultCards output={lesson.lesson} request={lesson.request} />
      ) : null}
    </div>
  );
}

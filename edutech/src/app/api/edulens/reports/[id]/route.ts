import { NextResponse } from "next/server";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import {
  getAnalysisById,
  getLessonOutputById,
  getStore,
  getSubmissionById,
} from "@/lib/edulens/store";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const locale = getLocaleFromRequest(request);
  const { id } = await context.params;
  const analysis = getAnalysisById(id, locale);
  if (analysis) {
    const submission = getSubmissionById(analysis.submissionId, locale);
    return NextResponse.json({ type: "homework", analysis, submission });
  }

  const lesson = getLessonOutputById(id, locale);
  if (lesson) {
    const requestRecord = getStore(locale).lessonRequests.find(
      (r) => r.id === lesson.requestId
    );
    return NextResponse.json({ type: "lesson", lesson, request: requestRecord });
  }

  return NextResponse.json({ error: "Report not found" }, { status: 404 });
}

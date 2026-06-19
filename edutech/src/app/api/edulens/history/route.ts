import { NextResponse } from "next/server";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import { getStore } from "@/lib/edulens/store";

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);
  const store = getStore(locale);
  const homeworkFallback = locale === "zh" ? "作业" : "Homework";
  const lessonFallback = locale === "zh" ? "教案包" : "Lesson pack";

  const history = [
    ...store.analyses.map((a) => {
      const sub = store.submissions.find((s) => s.id === a.submissionId);
      return {
        id: a.id,
        kind: "homework" as const,
        title: sub?.topic ?? sub?.subject ?? homeworkFallback,
        subject: sub?.subject ?? "",
        level: sub?.level ?? "",
        result: a.result,
        createdAt: a.createdAt,
      };
    }),
    ...store.lessonOutputs.map((o) => {
      const req = store.lessonRequests.find((r) => r.id === o.requestId);
      return {
        id: o.id,
        kind: "lesson" as const,
        title: req?.topic ?? lessonFallback,
        subject: req?.subject ?? "",
        level: req?.level ?? "",
        createdAt: o.createdAt,
      };
    }),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ history });
}

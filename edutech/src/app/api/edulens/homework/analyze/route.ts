import { NextResponse } from "next/server";
import {
  analyzeHomework,
  HomeworkAnalysisError,
} from "@/lib/edulens/services/edulens-service";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import { getMessages } from "@/lib/i18n/messages";
import type { HomeworkSubmission, RubricPoint } from "@/lib/edulens/types";

export async function POST(request: Request) {
  try {
    const locale = getLocaleFromRequest(request);
    const t = getMessages(locale);
    const body = (await request.json()) as Partial<HomeworkSubmission>;

    if (!body.subject || !body.level || !body.questionText || !body.studentAnswer) {
      return NextResponse.json(
        { error: t.homework.errors.required },
        { status: 400 }
      );
    }

    const result = await analyzeHomework(
      {
        subject: body.subject,
        level: body.level,
        topic: body.topic,
        questionText: body.questionText,
        studentAnswer: body.studentAnswer,
        standardAnswer: body.standardAnswer,
        rubric: body.rubric as RubricPoint[] | undefined,
        imageUrls: body.imageUrls,
      },
      locale
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] homework analyze:", error);

    if (error instanceof HomeworkAnalysisError) {
      const locale = getLocaleFromRequest(request);
      const t = getMessages(locale);
      const message =
        error.code === "no_ai_provider"
          ? t.homework.errors.noAiProvider
          : error.code === "validation_failed"
            ? t.homework.errors.validationFailed
            : t.homework.errors.aiFailed;

      return NextResponse.json(
        { error: message, errorCode: error.code },
        { status: error.code === "no_ai_provider" ? 503 : 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze homework" },
      { status: 500 }
    );
  }
}

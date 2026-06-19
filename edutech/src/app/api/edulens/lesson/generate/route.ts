import { NextResponse } from "next/server";
import {
  generateLessonPack,
  LessonGenerationError,
} from "@/lib/edulens/services/edulens-service";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import { getMessages } from "@/lib/i18n/messages";
import type { LessonRequest } from "@/lib/edulens/types";

export async function POST(request: Request) {
  try {
    const locale = getLocaleFromRequest(request);
    const t = getMessages(locale);
    const body = (await request.json()) as Partial<LessonRequest>;
    if (
      !body.subject ||
      !body.level ||
      !body.topic ||
      !body.durationMinutes
    ) {
      return NextResponse.json(
        { error: "subject, level, topic, and durationMinutes are required" },
        { status: 400 }
      );
    }

    const result = await generateLessonPack(
      {
        userMode: body.userMode ?? "teacher",
        subject: body.subject,
        level: body.level,
        topic: body.topic,
        classProfile: body.classProfile,
        durationMinutes: body.durationMinutes,
        difficulty: body.difficulty ?? "mixed",
        outputTypes: body.outputTypes ?? ["lesson_plan", "worksheet", "answer_key"],
        teacherContent: body.teacherContent,
        learningGoals: body.learningGoals,
        referenceImageDataUrls: body.referenceImageDataUrls,
      },
      locale
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] lesson generate:", error);

    if (error instanceof LessonGenerationError) {
      const locale = getLocaleFromRequest(request);
      const t = getMessages(locale);
      const message =
        error.code === "no_ai_provider"
          ? t.lesson.errors.noAiProvider
          : error.code === "validation_failed"
            ? t.lesson.errors.validationFailed
            : t.lesson.errors.aiFailed;

      return NextResponse.json(
        { error: message, errorCode: error.code },
        { status: error.code === "no_ai_provider" ? 503 : 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate lesson pack" },
      { status: 500 }
    );
  }
}

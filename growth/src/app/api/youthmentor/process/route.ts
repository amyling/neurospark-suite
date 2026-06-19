import { NextResponse } from "next/server";
import { createActionPlan } from "@/lib/youthmentor/action-plan";
import { generateMentorResponse } from "@/lib/youthmentor/mentor";
import { classifyRisk, getSafetyCrisisMessage } from "@/lib/youthmentor/risk";
import type { Locale } from "@/types/locale";
import { DEFAULT_LOCALE } from "@/types/locale";
import type {
  MentorPersona,
  MoodCheckIn,
  ReflectionAnswers,
} from "@/types/youthmentor";

type ProcessBody = {
  checkIn: MoodCheckIn;
  answers: ReflectionAnswers;
  mentorPersona: MentorPersona;
  locale?: Locale;
};

/**
 * API route: layered safety pipeline for mentor processing.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProcessBody;
    const { checkIn, answers, mentorPersona } = body;
    const locale: Locale =
      body.locale === "zh" || body.locale === "en" ? body.locale : DEFAULT_LOCALE;

    const combinedText = [
      checkIn.freeText,
      answers.whatHappened,
      answers.whatFelt,
      answers.worseThought,
      answers.anotherView,
      answers.smallAction,
      answers.trustedPerson,
    ].join(" ");

    const risk = await classifyRisk(combinedText, locale);

    if (risk.safetyLevel === "high_risk") {
      return NextResponse.json({
        blocked: true,
        risk,
        message: getSafetyCrisisMessage(locale),
      });
    }

    const response = await generateMentorResponse(
      checkIn,
      answers,
      mentorPersona,
      risk,
      locale
    );

    return NextResponse.json({
      blocked: false,
      risk,
      response,
      actionPlan: createActionPlan(response),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}

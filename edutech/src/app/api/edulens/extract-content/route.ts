import { NextResponse } from "next/server";
import { formatOcrMathFields } from "@/lib/edulens/ai/format-ocr-math";
import {
  splitCombinedFormulas,
  splitCombinedHomeworkText,
} from "@/lib/edulens/ai/split-homework-text";
import {
  extractFromImages,
  type VisionExtractErrorCode,
} from "@/lib/edulens/ai/vision";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import { getMessages } from "@/lib/i18n/messages";

function errorMessage(
  locale: "en" | "zh",
  code: VisionExtractErrorCode
): string {
  const t = getMessages(locale);
  return code === "no_vision_model"
    ? t.ai.visionNoModel
    : t.ai.visionExtractionFailed;
}

/**
 * Resolves question/answer fields for combined single-image uploads.
 */
function resolveCombinedFields(
  baseText: string,
  formulas: string[],
  fromModel?: { questionText?: string; studentAnswer?: string }
): { questionText: string; studentAnswer: string } {
  let questionText = fromModel?.questionText?.trim() ?? "";
  let studentAnswer = fromModel?.studentAnswer?.trim() ?? "";

  if (!questionText || !studentAnswer) {
    const fromText = splitCombinedHomeworkText(baseText);
    questionText = questionText || fromText.questionText;
    studentAnswer = studentAnswer || fromText.studentAnswer;
  }

  if (!studentAnswer) {
    const fromFormulas = splitCombinedFormulas(formulas);
    if (fromFormulas) {
      questionText = questionText || fromFormulas.questionText;
      studentAnswer = fromFormulas.studentAnswer;
    }
  }

  return { questionText, studentAnswer };
}

export async function POST(request: Request) {
  try {
    const locale = getLocaleFromRequest(request);
    const body = (await request.json()) as {
      images?: string[];
      subject?: string;
      topic?: string;
      purpose?: "homework" | "lesson";
      extractRole?: "question" | "answer" | "combined" | "general";
    };

    if (!body.images?.length) {
      return NextResponse.json({ error: "images required" }, { status: 400 });
    }

    const isCombined = body.extractRole === "combined";

    const result = await extractFromImages(body.images, {
      locale,
      subject: body.subject,
      topic: body.topic,
      purpose: body.purpose ?? "homework",
      extractRole: body.extractRole,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: errorMessage(locale, result.error),
          errorCode: result.error,
          provider: result.provider,
          detail: result.detail,
          visionUsed: false,
        },
        { status: result.error === "no_vision_model" ? 503 : 422 }
      );
    }

    const rawBaseText = result.payload.text.trim();
    const rawFormulas = result.payload.formulas;
    const diagramsBlock = result.payload.diagramDescriptions.length
      ? `\n\n${result.payload.diagramDescriptions.join("\n")}`
      : "";
    const tablesBlock = result.payload.tables.length
      ? `\n\n${result.payload.tables.join("\n\n")}`
      : "";

    if (isCombined) {
      const split = resolveCombinedFields(rawBaseText, rawFormulas, {
        questionText: result.payload.questionText,
        studentAnswer: result.payload.studentAnswer,
      });

      const formatted = formatOcrMathFields({
        text: rawBaseText,
        questionText: split.questionText,
        studentAnswer: (split.studentAnswer + diagramsBlock + tablesBlock).trim(),
        formulas: rawFormulas,
      });

      return NextResponse.json({
        text: formatted.text,
        questionText: formatted.questionText ?? "",
        studentAnswer: formatted.studentAnswer ?? "",
        formulas: formatted.formulas,
        diagramDescriptions: result.payload.diagramDescriptions,
        tables: result.payload.tables,
        provider: result.provider,
        visionUsed: true,
        confidence: result.confidence,
      });
    }

    const formatted = formatOcrMathFields({
      text: rawBaseText + diagramsBlock + tablesBlock,
      questionText: result.payload.questionText,
      studentAnswer: result.payload.studentAnswer,
      formulas: rawFormulas,
    });

    return NextResponse.json({
      text: formatted.text,
      questionText: formatted.questionText,
      studentAnswer: formatted.studentAnswer,
      formulas: formatted.formulas,
      diagramDescriptions: result.payload.diagramDescriptions,
      tables: result.payload.tables,
      provider: result.provider,
      visionUsed: true,
      confidence: result.confidence,
    });
  } catch (error) {
    console.error("[API] extract-content:", error);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}

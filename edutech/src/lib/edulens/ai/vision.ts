import type { Locale } from "@/lib/i18n/types";
import { getLanguageRule } from "../demo/mock-responses";
import { parseJSONFromLLM } from "./json-parser";
import { completeVisionJSON, getActiveProvider, isVisionCapable } from "./provider";

export type VisionExtractPayload = {
  text: string;
  formulas: string[];
  diagramDescriptions: string[];
  tables: string[];
  questionText?: string;
  studentAnswer?: string;
};

export type VisionExtractRole = "question" | "answer" | "combined" | "general";

export type VisionExtractErrorCode = "no_vision_model" | "extraction_failed";

export type VisionExtractResult =
  | {
      ok: true;
      payload: VisionExtractPayload;
      visionUsed: true;
      provider: string;
      confidence: "low" | "medium" | "high";
    }
  | {
      ok: false;
      error: VisionExtractErrorCode;
      provider: string;
      detail?: string;
    };

/**
 * Extracts text, LaTeX formulas, diagrams, and tables from images via vision LLM.
 * Never returns demo/fallback text — callers must handle errors explicitly.
 */
export async function extractFromImages(
  imageDataUrls: string[],
  options: {
    locale: Locale;
    subject?: string;
    topic?: string;
    purpose: "homework" | "lesson";
    extractRole?: VisionExtractRole;
  }
): Promise<VisionExtractResult> {
  const provider = getActiveProvider();

  if (!imageDataUrls.length) {
    return {
      ok: false,
      error: "extraction_failed",
      provider,
      detail: "No images provided",
    };
  }

  if (!isVisionCapable()) {
    return {
      ok: false,
      error: "no_vision_model",
      provider: provider === "mock" ? "mock" : provider,
    };
  }

  const langRule = getLanguageRule(options.locale);
  const role = options.extractRole ?? "general";

  /** Combined mode only: split question vs answer. All other roles use the original full OCR prompt. */
  const isCombined = role === "combined";
  const jsonSchema = isCombined
    ? '{ "text", "questionText", "studentAnswer", "formulas": string[], "diagramDescriptions": string[], "tables": string[] }'
    : '{ "text", "formulas": string[], "diagramDescriptions": string[], "tables": string[] }';

  const combinedRule = isCombined
    ? `
COMBINED IMAGE — you MUST fill questionText AND studentAnswer (both required):
- questionText: ONLY the problem statement (the integral/equation/word problem to solve). Stop before any student working.
- studentAnswer: ALL student working and final answer (steps, substitutions, "= ..." chains). Usually starts at the first "=" after the problem.
Example: image shows "∫₀² (-x²+4) dx = [-x³/3+4x]₀² = ... = 5⅓"
  → questionText: "\\\\int_{0}^{2} -x^2 + 4 dx"
  → studentAnswer: "= [-\\\\frac{x^3}{3} + 4x]_{0}^{2} = ... = 5\\\\frac{1}{3}"
Also put the full OCR in text. Put each math line in formulas[] in order; first formula is often the question only.`
    : "";

  const systemPrompt = `You are EduLens multimodal OCR for education materials.
${langRule}
Extract ALL readable content from the image(s): plain text, LaTeX formulas (in formulas array), diagram descriptions, tables as markdown.
Return ONLY JSON: ${jsonSchema}.
Preserve math notation; use LaTeX in formulas array (e.g. "x^2 - 5x + 6 = 0").

HANDWRITING MATH — minus / subtraction (critical):
- NEVER drop minus signs, even when faint or tightly spaced in handwriting.
- Distinguish multiplication from subtraction: "2x" means 2 times x; "2-x" or "2 - x" means 2 minus x — output the minus when present in the image.
- In trig arguments like tan^2(2-x), sec^4(2-x), cos(2-x), always include the minus inside parentheses when written.
- Use LaTeX minus in formulas: \\tan^{2}(2-x), not \\tan^{2}(2x), when the image shows subtraction.${combinedRule}`;

  const userPrompt = isCombined
    ? `Purpose: ${options.purpose}
Subject: ${options.subject ?? "General"}
Topic: ${options.topic ?? "General"}
This image has BOTH question and student answer on the same page. Split into questionText and studentAnswer.
Extract from ${imageDataUrls.length} image(s).`
    : `Purpose: ${options.purpose}
Subject: ${options.subject ?? "General"}
Topic: ${options.topic ?? "General"}
Extract homework/lesson content from ${imageDataUrls.length} image(s).`;

  try {
    const visionResult = await completeVisionJSON({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      imageDataUrls,
    });
    const parsed = parseJSONFromLLM<VisionExtractPayload>(visionResult.text);
    if (parsed) {
      const formulaBlock = (parsed.formulas ?? []).join("\n").trim();
      const textBody =
        parsed.text?.trim() ||
        formulaBlock ||
        (parsed.diagramDescriptions ?? []).join("\n").trim() ||
        (parsed.tables ?? []).join("\n\n").trim();

      if (textBody) {
        return {
          ok: true,
          payload: {
            text: parsed.text?.trim() ? parsed.text : textBody,
            formulas: parsed.formulas ?? [],
            diagramDescriptions: parsed.diagramDescriptions ?? [],
            tables: parsed.tables ?? [],
            questionText: parsed.questionText,
            studentAnswer: parsed.studentAnswer,
          },
          visionUsed: true,
          provider: visionResult.providerId || provider,
          confidence: "high",
        };
      }
    }
  } catch (error) {
    console.error("[EduLens Vision]", error);
    const detail = error instanceof Error ? error.message : undefined;
    return {
      ok: false,
      error: "extraction_failed",
      provider,
      detail,
    };
  }

  return {
    ok: false,
    error: "extraction_failed",
    provider,
    detail: "Vision model returned empty or unparseable content",
  };
}

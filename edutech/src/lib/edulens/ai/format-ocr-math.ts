import { repairDroppedMinusInOcrFields } from "./repair-ocr-minus";
import { prepareMathFieldForDisplay } from "../math/normalize-math-text";

/**
 * Normalizes OCR question / answer fields and optional formula lines for display.
 */
export function formatOcrMathFields(
  fields: {
    text?: string;
    questionText?: string;
    studentAnswer?: string;
    formulas?: string[];
  }
): {
  text: string;
  questionText?: string;
  studentAnswer?: string;
  formulas: string[];
} {
  const repaired = repairDroppedMinusInOcrFields(fields);
  const formulas = (repaired.formulas ?? []).map((f) =>
    prepareMathFieldForDisplay(f)
  );
  const text = prepareMathFieldForDisplay(repaired.text ?? "");

  let questionText = repaired.questionText
    ? prepareMathFieldForDisplay(repaired.questionText)
    : undefined;
  let studentAnswer = repaired.studentAnswer
    ? prepareMathFieldForDisplay(repaired.studentAnswer)
    : undefined;

  if (!questionText && formulas[0]) {
    questionText = formulas[0];
  }

  if (!studentAnswer && formulas.length > 1) {
    studentAnswer = formulas.slice(1).join("\n");
  }

  if (!questionText && text) {
    questionText = text;
  }

  return {
    text,
    questionText,
    studentAnswer,
    formulas,
  };
}

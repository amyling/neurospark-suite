/**
 * True when the text contains explicit subtraction (not just a leading negative).
 */
function hasExplicitSubtraction(text: string): boolean {
  return (
    /\(\s*\d+\s*[-−]\s*[\dxa-zA-Zπ\\]/.test(text) ||
    /\d\s*[-−]\s*[xa-zA-Zπ]/.test(text)
  );
}

/**
 * Repairs common OCR mistake: dropping minus in trig arguments (2x vs 2-x).
 */
export function repairDroppedMinusInOcr(text: string, force = false): string {
  if (!text.trim()) {
    return text;
  }
  if (!force && !hasExplicitSubtraction(text)) {
    return text;
  }

  return text.replace(
    /((?:\\)?(?:tan|sec|cos|sin|cot|csc)(?:\^{?\d+}?|\^\{[^}]+\})?\()2x(\))/gi,
    "$12-x$2"
  );
}

/**
 * Repairs minus drops across all OCR fields using cross-field context.
 */
export function repairDroppedMinusInOcrFields(fields: {
  text?: string;
  questionText?: string;
  studentAnswer?: string;
  formulas?: string[];
}): {
  text?: string;
  questionText?: string;
  studentAnswer?: string;
  formulas?: string[];
} {
  const combined = [
    fields.text ?? "",
    fields.questionText ?? "",
    fields.studentAnswer ?? "",
    ...(fields.formulas ?? []),
  ].join("\n");
  const force = hasExplicitSubtraction(combined);

  if (!force) {
    return fields;
  }

  return {
    text: fields.text ? repairDroppedMinusInOcr(fields.text, true) : fields.text,
    questionText: fields.questionText
      ? repairDroppedMinusInOcr(fields.questionText, true)
      : fields.questionText,
    studentAnswer: fields.studentAnswer
      ? repairDroppedMinusInOcr(fields.studentAnswer, true)
      : fields.studentAnswer,
    formulas: fields.formulas?.map((f) => repairDroppedMinusInOcr(f, true)),
  };
}

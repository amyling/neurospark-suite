/**
 * Strips OCR suffix blocks appended by the extract API.
 */
function stripExtractSuffixBlocks(text: string): string {
  return text
    .replace(/\n\n\[Formulas\][\s\S]*$/i, "")
    .replace(/\n\n\[Diagrams\][\s\S]*$/i, "")
    .replace(/\n\n\[Tables\][\s\S]*$/i, "")
    .trim();
}

/**
 * Heuristic split when a vision model returns one blob for question + answer on the same image.
 */
export function splitCombinedHomeworkText(fullText: string): {
  questionText: string;
  studentAnswer: string;
} {
  const text = stripExtractSuffixBlocks(fullText.replace(/\r\n/g, "\n"));

  if (!text) {
    return { questionText: "", studentAnswer: "" };
  }

  /** Integral problem: split before the first "=" that follows "dx" */
  const integralMatch = text.match(
    /^([\s\S]*?(?:\\int|∫)\s*[\s\S]*?\bdx)\s*(=.+)$/i
  );
  if (integralMatch) {
    return {
      questionText: integralMatch[1].trim(),
      studentAnswer: integralMatch[2].trim(),
    };
  }

  /** Blank line often separates printed question from handwritten answer */
  const blankLineIdx = text.search(/\n\s*\n/);
  if (blankLineIdx > 0) {
    const questionText = text.slice(0, blankLineIdx).trim();
    const studentAnswer = text.slice(blankLineIdx).trim();
    if (questionText && studentAnswer) {
      return { questionText, studentAnswer };
    }
  }

  /** "Question 1:" / "第1题" header then answer below */
  const numberedMatch = text.match(
    /^((?:第\s*\d+\s*题|问题\s*\d+|Question\s*\d+[:：.]?)[\s\S]*?)\n+([\s\S]+)$/i
  );
  if (numberedMatch) {
    return {
      questionText: numberedMatch[1].trim(),
      studentAnswer: numberedMatch[2].trim(),
    };
  }

  /**
   * Single-line math: first "=" often separates problem from working
   * e.g. "x^2 - 5 = 0 => x = ..." or integral line shown in one row
   */
  const eqIdx = text.indexOf("=");
  if (eqIdx > 0) {
    const left = text.slice(0, eqIdx).trim();
    const right = text.slice(eqIdx).trim();
    const leftRatio = left.length / text.length;
    if (left.length >= 3 && right.length >= 3 && leftRatio <= 0.45) {
      return { questionText: left, studentAnswer: right };
    }
  }

  return { questionText: text, studentAnswer: "" };
}

/**
 * Splits formula lines when the first line is the problem and the rest is working.
 */
export function splitCombinedFormulas(formulas: string[]): {
  questionText: string;
  studentAnswer: string;
} | null {
  if (formulas.length < 2) {
    return null;
  }

  const first = formulas[0].trim();
  const rest = formulas.slice(1);

  const firstIsProblem =
    /\\int|∫|dx\b|求|解|计算|prove|solve|evaluate/i.test(first) &&
    !first.trimStart().startsWith("=");

  if (!firstIsProblem && !rest.some((f) => f.trimStart().startsWith("="))) {
    return null;
  }

  return {
    questionText: first,
    studentAnswer: rest.map((f) => (f.trimStart().startsWith("=") ? f : `=${f}`)).join("\n"),
  };
}

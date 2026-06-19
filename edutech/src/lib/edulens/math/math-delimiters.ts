/**
 * Removes dollar delimiters and OCR artifacts like \$ before frac.
 */
export function stripAllMathDelimiters(text: string): string {
  return text
    .replace(/\\\$/g, "")
    .replace(/\$/g, "");
}

/**
 * Closes superscript braces dropped when $ delimiters were inserted mid-formula.
 */
export function repairSuperscriptBraces(text: string): string {
  return text.replace(
    /\^\{(\\frac\{[^{}]+\}\{[^{}]+\})(?!\})(\s+)(?=\\[a-zA-Z])/g,
    (_, frac, spaces) => `^{${frac}}${spaces}`
  );
}

/**
 * True when $ delimiters are mismatched or nested inside LaTeX (OCR/wrap damage).
 */
export function hasBrokenMathDelimiters(text: string): boolean {
  if (!text.includes("$")) {
    return false;
  }

  const dollars = text.match(/\$/g)?.length ?? 0;
  if (dollars % 2 !== 0) {
    return true;
  }

  if (/[_^][{]?[^}\n]*\$/.test(text)) {
    return true;
  }

  if (/\$\s*\\/.test(text) && dollars >= 2) {
    return true;
  }

  if (/\\\$/.test(text)) {
    return true;
  }

  return dollars > 2 && /\\(int|frac|tan|sin|cos|sec|sqrt|left|right)\b/.test(text);
}

/**
 * Whether dollar signs should be stripped before re-wrapping.
 */
export function shouldResetMathDelimiters(text: string): boolean {
  if (!text.includes("$") || !text.includes("\\")) {
    return false;
  }
  return hasBrokenMathDelimiters(text);
}

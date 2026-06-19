import { containsMathNotation, convertUnicodeMathToLatex } from "./unicode-math";
import {
  hasBrokenMathDelimiters,
  repairSuperscriptBraces,
  shouldResetMathDelimiters,
  stripAllMathDelimiters,
} from "./math-delimiters";
import { wrapBareLatexSpans } from "./latex-span";

/**
 * True when the line contains multiple natural-language words (not pure notation).
 */
export function containsNaturalLanguage(text: string): boolean {
  const words = text.match(/(?<!\\)\b[A-Za-z]{4,}\b/g) ?? [];
  return words.length >= 2;
}

/**
 * Unwraps JSON-style double backslashes so KaTeX receives valid LaTeX.
 */
export function unescapeStoredLatex(text: string): string {
  if (!text.includes("\\\\")) {
    return text;
  }
  return text.replace(/\\\\/g, "\\");
}

/**
 * Strips math delimiters for direct KaTeX input.
 */
export function stripMathDelimiters(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return trimmed.slice(2, -2).trim();
  }
  if (trimmed.startsWith("$") && trimmed.endsWith("$")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Collapses whitespace outside LaTeX braces.
 */
function collapseMathSpaces(text: string): string {
  return text.replace(/\s{2,}/g, " ").trim();
}

/**
 * Normalizes pi/4 style limits without frac wrapper.
 */
function repairPiLimits(text: string): string {
  return text
    .replace(/\^\{π\/4\}/g, "^{\\frac{\\pi}{4}}")
    .replace(/\^\{π\}/g, "^{\\pi}")
    .replace(/_\{0\}\^\{π\/4\}/g, "_{0}^{\\frac{\\pi}{4}}");
}

/**
 * Inserts newlines into single-line multi-step derivations for readable display.
 */
function breakMultiStepMathLines(text: string): string {
  if (text.includes("\n")) {
    return text;
  }

  const trimmed = text.trim();
  if (trimmed.length < 50) {
    return text;
  }

  const equalsCount = (trimmed.match(/=/g) ?? []).length;
  const approxCount = (trimmed.match(/≈/g) ?? []).length;
  if (equalsCount < 2 && approxCount < 1) {
    return text;
  }

  let result = trimmed;
  result = result.replace(
    /\](\s*_\{[^}]*\}(?:\s*\^\{[^}]*\})?)(\s*=\s*)/g,
    "]$1\n$2"
  );
  result = result.replace(/\](\s*=\s*)(?=[\[-\d])/g, "]\n$1");
  result = result.replace(/\)(\s*=\s*)(?=[-\d[])/g, ")\n$1");
  result = result.replace(/(\/\s*[\w^{}\\()+\-./\d]+)\s+(\+\s*1\s*\/)/g, "$1\n$2");
  result = result.replace(/\s(≈)\s/g, "\n$1 ");
  result = result.replace(/(≈\s*-?[\d.]+)\s+(\+\s*-?[\d.])/g, "$1\n$2");

  return result;
}

/**
 * True for definite-integral evaluation lines (]= [sec...]_{a}^{b}).
 */
function isEvaluationMathLine(text: string): boolean {
  const line = text.trim();
  return (
    /^=/.test(line) ||
    /^≈/.test(line) ||
    /^\+\s*[\d./-]/.test(line) ||
    /\]\s*_\{[^}]+\}\s*\^\{/.test(line) ||
    /\\sec\b|\\cos\b/.test(line)
  );
}

/**
 * Single-line integral / equation expressions.
 */
function isSingleLineMathHeavy(text: string): boolean {
  if (isEvaluationMathLine(text)) {
    return true;
  }
  if (!containsMathNotation(text)) {
    return false;
  }
  return (
    /\\int\b/.test(text) ||
    looksLikeFullLineLatex(text) ||
    isMostlyMathLine(text)
  );
}

/**
 * Removes a spurious outer \\frac{...} wrapper when no denominator is present.
 */
export function repairMalformedOuterFrac(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^\\frac\{([\s\S]+)\}$/);
  if (!match) {
    return text;
  }
  const inner = match[1];
  if (/\\frac\{[^{}]+\}\{[^{}]+\}/.test(inner) || inner.includes("}{")) {
    return text;
  }
  return inner.trim();
}

/**
 * Normalizes one line of mathematical content.
 */
function normalizeMathLine(line: string): string {
  let text = repairMalformedOuterFrac(convertUnicodeMathToLatex(line.trim()));
  text = unescapeStoredLatex(text);
  text = repairPiLimits(text);

  if (shouldResetMathDelimiters(text) || hasBrokenMathDelimiters(text)) {
    text = repairSuperscriptBraces(
      collapseMathSpaces(stripAllMathDelimiters(text))
    );
  }

  if (containsNaturalLanguage(text)) {
    if (text.includes("\\") && !text.includes("$")) {
      return wrapBareLatexSpans(text);
    }
    return text;
  }

  if (/^\$[^$\n]+\$$/.test(text.trim()) && text.trim().length < 120) {
    return text.trim();
  }

  if (isSingleLineMathHeavy(text)) {
    return `$$${stripMathDelimiters(text)}$$`;
  }

  if (!text.includes("$") && (looksLikeFullLineLatex(text) || isMostlyMathLine(text))) {
    return `$$${text}$$`;
  }

  if (text.includes("\\") && !text.includes("$")) {
    return wrapBareLatexSpans(text);
  }

  return text;
}

/**
 * Prepares mixed text / LaTeX for KaTeX segment splitting.
 */
export function normalizeMathText(input: string): string {
  if (!input?.trim()) {
    return input;
  }

  const trimmed = breakMultiStepMathLines(input.trim());
  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((line) => (line.trim() ? normalizeMathLine(line) : line))
      .join("\n");
  }

  return normalizeMathLine(trimmed);
}

/**
 * Prepares OCR / API math fields for KaTeX rendering in the UI.
 */
export function prepareMathFieldForDisplay(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  return normalizeMathText(trimmed);
}

/**
 * True when a line is predominantly mathematical notation.
 */
function isMostlyMathLine(text: string): boolean {
  const line = text.split("\n")[0]?.trim() ?? "";
  if (!line || line.length > 280) {
    return false;
  }
  if (containsNaturalLanguage(line)) {
    return false;
  }
  if (!containsMathNotation(line)) {
    return false;
  }
  const mathChars = (line.match(/[\\0-9^_=+\-*/().,|{}[\]a-zA-Z]/g) ?? []).length;
  return mathChars / line.length >= 0.5;
}

/**
 * True when an entire chunk is likely a display formula line.
 */
function looksLikeFullLineLatex(text: string): boolean {
  const line = text.split("\n")[0]?.trim() ?? "";
  if (!line) {
    return false;
  }
  if (containsNaturalLanguage(line)) {
    return false;
  }
  if (line.startsWith("\\") && /[_^{}=+\-*/0-9]/.test(line)) {
    return true;
  }
  return (
    /^[a-zA-Z0-9()^_=+\-*/\s,.|\\[\]{}|]+$/.test(line) &&
    /[_^=\\]/.test(line) &&
    /[a-zA-Z]/.test(line) &&
    line.length < 200
  );
}

/**
 * Wraps a formula string as display math unless already delimited.
 */
export function wrapAsDisplayMath(latex: string): string {
  const prepared = prepareMathFieldForDisplay(latex);
  if (prepared.startsWith("$$") && prepared.endsWith("$$")) {
    return prepared;
  }
  const trimmed = unescapeStoredLatex(latex.trim());
  return `$$${trimmed}$$`;
}

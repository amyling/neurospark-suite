import { containsMathNotation } from "./unicode-math";
import {
  containsNaturalLanguage,
  normalizeMathText,
  stripMathDelimiters,
  unescapeStoredLatex,
} from "./normalize-math-text";

export type MathSegment = {
  type: "text" | "math";
  content: string;
  display: boolean;
};

const DISPLAY_DOLLAR = /\$\$([\s\S]+?)\$\$/g;
const INLINE_DOLLAR = /(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g;
const DISPLAY_BRACKET = /\\\[([\s\S]+?)\\\]/g;
const INLINE_PAREN = /\\\(([\s\S]+?)\\\)/g;

const LATEX_HINT =
  /\\(?:int|frac|sqrt|sum|prod|lim|left|right|cdot|neq|leq|geq|infty|pi|theta|alpha|beta|gamma|delta|pm|mp|times|div|text|mathrm|mathbf|begin|end)\b/;

/**
 * Returns true when a text chunk is likely raw LaTeX from OCR.
 */
export function looksLikeLatex(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (containsNaturalLanguage(trimmed)) return false;
  if (trimmed.startsWith("\\")) return true;
  if (containsMathNotation(trimmed) && /[_^{}=+\-*/\\]/.test(trimmed)) {
    return true;
  }
  return LATEX_HINT.test(trimmed) && /[_^{}]/.test(trimmed);
}

/**
 * Strips OCR formula appendix blocks like [Formulas] sections.
 */
export function stripFormulaAppendix(text: string): string {
  return text.replace(/\n\n\[Formulas\][\s\S]*$/i, "").trim();
}

/**
 * Splits mixed plain text / LaTeX into renderable segments.
 */
export function splitMathSegments(input: string): MathSegment[] {
  const normalized = stripFormulaAppendix(normalizeMathText(input));
  if (!normalized) return [];

  let segments = splitDelimitedMath(normalized);

  if (
    segments.length === 1 &&
    segments[0].type === "text" &&
    looksLikeLatex(segments[0].content)
  ) {
    return [
      {
        type: "math",
        content: stripMathDelimiters(unescapeStoredLatex(segments[0].content)),
        display: true,
      },
    ];
  }

  return coalesceTextSegments(segments);
}

/**
 * Parses $...$ / $$...$$ delimited content.
 */
function splitDelimitedMath(text: string): MathSegment[] {
  const segments: MathSegment[] = [];
  let rest = text;

  const patterns: { regex: RegExp; display: boolean }[] = [
    { regex: DISPLAY_DOLLAR, display: true },
    { regex: DISPLAY_BRACKET, display: true },
    { regex: INLINE_PAREN, display: false },
    { regex: INLINE_DOLLAR, display: false },
  ];

  while (rest.length > 0) {
    let earliest: {
      index: number;
      length: number;
      content: string;
      display: boolean;
    } | null = null;

    for (const { regex, display } of patterns) {
      regex.lastIndex = 0;
      const match = regex.exec(rest);
      if (match && (earliest === null || match.index < earliest.index)) {
        earliest = {
          index: match.index,
          length: match[0].length,
          content: stripMathDelimiters(match[1].trim()),
          display,
        };
      }
    }

    if (!earliest) {
      pushPlainOrLatex(segments, rest);
      break;
    }

    if (earliest.index > 0) {
      pushPlainOrLatex(segments, rest.slice(0, earliest.index));
    }

    segments.push({
      type: "math",
      content: unescapeStoredLatex(earliest.content),
      display: earliest.display,
    });

    rest = rest.slice(earliest.index + earliest.length);
  }

  return segments;
}

/**
 * Merges adjacent text segments.
 */
function coalesceTextSegments(segments: MathSegment[]): MathSegment[] {
  const out: MathSegment[] = [];
  for (const seg of segments) {
    const last = out[out.length - 1];
    if (seg.type === "text" && last?.type === "text") {
      last.content += seg.content;
    } else {
      out.push({ ...seg });
    }
  }
  return out;
}

/**
 * Pushes plain text or auto-detected LaTeX lines.
 */
function pushPlainOrLatex(segments: MathSegment[], chunk: string): void {
  const lines = chunk.split("\n");
  lines.forEach((line, i) => {
    const lineText = i < lines.length - 1 ? `${line}\n` : line;
    if (!lineText.trim()) {
      segments.push({ type: "text", content: lineText, display: false });
      return;
    }
    const trimmed = lineText.trim();
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
      segments.push({
        type: "math",
        content: stripMathDelimiters(unescapeStoredLatex(trimmed)),
        display: true,
      });
      return;
    }
    if (looksLikeLatex(trimmed)) {
      segments.push({
        type: "math",
        content: stripMathDelimiters(unescapeStoredLatex(trimmed)),
        display: true,
      });
    } else {
      segments.push({ type: "text", content: lineText, display: false });
    }
  });
}

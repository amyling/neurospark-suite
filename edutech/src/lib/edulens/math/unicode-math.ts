const SUBSCRIPTS: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

/**
 * Converts Unicode math symbols (OCR output) into LaTeX-friendly text.
 */
export function convertUnicodeMathToLatex(input: string): string {
  let text = input
    .replace(/\u2212/g, "-")
    .replace(/×/g, "\\times ")
    .replace(/÷/g, "\\div ")
    .replace(/≤/g, "\\leq ")
    .replace(/≥/g, "\\geq ")
    .replace(/≠/g, "\\neq ")
    .replace(/±/g, "\\pm ")
    .replace(/∞/g, "\\infty ")
    .replace(/π/g, "\\pi")
    .replace(/½/g, "\\frac{1}{2}")
    .replace(/⅓/g, "\\frac{1}{3}")
    .replace(/¼/g, "\\frac{1}{4}")
    .replace(/⅔/g, "\\frac{2}{3}")
    .replace(/¾/g, "\\frac{3}{4}");

  text = text.replace(
    /\b(sec|cos|sin|tan|csc|cot)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/gi,
    (_, fn, sup) => {
      const digits = [...sup].map((c) => SUPERSCRIPTS[c] ?? c).join("");
      return `\\${fn.toLowerCase()}^{${digits}}`;
    }
  );

  text = text.replace(/∫\s*([₀₁₂₃₄₅₆₇₈₉]+)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)?/g, (_, sub, sup) => {
    const subDigits = [...sub].map((c) => SUBSCRIPTS[c] ?? c).join("");
    if (sup) {
      const supDigits = [...sup].map((c) => SUPERSCRIPTS[c] ?? c).join("");
      return `\\int_{${subDigits}}^{${supDigits}}`;
    }
    return `\\int_{${subDigits}}`;
  });

  text = text.replace(/∫/g, "\\int ");

  text = text.replace(/([A-Za-z0-9])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, base, sup) => {
    const digits = [...sup].map((c) => SUPERSCRIPTS[c] ?? c).join("");
    return `${base}^{${digits}}`;
  });

  text = text.replace(/([A-Za-z])([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, base, sub) => {
    const digits = [...sub].map((c) => SUBSCRIPTS[c] ?? c).join("");
    return `${base}_{${digits}}`;
  });

  return text;
}

/**
 * True when the string contains Unicode or ASCII math notation worth rendering.
 */
export function containsMathNotation(text: string): boolean {
  return (
    /\\(?:int|frac|sqrt|sum|left|right|cdot|times|leq|geq)/.test(text) ||
    /∫|×|÷|≤|≥|≠|±|π|[_^]|[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/.test(text) ||
    (/[=+\-*/0-9]/.test(text) && /[a-zA-Z]/.test(text))
  );
}

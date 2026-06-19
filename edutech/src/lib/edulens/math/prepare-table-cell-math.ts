/**
 * True when the cell is plain CJK / prose without math markers.
 */
function isPlainTextCell(text: string): boolean {
  return /^[\u4e00-\u9fff\s，。、；：！？（）《》「」\-]+$/.test(text.trim());
}

/**
 * Normalizes common bare LaTeX patterns in integral tables.
 */
function fixBareCellLatex(text: string): string {
  let out = text.trim();

  out = out.replace(/^x\^\{n\+1\}\/\(n\+1\)\+C$/i, "\\frac{x^{n+1}}{n+1}+C");
  out = out.replace(/^x\^n\s*\(n\s*≠\s*-1\)$/i, "x^n\\ (n\\neq -1)");
  out = out.replace(/^x\^n\s*\(n\s*!=\s*-1\)$/i, "x^n\\ (n\\neq -1)");
  out = out.replace(/\\ln\|x\|/g, "\\ln\\lvert x\\rvert");
  out = out.replace(/\bln\|x\|/gi, "\\ln\\lvert x\\rvert");
  out = out.replace(/^\\cos\s*x$/i, "\\cos x");
  out = out.replace(/^\\sin\s*x$/i, "\\sin x");
  out = out.replace(/^cos\s*x$/i, "\\cos x");
  out = out.replace(/^sin\s*x$/i, "\\sin x");
  out = out.replace(/^1\/x$/i, "\\frac{1}{x}");

  return out;
}

/**
 * Converts display math delimiters to inline for compact table cells.
 */
function forceInlineMathDelimiters(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return `$${trimmed.slice(2, -2).trim()}$`;
  }
  return trimmed;
}

/**
 * Prepares one markdown table cell for inline KaTeX rendering.
 */
export function prepareTableCellForDisplay(cell: string): string {
  const trimmed = cell.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (isPlainTextCell(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("$")) {
    return forceInlineMathDelimiters(trimmed);
  }

  return `$${fixBareCellLatex(trimmed)}$`;
}

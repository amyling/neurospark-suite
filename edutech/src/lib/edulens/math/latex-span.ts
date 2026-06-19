/**
 * Consumes a balanced {...} or [...] group starting at the opening bracket.
 */
function consumeBalancedGroup(text: string, start: number): number {
  const open = text[start];
  const close = open === "[" ? "]" : "}";
  let depth = 1;
  let i = start + 1;

  while (i < text.length && depth > 0) {
    if (text[i] === "\\") {
      const nested = readLatexCommand(text, i);
      if (nested) {
        i += nested.length;
        continue;
      }
    }
    if (text[i] === open) {
      depth++;
    } else if (text[i] === close) {
      depth--;
    }
    i++;
  }

  return i;
}

/**
 * Reads one LaTeX command from text starting at backslash (handles nested braces).
 */
export function readLatexCommand(text: string, start: number): string | null {
  if (text[start] !== "\\") {
    return null;
  }

  let i = start + 1;
  while (i < text.length && /[a-zA-Z]/.test(text[i])) {
    i++;
  }

  while (i < text.length && (text[i] === "[" || text[i] === "{")) {
    i = consumeBalancedGroup(text, i);
  }

  while (i < text.length && (text[i] === "^" || text[i] === "_")) {
    i++;
    if (i < text.length && text[i] === "{") {
      i = consumeBalancedGroup(text, i);
    } else if (i < text.length) {
      i++;
    }
  }

  if (i < text.length && text[i] === "(") {
    let depth = 1;
    i++;
    while (i < text.length && depth > 0) {
      if (text[i] === "(") depth++;
      else if (text[i] === ")") depth--;
      i++;
    }
  }

  return text.slice(start, i);
}

/**
 * Wraps each bare LaTeX command sequence in inline math delimiters.
 */
export function wrapBareLatexSpans(text: string): string {
  if (!text.includes("\\")) {
    return text;
  }

  let out = "";
  let i = 0;

  while (i < text.length) {
    if (text[i] === "\\") {
      const cmd = readLatexCommand(text, i);
      if (cmd) {
        out += `$${cmd}$`;
        i += cmd.length;
        continue;
      }
    }

    out += text[i];
    i++;
  }

  return out;
}

/**
 * Removes trailing commas before } or ] which some LLMs emit.
 */
function stripTrailingCommas(json: string): string {
  return json.replace(/,\s*([}\]])/g, "$1");
}

/**
 * True when a backslash starts LaTeX (e.g. \begin, \frac) not a JSON escape.
 */
function isLatexBackslash(input: string, index: number): boolean {
  const next = input[index + 1];
  if (!next) {
    return false;
  }

  if (next === "u") {
    const hex = input.slice(index + 2, index + 6);
    return !/^[0-9a-fA-F]{4}$/.test(hex);
  }

  if (!'\\"/bfnrt'.includes(next)) {
    return true;
  }

  const third = input[index + 2];
  return Boolean(third && /[a-zA-Z]/.test(third));
}

/**
 * Fixes LaTeX backslashes inside JSON string literals (\frac, \begin, \int, etc.).
 */
export function repairJsonStringEscapes(input: string): string {
  let out = "";
  let inString = false;
  let escape = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (!inString) {
      out += ch;
      if (ch === '"') {
        inString = true;
      }
      continue;
    }

    if (escape) {
      out += ch;
      escape = false;
      continue;
    }

    if (ch === "\\") {
      if (isLatexBackslash(input, i)) {
        out += "\\\\";
      } else {
        out += ch;
        escape = true;
      }
      continue;
    }

    if (ch === '"') {
      inString = false;
    }

    out += ch;
  }

  return out;
}

/**
 * Closes unbalanced { and [ brackets for truncated JSON responses.
 */
function closeOpenBrackets(partial: string): string {
  let text = partial.replace(/,\s*$/, "");
  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (ch === "{") {
      stack.push("}");
    } else if (ch === "[") {
      stack.push("]");
    } else if (ch === "}" || ch === "]") {
      stack.pop();
    }
  }

  if (inString) {
    text += '"';
  }

  while (stack.length > 0) {
    text += stack.pop();
  }

  return text;
}

/**
 * Attempts multiple repair strategies on malformed LLM JSON.
 */
function tryParseWithRepairs(candidate: string): unknown | null {
  const attempts = [
    candidate,
    repairJsonStringEscapes(candidate),
    stripTrailingCommas(candidate),
    stripTrailingCommas(repairJsonStringEscapes(candidate)),
    closeOpenBrackets(stripTrailingCommas(repairJsonStringEscapes(candidate))),
  ];

  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch {
      // try next repair
    }
  }

  const start = candidate.indexOf("{");
  if (start < 0) {
    return null;
  }

  for (let end = candidate.length; end > start + 10; end--) {
    const slice = candidate.slice(start, end);
    const repaired = closeOpenBrackets(
      stripTrailingCommas(repairJsonStringEscapes(slice))
    );
    try {
      return JSON.parse(repaired);
    } catch {
      // keep trimming
    }
  }

  return null;
}

/**
 * Extracts JSON object from LLM text (handles fences, LaTeX escapes, truncation).
 */
export function parseJSONFromLLM<T>(raw: string): T | null {
  if (!raw.trim()) {
    return null;
  }

  const trimmed = raw.trim().replace(/^\uFEFF/, "");
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    const escaped = repairJsonStringEscapes(candidate);
    if (escaped !== candidate) {
      try {
        return JSON.parse(escaped) as T;
      } catch {
        // fall through
      }
    }
  }

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const sliced = candidate.slice(start, end + 1);
    const repaired = tryParseWithRepairs(sliced);
    if (repaired) {
      return repaired as T;
    }
  }

  const repaired = tryParseWithRepairs(candidate);
  return repaired ? (repaired as T) : null;
}

/**
 * Returns true when the LLM text contains parseable JSON.
 */
export function isParseableLLMJson(raw: string): boolean {
  return parseJSONFromLLM(raw) !== null;
}

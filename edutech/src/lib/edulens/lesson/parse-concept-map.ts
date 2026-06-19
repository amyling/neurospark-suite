/** Parsed radial concept map from a diagram caption. */
export type ConceptMapData = {
  title?: string;
  center: string;
  branches: Array<{ label: string; detail?: string }>;
};

/**
 * Parses concept-map structure from AI or padding diagram captions.
 * Supports Chinese labels like 中心节点 / 分支1 and English center node / branch 1.
 */
export function parseConceptMapCaption(caption: string): ConceptMapData | null {
  const text = caption.trim();
  if (!text) {
    return null;
  }

  const looksLikeConceptMap =
    /概念图|concept\s*map|中心节点|center\s*node|分支\s*\d|branch\s*\d/i.test(text);
  if (!looksLikeConceptMap) {
    return null;
  }

  const titleMatch = text.match(
    /【([^】]+)】|概念图[：:]\s*([^\n。；]+)|concept\s*map[：:]\s*([^\n.]+)/i
  );
  const centerMatch = text.match(
    /中心节点[：:]\s*([^；。\n]+)|center\s*node[：:]\s*([^\n.;]+)/i
  );

  const branches: ConceptMapData["branches"] = [];

  const zhBranchRegex =
    /分支\s*(\d+)[：:]\s*([^（(\n；;]+)(?:[（(]([^）)]+)[）)])?/g;
  let match: RegExpExecArray | null;
  while ((match = zhBranchRegex.exec(text)) !== null) {
    branches.push({
      label: match[2].trim(),
      detail: match[3]?.trim(),
    });
  }

  const enBranchRegex =
    /branch\s*(\d+)[：:]\s*([^(.\n;]+)(?:\(([^)]+)\))?/gi;
  while ((match = enBranchRegex.exec(text)) !== null) {
    const index = Number(match[1]) - 1;
    const branch = { label: match[2].trim(), detail: match[3]?.trim() };
    if (index >= branches.length) {
      branches.push(branch);
    }
  }

  const center = (centerMatch?.[1] ?? centerMatch?.[2] ?? "").trim();
  if (!center && branches.length === 0) {
    return null;
  }

  return {
    title: (titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3])?.trim(),
    center: center || "Key concept",
    branches,
  };
}

/**
 * Extracts wrong vs correct lines from mistake-compare step narration.
 */
export function parseMistakeCompareLines(body: string): {
  wrong?: string;
  correct?: string;
} {
  const wrongMatch = body.match(
    /(?:误区|错误|mistake|wrong)[：:]\s*([^。.\n；;]+)/i
  );
  const correctMatch = body.match(
    /(?:正确|纠正|correct|approach)[：:]\s*([^。.\n；;]+)/i
  );

  return {
    wrong: wrongMatch?.[1]?.trim(),
    correct: correctMatch?.[1]?.trim(),
  };
}

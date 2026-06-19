import type { LessonOutputPayload } from "../ai/validator";

type TeachingContentBlock = NonNullable<LessonOutputPayload["teachingContent"]>[number];

export type LessonSubjectCategory =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "humanities"
  | "language"
  | "general";

/**
 * Maps request subject string to a coarse category for prompt and sanitization rules.
 */
export function getLessonSubjectCategory(subject: string): LessonSubjectCategory {
  const s = subject.toLowerCase();
  if (/math|数学/.test(s)) return "mathematics";
  if (/phys|物理/.test(s)) return "physics";
  if (/chem|化学/.test(s)) return "chemistry";
  if (/bio|生物/.test(s)) return "biology";
  if (/hist|geo|历史|地理/.test(s)) return "humanities";
  if (/english|chinese|语文|英文/.test(s)) return "language";
  return "general";
}

/**
 * Prompt block: subject-appropriate formulas and forbidden cross-subject math.
 */
export function buildLessonSubjectRulesBlock(
  subject: string,
  topic: string
): string {
  const category = getLessonSubjectCategory(subject);

  const base = `Subject: ${subject} | Topic: ${topic}
FORMULA DISCIPLINE (critical):
- Every formula MUST belong to ${subject} and "${topic}" — never import unrelated math.`;

  switch (category) {
    case "biology":
      return `${base}
- Biology / evolution: use concepts like variation, adaptation, natural selection, speciation, phylogeny.
- Acceptable formulas ONLY when relevant: Hardy-Weinberg p^2+2pq+q^2=1; growth rate r or selection coefficient s — NOT calculus ODEs unless topic is population ecology/modelling.
- FORBIDDEN for evolution/进化论/自然选择 topics: dN/dt, logistic differential equations, \\frac{dN}{dt}, integrals, derivatives, y=f(x), parabolas.
- Diagram captions: evolutionary tree, cladogram, trait comparison, fossil sequence — NOT coordinate graphs or reference frames.`;
    case "chemistry":
      return `${base}
- Use chemical equations, reaction rates, stoichiometry, equilibrium — not unrelated calculus graphs.`;
    case "physics":
      return `${base}
- Use physics formulas for this topic only (kinematics, energy, relativity, etc.).`;
    case "mathematics":
      return `${base}
- Use mathematics appropriate to the topic and level.`;
    case "humanities":
    case "language":
      return `${base}
- Prefer text, tables, timelines, concept maps. Formula blocks are optional; do NOT invent calculus or physics equations.`;
    default:
      return `${base}
- Match formulas and diagrams to the subject; do not default to calculus or y=f(x).`;
  }
}

/**
 * True when LaTeX looks like calculus / ODE content inappropriate for intro biology.
 */
function isCalculusStyleFormula(latex: string): boolean {
  return /\\frac\s*\{\s*d[A-Za-z]|\\frac\{d|\\int|dN\s*\/\s*dt|dx\s*\/\s*dt|dy\s*\/\s*dx|\\partial|y\s*=\s*f\s*\(\s*x\s*\)/i.test(
    latex
  );
}

/**
 * Suggests a biology-appropriate formula for common topics (not hard-coded lesson content).
 */
function suggestBiologyFormula(topic: string): string | null {
  const haystack = topic.toLowerCase();
  if (/进化|演化|evolution|自然选择|natural selection|遗传|heredity|allele|基因频率/.test(haystack)) {
    return "p^2 + 2pq + q^2 = 1";
  }
  if (/光合|photosynth/.test(haystack)) {
    return "6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2";
  }
  return null;
}

/**
 * Removes or corrects cross-subject formula hallucinations from teaching content.
 */
export function sanitizeTeachingContentForSubject(
  blocks: TeachingContentBlock[] | undefined,
  subject: string,
  topic: string
): TeachingContentBlock[] | undefined {
  if (!blocks?.length) {
    return blocks;
  }

  const category = getLessonSubjectCategory(subject);
  if (category !== "biology" && category !== "humanities" && category !== "language") {
    return blocks;
  }

  return blocks.map((block) => {
    if (block.type !== "formula" || !block.latex?.trim()) {
      if (block.type === "diagram" && category === "biology") {
        const caption = block.content.toLowerCase();
        if (/参考系|coordinate|parabola|y=f|积分|微积分/.test(caption)) {
          return {
            ...block,
            content: `Evolutionary tree for ${topic}: branch points show common ancestors; label species and shared traits.`,
          };
        }
      }
      return block;
    }

    if (!isCalculusStyleFormula(block.latex)) {
      return block;
    }

    const replacement = suggestBiologyFormula(topic);
    if (replacement) {
      return {
        ...block,
        latex: replacement,
        content: block.content.replace(
          /微积分|dN\/dt|logistic|微分方程|differential equation/gi,
          "population genetics equilibrium"
        ),
      };
    }

    return {
      ...block,
      type: "text" as const,
      content: `${block.content}\n\n(Key ideas for ${topic}: describe mechanisms in words — avoid unrelated calculus models.)`,
      latex: undefined,
    };
  });
}

import { isEmailWritingLesson } from "./detect-writing-lesson";

/**
 * Subject-aware padding text when auto-filling teaching content blocks.
 */
export function buildPaddingTeachingBlock(
  subject: string,
  topic: string,
  blockIndex: number,
  phaseCount: number,
  locale: "en" | "zh"
): TeachingContentBlock {
  const category = getLessonSubjectCategory(subject);
  const n = blockIndex;
  const isZh = locale === "zh";

  if (n % 4 === 0) {
    return {
      id: `tc-auto-${n}`,
      type: "table",
      content: isZh
        ? `| 要点 | 说明 |\n|------|------|\n| 核心概念 | ${topic} |\n| 证据/例子 | 课堂讨论 |\n| 常见误区 | 见板书 |`
        : `| Point | Note |\n|-------|------|\n| Core idea | ${topic} |\n| Evidence | Class discussion |\n| Pitfall | On board |`,
    };
  }

  if (n % 3 === 0) {
    const diagramCaption =
      category === "biology"
        ? isZh
          ? `「${topic}」进化树示意图：标出共同祖先、分支节点与代表性物种。`
          : `${topic} phylogenetic tree: label common ancestor, branch nodes, and example species.`
        : category === "language" && isEmailWritingLesson(topic)
          ? isZh
            ? `【概念图：${topic}】中心节点：公务电邮；分支1：格式规范（主题行、称呼、署名）；分支2：内容要素（目的、情况、影响、建议）；分支3：语言风格（正式、礼貌、客观）；分支4：常见误区（语气随意、建议空泛、格式错误）`
            : `【Concept map: ${topic}】Center node: official email; Branch 1: format (subject, salutation, signature); Branch 2: content (purpose, situation, impact, request); Branch 3: tone (formal, polite, objective); Branch 4: pitfalls (casual tone, vague request, format errors)`
        : category === "humanities" || category === "language"
          ? isZh
            ? `【概念图：${topic}】中心节点：${topic}；分支1：写作目的与读者；分支2：段落结构；分支3：语言与语气；分支4：格式与常见误区`
            : `【Concept map: ${topic}】Center node: ${topic}; Branch 1: purpose and audience; Branch 2: paragraph structure; Branch 3: language and tone; Branch 4: format and pitfalls`
          : isZh
            ? `「${topic}」示意图 ${n}：标出本课核心要素与相互关系。`
            : `${topic} diagram ${n}: label core elements and their relationships.`;

    return { id: `tc-auto-${n}`, type: "diagram", content: diagramCaption };
  }

  return {
    id: `tc-auto-${n}`,
    type: "text",
    content: isZh
      ? `【${topic} 拓展 ${n}】结合第 ${Math.min(n, phaseCount)} 阶段，组织学生讨论：这一现象有哪些证据支持？与其他观点有何区别？`
      : `[${topic} extension ${n}] After phase ${Math.min(n, phaseCount)}: discuss what evidence supports this idea and how it differs from alternatives.`,
  };
}

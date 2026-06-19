import type { Locale } from "@/lib/i18n/types";
import type { LessonOutputPayload } from "../ai/validator";
import { prepareMathFieldForDisplay } from "../math/normalize-math-text";
import type { TopicKnowledgeContext } from "../knowledge/types";
import type { RichContentBlock } from "../types";

/**
 * Merges inline math split across line breaks (e.g. `$y=$` + `$\log_a x$`).
 */
export function repairFragmentedInlineMath(text: string): string {
  if (!text?.trim()) {
    return text;
  }

  let result = text.replace(
    /\$([^$\n]{0,120})\$\s*\n+\s*\$([^$\n]{0,120})\$/g,
    (_, left, right) => `$${left.trim()} ${right.trim()}$`
  );

  const lines = result.split("\n");
  const merged: string[] = [];
  let buffer = "";
  let openDollars = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (buffer) {
        buffer += " ";
      }
      continue;
    }

    const dollars = (trimmed.match(/\$/g) ?? []).length;
    if (buffer) {
      buffer += ` ${trimmed}`;
      openDollars += dollars;
      if (openDollars % 2 === 0) {
        merged.push(buffer);
        buffer = "";
        openDollars = 0;
      }
      continue;
    }

    if (dollars % 2 !== 0) {
      buffer = trimmed;
      openDollars = dollars;
      continue;
    }

    merged.push(trimmed);
  }

  if (buffer) {
    merged.push(buffer);
  }

  return merged.join("\n");
}

/**
 * Removes duplicated topic labels and stray English clauses in Chinese prose.
 */
export function sanitizeProseForLocale(text: string, locale: Locale): string {
  if (!text?.trim()) {
    return text;
  }

  let result = text;

  if (locale === "zh") {
    result = result.replace(
      /([^\n：:]{2,40})[：:]\s*\1\s*(?:\([^)]+\))?/g,
      "$1"
    );
    result = result.replace(
      /\s*\([A-Za-z][^)]{8,120}\)\s*$/g,
      ""
    );
    result = result.replace(
      /(见板书|课堂讨论|Class discussion|On board)/gi,
      ""
    );
  }

  return result.replace(/\s{2,}/g, " ").trim();
}

/**
 * Prepares one lesson string field for display and model cleanup.
 */
export function sanitizeLessonTextField(
  text: string,
  locale: Locale
): string {
  const repaired = repairFragmentedInlineMath(text);
  const prose = sanitizeProseForLocale(repaired, locale);
  return prepareMathFieldForDisplay(prose);
}

/**
 * True when a teaching block looks like auto-generated filler.
 */
export function isAutoPaddingBlock(block: {
  id?: string;
  content: string;
}): boolean {
  return (
    /^tc-auto-\d+$/.test(block.id ?? "") ||
    /拓展 \d+|extension \d+|示意图 \d+|diagram \d+|见板书|课堂讨论|Class discussion/i.test(
      block.content
    ) ||
    /\|\s*核心概念\s*\|\s*[^|]+\s*\|\s*证据\/例子\s*\|\s*课堂讨论/i.test(
      block.content
    )
  );
}

/**
 * Builds syllabus-grounded teaching blocks instead of generic placeholders.
 */
export function buildKnowledgeTeachingBlocks(
  knowledge: TopicKnowledgeContext,
  topic: string,
  locale: Locale,
  count: number
): RichContentBlock[] {
  const isZh = locale === "zh";
  const blocks: RichContentBlock[] = [];
  const match = knowledge.matches[0]?.entry;
  if (!match) {
    return blocks;
  }

  const concepts = match.keyConcepts.slice(0, Math.min(count, 3));
  concepts.forEach((concept, index) => {
    blocks.push({
      id: `tc-kb-${index + 1}`,
      type: "text",
      content: isZh
        ? `【${topic}】${concept}：结合课堂实例说明其定义、适用条件与常见应用。`
        : `[${topic}] ${concept}: explain the definition, conditions, and a classroom example.`,
    });
  });

  if (blocks.length < count && match.formulas[0]) {
    blocks.push({
      id: "tc-kb-formula",
      type: "formula",
      content: isZh
        ? `本课核心公式（${topic}）：`
        : `Core formula for ${topic}:`,
      latex: match.formulas[0],
    });
  }

  if (blocks.length < count && match.diagramCaptions[0]) {
    blocks.push({
      id: "tc-kb-diagram",
      type: "diagram",
      content: match.diagramCaptions[0],
    });
  }

  if (blocks.length < count && match.misconceptions?.[0]) {
    blocks.push({
      id: "tc-kb-misconception",
      type: "text",
      content: isZh
        ? `常见误区：${match.misconceptions[0]}。请用反例或对比练习帮助学生纠正。`
        : `Common misconception: ${match.misconceptions[0]}. Use a counter-example in class.`,
    });
  }

  return blocks.slice(0, count);
}

/**
 * Sanitizes all string fields on a validated lesson payload.
 */
export function sanitizeLessonOutputPayload(
  payload: LessonOutputPayload,
  locale: Locale
): LessonOutputPayload {
  const clean = (value: string) => sanitizeLessonTextField(value, locale);

  return {
    ...payload,
    learningObjectives: payload.learningObjectives.map(clean),
    keyConcepts: payload.keyConcepts.map(clean),
    lessonPlan: payload.lessonPlan.map((phase) => ({
      ...phase,
      phase: clean(phase.phase),
      activities: phase.activities.map(clean),
      teacherNotes: phase.teacherNotes ? clean(phase.teacherNotes) : undefined,
      teacherScript: phase.teacherScript ? clean(phase.teacherScript) : undefined,
    })),
    commonMisconceptions: payload.commonMisconceptions.map(clean),
    revisionNotes: clean(payload.revisionNotes),
    teachingContent: payload.teachingContent?.map((block) => ({
      ...block,
      content: clean(block.content),
      latex: block.latex ? clean(block.latex) : undefined,
    })),
    learningVisualLessons: payload.learningVisualLessons?.map((lesson) => ({
      ...lesson,
      title: clean(lesson.title),
      knowledgeGap: clean(lesson.knowledgeGap),
      summary: clean(lesson.summary),
      steps: lesson.steps.map((step) => ({
        ...step,
        title: clean(step.title),
        body: clean(step.body),
        latex: step.latex ? clean(step.latex) : undefined,
      })),
    })),
  };
}

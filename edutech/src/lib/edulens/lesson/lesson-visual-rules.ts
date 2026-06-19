import { detectLessonVisualType } from "../math/detect-visual-type";
import {
  buildTopicKnowledgeContext,
  suggestVisualTypeFromKnowledge,
} from "../knowledge/retrieve-topic-knowledge";
import type { TopicKnowledgeContext } from "../knowledge/types";
import type {
  LearningVisualStep,
  LessonVisualType,
  RichContentBlock,
} from "../types";
import { getLessonSubjectCategory } from "./lesson-subject-rules";
import {
  isEmailWritingLesson,
  isWritingLesson,
} from "./detect-writing-lesson";

const PHYSICS_ONLY_VISUALS: LessonVisualType[] = ["physics_spacetime"];
const MATH_ONLY_VISUALS: LessonVisualType[] = [
  "integral_area",
  "parabola_graph",
  "factor_pairs",
  "number_line",
];

/**
 * True when the topic is explicitly relativity / spacetime (not general physics).
 */
export function isRelativityTopic(topic: string): boolean {
  const haystack = topic.toLowerCase();
  return /相对论|relativity|einstein|爱因斯坦|lorentz|洛伦兹|时空|spacetime|时间膨胀|time dilation|狭义相对论|special relativity/.test(
    haystack
  );
}

/**
 * True when the lesson is chemistry (subject or topic keywords).
 */
export function isChemistryLesson(topic: string, subject?: string): boolean {
  if (getLessonSubjectCategory(subject ?? "") === "chemistry") {
    return true;
  }
  const haystack = topic.toLowerCase();
  return /化学|chemistry|酸|碱|氧化|还原|电解|有机|摩尔|mole|bonding|键/.test(haystack);
}

/**
 * True when the lesson is physics (subject).
 */
export function isPhysicsSubject(subject?: string): boolean {
  return getLessonSubjectCategory(subject ?? "") === "physics";
}

/**
 * Clamps visualType to syllabus knowledge and subject boundaries.
 */
export function clampVisualTypeForSubject(
  visualType: LessonVisualType,
  step: LearningVisualStep,
  topic: string,
  subject: string,
  level: string,
  knowledge?: TopicKnowledgeContext
): LessonVisualType {
  const ctx = knowledge ?? buildTopicKnowledgeContext(subject, level, topic);
  const allowed = new Set(ctx.allowedVisualTypes);

  let clamped = visualType;

  if (PHYSICS_ONLY_VISUALS.includes(clamped) && !allowed.has("physics_spacetime")) {
    clamped = suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches) ?? "concept_process";
  }

  if (MATH_ONLY_VISUALS.includes(clamped) && !allowed.has(clamped)) {
    clamped = suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches) ?? "concept_process";
  }

  if (!allowed.has(clamped)) {
    const suggested = suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches);
    clamped = suggested ?? (allowed.has("concept_process") ? "concept_process" : ctx.allowedVisualTypes[0] ?? "generic");
  }

  if (getLessonSubjectCategory(subject) === "chemistry" && clamped === "physics_spacetime") {
    clamped = suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches) ?? "concept_process";
  }

  if (
    (getLessonSubjectCategory(subject) === "language" ||
      getLessonSubjectCategory(subject) === "humanities" ||
      isWritingLesson(topic, subject)) &&
    (clamped === "formula_spotlight" ||
      clamped === "integral_area" ||
      clamped === "parabola_graph" ||
      clamped === "equation_balance" ||
      clamped === "factor_pairs")
  ) {
    clamped = isEmailWritingLesson(topic, subject)
      ? "writing_structure"
      : suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches) ??
        "concept_map";
  }

  if (isPhysicsSubject(subject) && clamped === "physics_spacetime" && !isRelativityTopic(topic)) {
    clamped = suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches) ?? "concept_process";
  }

  return clamped;
}

/**
 * Picks a formula LaTeX string appropriate for the lesson subject and syllabus match.
 */
export function pickSubjectFormulaLatex(
  blocks: RichContentBlock[] | undefined,
  subject: string,
  topic: string,
  level: string
): string | undefined {
  const ctx = buildTopicKnowledgeContext(subject, level, topic);
  const syllabusFormulas = ctx.matches.flatMap((m) => m.entry.formulas);

  const formulas =
    blocks?.filter((block) => block.type === "formula" && block.latex?.trim()) ?? [];

  if (syllabusFormulas.length) {
    const blockMatch = formulas.find((block) =>
      syllabusFormulas.some((sf) => block.latex?.includes(sf.replace(/\\/g, "")))
    );
    if (blockMatch?.latex) {
      return blockMatch.latex.trim();
    }
  }

  if (!formulas.length) {
    return syllabusFormulas[0];
  }

  const isRelativityLatex = (latex: string) =>
    /gamma|lorentz|洛伦兹|\\frac\{1\}\{\\sqrt\{1\s*-\s*v|t\s*'\s*=|c\^2|vx\/c/i.test(latex);

  if (getLessonSubjectCategory(subject) === "chemistry") {
    const chem = formulas.find((b) => !isRelativityLatex(b.latex ?? ""));
    return chem?.latex?.trim();
  }

  if (isRelativityTopic(topic)) {
    const rel = formulas.find((b) => isRelativityLatex(b.latex ?? ""));
    return rel?.latex?.trim() ?? formulas[0].latex?.trim();
  }

  const nonRel = formulas.find((b) => !isRelativityLatex(b.latex ?? ""));
  return nonRel?.latex?.trim() ?? formulas[0].latex?.trim();
}

/**
 * Resolves the animation scene for one micro-lesson step using syllabus knowledge.
 */
export function resolveLessonStepVisualType(
  step: LearningVisualStep,
  topic: string,
  subject: string,
  level: string,
  knowledge?: TopicKnowledgeContext
): LessonVisualType {
  const ctx = knowledge ?? buildTopicKnowledgeContext(subject, level, topic);

  let resolved: LessonVisualType;

  const fromKnowledge = suggestVisualTypeFromKnowledge(step.title, step.body, ctx.matches);
  const aiType = step.visualType && step.visualType !== "generic" ? step.visualType : undefined;

  if (aiType && ctx.allowedVisualTypes.includes(aiType)) {
    resolved = aiType;
  } else if (fromKnowledge) {
    resolved = fromKnowledge;
  } else if (aiType) {
    resolved = aiType;
  } else {
    resolved = detectLessonVisualType(step, topic, subject);
  }

  return clampVisualTypeForSubject(resolved, step, topic, subject, level, ctx);
}

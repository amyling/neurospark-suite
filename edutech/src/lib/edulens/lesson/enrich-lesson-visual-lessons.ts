import type { Locale } from "@/lib/i18n/types";
import type {
  LearningVisualLesson,
  LearningVisualStep,
  RichContentBlock,
} from "../types";
import { buildTopicKnowledgeContext } from "../knowledge/retrieve-topic-knowledge";
import {
  pickSubjectFormulaLatex,
  resolveLessonStepVisualType,
} from "./lesson-visual-rules";
import { getLessonSubjectCategory } from "./lesson-subject-rules";
import {
  isEmailWritingLesson,
  isWritingLesson,
} from "./detect-writing-lesson";

/**
 * Detects generic boilerplate injected when the model returns thin step bodies.
 */
function isGenericBoilerplate(body: string): boolean {
  return /教师可在板书上逐步推导|Model the reasoning on the board|build intuition first, then connect the formula|请先建立直觉|邀请学生用自己的话复述要点/i.test(
    body
  );
}

/**
 * Expands a thin step body into classroom-ready narration (subject-aware, topic-specific).
 */
function expandStepBody(
  step: LearningVisualStep,
  topic: string,
  locale: Locale,
  minChars: number,
  subject: string
): string {
  let body = step.body.trim();
  if (isGenericBoilerplate(body)) {
    body = "";
  }
  if (body.length >= minChars) {
    return body;
  }

  const isZh = locale === "zh";
  const title = step.title.trim();
  const category = getLessonSubjectCategory(subject);

  if (category === "language" || category === "humanities") {
    if (isEmailWritingLesson(topic, subject)) {
      return isZh
        ? `${title}：本步聚焦公务电邮写作。${body ? `${body} ` : ""}请标出主题行、称呼、正文各段功能与结尾敬语，并说明为什么要这样写。`
        : `${title}: Focus on official email writing. ${body ? `${body} ` : ""}Label the subject, salutation, each body paragraph, and closing — explain why each part is needed.`;
    }
    if (isWritingLesson(topic, subject)) {
      return isZh
        ? `${title}：围绕「${topic}」的写作任务，${body ? `${body} ` : ""}请理清段落顺序与语气，并举一个校园或生活中的真实场景来对照。`
        : `${title}: For the writing task "${topic}", ${body ? `${body} ` : ""}clarify paragraph order and tone, and compare with a real school or daily-life example.`;
    }
    return isZh
      ? `${title}：围绕「${topic}」，${body ? `${body} ` : ""}请结合史料、文本或生活实例讨论因果关系，并在板书上整理要点。`
      : `${title}: For "${topic}", ${body ? `${body} ` : ""}discuss cause and effect with sources or examples, and organise key points on the board.`;
  }

  if (
    category === "physics" ||
    category === "chemistry" ||
    category === "biology"
  ) {
    if (body.length >= 45) {
      return body;
    }
    return isZh
      ? `${title}（${topic}）：${body ? `${body} ` : ""}对照上方图示，说明${title}与「${topic}」的直接联系，并举一个课堂可演示的观察或实验现象。`
      : `${title} (${topic}): ${body ? `${body} ` : ""}Use the diagram above to explain how ${title} connects to "${topic}", with one observable classroom demo or experiment.`;
  }

  if (body.length >= 45) {
    return body;
  }

  if (isZh) {
    return `${title}（${topic}）：${body ? `${body} ` : ""}结合本步图示，完成一道与${title}相关的例题或讨论问题。`;
  }

  return `${title} (${topic}): ${body ? `${body} ` : ""}Use the step diagram to work through one example or discussion question about ${title}.`;
}

/**
 * Subject-appropriate knowledge gap when the model returns a thin line.
 */
function expandKnowledgeGap(
  lesson: LearningVisualLesson,
  topic: string,
  locale: Locale,
  subject: string
): string {
  if (lesson.knowledgeGap.trim().length >= 40) {
    return lesson.knowledgeGap;
  }

  const category = getLessonSubjectCategory(subject);
  if (isEmailWritingLesson(topic, subject)) {
    return locale === "zh"
      ? `分步示范公务电邮的写作结构：格式、内容要素、语气与常见误区。`
      : `Step through official email structure: format, content blocks, tone, and common pitfalls.`;
  }
  if (isWritingLesson(topic, subject) || category === "language") {
    return locale === "zh"
      ? `把「${topic}」的写作任务拆成可演示、可讨论的步骤，帮助学生从审题走向成文。`
      : `Break the "${topic}" writing task into visual, discussable steps from planning to drafting.`;
  }

  return locale === "zh"
    ? `把「${topic}」的核心思想拆成可演示、可讨论的步骤，帮助学生从直觉走向公式与应用。`
    : `Break "${topic}" into visual, discussable steps so students move from intuition to formulas and applications.`;
}

/**
 * Subject-appropriate summary when the model returns a thin line.
 */
function expandSummary(
  lesson: LearningVisualLesson,
  topic: string,
  locale: Locale,
  subject: string
): string {
  if (lesson.summary.trim().length >= 30) {
    return lesson.summary;
  }

  if (isEmailWritingLesson(topic, subject)) {
    return locale === "zh"
      ? `回顾公务电邮的主题、称呼、正文结构、敬语署名与语气要求，完成一封范例修改练习。`
      : `Review subject, salutation, body structure, closing, and tone; then revise a sample email.`;
  }
  if (isWritingLesson(topic, subject)) {
    return locale === "zh"
      ? `回顾 ${topic} 的审题、提纲、段落与语言要点，完成一道巩固练笔。`
      : `Review planning, outline, paragraphs, and language for ${topic}; complete a short practice piece.`;
  }

  return locale === "zh"
    ? `回顾 ${topic} 的关键概念、公式与常见误区，完成一道巩固练习。`
    : `Review key ideas, formulas, and pitfalls for ${topic}, then complete a practice item.`;
}

/**
 * Enriches AI micro-lesson steps with longer narration and subject-aware visuals.
 */
export function enrichLearningVisualLessons(
  lessons: LearningVisualLesson[] | undefined,
  topic: string,
  subject: string,
  teachingContent: RichContentBlock[] | undefined,
  locale: Locale,
  durationMinutes = 60,
  level = "Sec 3"
): LearningVisualLesson[] {
  if (!lessons?.length) {
    return [];
  }

  const minBodyChars = durationMinutes >= 50 ? 120 : durationMinutes >= 30 ? 100 : 80;
  const knowledge = buildTopicKnowledgeContext(subject, level, topic);
  const category = getLessonSubjectCategory(subject);
  const skipFormula =
    category === "language" ||
    category === "humanities" ||
    isWritingLesson(topic, subject);
  const formulaLatex = skipFormula
    ? undefined
    : pickSubjectFormulaLatex(teachingContent, subject, topic, level);

  return lessons.map((lesson) => {
    const steps = lesson.steps.map((step) => {
      const body = expandStepBody(step, topic, locale, minBodyChars, subject);
      const visualType = resolveLessonStepVisualType(
        { ...step, body },
        topic,
        subject,
        level,
        knowledge
      );
      const latex =
        step.latex?.trim() ||
        (!skipFormula &&
        (visualType === "formula_spotlight" || visualType === "chemistry_reaction")
          ? formulaLatex
          : undefined);

      return {
        ...step,
        body,
        visualType,
        latex,
      };
    });

    return {
      ...lesson,
      knowledgeGap: expandKnowledgeGap(lesson, topic, locale, subject),
      steps,
      summary: expandSummary(lesson, topic, locale, subject),
    };
  });
}

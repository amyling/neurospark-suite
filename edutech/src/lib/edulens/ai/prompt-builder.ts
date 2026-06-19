import type { Locale } from "@/lib/i18n/types";
import type { HomeworkSubmission, LessonRequest } from "../types";
import { getLanguageRule } from "../demo/mock-responses";
import { buildLessonDepthPromptBlock } from "../lesson/enrich-lesson-pack";
import { buildLessonSubjectRulesBlock } from "../lesson/lesson-subject-rules";
import type { LessonRagContext } from "../knowledge/rag/types";
import type { TopicKnowledgeContext } from "../knowledge/types";
import {
  HOMEWORK_ANALYSIS_COMPACT_SCHEMA,
  HOMEWORK_ANALYSIS_JSON_SCHEMA,
} from "./homework-analysis-schema";
import { shrinkText } from "./prompt-trim";

/** Optional limits to keep lesson prompts within provider token budgets */
export type LessonPromptOptions = {
  maxRagChars?: number;
  maxTeacherChars?: number;
  includeDepthBlock?: boolean;
};

function resolveRagBlock(
  request: LessonRequest,
  ragContext: LessonRagContext | undefined,
  maxRagChars?: number
): string {
  const block =
    ragContext?.ragPromptBlock ??
    `Align to Subject "${request.subject}", Level "${request.level}", Topic "${request.topic}".`;
  return maxRagChars ? shrinkText(block, maxRagChars, "RAG") : block;
}

function resolveTeacherContent(
  request: LessonRequest,
  maxTeacherChars?: number
): string {
  const raw =
    request.teacherContent?.trim() || "(none — generate from topic)";
  return maxTeacherChars ? shrinkText(raw, maxTeacherChars, "teacher") : raw;
}

/**
 * Locale + math formatting rules for lesson generation.
 */
function buildLessonLocaleRules(locale: Locale): string {
  const base = getLanguageRule(locale);
  if (locale === "zh") {
    return `${base}
LANGUAGE & MATH FORMAT (critical):
- All prose in Simplified Chinese. English only inside $...$ LaTeX for symbols (e.g. $a$, $\\log_a x$).
- Never repeat the topic label twice (wrong: "二项式、对数、指数：二项式、对数、指数").
- Never append English parenthetical summaries after Chinese sentences.
- Keep each complete formula in ONE $...$ pair — do not split $y=$ and $\\log_a x$ across lines or segments.
- type "formula": put LaTeX in "latex" field; "content" is Chinese explanation only.
- type "diagram": Chinese caption describing axes/curves/particles; no raw LaTeX without $ delimiters.`;
  }
  return `${base}
MATH FORMAT:
- Wrap all math in $...$ (inline) or $$...$$ (display). One complete expression per pair.
- type "formula": LaTeX in "latex"; "content" is plain explanation.`;
}

function resolveKnowledgeBlock(
  knowledge: TopicKnowledgeContext,
  ragContext: LessonRagContext | undefined,
  maxChars?: number
): string {
  const block = ragContext?.ragPromptBlock ?? knowledge.promptBlock;
  return maxChars ? shrinkText(block, maxChars, "knowledge") : block;
}

const JSON_RULES = `
Return ONLY valid JSON. No markdown fences.
In JSON strings, escape every LaTeX backslash twice (write \\\\frac not \\frac, \\\\int not \\int).
Never claim 100% marking accuracy.
Include confidence levels where scoring is estimated.
Set teacherReviewRecommended true when uncertain or open-ended.
Do not encourage cheating or exam misconduct.
Do not claim official MOE or curriculum authority.
`;

const HOMEWORK_MARKING_RULES = `
CRITICAL MARKING RULES:
1. Read the EXACT question and student answer provided. Every field MUST reference this specific problem — never generic template text.
2. Solve the problem yourself first. Put your solution in correctSolution and answerComparison.modelAnswer.
3. Compare the student's work step-by-step against your solution.
4. If the student's final answer is mathematically correct, result MUST be "correct" or "partially_correct" (only when steps are incomplete). NEVER mark "incorrect" when the answer is right.
5. answerComparison.keyDifferences must list concrete differences (e.g. missing +C, wrong sign, skipped substitution step) — empty array if fully correct.
6. rubricAnalysis must reflect scoring points for THIS question only.
7. Use $...$ for inline math and $$...$$ for display math in all string fields.
8. When result is "incorrect" or "partially_correct", you MUST include:
   - At least 1 learningVisualLesson with 4-6 steps (animated micro-lesson explaining the gap)
   - At least 2 nextKnowledgeUnits (what to study next, with formulas and studySteps)
   - Full mistakeBreakdown and rubricAnalysis for every scoring point
9. learningVisualLessons steps should build intuition: concept → formula → apply to THIS question → common mistake → fix.
   Each step should set visualType: integral_area | equation_balance | factor_pairs | formula_spotlight | mistake_compare | number_line | generic.
10. Fill ALL required schema keys with content specific to the submission.
`;

export function buildHomeworkAnalysisPrompt(
  submission: HomeworkSubmission,
  locale: Locale = "en"
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are EduLens Homework Analyzer — an expert teacher marking assistant.
${JSON_RULES}
${getLanguageRule(locale)}
${HOMEWORK_MARKING_RULES}

Return JSON matching this schema exactly:
${HOMEWORK_ANALYSIS_JSON_SCHEMA}`;

  const userPrompt = `Mark this homework submission.

Subject: ${submission.subject}
Level: ${submission.level}
Topic: ${submission.topic ?? "General"}

--- QUESTION (what the student must solve) ---
${submission.questionText}

--- STUDENT ANSWER (what the student wrote) ---
${submission.studentAnswer}

--- REFERENCE ANSWER (optional, from teacher) ---
${submission.standardAnswer?.trim() || "Not provided — derive the correct answer yourself."}

Steps:
1. Solve the question completely.
2. Compare student answer to your solution.
3. Return structured JSON with answerComparison, rubricAnalysis, feedback tied to the content above.`;

  return { systemPrompt, userPrompt };
}

/**
 * Compact marking prompt used when the full-schema response fails to parse.
 */
export function buildHomeworkAnalysisCompactPrompt(
  submission: HomeworkSubmission,
  locale: Locale = "en"
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are EduLens Homework Analyzer — an expert teacher marking assistant.
${JSON_RULES}
${getLanguageRule(locale)}
${HOMEWORK_MARKING_RULES}

IMPORTANT: Keep each string field concise (under 400 chars). Limit learningVisualLessons to 1 lesson with 4 steps.
Return ONLY valid JSON matching this schema:
${HOMEWORK_ANALYSIS_COMPACT_SCHEMA}`;

  const userPrompt = `Mark this homework submission.

Subject: ${submission.subject}
Level: ${submission.level}
Topic: ${submission.topic ?? "General"}

--- QUESTION ---
${submission.questionText}

--- STUDENT ANSWER ---
${submission.studentAnswer}

--- REFERENCE ANSWER ---
${submission.standardAnswer?.trim() || "Not provided — derive the correct answer yourself."}`;

  return { systemPrompt, userPrompt };
}

export function buildLessonPackPrompt(
  request: LessonRequest,
  locale: Locale = "en",
  ragContext?: LessonRagContext,
  options?: LessonPromptOptions
): { systemPrompt: string; userPrompt: string } {
  const hasTeacherContent = Boolean(request.teacherContent?.trim());
  const contentRule = hasTeacherContent
    ? "Base the lesson on the teacher-provided content below. Expand it into a full classroom-ready pack; do not ignore their material."
    : "No teacher content was provided. Generate detailed, topic-specific content appropriate for the level and subject (not a generic outline).";

  const depthBlock =
    options?.includeDepthBlock === false
      ? ""
      : buildLessonDepthPromptBlock(request.durationMinutes);
  const subjectRulesBlock = buildLessonSubjectRulesBlock(request.subject, request.topic);
  const ragBlock = resolveRagBlock(request, ragContext, options?.maxRagChars);

  const systemPrompt = `You are EduLens Lesson Generator — expert teacher lesson designer.
${JSON_RULES}
${buildLessonLocaleRules(locale)}
${contentRule}
${depthBlock}
${subjectRulesBlock}
${ragBlock}
CRITICAL: The entire lesson MUST match the Topic field exactly ("${request.topic}").
- Never use generic placeholders (e.g. y=f(x) as a default formula) unless the topic is explicitly about functions or graphs.
- If Topic is calculus/integrals/微积分, do NOT output quadratic-equation or parabola content unless the topic explicitly asks for it.
- If Topic is quadratic functions, do NOT output unrelated calculus-only material.
Requirements:
- NOT a shallow framework: include concrete explanations, board work, discussion questions, timing, and differentiation.
- Depth: each lessonPlan phase needs teacherScript with 3+ sentences of what the teacher says; worksheet needs at least 4 complete questions with realistic context.
- teachingContent text blocks: each at least 3 sentences with concrete examples (not one-line summaries).
- Include multimodal teachingContent blocks: type "text" | "formula" | "diagram" | "table". Use LaTeX in "latex" for formulas — valid LaTeX only (e.g. t' = \\gamma(t - vx/c^2), NOT \\frac{entire equation}).
- For type "table", content MUST be valid markdown table rows (| col | col | with separator line).
- For type "diagram", content MUST describe a subject-specific illustration aligned to the RAG references above (NOT a generic math graph unless topic is mathematics).
- learningVisualLessons: 1 micro-lesson with 5-6 steps; EACH step body MUST be 2-4 full sentences (80+ characters) explaining the idea for students.
  Each step title and body MUST reference the specific sub-topic "${request.topic}" — NEVER reuse generic phrases like "build intuition" or "model on the board" across steps.
  Step 1 must name the concrete phenomenon; later steps must build on prior step content (not repeat the same sentence).
  Set visualType per step using the RAG visual type rules — match the step content (e.g. bonding → concept_process; reaction equation → chemistry_reaction; particle model → concept_process; circuit → concept_process; relativity only → physics_spacetime).
  Do NOT use physics_spacetime for chemistry, electricity, waves, or mechanics topics.
- For type "diagram", content MUST be a precise visual brief (particle arrangement, circuit layout, graph axes, etc.) that matches "${request.topic}" — NOT a placeholder like "see diagram".
- lessonPlan phases must include teacherScript (what the teacher says/does on the board).
- worksheet questions must be complete with realistic numbers/context; answerKey must show full working.
- At least 5 teachingContent blocks mixing text, formulas, and diagram descriptions.
Schema keys: learningObjectives, keyConcepts, lessonPlan, workedExamples, worksheet, answerKey, commonMisconceptions, revisionNotes, exitTicket, homework, cheatSheet, teachingContent, learningVisualLessons, contentSource.
lessonPlan items: { phase, durationMinutes, activities, teacherNotes?, teacherScript? }.
teachingContent items: { id?, type, content, latex? }.
contentSource: "teacher_input" | "ai_generated" | "mixed".`;

  const userPrompt = `Generate a FULL lesson pack (classroom-ready).
Mode: ${request.userMode}
Subject: ${request.subject}
Level: ${request.level}
Topic: ${request.topic}
${request.classProfile ? `Class profile: ${request.classProfile}\n` : ""}Duration (minutes): ${request.durationMinutes}
Difficulty: ${request.difficulty}
Learning goals: ${request.learningGoals ?? "(derive from topic)"}
Output types requested: ${request.outputTypes.join(", ")}

Teacher-provided content (may be empty):
---
${resolveTeacherContent(request, options?.maxTeacherChars)}
---`;

  return { systemPrompt, userPrompt };
}

/**
 * Shorter lesson prompt for retry when the full JSON response fails validation.
 */
export function buildLessonPackCompactPrompt(
  request: LessonRequest,
  locale: Locale = "en",
  ragContext?: LessonRagContext,
  options?: LessonPromptOptions
): { systemPrompt: string; userPrompt: string } {
  const hasTeacherContent = Boolean(request.teacherContent?.trim());
  const depthBlock =
    options?.includeDepthBlock === false
      ? ""
      : buildLessonDepthPromptBlock(request.durationMinutes);
  const subjectRulesBlock = buildLessonSubjectRulesBlock(request.subject, request.topic);
  const ragBlock = resolveRagBlock(
    request,
    ragContext,
    options?.maxRagChars ?? 1_400
  );
  const systemPrompt = `You are EduLens Lesson Generator.
${JSON_RULES}
${buildLessonLocaleRules(locale)}
${depthBlock}
${subjectRulesBlock}
${ragBlock}
Return ONLY JSON with keys: learningObjectives, keyConcepts, lessonPlan, workedExamples, worksheet, answerKey, commonMisconceptions, revisionNotes, teachingContent, learningVisualLessons, contentSource.
CRITICAL: Every field MUST be specific to Topic "${request.topic}" and Subject "${request.subject}" — never generic placeholders like y=f(x) unless the topic is functions/graphs.
${hasTeacherContent ? "Expand the teacher content below; do not ignore it." : "Generate detailed topic-specific content from the topic field."}
teachingContent: at least 5 blocks (type text|formula|diagram|table). Use valid LaTeX in latex for formulas.
lessonPlan: include teacherScript per phase (3+ sentences each).
learningVisualLessons: 1 item with 5-6 steps; each step body 80+ chars; visualType must follow RAG visual type rules for this topic.`;

  const userPrompt = `Topic: ${request.topic}
Subject: ${request.subject} | Level: ${request.level}
Duration: ${request.durationMinutes} min | Difficulty: ${request.difficulty}
Teacher content:
---
${resolveTeacherContent(request, options?.maxTeacherChars ?? 2_000)}
---`;

  return { systemPrompt, userPrompt };
}

/**
 * Minimal lesson prompt for token-limited providers (e.g. Groq free tier ~12k TPM).
 */
export function buildLessonPackMinimalPrompt(
  request: LessonRequest,
  locale: Locale = "en",
  ragContext?: LessonRagContext
): { systemPrompt: string; userPrompt: string } {
  const ragBlock = resolveRagBlock(request, ragContext, 700);
  const systemPrompt = `You are EduLens Lesson Generator.
${JSON_RULES}
${buildLessonLocaleRules(locale)}
Subject: ${request.subject} | Level: ${request.level} | Topic: ${request.topic}
${ragBlock}
Return ONLY JSON with keys: learningObjectives, keyConcepts, lessonPlan, workedExamples, worksheet, answerKey, commonMisconceptions, revisionNotes, teachingContent, learningVisualLessons, contentSource.
Keep strings concise. Topic MUST be "${request.topic}" — no generic placeholders.
teachingContent: 4+ blocks (text|formula|diagram|table).
lessonPlan: 3+ phases with teacherScript.
learningVisualLessons: 1 item, 4-5 steps, visualType per step.`;

  const userPrompt = `Generate lesson pack.
Duration: ${request.durationMinutes} min | Difficulty: ${request.difficulty}
Teacher content:
---
${resolveTeacherContent(request, 1_000)}
---`;

  return { systemPrompt, userPrompt };
}

type LessonStructureSlice = {
  learningObjectives: string[];
  keyConcepts: string[];
  lessonPlan: import("../ai/validator").LessonOutputPayload["lessonPlan"];
  commonMisconceptions?: string[];
};

/**
 * Part 1/3 — lesson skeleton grounded in syllabus knowledge.
 */
export function buildLessonStructurePrompt(
  request: LessonRequest,
  locale: Locale,
  knowledge: TopicKnowledgeContext,
  ragContext?: LessonRagContext
): { systemPrompt: string; userPrompt: string } {
  const knowledgeBlock = resolveKnowledgeBlock(knowledge, ragContext, 2_000);
  const depthBlock = buildLessonDepthPromptBlock(request.durationMinutes);
  const systemPrompt = `You are EduLens Lesson Generator — structure planner.
${JSON_RULES}
${buildLessonLocaleRules(locale)}
${buildLessonSubjectRulesBlock(request.subject, request.topic)}
${knowledgeBlock}
${depthBlock}
Return ONLY JSON with keys: learningObjectives, keyConcepts, lessonPlan, commonMisconceptions.
Use syllabus key concepts verbatim where possible — do NOT invent generic labels.
lessonPlan phases MUST sum to ${request.durationMinutes} minutes.
Each phase: phase, durationMinutes, activities (3+ items), teacherScript (4+ full sentences).`;

  const userPrompt = `Plan lesson structure.
Subject: ${request.subject} | Level: ${request.level} | Topic: ${request.topic}
Duration: ${request.durationMinutes} min | Difficulty: ${request.difficulty}
Teacher notes:
---
${resolveTeacherContent(request, 1_500)}
---`;

  return { systemPrompt, userPrompt };
}

/**
 * Part 2/3 — teaching blocks and worked examples from structure + knowledge.
 */
export function buildLessonTeachingPrompt(
  request: LessonRequest,
  locale: Locale,
  structure: LessonStructureSlice,
  knowledge: TopicKnowledgeContext,
  ragContext?: LessonRagContext
): { systemPrompt: string; userPrompt: string } {
  const knowledgeBlock = resolveKnowledgeBlock(knowledge, ragContext, 2_400);
  const systemPrompt = `You are EduLens Lesson Generator — teaching content writer.
${JSON_RULES}
${buildLessonLocaleRules(locale)}
${buildLessonSubjectRulesBlock(request.subject, request.topic)}
${knowledgeBlock}
Return ONLY JSON with keys: teachingContent, workedExamples, revisionNotes.
teachingContent: 6+ blocks mixing text, formula, diagram, table.
- text: 3-5 sentences with concrete examples (not one-liners).
- formula: "latex" holds LaTeX; "content" is explanation in the target language.
- diagram: caption describing axes/curves/particles for this topic.
- table: valid markdown table with | headers |.
Use diagram captions from the knowledge base when provided.
workedExamples: 2+ with full question text; revisionNotes: 1 paragraph summary.`;

  const userPrompt = `Write teaching content for Topic "${request.topic}".
Objectives: ${structure.learningObjectives.join("; ")}
Key concepts: ${structure.keyConcepts.join("; ")}
Lesson phases: ${structure.lessonPlan.map((p) => p.phase).join(" → ")}`;

  return { systemPrompt, userPrompt };
}

/**
 * Part 3/3 — worksheet, answers, and animated micro-lesson steps.
 */
export function buildLessonAssessmentPrompt(
  request: LessonRequest,
  locale: Locale,
  structure: LessonStructureSlice,
  knowledge: TopicKnowledgeContext,
  ragContext?: LessonRagContext
): { systemPrompt: string; userPrompt: string } {
  const knowledgeBlock = resolveKnowledgeBlock(knowledge, ragContext, 1_800);
  const visuals = knowledge.allowedVisualTypes.join(" | ");
  const systemPrompt = `You are EduLens Lesson Generator — assessment & animation writer.
${JSON_RULES}
${buildLessonLocaleRules(locale)}
${knowledgeBlock}
Return ONLY JSON with keys: worksheet, answerKey, learningVisualLessons, contentSource.
worksheet: 4+ complete questions with realistic numbers/context.
answerKey: matching questionId with full working.
learningVisualLessons: exactly 1 lesson, 5-6 steps.
Each step: title, body (3-5 sentences, 120+ chars, topic-specific), visualType from: ${visuals}.
Do NOT use generic phrases like "build intuition" or "model on the board".
contentSource: "teacher_input" | "ai_generated" | "mixed".`;

  const userPrompt = `Create worksheet and animation for Topic "${request.topic}" (${request.subject}, ${request.level}).
Key concepts: ${structure.keyConcepts.join("; ")}`;

  return { systemPrompt, userPrompt };
}

export function buildSimilarQuestionsPrompt(
  subject: string,
  topic: string,
  count: number,
  locale: Locale = "en"
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `Generate similar practice questions with answers. ${JSON_RULES}
${getLanguageRule(locale)}
Return JSON: { "questions": [{ "question", "answer", "difficulty" }] }`;

  const userPrompt = `Subject: ${subject}. Topic: ${topic}. Count: ${count}.`;
  return { systemPrompt, userPrompt };
}

export function buildKnowledgeExtractionPrompt(
  questionText: string,
  subject: string,
  locale: Locale = "en"
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `Extract knowledge point mapping. ${JSON_RULES}
${getLanguageRule(locale)}
Return JSON: { "mainTopic", "subTopics": [], "prerequisites": [] }`;

  const userPrompt = `Subject: ${subject}\nQuestion: ${questionText}`;
  return { systemPrompt, userPrompt };
}

export function buildMistakeClassificationPrompt(
  studentAnswer: string,
  feedback: string,
  locale: Locale = "en"
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `Classify mistake types for learning analytics. ${JSON_RULES}
${getLanguageRule(locale)}
Return JSON: { "mistakeTypes": string[] }`;

  const userPrompt = `Student answer: ${studentAnswer}\nFeedback context: ${feedback}`;
  return { systemPrompt, userPrompt };
}

export function buildLearningPlanPrompt(
  mistakeTypes: string[],
  knowledgePoints: string[],
  locale: Locale = "en"
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `Create a short remedial learning plan (3-5 steps). ${JSON_RULES}
${getLanguageRule(locale)}
Return JSON: { "learningPlan": string[] }`;

  const userPrompt = `Mistakes: ${mistakeTypes.join(", ")}\nKnowledge points: ${knowledgePoints.join(", ")}`;
  return { systemPrompt, userPrompt };
}

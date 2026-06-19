import { v4 as uuidv4 } from "uuid";
import type { Locale } from "@/lib/i18n/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/types";
import { extractFromImages } from "../ai/vision";
import { mockAnalyzeHomework, mockLessonPack } from "../demo/mock-responses";
import { parseJSONFromLLM } from "../ai/json-parser";
import {
  buildHomeworkAnalysisCompactPrompt,
  buildHomeworkAnalysisPrompt,
  buildKnowledgeExtractionPrompt,
  buildLearningPlanPrompt,
  buildLessonPackCompactPrompt,
  buildLessonPackPrompt,
  buildMistakeClassificationPrompt,
  buildSimilarQuestionsPrompt,
} from "../ai/prompt-builder";
import {
  hasConfiguredAIProvider,
  isExplicitMockMode,
} from "../ai/config";
import { completeJSON, getActiveProvider } from "../ai/provider";
import {
  applySafetyDefaults,
  validateHomeworkAnalysis,
  validateLessonOutput,
  type HomeworkAnalysisPayload,
  type LessonOutputPayload,
} from "../ai/validator";
import { buildDefaultLessonVisualLessons } from "../lesson/build-lesson-visual-lessons";
import { enrichLessonPackPayload } from "../lesson/enrich-lesson-pack";
import { sanitizeLessonTextField } from "../lesson/sanitize-lesson-content";
import { fetchLessonPackMultiPart } from "../lesson/lesson-multi-part";
import { buildTopicKnowledgeContext } from "../knowledge/retrieve-topic-knowledge";
import { enrichLearningVisualLessons } from "../lesson/enrich-lesson-visual-lessons";
import { enrichLessonWithMedia } from "../lesson/enrich-lesson-media";
import { buildLessonRagContext } from "../knowledge/rag/retrieve-lesson-rag";
import { isRagEnabled } from "../knowledge/rag/fetch-wikipedia-knowledge";
import { repairMalformedOuterFrac } from "../math/normalize-math-text";
import {
  addAnalysis,
  addLessonOutput,
  addLessonRequest,
  addMistakeBookEntry,
  addSubmission,
  getAnalysisById,
  getStore,
  getSubmissionById,
} from "../store";
import type {
  DashboardStats,
  HomeworkAnalysis,
  HomeworkSubmission,
  LessonOutput,
  LessonRequest,
  MistakeBookEntry,
  QuestionItem,
} from "../types";

function withQuestionIds(
  items: {
    question: string;
    answer?: string;
    difficulty?: QuestionItem["difficulty"];
  }[]
): QuestionItem[] {
  return items.map((item) => ({
    id: uuidv4(),
    question: item.question,
    answer: item.answer,
    difficulty: item.difficulty,
  }));
}

/** Thrown when real AI analysis is unavailable or fails validation */
export class HomeworkAnalysisError extends Error {
  code: "no_ai_provider" | "ai_failed" | "validation_failed";

  constructor(
    message: string,
    code: "no_ai_provider" | "ai_failed" | "validation_failed"
  ) {
    super(message);
    this.name = "HomeworkAnalysisError";
    this.code = code;
  }
}

function payloadToAnalysis(
  submissionId: string,
  payload: HomeworkAnalysisPayload
): HomeworkAnalysis {
  return applySafetyDefaults({
    id: uuidv4(),
    submissionId,
    result: payload.result,
    estimatedScore: payload.estimatedScore,
    correctSolution: payload.correctSolution,
    answerComparison: payload.answerComparison,
    mistakeTypes: payload.mistakeTypes,
    knowledgePoints: payload.knowledgePoints,
    rubricAnalysis: payload.rubricAnalysis,
    mistakeBreakdown: payload.mistakeBreakdown,
    scoreForecast: payload.scoreForecast,
    improvementTips: payload.improvementTips,
    perfectAnswerTemplate: payload.perfectAnswerTemplate,
    learningVisualLessons: payload.learningVisualLessons?.map((lesson, li) => ({
      ...lesson,
      steps: lesson.steps.map((step, si) => ({
        ...step,
        id: step.id ?? `lv-${li + 1}-s${si + 1}`,
      })),
    })),
    nextKnowledgeUnits: payload.nextKnowledgeUnits,
    feedback: payload.feedback,
    similarQuestions: withQuestionIds(payload.similarQuestions),
    remedialQuestions: withQuestionIds(payload.remedialQuestions),
    extensionQuestions: withQuestionIds(payload.extensionQuestions),
    learningPlan: payload.learningPlan,
    teacherReviewRecommended: payload.teacherReviewRecommended,
    createdAt: new Date().toISOString(),
  });
}

function payloadToLessonOutput(
  request: LessonRequest,
  payload: LessonOutputPayload,
  locale: Locale
): LessonOutput {
  const worksheet = withQuestionIds(payload.worksheet).map((q, i) => ({
    ...q,
    id: q.id || `ws-${i + 1}`,
  }));

  const teachingContent = payload.teachingContent?.map((block, i) => ({
    id: block.id ?? `tc-${i + 1}`,
    type: block.type,
    content: sanitizeLessonTextField(block.content, locale),
    latex: block.latex
      ? repairMalformedOuterFrac(sanitizeLessonTextField(block.latex, locale))
      : undefined,
  }));

  const baseVisualLessons =
    payload.learningVisualLessons?.length
      ? payload.learningVisualLessons.map((lesson, li) => ({
          ...lesson,
          steps: lesson.steps.map((step, si) => ({
            ...step,
            id: step.id ?? `lv-${li + 1}-s${si + 1}`,
          })),
        }))
      : buildDefaultLessonVisualLessons(
          request.topic,
          teachingContent,
          locale,
          request.subject,
          request.level
        );

  const visualLessons = enrichLearningVisualLessons(
    baseVisualLessons,
    request.topic,
    request.subject,
    teachingContent,
    locale,
    request.durationMinutes,
    request.level
  );

  return {
    id: uuidv4(),
    requestId: request.id,
    learningObjectives: payload.learningObjectives,
    keyConcepts: payload.keyConcepts,
    lessonPlan: payload.lessonPlan,
    workedExamples: withQuestionIds(payload.workedExamples),
    worksheet,
    answerKey: payload.answerKey.map((a, i) => ({
      ...a,
      questionId: a.questionId || worksheet[i]?.id || `ws-${i + 1}`,
    })),
    commonMisconceptions: payload.commonMisconceptions,
    revisionNotes: payload.revisionNotes,
    exitTicket: payload.exitTicket
      ? withQuestionIds(payload.exitTicket)
      : undefined,
    homework: payload.homework ? withQuestionIds(payload.homework) : undefined,
    cheatSheet: payload.cheatSheet,
    teachingContent,
    learningVisualLessons: visualLessons,
    contentSource: payload.contentSource,
    createdAt: new Date().toISOString(),
  };
}

export type AnalyzeHomeworkResult = {
  submission: HomeworkSubmission;
  analysis: HomeworkAnalysis;
  meta: { source: "ai" | "mock"; provider: string };
};

/**
 * Calls the LLM with full then compact prompts until JSON validates.
 */
async function fetchHomeworkAnalysisPayload(
  submission: HomeworkSubmission,
  locale: Locale
): Promise<HomeworkAnalysisPayload> {
  const promptBuilders = [
    () => buildHomeworkAnalysisPrompt(submission, locale),
    () => buildHomeworkAnalysisCompactPrompt(submission, locale),
  ];

  for (let attempt = 0; attempt < promptBuilders.length; attempt++) {
    const prompts = promptBuilders[attempt]();
    const raw = await completeJSON({ ...prompts, jsonMode: true });

    if (!raw.trim()) {
      console.error(
        `[EduLens] Homework analysis attempt ${attempt + 1}: empty AI response`
      );
      continue;
    }

    const parsed = parseJSONFromLLM<HomeworkAnalysisPayload>(raw);
    if (!parsed) {
      console.error(
        `[EduLens] Homework analysis attempt ${attempt + 1}: invalid JSON, head:`,
        raw.slice(0, 400)
      );
      continue;
    }

    const payload = validateHomeworkAnalysis(parsed);
    if (payload) {
      return payload;
    }

    console.error(
      `[EduLens] Homework analysis attempt ${attempt + 1}: schema validation failed`
    );
  }

  throw new HomeworkAnalysisError(
    "AI returned invalid JSON. Check provider chain and try again.",
    "ai_failed"
  );
}

/** Analyzes homework via LLM structured JSON — mock only when EDULENS_AI_MODE=mock */
export async function analyzeHomework(
  input: Omit<HomeworkSubmission, "id" | "createdAt">,
  locale: Locale = DEFAULT_LOCALE
): Promise<AnalyzeHomeworkResult> {
  const submission: HomeworkSubmission = {
    ...input,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  addSubmission(submission, locale);

  let payload: HomeworkAnalysisPayload | null = null;
  let source: "ai" | "mock" = "ai";
  const provider = getActiveProvider();

  if (isExplicitMockMode()) {
    payload = mockAnalyzeHomework(submission, locale);
    source = "mock";
  } else {
    if (!hasConfiguredAIProvider()) {
      throw new HomeworkAnalysisError(
        "No AI provider configured. Set GEMINI_API_KEY or EDULENS_AI_MODE=mock for demo.",
        "no_ai_provider"
      );
    }

    payload = await fetchHomeworkAnalysisPayload(submission, locale);
  }

  const analysis = payloadToAnalysis(submission.id, payload);
  addAnalysis(analysis, locale);
  return { submission, analysis, meta: { source, provider } };
}

/** Thrown when real AI lesson generation is unavailable or fails validation */
export class LessonGenerationError extends Error {
  code: "no_ai_provider" | "ai_failed" | "validation_failed";

  constructor(
    message: string,
    code: "no_ai_provider" | "ai_failed" | "validation_failed"
  ) {
    super(message);
    this.name = "LessonGenerationError";
    this.code = code;
  }
}

export type GenerateLessonPackResult = {
  request: LessonRequest;
  output: LessonOutput;
  meta: {
    source: "ai" | "mock";
    provider: string;
    ragEnabled?: boolean;
    ragWebUsed?: boolean;
    ragChunkCount?: number;
    syllabusRefs?: string[];
  };
};

/**
 * Calls the LLM with full then compact prompts until lesson JSON validates.
 */
async function fetchLessonPackPayload(
  request: LessonRequest,
  locale: Locale,
  ragContext?: Awaited<ReturnType<typeof buildLessonRagContext>>
): Promise<LessonOutputPayload> {
  const resolvedRag =
    ragContext ??
    (isRagEnabled()
      ? await buildLessonRagContext({
          subject: request.subject,
          level: request.level,
          topic: request.topic,
          locale,
          teacherContent: request.teacherContent,
        })
      : undefined);

  /** Multi-part (structure → teaching → assessment) then single-shot fallbacks */
  const multiPart = await fetchLessonPackMultiPart(
    request,
    locale,
    resolvedRag
  );
  if (multiPart) {
    const knowledge = buildTopicKnowledgeContext(
      request.subject,
      request.level,
      request.topic
    );
    return enrichLessonPackPayload(multiPart, request, locale, knowledge);
  }

  const promptBuilders = [
    () => buildLessonPackCompactPrompt(request, locale, resolvedRag),
    () => buildLessonPackPrompt(request, locale, resolvedRag),
  ];

  let hadAnyResponse = false;

  for (let attempt = 0; attempt < promptBuilders.length; attempt++) {
    const prompts = promptBuilders[attempt]();
    const raw = await completeJSON({ ...prompts, jsonMode: true });

    if (!raw.trim()) {
      console.error(
        `[EduLens] Lesson generation attempt ${attempt + 1}: empty AI response (all providers failed or timed out)`
      );
      continue;
    }

    hadAnyResponse = true;

    const parsed = parseJSONFromLLM<LessonOutputPayload>(raw);
    if (!parsed) {
      console.error(
        `[EduLens] Lesson generation attempt ${attempt + 1}: invalid JSON, head:`,
        raw.slice(0, 400)
      );
      continue;
    }

    const payload = validateLessonOutput(parsed);
    if (payload) {
      const knowledge = buildTopicKnowledgeContext(
        request.subject,
        request.level,
        request.topic
      );
      return enrichLessonPackPayload(payload, request, locale, knowledge);
    }

    console.error(
      `[EduLens] Lesson generation attempt ${attempt + 1}: schema validation failed`
    );
  }

  if (!hadAnyResponse) {
    throw new LessonGenerationError(
      "All AI providers failed or timed out. Try GROQ/GEMINI first in EDULENS_PROVIDER_CHAIN or increase EDULENS_AGNES_TIMEOUT_MS.",
      "ai_failed"
    );
  }

  throw new LessonGenerationError(
    "AI returned lesson JSON that failed schema validation after retries.",
    "validation_failed"
  );
}

/** Generates lesson pack via AI pipeline — mock only when EDULENS_AI_MODE=mock */
export async function generateLessonPack(
  input: Omit<LessonRequest, "id" | "createdAt">,
  locale: Locale = DEFAULT_LOCALE
): Promise<GenerateLessonPackResult> {
  let teacherContent = input.teacherContent?.trim() ?? "";

  if (input.referenceImageDataUrls?.length) {
    const extracted = await extractFromImages(input.referenceImageDataUrls, {
      locale,
      subject: input.subject,
      topic: input.topic,
      purpose: "lesson",
    });
    if (extracted.ok) {
      const parts = [
        teacherContent,
        extracted.payload.text,
        extracted.payload.formulas.map((f) => `$$${f}$$`).join("\n"),
        extracted.payload.diagramDescriptions.join("\n"),
      ].filter(Boolean);
      teacherContent = parts.join("\n\n");
    }
  }

  const request: LessonRequest = {
    ...input,
    teacherContent: teacherContent || undefined,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  addLessonRequest(request, locale);

  let payload: LessonOutputPayload | null = null;
  let source: "ai" | "mock" = "ai";
  const provider = getActiveProvider();
  let ragMeta: GenerateLessonPackResult["meta"] = { source, provider };
  let ragContext: Awaited<ReturnType<typeof buildLessonRagContext>> | undefined;

  if (isExplicitMockMode()) {
    payload = mockLessonPack(request, locale);
    source = "mock";
    ragMeta = { source, provider };
  } else {
    if (!hasConfiguredAIProvider()) {
      throw new LessonGenerationError(
        "No AI provider configured. Set GEMINI_API_KEY or EDULENS_AI_MODE=mock for demo.",
        "no_ai_provider"
      );
    }

    if (isRagEnabled()) {
      ragContext = await buildLessonRagContext({
        subject: request.subject,
        level: request.level,
        topic: request.topic,
        locale,
        teacherContent: request.teacherContent,
      });
      ragMeta = {
        source,
        provider,
        ragEnabled: true,
        ragWebUsed: ragContext.webRetrievalUsed,
        ragChunkCount: ragContext.chunks.length,
        syllabusRefs: ragContext.syllabusRefs,
      };
    }

    payload = await fetchLessonPackPayload(request, locale, ragContext);
  }

  const output = payloadToLessonOutput(request, payload, locale);
  const outputWithMedia = await enrichLessonWithMedia(
    output,
    request.subject,
    request.topic,
    locale
  );
  addLessonOutput(outputWithMedia, locale);
  return { request, output: outputWithMedia, meta: ragMeta };
}

export async function generateSimilarQuestions(
  subject: string,
  topic: string,
  count: number,
  locale: Locale = DEFAULT_LOCALE
): Promise<QuestionItem[]> {
  const prompts = buildSimilarQuestionsPrompt(subject, topic, count, locale);
  if (getActiveProvider() !== "mock") {
    const raw = await completeJSON({ ...prompts, jsonMode: true });
    const parsed = parseJSONFromLLM<{ questions: QuestionItem[] }>(raw);
    if (parsed?.questions?.length) {
      return withQuestionIds(parsed.questions);
    }
  }
  const label = locale === "zh" ? "练习" : "practice";
  const answer = locale === "zh" ? "参考答案" : "Model answer";
  return withQuestionIds(
    Array.from({ length: count }, (_, i) => ({
      question: `${topic} ${label} ${i + 1}`,
      answer,
      difficulty: "standard" as const,
    }))
  );
}

export async function extractKnowledgePoints(
  questionText: string,
  subject: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<HomeworkAnalysis["knowledgePoints"]> {
  const prompts = buildKnowledgeExtractionPrompt(questionText, subject, locale);
  if (getActiveProvider() !== "mock") {
    const raw = await completeJSON({ ...prompts, jsonMode: true });
    const parsed = parseJSONFromLLM<HomeworkAnalysis["knowledgePoints"]>(raw);
    if (parsed?.mainTopic) {
      return parsed;
    }
  }
  return {
    mainTopic: subject,
    subTopics: locale === "zh" ? ["核心技能"] : ["Core skills"],
    prerequisites: locale === "zh" ? ["基础"] : ["Foundations"],
  };
}

export async function classifyMistakeType(
  studentAnswer: string,
  feedback: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<string[]> {
  const prompts = buildMistakeClassificationPrompt(
    studentAnswer,
    feedback,
    locale
  );
  if (getActiveProvider() !== "mock") {
    const raw = await completeJSON({ ...prompts, jsonMode: true });
    const parsed = parseJSONFromLLM<{ mistakeTypes: string[] }>(raw);
    if (parsed?.mistakeTypes) {
      return parsed.mistakeTypes;
    }
  }
  return ["Procedural slip"];
}

export async function generateLearningPlan(
  mistakeTypes: string[],
  knowledgePoints: string[],
  locale: Locale = DEFAULT_LOCALE
): Promise<string[]> {
  const prompts = buildLearningPlanPrompt(
    mistakeTypes,
    knowledgePoints,
    locale
  );
  if (getActiveProvider() !== "mock") {
    const raw = await completeJSON({ ...prompts, jsonMode: true });
    const parsed = parseJSONFromLLM<{ learningPlan: string[] }>(raw);
    if (parsed?.learningPlan?.length) {
      return parsed.learningPlan;
    }
  }
  return locale === "zh"
    ? [
        "复习本主题的课堂笔记。",
        "重做该题并写全步骤。",
        "完成 3 道相似练习题。",
      ]
    : [
        "Review class notes on this topic.",
        "Redo the question with full working.",
        "Complete 3 similar practice questions.",
      ];
}

export function saveMistakeBookEntry(
  analysisId: string,
  locale: Locale = DEFAULT_LOCALE
): MistakeBookEntry | null {
  const analysis = getAnalysisById(analysisId, locale);
  if (!analysis) {
    return null;
  }
  const submission = getSubmissionById(analysis.submissionId, locale);
  const entry: MistakeBookEntry = {
    id: uuidv4(),
    analysisId: analysis.id,
    submissionId: analysis.submissionId,
    subject: submission?.subject ?? "General",
    level: submission?.level ?? "Sec 4",
    topic: submission?.topic ?? analysis.knowledgePoints.mainTopic,
    mistakeTypes: analysis.mistakeTypes,
    knowledgePoints: [
      analysis.knowledgePoints.mainTopic,
      ...analysis.knowledgePoints.subTopics,
    ],
    summary: analysis.feedback.slice(0, 160),
    savedAt: new Date().toISOString(),
  };
  addMistakeBookEntry(entry, locale);
  return entry;
}

export function getDashboardStats(locale: Locale = DEFAULT_LOCALE): DashboardStats {
  const store = getStore(locale);
  const homeworkLabel = locale === "zh" ? "作业分析" : "Homework analysis";
  const lessonLabel = locale === "zh" ? "教案包" : "Lesson pack";
  const generalLabel = locale === "zh" ? "通用" : "General";

  const recentActivity = [
    ...store.analyses.slice(0, 5).map((a) => {
      const sub = store.submissions.find((s) => s.id === a.submissionId);
      return {
        id: a.id,
        type: "homework" as const,
        title: sub?.topic ?? sub?.subject ?? homeworkLabel,
        subject: sub?.subject ?? generalLabel,
        createdAt: a.createdAt,
      };
    }),
    ...store.lessonOutputs.slice(0, 3).map((o) => {
      const req = store.lessonRequests.find((r) => r.id === o.requestId);
      return {
        id: o.id,
        type: "lesson" as const,
        title: req?.topic ?? lessonLabel,
        subject: req?.subject ?? generalLabel,
        createdAt: o.createdAt,
      };
    }),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  const topicMap = new Map<string, { subject: string; count: number }>();
  for (const entry of store.mistakeBook) {
    const key = entry.topic;
    const existing = topicMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      topicMap.set(key, { subject: entry.subject, count: 1 });
    }
  }
  const totalMistakes = store.mistakeBook.length || 1;
  const topicWeakness = [...topicMap.entries()]
    .map(([topic, { subject, count }]) => ({
      topic,
      subject,
      count,
      percentage: Math.round((count / totalMistakes) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    totalAnalyses: store.analyses.length,
    totalLessons: store.lessonOutputs.length,
    mistakeBookCount: store.mistakeBook.length,
    recentActivity,
    topicWeakness,
  };
}

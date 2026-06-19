import { z } from "zod";
import type { HomeworkAnalysis, LessonOutput } from "../types";
import { normalizeHomeworkAnalysisRaw } from "./homework-normalizer";
import { normalizeLessonOutputRaw } from "./lesson-normalizer";

const questionItemSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  answer: z.string().optional(),
  difficulty: z.enum(["basic", "standard", "challenge"]).optional(),
  knowledgePoints: z.array(z.string()).optional(),
});

const learningVisualLessonSchema = z.object({
  title: z.string(),
  knowledgeGap: z.string(),
  steps: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      body: z.string(),
      latex: z.string().optional(),
      highlightVars: z.array(z.string()).optional(),
      visualType: z
        .enum([
          "integral_area",
          "parabola_graph",
          "equation_balance",
          "factor_pairs",
          "number_line",
          "formula_spotlight",
          "mistake_compare",
          "chemistry_reaction",
          "concept_process",
          "concept_map",
          "writing_structure",
          "physics_spacetime",
          "generic",
        ])
        .optional(),
    })
  ),
  summary: z.string(),
});

const homeworkAnalysisSchema = z.object({
  result: z.enum(["correct", "partially_correct", "incorrect", "uncertain"]),
  estimatedScore: z
    .object({
      score: z.number(),
      maxScore: z.number(),
      confidence: z.enum(["low", "medium", "high"]),
    })
    .optional(),
  correctSolution: z.string(),
  answerComparison: z
    .object({
      questionRecap: z.string(),
      studentAnswerRecap: z.string(),
      modelAnswer: z.string(),
      keyDifferences: z.array(z.string()).default([]),
    })
    .optional(),
  mistakeTypes: z.array(z.string()).default([]),
  knowledgePoints: z.object({
    mainTopic: z.string(),
    subTopics: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
  }),
  rubricAnalysis: z
    .array(
      z.object({
        point: z.string(),
        maxMarks: z.number().optional(),
        earnedMarks: z.number().optional(),
        status: z.enum(["present", "partial", "missing", "uncertain"]),
        confidence: z.number(),
        explanation: z.string(),
        standardAnswer: z.string().optional(),
        improvementSuggestion: z.string().optional(),
      })
    )
    .default([]),
  mistakeBreakdown: z
    .array(
      z.object({
        category: z.string(),
        percentage: z.number(),
        questionCount: z.number(),
        lostMarks: z.number(),
        recoverableMarks: z.number(),
        priority: z.enum(["high", "medium", "low"]),
        actionPlan: z.array(z.string()).default([]),
      })
    )
    .optional(),
  scoreForecast: z
    .object({
      currentScore: z.number(),
      maxScore: z.number(),
      conservativeGain: z.number(),
      sprintGain: z.number(),
      nextTestMin: z.number(),
      nextTestMax: z.number(),
      recoverablePercentage: z.number(),
      executionDifficulty: z.enum(["low", "medium", "high"]),
    })
    .optional(),
  improvementTips: z.array(z.string()).optional(),
  perfectAnswerTemplate: z.string().optional(),
  learningVisualLessons: z.array(learningVisualLessonSchema).optional(),
  nextKnowledgeUnits: z
    .array(
      z.object({
        topic: z.string(),
        whyNeeded: z.string(),
        keyIdeas: z.array(z.string()).default([]),
        formulas: z.array(z.string()).default([]),
        studySteps: z.array(z.string()).default([]),
      })
    )
    .optional(),
  feedback: z.string(),
  similarQuestions: z.array(questionItemSchema).default([]),
  remedialQuestions: z.array(questionItemSchema).default([]),
  extensionQuestions: z.array(questionItemSchema).default([]),
  learningPlan: z.array(z.string()).default([]),
  teacherReviewRecommended: z.boolean().default(true),
});

const lessonOutputSchema = z.object({
  learningObjectives: z.array(z.string()),
  keyConcepts: z.array(z.string()),
  lessonPlan: z.array(
    z.object({
      phase: z.string(),
      durationMinutes: z.number(),
      activities: z.array(z.string()),
      teacherNotes: z.string().optional(),
      teacherScript: z.string().optional(),
    })
  ),
  workedExamples: z.array(questionItemSchema).default([]),
  worksheet: z.array(questionItemSchema).default([]),
  answerKey: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
        working: z.string().optional(),
      })
    )
    .default([]),
  commonMisconceptions: z.array(z.string()).default([]),
  revisionNotes: z.string(),
  exitTicket: z.array(questionItemSchema).optional(),
  homework: z.array(questionItemSchema).optional(),
  cheatSheet: z.string().optional(),
  teachingContent: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.enum(["text", "formula", "diagram", "table"]),
        content: z.string(),
        latex: z.string().optional(),
      })
    )
    .optional(),
  contentSource: z.enum(["teacher_input", "ai_generated", "mixed"]).optional(),
  learningVisualLessons: z.array(learningVisualLessonSchema).optional(),
});

export type HomeworkAnalysisPayload = z.infer<typeof homeworkAnalysisSchema>;
export type LessonOutputPayload = z.infer<typeof lessonOutputSchema>;

export function validateHomeworkAnalysis(
  data: unknown
): HomeworkAnalysisPayload | null {
  const normalized = normalizeHomeworkAnalysisRaw(data);
  const parsed = homeworkAnalysisSchema.safeParse(normalized);
  if (!parsed.success && process.env.NODE_ENV === "development") {
    console.error(
      "[EduLens] Homework validation errors:",
      parsed.error.flatten()
    );
  }
  return parsed.success ? parsed.data : null;
}

export function validateLessonOutput(data: unknown): LessonOutputPayload | null {
  const normalized = normalizeLessonOutputRaw(data);
  const parsed = lessonOutputSchema.safeParse(normalized);
  if (!parsed.success && process.env.NODE_ENV === "development") {
    console.error(
      "[EduLens] Lesson validation errors:",
      parsed.error.flatten()
    );
  }
  return parsed.success ? parsed.data : null;
}

/** Ensures open-ended answers trigger teacher review when score confidence is low */
export function applySafetyDefaults(
  analysis: HomeworkAnalysis
): HomeworkAnalysis {
  const lowConfidence =
    analysis.estimatedScore?.confidence === "low" ||
    analysis.result === "uncertain";
  if (lowConfidence) {
    return { ...analysis, teacherReviewRecommended: true };
  }
  return analysis;
}

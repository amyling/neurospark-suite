/**
 * Coerces LLM homework JSON into shapes the Zod schema accepts.
 */
function coerceNumber(value: unknown, fallback?: number): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

const RESULT_VALUES = new Set([
  "correct",
  "partially_correct",
  "incorrect",
  "uncertain",
]);

const STATUS_VALUES = new Set(["present", "partial", "missing", "uncertain"]);
const PRIORITY_VALUES = new Set(["high", "medium", "low"]);
const CONFIDENCE_VALUES = new Set(["low", "medium", "high"]);
const DIFFICULTY_VALUES = new Set(["basic", "standard", "challenge"]);

/**
 * Normalizes raw LLM homework analysis before schema validation.
 */
export function normalizeHomeworkAnalysisRaw(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  const raw = data as Record<string, unknown>;
  const out: Record<string, unknown> = { ...raw };

  if (typeof out.result === "string" && !RESULT_VALUES.has(out.result)) {
    const lower = out.result.toLowerCase();
    if (lower.includes("partial")) {
      out.result = "partially_correct";
    } else if (lower.includes("incorrect") || lower.includes("wrong")) {
      out.result = "incorrect";
    } else if (lower.includes("correct")) {
      out.result = "correct";
    } else {
      out.result = "uncertain";
    }
  }

  if (out.estimatedScore && typeof out.estimatedScore === "object") {
    const score = out.estimatedScore as Record<string, unknown>;
    out.estimatedScore = {
      score: coerceNumber(score.score, 0) ?? 0,
      maxScore: coerceNumber(score.maxScore, 10) ?? 10,
      confidence: CONFIDENCE_VALUES.has(String(score.confidence))
        ? score.confidence
        : "medium",
    };
  }

  if (Array.isArray(out.rubricAnalysis)) {
    out.rubricAnalysis = out.rubricAnalysis
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const row = item as Record<string, unknown>;
        const confidence = coerceNumber(row.confidence, 0.7) ?? 0.7;
        return {
          ...row,
          maxMarks: coerceNumber(row.maxMarks),
          earnedMarks: coerceNumber(row.earnedMarks),
          confidence: Math.min(1, Math.max(0, confidence)),
          status: STATUS_VALUES.has(String(row.status))
            ? row.status
            : "uncertain",
        };
      });
  }

  if (Array.isArray(out.mistakeBreakdown)) {
    out.mistakeBreakdown = out.mistakeBreakdown
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const row = item as Record<string, unknown>;
        return {
          ...row,
          percentage: coerceNumber(row.percentage, 0) ?? 0,
          questionCount: coerceNumber(row.questionCount, 1) ?? 1,
          lostMarks: coerceNumber(row.lostMarks, 0) ?? 0,
          recoverableMarks: coerceNumber(row.recoverableMarks, 0) ?? 0,
          priority: PRIORITY_VALUES.has(String(row.priority))
            ? row.priority
            : "medium",
          actionPlan: Array.isArray(row.actionPlan)
            ? row.actionPlan.filter((s) => typeof s === "string")
            : [],
        };
      });
  }

  if (Array.isArray(out.learningVisualLessons)) {
    out.learningVisualLessons = out.learningVisualLessons
      .filter((lesson) => lesson && typeof lesson === "object")
      .map((lesson) => {
        const row = lesson as Record<string, unknown>;
        const steps = Array.isArray(row.steps)
          ? row.steps
              .filter(
                (step) =>
                  step &&
                  typeof step === "object" &&
                  typeof (step as Record<string, unknown>).title === "string" &&
                  typeof (step as Record<string, unknown>).body === "string"
              )
              .map((step) => {
                const s = step as Record<string, unknown>;
                return {
                  ...s,
                  highlightVars: Array.isArray(s.highlightVars)
                    ? s.highlightVars.filter((v) => typeof v === "string")
                    : undefined,
                };
              })
          : [];
        return {
          title: String(row.title ?? "Review"),
          knowledgeGap: String(row.knowledgeGap ?? ""),
          steps,
          summary: String(row.summary ?? ""),
        };
      })
      .filter((lesson) => lesson.steps.length > 0);
  }

  if (Array.isArray(out.nextKnowledgeUnits)) {
    out.nextKnowledgeUnits = out.nextKnowledgeUnits
      .filter((unit) => unit && typeof unit === "object")
      .map((unit) => {
        const row = unit as Record<string, unknown>;
        return {
          topic: String(row.topic ?? "Next topic"),
          whyNeeded: String(row.whyNeeded ?? ""),
          keyIdeas: Array.isArray(row.keyIdeas)
            ? row.keyIdeas.filter((s) => typeof s === "string")
            : [],
          formulas: Array.isArray(row.formulas)
            ? row.formulas.filter((s) => typeof s === "string")
            : [],
          studySteps: Array.isArray(row.studySteps)
            ? row.studySteps.filter((s) => typeof s === "string")
            : [],
        };
      });
  }

  const normalizeQuestions = (items: unknown) =>
    Array.isArray(items)
      ? items
          .filter((item) => item && typeof item === "object")
          .map((item) => {
            const row = item as Record<string, unknown>;
            return {
              ...row,
              question: String(row.question ?? ""),
              difficulty:
                row.difficulty &&
                DIFFICULTY_VALUES.has(String(row.difficulty))
                  ? row.difficulty
                  : undefined,
            };
          })
          .filter((item) => item.question.length > 0)
      : [];

  out.similarQuestions = normalizeQuestions(out.similarQuestions);
  out.remedialQuestions = normalizeQuestions(out.remedialQuestions);
  out.extensionQuestions = normalizeQuestions(out.extensionQuestions);

  if (typeof out.teacherReviewRecommended === "string") {
    out.teacherReviewRecommended = out.teacherReviewRecommended !== "false";
  }

  if (out.knowledgePoints && typeof out.knowledgePoints === "object") {
    const kp = out.knowledgePoints as Record<string, unknown>;
    out.knowledgePoints = {
      mainTopic: String(kp.mainTopic ?? "General"),
      subTopics: Array.isArray(kp.subTopics)
        ? kp.subTopics.filter((s) => typeof s === "string")
        : [],
      prerequisites: Array.isArray(kp.prerequisites)
        ? kp.prerequisites.filter((s) => typeof s === "string")
        : [],
    };
  }

  return out;
}

import { repairMalformedOuterFrac } from "../math/normalize-math-text";

const DIFFICULTY_VALUES = new Set(["basic", "standard", "challenge"]);
const CONTENT_SOURCE_VALUES = new Set([
  "teacher_input",
  "ai_generated",
  "mixed",
]);
const VISUAL_TYPES = new Set([
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
]);
const TEACHING_BLOCK_TYPES = new Set(["text", "formula", "diagram", "table"]);

/**
 * Coerces unknown values to a finite number.
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

/**
 * Wraps lesson-like objects (single item) or arrays.
 */
function coerceLessonArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("steps" in obj || "title" in obj || "phase" in obj) {
      return [obj];
    }
    return Object.values(obj);
  }
  if (typeof value === "string" && value.trim()) {
    return [value];
  }
  return [];
}

/**
 * Wraps a single value or object map into an array.
 */
function coerceArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const values = Object.values(obj);
    if (values.length > 0) {
      return values;
    }
  }
  if (typeof value === "string" && value.trim()) {
    return [value];
  }
  return [];
}

/**
 * Coerces string arrays from strings or mixed arrays.
 */
function coerceStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }
        if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          return String(
            row.text ?? row.content ?? row.label ?? row.name ?? ""
          ).trim();
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

/**
 * Normalizes LLM question items (worksheet, exit ticket, etc.).
 */
function normalizeQuestionItems(items: unknown) {
  return coerceArray(items)
    .filter((item) => item !== null && item !== undefined)
    .map((item) => {
      if (typeof item === "string") {
        return { question: item.trim() };
      }
      if (!item || typeof item !== "object") {
        return null;
      }
      const row = item as Record<string, unknown>;
      const question = String(
        row.question ??
          row.prompt ??
          row.text ??
          row.problem ??
          row.title ??
          row.content ??
          ""
      ).trim();
      if (!question) {
        return null;
      }
      return {
        ...row,
        question,
        answer:
          row.answer !== undefined ? String(row.answer) : row.answer,
        difficulty:
          row.difficulty &&
          DIFFICULTY_VALUES.has(String(row.difficulty))
            ? row.difficulty
            : undefined,
      };
    })
    .filter(Boolean);
}

/**
 * Normalizes answer key entries from arrays or keyed objects.
 */
function normalizeAnswerKey(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item && typeof item === "object")
      .map((item, index) => {
        const row = item as Record<string, unknown>;
        return {
          questionId: String(row.questionId ?? row.id ?? `ws-${index + 1}`),
          answer: String(row.answer ?? row.solution ?? row.value ?? ""),
          working:
            row.working !== undefined
              ? String(row.working)
              : row.working,
        };
      })
      .filter((item) => item.answer.length > 0);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(
      ([key, answer]) => ({
        questionId: key,
        answer: String(answer ?? ""),
      })
    );
  }

  return [];
}

/**
 * Normalizes lesson plan phases from arrays or keyed objects.
 */
function normalizeLessonPlan(value: unknown) {
  return coerceLessonArray(value)
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const row = item as Record<string, unknown>;
      const activities = coerceStringArray(
        row.activities ?? row.activity ?? row.tasks
      );
      return {
        phase: String(row.phase ?? row.name ?? row.title ?? `Phase ${index + 1}`),
        durationMinutes:
          coerceNumber(row.durationMinutes ?? row.duration ?? row.minutes, 10) ??
          10,
        activities: activities.length ? activities : ["Class activity"],
        teacherNotes:
          row.teacherNotes !== undefined
            ? String(row.teacherNotes)
            : undefined,
        teacherScript:
          row.teacherScript !== undefined
            ? String(row.teacherScript)
            : undefined,
      };
    });
}

/**
 * Normalizes multimodal teaching content blocks.
 */
function normalizeTeachingContent(value: unknown) {
  return coerceArray(value)
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const row = item as Record<string, unknown>;
      const rawType = String(row.type ?? "text").toLowerCase();
      const type = TEACHING_BLOCK_TYPES.has(rawType) ? rawType : "text";
      return {
        id: row.id !== undefined ? String(row.id) : `tc-${index + 1}`,
        type,
        content: String(row.content ?? row.text ?? row.caption ?? ""),
        latex:
          row.latex !== undefined
            ? repairMalformedOuterFrac(String(row.latex))
            : undefined,
      };
    })
    .filter((item) => item.content.length > 0);
}

/**
 * Normalizes animated micro-lesson steps when the model returns strings.
 */
function normalizeLearningVisualLessons(value: unknown) {
  return coerceLessonArray(value)
    .filter((lesson) => lesson && typeof lesson === "object")
    .map((lesson) => {
      const row = lesson as Record<string, unknown>;
      const steps = coerceArray(row.steps)
        .map((step, index) => {
          if (typeof step === "string" && step.trim()) {
            return {
              title: `Step ${index + 1}`,
              body: step.trim(),
              visualType: "generic",
            };
          }
          if (!step || typeof step !== "object") {
            return null;
          }
          const s = step as Record<string, unknown>;
          const title = String(
            s.title ??
              s.name ??
              s.stepTitle ??
              s.step_title ??
              `Step ${index + 1}`
          ).trim();
          const body = String(
            s.body ??
              s.content ??
              s.text ??
              s.description ??
              s.explanation ??
              s.step ??
              ""
          ).trim();
          if (!title || !body) {
            return null;
          }
          const visualType = VISUAL_TYPES.has(String(s.visualType))
            ? s.visualType
            : "generic";
          return {
            title,
            body,
            visualType,
            latex: s.latex !== undefined ? repairMalformedOuterFrac(String(s.latex)) : undefined,
            highlightVars: Array.isArray(s.highlightVars)
              ? s.highlightVars.filter((v) => typeof v === "string")
              : undefined,
          };
        })
        .filter(Boolean);

      const title = String(row.title ?? row.name ?? "Lesson walkthrough").trim();
      const knowledgeGap = String(
        row.knowledgeGap ?? row.gap ?? row.knowledge_gap ?? ""
      ).trim();
      const summary = String(row.summary ?? row.conclusion ?? "").trim();

      return {
        title: title || "Lesson walkthrough",
        knowledgeGap: knowledgeGap || "Core concept review",
        steps,
        summary: summary || "Review the key steps from this lesson.",
      };
    })
    .filter((lesson) => lesson.steps.length > 0);
}

/**
 * Normalizes contentSource enum variants from LLM output.
 */
function normalizeContentSource(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const lower = value.toLowerCase().replace(/\s+/g, "_");
  if (CONTENT_SOURCE_VALUES.has(lower)) {
    return lower;
  }
  if (lower.includes("teacher") && lower.includes("ai")) {
    return "mixed";
  }
  if (lower.includes("teacher")) {
    return "teacher_input";
  }
  if (lower.includes("ai") || lower.includes("generated")) {
    return "ai_generated";
  }
  return undefined;
}

/**
 * Coerces revision notes from strings or bullet arrays.
 */
function normalizeRevisionNotes(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  const bullets = coerceStringArray(value);
  if (bullets.length) {
    return bullets.join("\n");
  }
  return "Review key concepts and practice similar problems.";
}

/**
 * Coerces raw LLM lesson JSON into shapes the Zod schema accepts.
 */
export function normalizeLessonOutputRaw(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  const raw = data as Record<string, unknown>;
  const out: Record<string, unknown> = { ...raw };

  out.learningObjectives = coerceStringArray(
    out.learningObjectives ?? out.objectives ?? out.learning_goals
  );
  out.keyConcepts = coerceStringArray(
    out.keyConcepts ?? out.key_concepts ?? out.concepts
  );
  out.lessonPlan = normalizeLessonPlan(
    out.lessonPlan ?? out.lesson_plan ?? out.phases
  );
  out.workedExamples = normalizeQuestionItems(
    out.workedExamples ?? out.worked_examples ?? out.examples
  );
  out.worksheet = normalizeQuestionItems(
    out.worksheet ?? out.worksheetQuestions ?? out.questions
  );
  out.answerKey = normalizeAnswerKey(out.answerKey ?? out.answer_key);
  out.commonMisconceptions = coerceStringArray(
    out.commonMisconceptions ?? out.misconceptions ?? out.common_misconceptions
  );
  out.revisionNotes = normalizeRevisionNotes(
    out.revisionNotes ?? out.revision_notes
  );

  const exitTicket = normalizeQuestionItems(
    out.exitTicket ?? out.exit_ticket
  );
  if (exitTicket.length) {
    out.exitTicket = exitTicket;
  }

  const homework = normalizeQuestionItems(out.homework);
  if (homework.length) {
    out.homework = homework;
  }

  if (out.cheatSheet !== undefined) {
    out.cheatSheet = String(out.cheatSheet);
  }

  const teachingContent = normalizeTeachingContent(
    out.teachingContent ?? out.teaching_content
  );
  if (teachingContent.length) {
    out.teachingContent = teachingContent;
  }

  const visualLessons = normalizeLearningVisualLessons(
    out.learningVisualLessons ?? out.learning_visual_lessons
  );
  if (visualLessons.length) {
    out.learningVisualLessons = visualLessons;
  } else {
    delete out.learningVisualLessons;
  }
  delete out.learning_visual_lessons;

  const contentSource = normalizeContentSource(
    out.contentSource ?? out.content_source
  );
  if (contentSource) {
    out.contentSource = contentSource;
  } else {
    delete out.contentSource;
  }
  delete out.content_source;

  return out;
}

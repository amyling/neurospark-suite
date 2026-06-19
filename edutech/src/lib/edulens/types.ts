/** Core EduLens domain types */

export type RubricPoint = {
  point: string;
  maxMarks: number;
};

/** Per-scoring-point breakdown from marking rubric */
export type RubricPointAnalysis = {
  point: string;
  maxMarks?: number;
  earnedMarks?: number;
  status: "present" | "partial" | "missing" | "uncertain";
  confidence: number;
  explanation: string;
  standardAnswer?: string;
  improvementSuggestion?: string;
};

/** Error category with recoverable marks and action plan */
export type MistakeCategoryBreakdown = {
  category: string;
  percentage: number;
  questionCount: number;
  lostMarks: number;
  recoverableMarks: number;
  priority: "high" | "medium" | "low";
  actionPlan: string[];
};

/** Predicted score improvement range */
export type ScoreForecast = {
  currentScore: number;
  maxScore: number;
  conservativeGain: number;
  sprintGain: number;
  nextTestMin: number;
  nextTestMax: number;
  recoverablePercentage: number;
  executionDifficulty: "low" | "medium" | "high";
};

export type QuestionItem = {
  id: string;
  question: string;
  answer?: string;
  difficulty?: "basic" | "standard" | "challenge";
  knowledgePoints?: string[];
};

export type AnswerItem = {
  questionId: string;
  answer: string;
  working?: string;
};

export type LessonPhase = {
  phase: string;
  durationMinutes: number;
  activities: string[];
  teacherNotes?: string;
  /** Verbatim teacher talk / board script for this phase */
  teacherScript?: string;
};

/** Multimodal teaching block (text, formula, diagram, table) */
export type RichContentBlock = {
  id: string;
  type: "text" | "formula" | "diagram" | "table";
  content: string;
  /** LaTeX when type is formula */
  latex?: string;
  /** Agnes-generated or uploaded diagram image URL */
  imageUrl?: string;
  /** Optional short animation clip for diagram blocks */
  videoUrl?: string;
};

/** Animation scene for a micro-lesson step */
export type LessonVisualType =
  | "integral_area"
  | "parabola_graph"
  | "equation_balance"
  | "factor_pairs"
  | "number_line"
  | "formula_spotlight"
  | "mistake_compare"
  | "chemistry_reaction"
  | "concept_process"
  | "concept_map"
  | "writing_structure"
  | "physics_spacetime"
  | "generic";

/** One step in an animated micro-lesson */
export type LearningVisualStep = {
  id?: string;
  title: string;
  body: string;
  latex?: string;
  highlightVars?: string[];
  /** Drives the teaching animation panel */
  visualType?: LessonVisualType;
  /** Agnes-generated illustration for this step */
  imageUrl?: string;
  /** Agnes-generated short animation (step 0 when enabled) */
  videoUrl?: string;
};

/** Animated step-by-step explanation for a knowledge gap */
export type LearningVisualLesson = {
  title: string;
  knowledgeGap: string;
  steps: LearningVisualStep[];
  summary: string;
};

/** Next topics/concepts to study when the answer was wrong */
export type NextKnowledgeUnit = {
  topic: string;
  whyNeeded: string;
  keyIdeas: string[];
  formulas: string[];
  studySteps: string[];
};

/** LLM structured comparison of student work vs model solution */
export type AnswerComparison = {
  questionRecap: string;
  studentAnswerRecap: string;
  modelAnswer: string;
  keyDifferences: string[];
};

export type HomeworkSubmission = {
  id: string;
  subject: string;
  level: string;
  topic?: string;
  questionText: string;
  studentAnswer: string;
  standardAnswer?: string;
  rubric?: RubricPoint[];
  imageUrls?: string[];
  createdAt: string;
};

export type HomeworkAnalysis = {
  id: string;
  submissionId: string;
  result: "correct" | "partially_correct" | "incorrect" | "uncertain";
  estimatedScore?: {
    score: number;
    maxScore: number;
    confidence: "low" | "medium" | "high";
  };
  correctSolution: string;
  /** Structured side-by-side comparison from the marking model */
  answerComparison?: AnswerComparison;
  mistakeTypes: string[];
  knowledgePoints: {
    mainTopic: string;
    subTopics: string[];
    prerequisites: string[];
  };
  rubricAnalysis: RubricPointAnalysis[];
  /** Categorized mistake breakdown with recovery potential */
  mistakeBreakdown?: MistakeCategoryBreakdown[];
  /** Predicted score improvement after targeted practice */
  scoreForecast?: ScoreForecast;
  /** High-level score-boosting tips */
  improvementTips?: string[];
  /** Model answer showing full marks structure */
  perfectAnswerTemplate?: string;
  /** Step-by-step animated explanations for knowledge gaps */
  learningVisualLessons?: LearningVisualLesson[];
  /** What to learn next when incorrect */
  nextKnowledgeUnits?: NextKnowledgeUnit[];
  feedback: string;
  similarQuestions: QuestionItem[];
  remedialQuestions: QuestionItem[];
  extensionQuestions: QuestionItem[];
  learningPlan: string[];
  teacherReviewRecommended: boolean;
  createdAt: string;
};

export type LessonRequest = {
  id: string;
  userMode: "teacher" | "student";
  subject: string;
  level: string;
  topic: string;
  classProfile?: string;
  durationMinutes: number;
  difficulty: "basic" | "standard" | "challenge" | "mixed";
  outputTypes: string[];
  /** Teacher-provided syllabus, notes, or lesson brief (optional) */
  teacherContent?: string;
  /** Lesson goals beyond topic title (optional) */
  learningGoals?: string;
  /** Base64 data URLs from uploaded textbook slides / worksheets */
  referenceImageDataUrls?: string[];
  createdAt: string;
};

export type LessonOutput = {
  id: string;
  requestId: string;
  learningObjectives: string[];
  keyConcepts: string[];
  lessonPlan: LessonPhase[];
  workedExamples: QuestionItem[];
  worksheet: QuestionItem[];
  answerKey: AnswerItem[];
  commonMisconceptions: string[];
  revisionNotes: string;
  exitTicket?: QuestionItem[];
  homework?: QuestionItem[];
  cheatSheet?: string;
  /** Detailed multimodal lesson body */
  teachingContent?: RichContentBlock[];
  /** Animated step-by-step teaching scenes */
  learningVisualLessons?: LearningVisualLesson[];
  /** How content was sourced */
  contentSource?: "teacher_input" | "ai_generated" | "mixed";
  createdAt: string;
};

export type MultimodalExtractResult = {
  text: string;
  formulas: string[];
  diagramDescriptions: string[];
  tables: string[];
  provider: string;
  visionUsed: boolean;
  confidence: "low" | "medium" | "high";
  /** Populated when extractRole is combined */
  questionText?: string;
  studentAnswer?: string;
};

export type MistakeBookEntry = {
  id: string;
  analysisId: string;
  submissionId: string;
  subject: string;
  level: string;
  topic: string;
  mistakeTypes: string[];
  knowledgePoints: string[];
  summary: string;
  savedAt: string;
};

export type DashboardStats = {
  totalAnalyses: number;
  totalLessons: number;
  mistakeBookCount: number;
  recentActivity: {
    id: string;
    type: "homework" | "lesson";
    title: string;
    subject: string;
    createdAt: string;
  }[];
  topicWeakness: {
    topic: string;
    subject: string;
    count: number;
    percentage: number;
  }[];
};

export type EduLensStore = {
  submissions: HomeworkSubmission[];
  analyses: HomeworkAnalysis[];
  lessonRequests: LessonRequest[];
  lessonOutputs: LessonOutput[];
  mistakeBook: MistakeBookEntry[];
};

import type { LessonVisualType } from "../types";

/** Singapore syllabus level band for retrieval */
export type SyllabusLevelBand = "primary" | "sec_lower" | "sec_upper" | "jc";

/** Curated topic entry aligned to MOE/SEAB syllabi */
export type SyllabusTopicEntry = {
  id: string;
  subject: string;
  levelBands: SyllabusLevelBand[];
  matchKeywords: string[];
  syllabusRef: string;
  section: string;
  keyConcepts: string[];
  formulas: string[];
  diagramCaptions: string[];
  /** Suggested visualType values for micro-lesson steps (topic-dependent, not one default) */
  visualTypes: LessonVisualType[];
  /** Maps step text hints to a visualType (patterns are case-insensitive regex strings) */
  stepVisualHints: { pattern: string; visualType: LessonVisualType }[];
  misconceptions?: string[];
  sources?: string[];
};

/** Result of matching a lesson topic against the knowledge base */
export type TopicKnowledgeMatch = {
  entry: SyllabusTopicEntry;
  score: number;
};

/** Context injected into lesson prompts and post-processing */
export type TopicKnowledgeContext = {
  matches: TopicKnowledgeMatch[];
  promptBlock: string;
  allowedVisualTypes: LessonVisualType[];
  syllabusRefs: string[];
};

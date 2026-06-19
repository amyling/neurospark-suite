import type { LessonVisualType } from "../../types";
import type { TopicKnowledgeContext, TopicKnowledgeMatch } from "../types";

/** Source of a retrieved knowledge chunk for RAG */
export type RagChunkSource = "syllabus" | "wikipedia" | "web";

/** One retrieved passage injected into the lesson prompt */
export type RagChunk = {
  id: string;
  source: RagChunkSource;
  title: string;
  content: string;
  score: number;
  url?: string;
};

/** Full RAG context: syllabus alignment + optional web retrieval */
export type LessonRagContext = TopicKnowledgeContext & {
  chunks: RagChunk[];
  /** Combined prompt block (syllabus + retrieved passages) */
  ragPromptBlock: string;
  webRetrievalUsed: boolean;
};

/** Params for lesson RAG retrieval */
export type LessonRagQuery = {
  subject: string;
  level: string;
  topic: string;
  locale: "en" | "zh";
  teacherContent?: string;
};

export type { TopicKnowledgeMatch, LessonVisualType };

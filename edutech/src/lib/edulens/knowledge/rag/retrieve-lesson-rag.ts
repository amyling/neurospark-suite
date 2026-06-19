import type { Locale } from "@/lib/i18n/types";
import { retrievePdfSyllabusChunks } from "../retrieve-pdf-chunks";
import {
  buildTopicKnowledgeContext,
  suggestVisualTypeFromKnowledge,
} from "../retrieve-topic-knowledge";
import type { TopicKnowledgeContext } from "../types";
import { fetchWikipediaChunks, isRagWebEnabled } from "./fetch-wikipedia-knowledge";
import type { LessonRagContext, LessonRagQuery, RagChunk } from "./types";

const MAX_RAG_CHARS = 3_200;

/**
 * Converts syllabus matches into high-priority RAG chunks.
 */
function syllabusToChunks(context: TopicKnowledgeContext): RagChunk[] {
  return context.matches.map(({ entry, score }, index) => ({
    id: `syllabus-${entry.id}`,
    source: "syllabus",
    title: entry.syllabusRef,
    content: [
      `Section: ${entry.section}`,
      `Key concepts: ${entry.keyConcepts.join("; ")}`,
      entry.formulas.length ? `Formulas: ${entry.formulas.join("; ")}` : "",
      `Diagram ideas: ${entry.diagramCaptions.join("; ")}`,
      entry.misconceptions?.length
        ? `Misconceptions: ${entry.misconceptions.join("; ")}`
        : "",
      `Suggested visuals: ${entry.visualTypes.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
    score: 100 + score - index,
  }));
}

/**
 * Formats ranked RAG chunks into a prompt block with citation labels.
 */
function formatRagPromptBlock(
  query: LessonRagQuery,
  chunks: RagChunk[],
  syllabus: TopicKnowledgeContext
): string {
  const ranked = [...chunks].sort((a, b) => b.score - a.score);
  let budget = MAX_RAG_CHARS;
  const selected: RagChunk[] = [];

  for (const chunk of ranked) {
    const size = chunk.content.length + chunk.title.length;
    if (size > budget && selected.length >= 2) {
      continue;
    }
    selected.push(chunk);
    budget -= size;
    if (budget <= 0 && selected.length >= 3) {
      break;
    }
  }

  const passageBlock = selected.length
    ? selected
        .map(
          (chunk, i) =>
            `[${i + 1}] (${chunk.source}) ${chunk.title}\n${chunk.content}${
              chunk.url ? `\nSource: ${chunk.url}` : ""
            }`
        )
        .join("\n\n")
    : "(No external passages retrieved — use syllabus rules and teacher content only.)";

  const visualList = syllabus.allowedVisualTypes.join(" | ");

  return `RAG RETRIEVAL (offline-first) — ground the lesson in these references:
Priority: [syllabus] curated entries + MOE PDF excerpts > [wikipedia] (only if live web enabled).
Subject: ${query.subject} | Level: ${query.level} | Topic: ${query.topic}

--- Retrieved passages ---
${passageBlock}

--- Allowed animation visualTypes ---
${visualList}

--- Generation rules ---
1. Ground learningObjectives, teachingContent, and worksheet in the passages above — NOT generic filler.
2. If [wikipedia] conflicts with [syllabus], follow [syllabus] and Singapore ${query.level} scope.
3. Each learningVisualLessons step: pick ONE visualType from the allowed list based on step content.
4. Do not invent off-topic formulas (e.g. relativity in chemistry, calculus in evolution).
5. Set contentSource to "mixed" when teacher content and RAG references are both used.`;
}

/**
 * Builds full lesson RAG context: curated syllabus + offline PDF index + optional live web.
 */
export async function buildLessonRagContext(
  query: LessonRagQuery
): Promise<LessonRagContext> {
  const syllabus = buildTopicKnowledgeContext(
    query.subject,
    query.level,
    query.topic
  );

  const chunks: RagChunk[] = [
    ...syllabusToChunks(syllabus),
    ...retrievePdfSyllabusChunks(query.subject, query.level, query.topic),
  ];
  let webRetrievalUsed = false;

  if (isRagWebEnabled()) {
    try {
      const wikiChunks = await fetchWikipediaChunks(
        query.subject,
        query.topic,
        query.locale
      );
      if (wikiChunks.length) {
        chunks.push(...wikiChunks);
        webRetrievalUsed = true;
      }
    } catch {
      /* offline — syllabus + PDF chunks are sufficient */
    }
  }

  const ragPromptBlock = formatRagPromptBlock(query, chunks, syllabus);

  return {
    ...syllabus,
    chunks,
    ragPromptBlock,
    webRetrievalUsed,
  };
}

/**
 * Re-exports for visual-type resolution using RAG syllabus matches.
 */
export { suggestVisualTypeFromKnowledge };

import type { RagChunk } from "./rag/types";
import pdfChunkData from "./data/sg-syllabus-pdf-chunks.json";
import webChunkData from "./data/sg-syllabus-web-knowledge-chunks.json";
import { levelToSyllabusBand } from "./retrieve-topic-knowledge";

export type SyllabusPdfChunk = {
  id: string;
  subject: string;
  syllabusCode: string;
  sourceFile: string;
  title: string;
  content: string;
  matchKeywords: string[];
};

const PDF_CHUNKS = [
  ...(pdfChunkData as { chunks: SyllabusPdfChunk[] }).chunks,
  ...(webChunkData as { chunks: SyllabusPdfChunk[] }).chunks,
];

/**
 * Scores offline PDF syllabus chunks against a lesson query.
 */
function scorePdfChunk(
  chunk: SyllabusPdfChunk,
  subject: string,
  level: string,
  levelBand: ReturnType<typeof levelToSyllabusBand>,
  topicHaystack: string
): number {
  let score = 0;

  if (chunk.subject.toLowerCase() === subject.toLowerCase()) {
    score += 10;
  }

  for (const keyword of chunk.matchKeywords) {
    if (topicHaystack.includes(keyword.toLowerCase())) {
      score += 6;
    }
  }

  if (topicHaystack.includes(chunk.title.toLowerCase().slice(0, 20))) {
    score += 8;
  }

  const contentLower = chunk.content.toLowerCase();
  const topicTokens = topicHaystack.split(/\s+/).filter((t) => t.length > 3);
  for (const token of topicTokens) {
    if (contentLower.includes(token)) {
      score += 2;
    }
  }

  if (levelBand === "primary" && chunk.syllabusCode.startsWith("P")) {
    score += 4;
  }
  if (levelBand === "sec_upper" && /6091|6092|6093|4049|4052|5076|5086|5087|5088/.test(chunk.syllabusCode)) {
    score += 3;
  }
  if (levelBand === "primary" && /^P[1-6]$|^P\d-\d$/.test(chunk.syllabusCode)) {
    const levelNum = level.match(/\d+/)?.[0];
    if (levelNum && (chunk.syllabusCode === `P${levelNum}` || chunk.syllabusCode.includes(`P${levelNum}`))) {
      score += 6;
    }
  }

  return score;
}

/**
 * Retrieves pre-indexed offline PDF syllabus chunks (no network required).
 */
export function retrievePdfSyllabusChunks(
  subject: string,
  level: string,
  topic: string,
  limit = 4
): RagChunk[] {
  const levelBand = levelToSyllabusBand(level);
  const topicHaystack = `${topic} ${subject}`.toLowerCase();

  return PDF_CHUNKS.map((chunk) => ({
    chunk,
    score: scorePdfChunk(chunk, subject, level, levelBand, topicHaystack),
  }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk, score }) => ({
      id: chunk.id,
      source: "syllabus" as const,
      title: `${chunk.syllabusCode} PDF — ${chunk.title}`,
      content: chunk.content,
      score: 70 + score,
      url: chunk.sourceFile,
    }));
}

/**
 * Returns count of offline PDF chunks loaded (for status UI).
 */
export function getOfflinePdfChunkCount(): number {
  return PDF_CHUNKS.length;
}

import fs from "fs/promises";
import path from "path";
import { chunkSyllabusText } from "./chunk-syllabus-text";

export type PdfExtractedChunk = {
  id: string;
  subject: string;
  syllabusCode: string;
  sourceFile: string;
  title: string;
  content: string;
  matchKeywords: string[];
};

/**
 * Extracts plain text from a syllabus PDF on the server (Node.js).
 */
export async function extractSyllabusPdfText(absolutePath: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs"
  );
  pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

  const buffer = await fs.readFile(absolutePath);
  const data = new Uint8Array(buffer);
  const pdf = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

  const parts: string[] = [];
  const pageLimit = Math.min(pdf.numPages, 80);

  for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) {
      parts.push(pageText);
    }
  }

  return parts.join("\n\n");
}

/**
 * Extracts and chunks one syllabus PDF into RAG-ready records.
 */
export async function extractSyllabusPdfChunks(
  absolutePath: string,
  meta: { subject: string; syllabusCode: string; sourceFile: string }
): Promise<PdfExtractedChunk[]> {
  const raw = await extractSyllabusPdfText(absolutePath);
  const chunks = chunkSyllabusText(raw);

  return chunks.map((chunk, index) => ({
    id: `${meta.syllabusCode}-pdf-${index + 1}`,
    subject: meta.subject,
    syllabusCode: meta.syllabusCode,
    sourceFile: meta.sourceFile,
    title: chunk.title,
    content: chunk.content,
    matchKeywords: chunk.keywords,
  }));
}

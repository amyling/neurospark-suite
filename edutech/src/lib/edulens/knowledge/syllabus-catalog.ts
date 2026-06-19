import { SG_SYLLABUS_CATALOG } from "./syllabus-options";

/**
 * Relative paths to MOE syllabus PDFs under `syllabus/`.
 * Used for PDF indexing and offline RAG chunk resolution.
 */
export const SG_SYLLABUS_PDF_CATALOG = SG_SYLLABUS_CATALOG.map((entry) => ({
  subject: entry.subject,
  level: entry.schoolLevel === "primary" ? "Primary" : "Secondary",
  file: `../syllabus/${entry.file}`,
  code: entry.code,
}));

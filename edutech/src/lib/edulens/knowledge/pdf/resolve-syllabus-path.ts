import fs from "fs";
import path from "path";
import { SG_SYLLABUS_PDF_CATALOG } from "../syllabus-catalog";

/** Candidate roots for the sibling `syllabus/` folder (varies by monorepo layout). */
const SYLLABUS_ROOT_CANDIDATES = [
  path.resolve(process.cwd(), "..", "syllabus"),
  path.resolve(process.cwd(), "..", "..", "syllabus"),
  path.resolve(process.cwd(), "syllabus"),
];

/**
 * Resolves an absolute path to a syllabus PDF if the file exists on disk.
 */
export function resolveSyllabusPdfPath(catalogRelativeFile: string): string | null {
  const normalized = catalogRelativeFile.replace(/^\.\.\/syllabus\//, "");
  for (const root of SYLLABUS_ROOT_CANDIDATES) {
    const absolute = path.join(root, normalized);
    if (fs.existsSync(absolute)) {
      return absolute;
    }
  }
  return null;
}

/**
 * Lists catalog PDFs that exist locally (for indexing scripts).
 */
export function listAvailableSyllabusPdfs(): {
  catalog: (typeof SG_SYLLABUS_PDF_CATALOG)[number];
  absolutePath: string;
}[] {
  const found: { catalog: (typeof SG_SYLLABUS_PDF_CATALOG)[number]; absolutePath: string }[] =
    [];
  for (const entry of SG_SYLLABUS_PDF_CATALOG) {
    const absolutePath = resolveSyllabusPdfPath(entry.file);
    if (absolutePath) {
      found.push({ catalog: entry, absolutePath });
    }
  }
  return found;
}

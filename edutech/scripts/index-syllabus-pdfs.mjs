/**
 * Indexes MOE syllabus PDFs into sg-syllabus-pdf-chunks.json (offline RAG).
 * Run when ../syllabus PDFs are available: npm run index:syllabus
 */
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const CATALOG = [
  {
    subject: "Chemistry",
    code: "6092",
    file: "secondary/2023 OLevel Chemistry Syllabus Updated 2024.pdf",
  },
  {
    subject: "Physics",
    code: "6091",
    file: "secondary/2023 OLevel Physics Syllabus Updated 2024.pdf",
  },
  {
    subject: "Science",
    code: "S1-S2",
    file: "secondary/2021 Science Lower Secondary ExpressNormalAcademic Syllabus.pdf",
  },
  {
    subject: "Science",
    code: "P3-P6",
    file: "primary/Primary Science Syllabus 2023_May24.pdf",
  },
  {
    subject: "Mathematics",
    code: "P1-P6",
    file: "primary/2021 Primary Mathematics Syllabus P1 to P6 Updated Dec 2024.pdf",
  },
  {
    subject: "Mathematics",
    code: "Sec",
    file: "secondary/2020-express_na-maths_syllabuses.pdf",
  },
];

const SYLLABUS_ROOTS = [
  path.resolve(root, "..", "syllabus"),
  path.resolve(root, "..", "..", "syllabus"),
  path.resolve(root, "syllabus"),
];

/**
 * @param {string} rawText
 */
function chunkSyllabusText(rawText) {
  const maxChunkChars = 700;
  const minChunkChars = 120;
  const cleaned = rawText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const sections = cleaned.split(/\n(?=\d+\.\s+[A-Z])/);
  const chunks = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (trimmed.length < minChunkChars) continue;
    const titleMatch = trimmed.match(/^(\d+\.\s+[^\n]+)/);
    const title = titleMatch?.[1]?.trim() ?? "Syllabus section";
    if (trimmed.length <= maxChunkChars) {
      chunks.push({ title, content: trimmed });
      continue;
    }
    chunks.push({ title, content: trimmed.slice(0, maxChunkChars) + "…" });
  }

  if (!chunks.length && cleaned.length >= minChunkChars) {
    chunks.push({ title: "Syllabus excerpt", content: cleaned.slice(0, maxChunkChars) });
  }
  return chunks;
}

/**
 * @param {string} absolutePath
 */
async function extractPdfText(absolutePath) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = path.join(
    root,
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs"
  );

  const buffer = await fs.readFile(absolutePath);
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const parts = [];
  const limit = Math.min(pdf.numPages, 80);

  for (let pageNum = 1; pageNum <= limit; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) parts.push(pageText);
  }

  return parts.join("\n\n");
}

function resolvePdf(relativeFile) {
  for (const syllabusRoot of SYLLABUS_ROOTS) {
    const absolute = path.join(syllabusRoot, relativeFile);
    if (fsSync.existsSync(absolute)) return absolute;
  }
  return null;
}

async function main() {
  const allChunks = [];

  for (const entry of CATALOG) {
    const absolutePath = resolvePdf(entry.file);
    if (!absolutePath) {
      console.warn(`Skip (not found): ${entry.file}`);
      continue;
    }

    console.log(`Indexing: ${entry.subject} — ${absolutePath}`);
    const raw = await extractPdfText(absolutePath);
    const parts = chunkSyllabusText(raw);

    parts.forEach((part, index) => {
      allChunks.push({
        id: `${entry.code}-pdf-${index + 1}`,
        subject: entry.subject,
        syllabusCode: entry.code,
        sourceFile: `syllabus/${entry.file}`,
        title: part.title,
        content: part.content,
        matchKeywords: part.content
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 5)
          .slice(0, 10),
      });
    });

    console.log(`  → ${parts.length} chunks`);
  }

  if (!allChunks.length) {
    console.error("No PDFs indexed. Keep bundled sg-syllabus-pdf-chunks.json for offline use.");
    process.exit(1);
  }

  const outputPath = path.join(
    root,
    "src/lib/edulens/knowledge/data/sg-syllabus-pdf-chunks.json"
  );

  const payload = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    generator: "scripts/index-syllabus-pdfs.mjs",
    chunks: allChunks,
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${allChunks.length} chunks to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

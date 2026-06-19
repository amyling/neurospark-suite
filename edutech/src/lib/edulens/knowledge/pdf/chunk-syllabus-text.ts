/**
 * Splits raw syllabus PDF text into retrieval-sized chunks.
 */
export function chunkSyllabusText(
  rawText: string,
  options: { maxChunkChars?: number; minChunkChars?: number } = {}
): { title: string; content: string; keywords: string[] }[] {
  const maxChunkChars = options.maxChunkChars ?? 700;
  const minChunkChars = options.minChunkChars ?? 120;

  const cleaned = rawText
    .replace(/\r\n/g, "\n")
    .replace(/6092 CHEMISTRY GCE ORDINARY LEVEL SYLLABUS/g, "")
    .replace(/OFFICIAL \(OPEN\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const sections = cleaned.split(/\n(?=\d+\.\s+[A-Z])/);
  const chunks: { title: string; content: string; keywords: string[] }[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (trimmed.length < minChunkChars) {
      continue;
    }

    const titleMatch = trimmed.match(/^(\d+\.\s+[^\n]+)/);
    const title = titleMatch?.[1]?.trim() ?? "Syllabus section";
    const paragraphs = trimmed.split(/\n\n+/).filter((p) => p.length > 40);

    let buffer = "";
    for (const paragraph of paragraphs) {
      if ((buffer + paragraph).length > maxChunkChars && buffer.length >= minChunkChars) {
        chunks.push({
          title,
          content: buffer.trim(),
          keywords: extractKeywords(buffer),
        });
        buffer = paragraph;
      } else {
        buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
      }
    }

    if (buffer.length >= minChunkChars) {
      chunks.push({
        title,
        content: buffer.trim(),
        keywords: extractKeywords(buffer),
      });
    }
  }

  if (!chunks.length && cleaned.length >= minChunkChars) {
    chunks.push({
      title: "Syllabus excerpt",
      content: cleaned.slice(0, maxChunkChars),
      keywords: extractKeywords(cleaned),
    });
  }

  return chunks;
}

/**
 * Extracts simple keyword tokens from syllabus text for retrieval scoring.
 */
function extractKeywords(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4);

  return [...new Set(tokens)].slice(0, 12);
}

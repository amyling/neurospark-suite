/** Minimum extracted characters per page to treat a PDF page as text-based */
const MIN_TEXT_CHARS_PER_PAGE = 40;

/** Maximum PDF pages to read */
const MAX_PDF_PAGES = 15;

/** Maximum scanned pages rendered for vision OCR */
const MAX_RENDER_PAGES = 5;

/** Render scale for scanned PDF pages */
const RENDER_SCALE = 1.5;

export type PdfExtractResult = {
  text: string;
  pageCount: number;
  /** JPEG data URLs for low-text (scanned) pages */
  pageImageDataUrls: string[];
};

/**
 * Loads pdf.js on the client with a CDN worker (avoids Next.js bundling issues).
 */
async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

/**
 * Renders a PDF page to a JPEG data URL for vision OCR.
 */
async function renderPageToDataUrl(
  page: import("pdfjs-dist").PDFPageProxy
): Promise<string> {
  const viewport = page.getViewport({ scale: RENDER_SCALE });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }
  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas.toDataURL("image/jpeg", 0.88);
}

/**
 * Extracts text from a PDF file. Renders page images when text is sparse (scanned PDFs).
 */
export async function extractPdfClient(file: File): Promise<PdfExtractResult> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;

  const pagesToRead = Math.min(pdf.numPages, MAX_PDF_PAGES);
  const textParts: string[] = [];
  const pageImageDataUrls: string[] = [];

  for (let pageNum = 1; pageNum <= pagesToRead; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      textParts.push(pageText);
    }

    const needsVision =
      pageText.length < MIN_TEXT_CHARS_PER_PAGE &&
      pageImageDataUrls.length < MAX_RENDER_PAGES;

    if (needsVision) {
      pageImageDataUrls.push(await renderPageToDataUrl(page));
    }
  }

  return {
    text: textParts.join("\n\n").trim(),
    pageCount: pdf.numPages,
    pageImageDataUrls,
  };
}

/**
 * Returns true when the file is a PDF (by MIME type or extension).
 */
export function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

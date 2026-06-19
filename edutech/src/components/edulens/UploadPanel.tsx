"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VisionExtractRole } from "@/lib/edulens/ai/vision";
import { extractPdfClient, isPdfFile } from "@/lib/edulens/pdf/extract-pdf-client";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Reads a file as base64 data URL.
 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Image / PDF upload with drag-drop, paste, PDF text extraction, and vision OCR */
export function UploadPanel({
  onTextExtracted,
  onImagesChange,
  label,
  hint,
  chooseFileLabel,
  dragDropHint,
  pasteHint,
  subject,
  topic,
  purpose = "homework",
  extractRole = "general",
  images = [],
  multiple = true,
  acceptPdf = true,
}: {
  onTextExtracted?: (
    text: string,
    meta?: {
      visionUsed: boolean;
      dataUrl?: string;
      questionText?: string;
      studentAnswer?: string;
    }
  ) => void;
  onImagesChange?: (dataUrls: string[]) => void;
  label: string;
  hint: string;
  chooseFileLabel: string;
  dragDropHint?: string;
  pasteHint?: string;
  subject?: string;
  topic?: string;
  purpose?: "homework" | "lesson";
  extractRole?: VisionExtractRole;
  images?: string[];
  multiple?: boolean;
  /** When true, PDF files are parsed for text and scanned pages are sent to vision OCR */
  acceptPdf?: boolean;
}) {
  const { locale, t } = useLocale();
  const [extracting, setExtracting] = useState(false);
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [lastNoteIsError, setLastNoteIsError] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  /**
   * Calls vision OCR API and merges extracted text into the parent form.
   * Keeps images attached even when OCR fails so multimodal generation still works.
   */
  const runVisionExtract = useCallback(
    async (dataUrls: string[]) => {
      if (!dataUrls.length || !onTextExtracted) {
        return;
      }

      const body: Record<string, unknown> = {
        images: dataUrls,
        subject,
        topic,
        purpose,
      };
      if (extractRole === "combined") {
        body.extractRole = "combined";
      }

      const res = await fetchEdulens("/api/edulens/extract-content", locale, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.visionUsed) {
        onTextExtracted("", {
          visionUsed: false,
          dataUrl: dataUrls[0],
        });
        setLastNoteIsError(true);
        setLastNote(
          data.error ??
            (data.errorCode === "no_vision_model"
              ? t.ai.visionNoModel
              : t.ai.visionExtractionFailed)
        );
        return;
      }

      onTextExtracted(data.text ?? data.questionText ?? "", {
        visionUsed: true,
        dataUrl: dataUrls[0],
        questionText: data.questionText,
        studentAnswer: data.studentAnswer,
      });
      setLastNoteIsError(false);
      setLastNote(`${t.ai.visionOk} (${data.provider})`);
    },
    [
      extractRole,
      locale,
      onTextExtracted,
      purpose,
      subject,
      t.ai.visionExtractionFailed,
      t.ai.visionNoModel,
      t.ai.visionOk,
      topic,
    ]
  );

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const allFiles = Array.from(files);
      const pdfFiles = acceptPdf ? allFiles.filter(isPdfFile) : [];
      const imageFiles = allFiles.filter((f) => f.type.startsWith("image/"));

      if (!pdfFiles.length && !imageFiles.length) {
        setLastNoteIsError(true);
        setLastNote(t.homework.unsupportedFileType);
        return;
      }

      const oversized = [...pdfFiles, ...imageFiles].find(
        (f) => f.size > MAX_FILE_SIZE
      );
      if (oversized) {
        setLastNoteIsError(true);
        setLastNote(t.homework.fileTooLarge);
        return;
      }

      setExtracting(true);
      setLastNote(null);
      setLastNoteIsError(false);

      try {
        for (const pdfFile of pdfFiles) {
          setLastNote(t.ai.parsingPdf);
          const pdfResult = await extractPdfClient(pdfFile);

          if (pdfResult.text && onTextExtracted) {
            onTextExtracted(pdfResult.text, { visionUsed: false });
            setLastNoteIsError(false);
            setLastNote(
              t.ai.pdfTextOk.replace("{pages}", String(pdfResult.pageCount))
            );
          }

          if (pdfResult.pageImageDataUrls.length) {
            const newImages = multiple
              ? [...imagesRef.current, ...pdfResult.pageImageDataUrls]
              : pdfResult.pageImageDataUrls.slice(0, 1);
            onImagesChange?.(newImages);
            imagesRef.current = newImages;

            if (!pdfResult.text) {
              setLastNote(t.ai.pdfVisionFallback);
            }
            await runVisionExtract(pdfResult.pageImageDataUrls);
          } else if (!pdfResult.text) {
            setLastNoteIsError(true);
            setLastNote(t.ai.pdfEmpty);
          }
        }

        if (imageFiles.length) {
          const dataUrls = await Promise.all(
            imageFiles.map(readFileAsDataUrl)
          );
          const newImages = multiple
            ? [...imagesRef.current, ...dataUrls]
            : dataUrls.slice(0, 1);
          onImagesChange?.(newImages);
          imagesRef.current = newImages;

          if (onTextExtracted) {
            await runVisionExtract(dataUrls);
          } else {
            setLastNoteIsError(false);
            setLastNote(
              `${dataUrls.length} image(s) attached for multimodal generation`
            );
          }
        }
      } catch {
        setLastNoteIsError(true);
        setLastNote(t.ai.pdfParseFailed);
      } finally {
        setExtracting(false);
      }
    },
    [
      acceptPdf,
      multiple,
      onImagesChange,
      onTextExtracted,
      runVisionExtract,
      t.ai.pdfEmpty,
      t.ai.pdfParseFailed,
      t.ai.pdfTextOk,
      t.ai.pdfVisionFallback,
      t.ai.parsingPdf,
      t.homework.fileTooLarge,
      t.homework.unsupportedFileType,
    ]
  );

  /** Handles clipboard paste of images */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length) {
        e.preventDefault();
        processFiles(imageFiles);
      }
    };

    el.addEventListener("paste", handlePaste);
    return () => el.removeEventListener("paste", handlePaste);
  }, [processFiles]);

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onImagesChange?.(next);
  };

  const acceptTypes = acceptPdf ? "image/*,application/pdf,.pdf" : "image/*";

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`rounded-lg border border-dashed bg-slate-50 p-4 outline-none transition-colors ${
        dragOver ? "border-indigo-400 bg-indigo-50" : "border-slate-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) {
          processFiles(e.dataTransfer.files);
        }
      }}
    >
      <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-500">{hint}</span>
        {dragDropHint ? (
          <span className="text-xs text-slate-400">{dragDropHint}</span>
        ) : null}
        {pasteHint ? (
          <span className="text-xs text-slate-400">{pasteHint}</span>
        ) : null}
        <input
          type="file"
          accept={acceptTypes}
          multiple={multiple}
          className="sr-only"
          disabled={extracting}
          onChange={(e) => {
            if (e.target.files?.length) {
              processFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
        <span
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
            extracting
              ? "cursor-wait bg-indigo-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {extracting ? t.ai.extracting : chooseFileLabel}
        </span>
      </label>

      {images.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={`${url.slice(0, 32)}-${i}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Upload ${i + 1}`}
                className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white hover:bg-rose-600"
                aria-label={t.homework.removeImage}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {lastNote ? (
        <p
          className={`mt-2 text-center text-xs ${
            lastNoteIsError ? "text-rose-600" : "text-slate-500"
          }`}
          role={lastNoteIsError ? "alert" : undefined}
        >
          {lastNote}
        </p>
      ) : null}
    </div>
  );
}

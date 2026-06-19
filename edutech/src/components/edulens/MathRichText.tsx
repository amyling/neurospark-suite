"use client";

import katex from "katex";
import { prepareMathFieldForDisplay } from "@/lib/edulens/math/normalize-math-text";
import { splitMathSegments } from "@/lib/edulens/math/split-math-segments";
import "katex/dist/katex.min.css";

/**
 * Renders mixed plain text and LaTeX with KaTeX (readable formulas & variables).
 */
export function MathRichText({
  text,
  className = "",
  skipNormalize = false,
}: {
  text: string;
  className?: string;
  /** Use when text is already prepared (e.g. table cells). */
  skipNormalize?: boolean;
}) {
  const prepared = skipNormalize ? text : prepareMathFieldForDisplay(text);
  const segments = splitMathSegments(prepared);
  const isInline = className.includes("inline");

  if (!segments.length) {
    return null;
  }

  const hasDisplayMath = segments.some(
    (seg) => seg.type === "math" && seg.display
  );

  return (
    <div
      className={
        isInline
          ? `math-rich-text inline text-sm leading-normal text-slate-800 ${className}`
          : `math-rich-text text-sm leading-relaxed text-slate-800 ${hasDisplayMath ? "space-y-2" : ""} ${className}`
      }
    >
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return (
            <span key={`t-${i}`} className="whitespace-pre-wrap break-words">
              {seg.content}
            </span>
          );
        }

        let html = "";
        try {
          html = katex.renderToString(seg.content, {
            throwOnError: false,
            displayMode: seg.display,
            strict: "ignore",
            trust: true,
          });
        } catch {
          html = seg.content;
        }

        if (html.includes('class="katex-error"')) {
          try {
            html = katex.renderToString(seg.content.replace(/\s+/g, " "), {
              throwOnError: false,
              displayMode: seg.display,
              strict: "ignore",
              trust: true,
            });
          } catch {
            html = seg.content;
          }
        }

        if (seg.display && !className.includes("inline")) {
          return (
            <div
              key={`m-${i}`}
              className="my-1 w-full overflow-x-auto py-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        return (
          <span
            key={`m-${i}`}
            className="mx-0.5 inline align-middle"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </div>
  );
}

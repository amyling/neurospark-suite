"use client";

import type { RichContentBlock } from "@/lib/edulens/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { LessonDiagramVisual } from "./LessonDiagramVisual";
import { LessonMarkdownTable } from "./LessonMarkdownTable";
import { MathRichText } from "./MathRichText";

/** Renders multimodal teaching blocks (text, formula, diagram, table) */
export function RichContentBlocks({ blocks }: { blocks: RichContentBlock[] }) {
  const { t } = useLocale();

  if (!blocks.length) return null;

  const typeLabel: Record<RichContentBlock["type"], string> = {
    text: t.lesson.blockText,
    formula: t.lesson.blockFormula,
    diagram: t.lesson.blockDiagram,
    table: t.lesson.blockTable,
  };

  return (
    <div className="space-y-3">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {typeLabel[block.type]}
          </span>

          {block.type === "formula" && block.latex ? (
            <div className="mt-2 overflow-x-auto rounded bg-white px-3 py-2">
              <MathRichText text={`$$${block.latex}$$`} />
            </div>
          ) : null}

          {block.type === "diagram" ? (
            <LessonDiagramVisual
              caption={block.content}
              imageUrl={block.imageUrl}
              videoUrl={block.videoUrl}
            />
          ) : null}

          {block.type === "table" ? (
            <LessonMarkdownTable content={block.content} />
          ) : null}

          {block.type === "text" || block.type === "formula" ? (
            <MathRichText text={block.content} className="mt-2" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

"use client";

import { parseMarkdownTable } from "@/lib/edulens/lesson/parse-markdown-table";
import { prepareTableCellForDisplay } from "@/lib/edulens/math/prepare-table-cell-math";
import { MathRichText } from "./MathRichText";

/**
 * Renders markdown table content as a styled HTML table with math in cells.
 */
export function LessonMarkdownTable({ content }: { content: string }) {
  const table = parseMarkdownTable(content);

  if (!table) {
    return <MathRichText text={content} className="mt-2" />;
  }

  return (
    <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-indigo-50/80">
            {table.headers.map((header, headerIndex) => (
              <th
                key={`header-${headerIndex}`}
                className="min-w-[4.5rem] whitespace-nowrap px-3 py-2 font-semibold text-indigo-900"
              >
                <MathRichText
                  text={prepareTableCellForDisplay(header)}
                  className="inline"
                  skipNormalize
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className="border-b border-slate-100 last:border-0"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className={`min-w-[4.5rem] px-3 py-2 align-middle text-slate-700 ${
                    cellIndex === row.length - 1
                      ? "break-keep-all [word-break:keep-all]"
                      : ""
                  }`}
                >
                  <MathRichText
                    text={prepareTableCellForDisplay(cell)}
                    className="inline leading-normal"
                    skipNormalize
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

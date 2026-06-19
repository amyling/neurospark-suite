"use client";

import { useEffect, useRef, useState } from "react";
import { MathRichText } from "./MathRichText";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Homework text field: KaTeX-rendered view by default; optional source edit.
 */
export function OcrTextBox({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const { t } = useLocale();
  const [editing, setEditing] = useState(false);
  const wasEmptyRef = useRef(true);
  const isEmpty = !value.trim();

  /**
   * Switch to formatted view only when OCR first fills an empty field.
   * Manual edits must not close the editor until the user clicks done.
   */
  useEffect(() => {
    const nowEmpty = !value.trim();
    if (wasEmptyRef.current && !nowEmpty) {
      setEditing(false);
    }
    wasEmptyRef.current = nowEmpty;
  }, [value]);

  return (
    <div className="block">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {!isEmpty ? (
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            {editing ? t.homework.doneEditing : t.homework.editSource}
          </button>
        ) : null}
      </div>

      {!isEmpty && !editing ? (
        <div
          className="ocr-read-box min-h-[4rem] rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm"
          role="article"
          aria-label={label}
        >
          <MathRichText text={value} className="text-base leading-relaxed" />
        </div>
      ) : null}

      {editing || isEmpty ? (
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : null}
    </div>
  );
}

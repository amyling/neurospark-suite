"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Centered loading indicator */
export function LoadingState({ label }: { label?: string }) {
  const { t } = useLocale();
  const text = label ?? t.common.loading;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"
        role="status"
        aria-label={text}
      />
      <p className="text-sm">{text}</p>
    </div>
  );
}

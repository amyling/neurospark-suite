"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Opens print dialog for PDF-style report export */
export function ReportExportButton() {
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
    >
      {t.report.export}
    </button>
  );
}

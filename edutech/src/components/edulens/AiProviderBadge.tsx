"use client";

import { useEffect, useState } from "react";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";

type AiStatus = {
  mode: string;
  textModel: string;
  visionModel: string;
  visionCapable: boolean;
  devProfile: string | null;
  profileLabel: string;
  providerChain?: string | null;
  hints: string[];
  ocrNote: string;
};

/** Shows which LLM / vision backend is active and free-tier setup hints */
export function AiProviderBadge() {
  const { locale, t } = useLocale();
  const [status, setStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    fetchEdulens("/api/edulens/ai-status", locale)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => null);
  }, [locale]);

  if (!status) return null;

  return (
    <div className="max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
      <p className="font-medium text-slate-800">{t.ai.statusTitle}</p>
      {status.providerChain ? (
        <p className="mt-1 font-mono text-indigo-700">{status.providerChain}</p>
      ) : null}
      <p className="mt-1">
        {t.ai.mode}: <span className="font-mono">{status.mode}</span>
      </p>
      <p className="mt-0.5">
        {t.ai.textModel}: <span className="font-mono">{status.textModel}</span>
      </p>
      <p className="mt-0.5">
        {t.ai.vision}:{" "}
        {status.visionCapable ? (
          <span className="text-emerald-700">{status.visionModel}</span>
        ) : (
          <span className="text-amber-700">{t.ai.visionOff}</span>
        )}
      </p>
      <p className="mt-1 text-slate-500">{status.ocrNote}</p>
      {status.hints?.length ? (
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-slate-500">
          {status.hints.slice(0, 2).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

type ProviderStatus = {
  configured: boolean;
  mode: string;
  textModel: string;
  profileLabel: string;
  providerChain?: string;
};

/**
 * Shows which LLM backend is active (EDULENS_* env).
 */
export function AiProviderBadge() {
  const { t } = useLocale();
  const [status, setStatus] = useState<ProviderStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/status");
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as ProviderStatus;
        if (!cancelled) {
          setStatus(data);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status) {
    return null;
  }

  const label = status.configured
    ? status.providerChain
      ? `${t.characterChat.llmChain}: ${status.providerChain}`
      : `${t.characterChat.llmActive}: ${status.mode} · ${status.textModel}`
    : t.characterChat.llmMock;

  return (
    <p
      className={`rounded-xl px-3 py-2 text-xs ring-1 ${
        status.configured
          ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
          : "bg-slate-50 text-slate-600 ring-slate-200"
      }`}
    >
      {label}
    </p>
  );
}

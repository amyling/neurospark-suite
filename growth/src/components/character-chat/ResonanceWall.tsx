"use client";

import { useLocale } from "@/context/LocaleContext";
import { getResonanceMessage } from "@/lib/character-chat/resonance-wall";

/**
 * Anonymous resonance wall — no rankings, no social comparison.
 */
export function ResonanceWall() {
  const { locale, t } = useLocale();
  const { message } = getResonanceMessage(locale);

  return (
    <section className="rounded-2xl bg-gradient-to-r from-violet-50 to-sky-50 p-4 ring-1 ring-violet-100">
      <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
        {t.characterGrowth.resonanceTitle}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{message}</p>
      <p className="mt-2 text-xs text-slate-500">{t.characterGrowth.resonanceNote}</p>
    </section>
  );
}

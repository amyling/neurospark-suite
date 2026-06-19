"use client";

import { useLocale } from "@/context/LocaleContext";
import { getMentorPersonas } from "@/lib/youthmentor/demo-seed";
import type { MentorPersona } from "@/types/youthmentor";

const CARD_COLORS = [
  "from-sky-100 to-sky-50",
  "from-violet-100 to-violet-50",
  "from-emerald-100 to-emerald-50",
  "from-rose-100 to-rose-50",
  "from-amber-100 to-amber-50",
];

/**
 * Original mentor persona cards (no celebrity impersonation).
 */
export function MentorPersonaCards({
  value,
  onChange,
}: {
  value: MentorPersona | null;
  onChange: (persona: MentorPersona) => void;
}) {
  const { locale } = useLocale();
  const personas = getMentorPersonas(locale);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {personas.map((persona, index) => (
        <button
          key={persona.value}
          type="button"
          onClick={() => onChange(persona.value)}
          className={`rounded-2xl bg-gradient-to-br p-4 text-left ring-2 transition-all ${CARD_COLORS[index % CARD_COLORS.length]} ${
            value === persona.value
              ? "ring-sky-500 shadow-md"
              : "ring-transparent hover:ring-sky-200"
          }`}
        >
          <h3 className="font-semibold text-slate-800">{persona.title}</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">{persona.tone}</p>
          <p className="mt-2 text-sm text-slate-600">{persona.description}</p>
        </button>
      ))}
    </div>
  );
}

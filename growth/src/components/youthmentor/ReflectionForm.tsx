"use client";

import { useLocale } from "@/context/LocaleContext";
import type { ReflectionAnswers } from "@/types/youthmentor";

/**
 * Structured six-step reflection form.
 */
export function ReflectionForm({
  answers,
  onChange,
}: {
  answers: ReflectionAnswers;
  onChange: (key: keyof ReflectionAnswers, value: string) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {t.reflectionPrompts.map((prompt) => (
        <label key={prompt.key} className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {prompt.label}
          </span>
          <textarea
            value={answers[prompt.key]}
            onChange={(e) => onChange(prompt.key, e.target.value)}
            rows={2}
            placeholder={prompt.placeholder}
            className="w-full resize-y rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
          />
        </label>
      ))}
    </div>
  );
}

"use client";

import { useLocale } from "@/context/LocaleContext";
import { getMoodOptions } from "@/lib/youthmentor/demo-seed";
import type { Mood } from "@/types/youthmentor";

/**
 * Mood emoji selector for check-in.
 */
export function MoodSelector({
  value,
  onChange,
}: {
  value: Mood;
  onChange: (mood: Mood) => void;
}) {
  const { locale } = useLocale();
  const options = getMoodOptions(locale);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-4 text-sm transition-all ${
            value === option.value
              ? "border-sky-400 bg-sky-50 shadow-sm"
              : "border-transparent bg-white ring-1 ring-slate-200 hover:ring-sky-200"
          }`}
        >
          <span className="text-2xl" aria-hidden>
            {option.emoji}
          </span>
          <span className="font-medium text-slate-700">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

"use client";

import { useLocale } from "@/context/LocaleContext";
import { getStressOptions } from "@/lib/youthmentor/demo-seed";
import type { StressSource } from "@/types/youthmentor";

/**
 * Stress source chip selector.
 */
export function StressSourceChips({
  value,
  onChange,
}: {
  value: StressSource;
  onChange: (source: StressSource) => void;
}) {
  const { locale } = useLocale();
  const options = getStressOptions(locale);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.value
              ? "bg-violet-500 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

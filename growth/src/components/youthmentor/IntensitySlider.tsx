"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * 1–10 intensity slider for mood check-in.
 */
export function IntensitySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>{t.checkIn.intensityLabel}</span>
        <span className="font-semibold text-sky-600">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-sky-500"
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{t.common.intensityMild}</span>
        <span>{t.common.intensityStrong}</span>
      </div>
    </div>
  );
}

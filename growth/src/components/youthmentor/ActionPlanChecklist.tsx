"use client";

import { useLocale } from "@/context/LocaleContext";
import type { ActionPlanItem } from "@/types/youthmentor";

/**
 * Checklist for small action steps.
 */
export function ActionPlanChecklist({
  items,
  onToggle,
}: {
  items: ActionPlanItem[];
  onToggle: (id: string) => void;
}) {
  const { t } = useLocale();

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{t.actionPlan.empty}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onToggle(item.id)}
              className="mt-0.5 h-4 w-4 rounded accent-emerald-500"
            />
            <span
              className={`text-sm ${
                item.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-700"
              }`}
            >
              {item.text}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

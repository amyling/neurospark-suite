"use client";

import { useLocale } from "@/context/LocaleContext";
import { useGrowthSettings } from "@/context/GrowthSettingsContext";

/**
 * Shows freemium / parent-mode usage limits.
 */
export function UsageLimitBanner() {
  const { t } = useLocale();
  const {
    settings,
    usageRemaining,
    usageLimit,
    limitBlockedReason,
    togglePremium,
  } = useGrowthSettings();

  if (settings.isPremium) {
    return (
      <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 ring-1 ring-emerald-200">
        {t.characterGrowth.premiumActive}
      </p>
    );
  }

  const blocked =
    limitBlockedReason === "limit" ||
    limitBlockedReason === "parent_limit" ||
    limitBlockedReason === "quiet_hours";

  return (
    <div
      className={`rounded-xl px-3 py-2 text-xs ring-1 ${
        blocked
          ? "bg-rose-50 text-rose-800 ring-rose-200"
          : "bg-slate-50 text-slate-600 ring-slate-200"
      }`}
    >
      <p>
        {blocked
          ? limitBlockedReason === "quiet_hours"
            ? t.characterGrowth.quietHours
            : t.characterGrowth.limitReached
          : t.characterGrowth.messagesLeft.replace(
              "{n}",
              String(usageRemaining)
            ).replace("{limit}", String(usageLimit))}
      </p>
      <button
        type="button"
        onClick={togglePremium}
        className="mt-1 font-medium text-violet-600 hover:underline"
      >
        {t.characterGrowth.tryPremiumDemo}
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useGrowthSettings } from "@/context/GrowthSettingsContext";
import { useCharacterChat } from "@/context/CharacterChatContext";
import { getCoachingPacks } from "@/lib/character-chat/coaching-packs";
import { getCoachingPackProgress } from "@/lib/character-chat/growth-storage";
import type { CoachingPackId } from "@/types/character-growth";

/**
 * Themed multi-day coaching packs (freemium demo).
 */
export function CoachingPackCards() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { settings } = useGrowthSettings();
  const { startCoachingPack } = useCharacterChat();
  const packs = getCoachingPacks(locale);
  const active = getCoachingPackProgress();

  const handleStart = async (id: CoachingPackId, requiresPremium: boolean) => {
    if (requiresPremium && !settings.isPremium) {
      return;
    }
    await startCoachingPack(id);
    router.push("/youthmentor/characters/chat");
  };

  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-800">
        {t.characterGrowth.coachingTitle}
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        {t.characterGrowth.coachingSubtitle}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {packs.map((pack) => {
          const locked = pack.requiresPremium && !settings.isPremium;
          const isActive = active?.packId === pack.id;
          return (
            <button
              key={pack.id}
              type="button"
              disabled={locked}
              onClick={() => handleStart(pack.id, pack.requiresPremium)}
              className="rounded-2xl bg-white p-4 text-left ring-1 ring-amber-100 transition hover:ring-amber-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <p className="font-medium text-slate-800">{pack.title}</p>
              <p className="mt-1 text-xs text-slate-500">{pack.description}</p>
              <p className="mt-2 text-xs text-amber-700">
                {locked
                  ? t.characterGrowth.coachingPremiumOnly
                  : isActive
                    ? t.characterGrowth.coachingActive.replace(
                        "{day}",
                        String(active?.currentDay ?? 1)
                      )
                    : t.characterGrowth.coachingStart.replace(
                        "{days}",
                        String(pack.durationDays)
                      )}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

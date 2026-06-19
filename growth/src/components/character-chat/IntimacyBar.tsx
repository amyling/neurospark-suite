"use client";

import { useLocale } from "@/context/LocaleContext";
import { getIntimacyUnlockNote } from "@/lib/character-chat/intimacy";
import type { CharacterRelationship } from "@/types/character-growth";

/**
 * Displays intimacy level, streak, and unlock hint.
 */
export function IntimacyBar({
  relationship,
}: {
  relationship: CharacterRelationship | null;
}) {
  const { locale, t } = useLocale();
  if (!relationship || relationship.messageCount === 0) {
    return null;
  }

  const note = getIntimacyUnlockNote(relationship.intimacyLevel, locale);

  return (
    <div className="rounded-xl bg-violet-50 px-3 py-2 text-xs text-violet-900 ring-1 ring-violet-100">
      <p className="font-semibold">
        {t.characterGrowth.intimacyLevel} Lv.{relationship.intimacyLevel}
        <span className="ml-2 font-normal text-violet-700">
          · {t.characterGrowth.streak} {relationship.streakDays}
          {locale === "zh" ? " 天" : "d"}
        </span>
      </p>
      <p className="mt-0.5 text-violet-800">{note}</p>
    </div>
  );
}

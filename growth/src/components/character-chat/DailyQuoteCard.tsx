"use client";

import { useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useCharacterChat } from "@/context/CharacterChatContext";
import {
  getDailyQuote,
  resolveDailyQuoteCharacterId,
} from "@/lib/character-chat/daily-quote";
import { ShareQuoteButton } from "@/components/character-chat/ShareQuoteButton";

/**
 * Shows a deterministic daily quote from the user's favorite character.
 */
export function DailyQuoteCard() {
  const { locale, t } = useLocale();
  const { profile } = useCharacterChat();

  const quote = useMemo(() => {
    const id = resolveDailyQuoteCharacterId(profile.favoriteCharacterId);
    return getDailyQuote(id, locale);
  }, [locale, profile.favoriteCharacterId]);

  if (!quote) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-gradient-to-br from-amber-50 to-violet-50 p-4 ring-1 ring-amber-100">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
        {t.characterGrowth.dailyQuote}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {quote.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">
            {quote.characterName}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {quote.quote}
          </p>
          <div className="mt-2">
            <ShareQuoteButton
              characterName={quote.characterName}
              quote={quote.quote}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

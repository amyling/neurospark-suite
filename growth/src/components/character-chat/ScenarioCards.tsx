"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { getScenarioCards } from "@/lib/character-chat/scenarios";
import { useCharacterChat } from "@/context/CharacterChatContext";
import type { ScenarioId } from "@/types/character-growth";

/**
 * Pain-point scenario cards that route into the best-matched character.
 */
export function ScenarioCards() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { startScenario } = useCharacterChat();
  const cards = getScenarioCards(locale);

  const handleStart = async (id: ScenarioId) => {
    await startScenario(id);
    router.push("/youthmentor/characters/chat");
  };

  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-800">
        {t.characterGrowth.scenarioTitle}
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        {t.characterGrowth.scenarioSubtitle}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => handleStart(card.id)}
            className="rounded-2xl bg-white p-4 text-left ring-1 ring-violet-100 transition hover:ring-violet-300 hover:shadow-sm"
          >
            <p className="font-medium text-slate-800">{card.title}</p>
            <p className="mt-1 text-xs text-slate-500">{card.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

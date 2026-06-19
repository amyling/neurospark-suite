"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiProviderBadge } from "@/components/character-chat/AiProviderBadge";
import { CharacterForm } from "@/components/character-chat/CharacterForm";
import { CharacterPicker } from "@/components/character-chat/CharacterPicker";
import { CoachingPackCards } from "@/components/character-chat/CoachingPackCards";
import { DailyQuoteCard } from "@/components/character-chat/DailyQuoteCard";
import { ProfileForm } from "@/components/character-chat/ProfileForm";
import { ResonanceWall } from "@/components/character-chat/ResonanceWall";
import { ScenarioCards } from "@/components/character-chat/ScenarioCards";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { useLocale } from "@/context/LocaleContext";
import { useCharacterChat } from "@/context/CharacterChatContext";
import type { ChatCharacter } from "@/types/character-chat";

export default function CharactersPage() {
  const router = useRouter();
  const { t } = useLocale();
  const {
    characters,
    activeCharacter,
    selectCharacter,
    createCharacter,
    removeCustomCharacter,
    setFavoriteCharacter,
  } = useCharacterChat();

  const handleSelect = (character: ChatCharacter) => {
    selectCharacter(character);
    setFavoriteCharacter(character.id);
    router.push("/youthmentor/characters/chat");
  };

  return (
    <div>
      <SafetyBanner />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-violet-100">
        <h2 className="text-xl font-semibold text-slate-800">
          {t.characterChat.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t.characterChat.intro}
        </p>
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200">
          {t.characterChat.disclaimer}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <AiProviderBadge />
          <Link
            href="/youthmentor/settings"
            className="rounded-full px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
          >
            {t.characterGrowth.settingsLink}
          </Link>
          <Link
            href="/youthmentor/characters/insights"
            className="rounded-full px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
          >
            {t.characterGrowth.insightsLink}
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <ResonanceWall />
      </div>

      <div className="mt-6">
        <DailyQuoteCard />
      </div>

      <div className="mt-6">
        <ScenarioCards />
      </div>

      <div className="mt-6">
        <CoachingPackCards />
      </div>

      <div className="mt-6">
        <ProfileForm />
      </div>

      <div className="mt-6">
        <CharacterForm
          onSubmit={(values) => {
            const created = createCharacter(values);
            handleSelect(created);
          }}
        />
      </div>

      <div className="mt-6">
        <CharacterPicker
          characters={characters}
          selectedId={activeCharacter?.id ?? null}
          onSelect={handleSelect}
          onDeleteCustom={removeCustomCharacter}
        />
      </div>

      {activeCharacter && (
        <div className="mt-6 text-center">
          <Link
            href="/youthmentor/characters/chat"
            className="inline-block rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600"
          >
            {t.characterChat.continueChat}
          </Link>
        </div>
      )}
    </div>
  );
}

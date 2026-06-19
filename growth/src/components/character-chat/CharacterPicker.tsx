"use client";

import { useLocale } from "@/context/LocaleContext";
import type { ChatCharacter, CharacterCategory } from "@/types/character-chat";

/**
 * Grid of selectable character cards grouped by category.
 */
export function CharacterPicker({
  characters,
  selectedId,
  onSelect,
  onDeleteCustom,
}: {
  characters: ChatCharacter[];
  selectedId: string | null;
  onSelect: (character: ChatCharacter) => void;
  onDeleteCustom?: (id: string) => void;
}) {
  const { t } = useLocale();
  const groups: CharacterCategory[] = ["celebrity", "religious", "custom"];

  return (
    <div className="space-y-6">
      {groups.map((category) => {
        const items = characters.filter((c) => c.category === category);
        if (items.length === 0) {
          return null;
        }
        const label = t.characterChat.categories[category];

        return (
          <section key={category}>
            <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {items.map((character) => (
                <div
                  key={character.id}
                  className={`relative rounded-2xl bg-white p-4 ring-2 transition-all ${
                    selectedId === character.id
                      ? "ring-violet-500 shadow-md"
                      : "ring-slate-100 hover:ring-violet-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(character)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl" aria-hidden>
                        {character.avatar}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-800">
                          {character.name}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500">
                          {character.description}
                        </p>
                      </div>
                    </div>
                  </button>
                  {!character.isBuiltIn && onDeleteCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustom(character.id)}
                      className="absolute right-3 top-3 text-xs text-rose-500 hover:underline"
                    >
                      {t.common.delete}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChatPanel } from "@/components/character-chat/ChatPanel";
import { useLocale } from "@/context/LocaleContext";
import { useCharacterChat } from "@/context/CharacterChatContext";

export default function CharacterChatInner() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { loadReflectionDebrief } = useCharacterChat();

  useEffect(() => {
    if (searchParams.get("debrief") === "1") {
      void loadReflectionDebrief();
    }
  }, [loadReflectionDebrief, searchParams]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {t.characterChat.chatTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t.characterChat.chatSubtitle}
          </p>
        </div>
        <Link
          href="/youthmentor/characters"
          className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.characterChat.changeCharacter}
        </Link>
      </div>

      <ChatPanel />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SafetyCrisisPanel } from "@/components/youthmentor/SafetyCrisisPanel";
import { ChatMessageActions } from "@/components/character-chat/ChatMessageActions";
import { IntimacyBar } from "@/components/character-chat/IntimacyBar";
import { UsageLimitBanner } from "@/components/character-chat/UsageLimitBanner";
import { useLocale } from "@/context/LocaleContext";
import { useCharacterChat } from "@/context/CharacterChatContext";
import { useGrowthSettings } from "@/context/GrowthSettingsContext";

/**
 * Multi-turn chat UI with intimacy, limits, feedback, and TTS.
 */
export function ChatPanel() {
  const { t } = useLocale();
  const { canSendMessage, settings } = useGrowthSettings();
  const {
    activeCharacter,
    messages,
    isSending,
    crisisMessage,
    relationship,
    sendMessage,
    clearChat,
  } = useCharacterChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, crisisMessage]);

  if (!activeCharacter) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
        {t.characterChat.selectToChat}
      </p>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }
    setInput("");
    await sendMessage(text);
  };

  const inputDisabled =
    isSending ||
    Boolean(crisisMessage) ||
    (!canSendMessage && !settings.isPremium);

  return (
    <div className="flex flex-col gap-3">
      <UsageLimitBanner />
      <IntimacyBar relationship={relationship} />

      <div className="flex flex-col rounded-2xl bg-white ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {activeCharacter.avatar}
            </span>
            <div>
              <h3 className="font-semibold text-slate-800">
                {activeCharacter.name}
              </h3>
              <p className="text-xs text-slate-500">
                {t.characterChat.simulationNote}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {t.characterChat.clearChat}
          </button>
        </div>

        <div className="flex max-h-[28rem] min-h-[20rem] flex-col gap-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-violet-500 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {message.content}
              </div>
              {message.role === "assistant" && (
                <ChatMessageActions
                  messageId={message.id}
                  content={message.content}
                  characterName={activeCharacter.name}
                />
              )}
            </div>
          ))}
          {isSending && (
            <p className="text-xs text-slate-400">{t.characterChat.typing}</p>
          )}
          {crisisMessage && (
            <div className="mt-2">
              <SafetyCrisisPanel message={crisisMessage} />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-slate-100 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={inputDisabled}
            placeholder={t.characterChat.inputPlaceholder}
            className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={inputDisabled || !input.trim()}
            className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
          >
            {t.characterChat.send}
          </button>
        </form>
      </div>
    </div>
  );
}

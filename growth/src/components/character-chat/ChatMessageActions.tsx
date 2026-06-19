"use client";

import { useLocale } from "@/context/LocaleContext";
import { useCharacterChat } from "@/context/CharacterChatContext";
import { ShareQuoteButton } from "@/components/character-chat/ShareQuoteButton";

/**
 * Assistant message actions: feedback, TTS, share.
 */
export function ChatMessageActions({
  messageId,
  content,
  characterName,
}: {
  messageId: string;
  content: string;
  characterName: string;
}) {
  const { t } = useLocale();
  const { submitFeedback } = useCharacterChat();

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(content);
    utter.lang = /[\u4e00-\u9fff]/.test(content) ? "zh-CN" : "en-US";
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
      <button
        type="button"
        onClick={() => submitFeedback(messageId, "up")}
        className="hover:text-emerald-600"
        aria-label={t.characterGrowth.feedbackUp}
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => submitFeedback(messageId, "down")}
        className="hover:text-rose-600"
        aria-label={t.characterGrowth.feedbackDown}
      >
        👎
      </button>
      <button
        type="button"
        onClick={speak}
        className="hover:text-violet-600"
      >
        {t.characterGrowth.listen}
      </button>
      <ShareQuoteButton characterName={characterName} quote={content.slice(0, 200)} />
    </div>
  );
}

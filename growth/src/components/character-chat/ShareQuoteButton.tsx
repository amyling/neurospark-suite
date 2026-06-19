"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * Shares a quote as plain text (clipboard).
 */
export function ShareQuoteButton({
  characterName,
  quote,
}: {
  characterName: string;
  quote: string;
}) {
  const { t } = useLocale();

  const handleShare = async () => {
    const text = `「${quote}」— ${characterName}\n${t.characterGrowth.shareDisclaimer}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      alert(t.characterGrowth.copied);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="text-xs font-medium text-violet-600 hover:underline"
    >
      {t.characterGrowth.shareQuote}
    </button>
  );
}

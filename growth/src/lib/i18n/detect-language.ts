import type { Locale } from "@/types/locale";

/**
 * Detects reply language from recent user text; falls back to UI locale when unclear.
 */
export function detectReplyLanguage(
  userMessage: string,
  recentUserTexts: string[] = [],
  fallbackLocale: Locale = "en"
): Locale {
  const combined = [userMessage, ...recentUserTexts].join(" ").trim();
  if (!combined) {
    return fallbackLocale;
  }

  const cjkCount = (combined.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
  const latinCount = (combined.match(/[a-zA-Z]/g) ?? []).length;

  if (cjkCount >= 2 && cjkCount >= latinCount) {
    return "zh";
  }
  if (latinCount >= 3 && latinCount > cjkCount) {
    return "en";
  }

  return fallbackLocale;
}

/**
 * Builds an LLM instruction for matching the user's language.
 */
export function replyLanguageInstruction(replyLang: Locale): string {
  if (replyLang === "zh") {
    return "You MUST reply in Chinese (Simplified), matching the language of the user's latest message.";
  }
  return "You MUST reply in English, matching the language of the user's latest message.";
}

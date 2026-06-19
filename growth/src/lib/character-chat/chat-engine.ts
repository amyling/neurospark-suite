import { completeChat } from "@/lib/ai/provider";
import { isLLMConfigured } from "@/lib/ai/config";
import {
  detectReplyLanguage,
  replyLanguageInstruction,
} from "@/lib/i18n/detect-language";
import { classifyRisk, getSafetyCrisisMessage } from "@/lib/youthmentor/risk";
import { getKnowledgeAttribution } from "@/lib/character-chat/knowledge/attribution";
import { buildRagPromptBlock } from "@/lib/character-chat/knowledge/search";
import {
  buildKnowledgeMockReply,
  buildKnowledgePromptBlock,
} from "@/lib/character-chat/knowledge";
import { buildMemoryPromptBlock } from "@/lib/character-chat/memory";
import { getIntimacyUnlockNote } from "@/lib/character-chat/intimacy";
import { getMockStyles } from "@/lib/character-chat/mock-styles";
import type { Locale } from "@/types/locale";
import type {
  CharacterChatResponse,
  ChatCharacter,
  ChatMessage,
} from "@/types/character-chat";

/**
 * Picks a random item from a list.
 */
function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Finds a topic-specific reply or falls back to generic lines.
 */
function matchTopicReply(
  text: string,
  style: ReturnType<typeof getMockStyles>[string]
): string | null {
  if (!style) {
    return null;
  }
  for (const topic of style.topicReplies) {
    if (topic.pattern.test(text)) {
      return pick(topic.replies);
    }
  }
  return null;
}

/**
 * Builds a mock in-character reply when LLM is unavailable.
 */
function buildCharacterReply(
  character: ChatCharacter,
  userMessage: string,
  replyLang: Locale
): string {
  const knowledgeReply = buildKnowledgeMockReply(
    character.id,
    character.name,
    userMessage,
    replyLang
  );
  if (knowledgeReply) {
    const styles = getMockStyles(replyLang);
    const style = styles[character.id];
    if (style) {
      const body = matchTopicReply(userMessage, style) ?? pick(style.fallback);
      return `${pick(style.openers)} ${body} ${knowledgeReply}`;
    }
    return knowledgeReply;
  }

  const styles = getMockStyles(replyLang);
  const style = styles[character.id];

  if (style) {
    const body = matchTopicReply(userMessage, style) ?? pick(style.fallback);
    return `${pick(style.openers)} ${body} ${pick(style.closers)}`;
  }

  if (replyLang === "zh") {
    return `作为${character.name}：${character.personality}。关于你说的这件事——${character.speakingStyle}`;
  }

  return `As ${character.name}: ${character.personality}. About what you said — ${character.speakingStyle}`;
}

/**
 * Builds the system prompt for in-character LLM role-play.
 */
function buildSystemPrompt(
  character: ChatCharacter,
  replyLang: Locale,
  uiLocale: Locale
): string {
  const uiNote =
    uiLocale === "zh"
      ? "界面语言为中文；角色设定如下。"
      : "UI locale is English; character profile below.";

  return [
    `You are role-playing as "${character.name}" in an AI simulation app.`,
    "You are NOT the real person. Do not claim official endorsement.",
    uiNote,
    `Description: ${character.description}`,
    `Personality: ${character.personality}`,
    `Speaking style: ${character.speakingStyle}`,
    replyLanguageInstruction(replyLang),
    "Stay in character. Keep replies concise (2-4 short paragraphs). Ask follow-up questions when helpful.",
    "Ground answers in the knowledge base themes and documented rhetoric — paraphrase naturally, do not invent new doctrines.",
    "If the user mentions self-harm, suicide, or immediate danger, stop role-play and urge them to contact a trusted adult or emergency services — in the user's language.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Resolves reply language from the latest user message and recent history.
 */
function resolveReplyLanguage(
  userMessage: string,
  history: ChatMessage[],
  uiLocale: Locale
): Locale {
  const recentUserTexts = history
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content);
  return detectReplyLanguage(userMessage, recentUserTexts, uiLocale);
}

/**
 * Calls the configured LLM for a character reply.
 */
async function buildLLMCharacterReply(
  character: ChatCharacter,
  userMessage: string,
  history: ChatMessage[],
  uiLocale: Locale,
  replyLang: Locale,
  intimacyLevel: 1 | 2 | 3 = 1,
  reflectionContext?: string
): Promise<string | null> {
  if (!isLLMConfigured()) {
    return null;
  }

  const recent = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-16)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const systemPrompt = [
    buildSystemPrompt(character, replyLang, uiLocale),
    buildMemoryPromptBlock(character.id, uiLocale),
    buildKnowledgePromptBlock(character.id, userMessage, replyLang),
    buildRagPromptBlock(character.id, userMessage, replyLang, intimacyLevel),
    getIntimacyUnlockNote(intimacyLevel, uiLocale),
    reflectionContext
      ? `--- REFLECTION CONTEXT ---\n${reflectionContext}\n--- END ---`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const llmText = await completeChat({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...recent,
      { role: "user", content: userMessage },
    ],
    temperature: 0.75,
  });

  return llmText.trim() || null;
}

/**
 * Processes one user turn in a character chat session.
 */
export async function processCharacterChat(
  character: ChatCharacter,
  userMessage: string,
  locale: Locale,
  history: ChatMessage[] = [],
  options?: {
    intimacyLevel?: 1 | 2 | 3;
    reflectionContext?: string;
  }
): Promise<CharacterChatResponse> {
  const risk = await classifyRisk(userMessage, locale);

  if (risk.safetyLevel === "high_risk") {
    return {
      blocked: true,
      crisisMessage: getSafetyCrisisMessage(locale),
    };
  }

  const replyLang = resolveReplyLanguage(userMessage, history, locale);
  const intimacyLevel = options?.intimacyLevel ?? 1;

  const llmReply = await buildLLMCharacterReply(
    character,
    userMessage,
    history,
    locale,
    replyLang,
    intimacyLevel,
    options?.reflectionContext
  );
  const content =
    llmReply ?? buildCharacterReply(character, userMessage, replyLang);

  const attribution = getKnowledgeAttribution(
    character.id,
    userMessage,
    locale
  );
  const footnote =
    attribution && character.isBuiltIn
      ? locale === "zh"
        ? `\n\n— 参考思路：${attribution}`
        : `\n\n— Reference themes: ${attribution}`
      : "";

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: `${content}${footnote}`,
    createdAt: new Date().toISOString(),
  };

  return { blocked: false, message };
}

import {
  getCharacterMemory,
  getUserProfile,
  saveCharacterMemory,
} from "@/lib/character-chat/growth-storage";
import type { ChatMessage } from "@/types/character-chat";
import type { Locale } from "@/types/locale";

const GOAL_PATTERN =
  /我会|我要|打算|计划|try to|i will|i plan|goal|目标|每天|every day/i;
const NAME_PATTERN = /我叫|我是|my name is|call me/i;

/**
 * Extracts simple memory facts from a conversation turn (no LLM).
 */
export function extractMemoryFacts(
  userMessage: string,
  assistantReply: string
): string[] {
  const facts: string[] = [];
  const nameMatch = userMessage.match(
    /(?:我叫|我是|call me|my name is)\s*([^\s，,。.!?\n]{1,20})/i
  );
  if (nameMatch?.[1]) {
    facts.push(`User prefers to be called ${nameMatch[1].trim()}.`);
  }
  if (GOAL_PATTERN.test(userMessage)) {
    const snippet =
      userMessage.length > 100 ? `${userMessage.slice(0, 100)}…` : userMessage;
    facts.push(`User mentioned a goal or plan: ${snippet}`);
  }
  const topicSnippet =
    userMessage.length > 60 ? userMessage.slice(0, 60) : userMessage;
  facts.push(`Recent concern: ${topicSnippet}`);
  if (assistantReply.includes("?") || assistantReply.includes("？")) {
    facts.push("Last reply included a follow-up question — continue the thread.");
  }
  return facts;
}

/**
 * Updates character memory after a chat turn.
 */
export function updateMemoryFromTurn(
  characterId: string,
  userMessage: string,
  assistantReply: string
): void {
  const current = getCharacterMemory(characterId);
  const newFacts = extractMemoryFacts(userMessage, assistantReply);
  const mergedFacts = [...newFacts, ...current.facts]
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .slice(0, 12);

  const topic =
    userMessage.length > 40 ? `${userMessage.slice(0, 40)}…` : userMessage;
  const lastTopics = [topic, ...current.lastTopics].slice(0, 5);

  let pendingGoal = current.pendingGoal;
  if (GOAL_PATTERN.test(userMessage)) {
    pendingGoal =
      userMessage.length > 80 ? `${userMessage.slice(0, 80)}…` : userMessage;
  }

  saveCharacterMemory({
    characterId,
    facts: mergedFacts,
    lastTopics,
    pendingGoal,
    llmSummary: current.llmSummary ?? null,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Builds a memory block for LLM system prompts.
 */
export function buildMemoryPromptBlock(
  characterId: string,
  locale: Locale
): string {
  const profile = getUserProfile();
  const memory = getCharacterMemory(characterId);
  const lines: string[] = [
    "--- USER MEMORY (use naturally, do not recite as a list) ---",
  ];

  if (profile.displayName) {
    lines.push(
      locale === "zh"
        ? `用户称呼：${profile.displayName}`
        : `User display name: ${profile.displayName}`
    );
  }
  if (profile.gradeOrRole) {
    lines.push(
      locale === "zh"
        ? `身份/年级：${profile.gradeOrRole}`
        : `Role/grade: ${profile.gradeOrRole}`
    );
  }
  if (memory.pendingGoal) {
    lines.push(
      locale === "zh"
        ? `用户曾提到的目标：${memory.pendingGoal}`
        : `User's stated goal: ${memory.pendingGoal}`
    );
  }
  if (memory.llmSummary) {
    lines.push(
      locale === "zh"
        ? `长期记忆摘要：${memory.llmSummary}`
        : `Long-term memory summary: ${memory.llmSummary}`
    );
  }
  memory.facts.slice(0, 6).forEach((f) => lines.push(`- ${f}`));
  lines.push("--- END MEMORY ---");
  return lines.join("\n");
}

/**
 * Builds a personalized greeting suffix from memory.
 */
export function buildMemoryGreetingSuffix(
  characterId: string,
  locale: Locale
): string {
  const memory = getCharacterMemory(characterId);
  if (memory.pendingGoal) {
    return locale === "zh"
      ? `\n\n上次你提到：${memory.pendingGoal} 今天进展如何？`
      : `\n\nLast time you mentioned: ${memory.pendingGoal} How is it going today?`;
  }
  if (memory.lastTopics[0]) {
    return locale === "zh"
      ? `\n\n我们上次谈到：${memory.lastTopics[0]} 想继续吗？`
      : `\n\nWe last spoke about: ${memory.lastTopics[0]} Shall we continue?`;
  }
  return "";
}

/**
 * Persists an LLM-generated memory summary for a character.
 */
export function saveLlmMemorySummary(
  characterId: string,
  summary: string
): void {
  const current = getCharacterMemory(characterId);
  saveCharacterMemory({
    ...current,
    llmSummary: summary.trim(),
    updatedAt: new Date().toISOString(),
  });
}

const MEMORY_SUMMARY_INTERVAL = 5;

/**
 * Returns true when an LLM memory refresh should run.
 */
export function shouldRefreshLlmMemory(messageCount: number): boolean {
  return messageCount > 0 && messageCount % MEMORY_SUMMARY_INTERVAL === 0;
}

/**
 * Summarizes recent messages for reflection debrief context.
 */
export function summarizeRecentMessages(messages: ChatMessage[]): string {
  return messages
    .slice(-8)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
}

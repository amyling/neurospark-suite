import type { ChatCharacter, CharacterChatSession } from "@/types/character-chat";

const CUSTOM_CHARACTERS_KEY = "youthmentor_custom_characters";
const CHAT_SESSIONS_KEY = "youthmentor_character_sessions";

/**
 * Loads user-created characters from localStorage.
 */
export function getCustomCharacters(): ChatCharacter[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(CUSTOM_CHARACTERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ChatCharacter[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists a new custom character.
 */
export function saveCustomCharacter(character: ChatCharacter): void {
  const existing = getCustomCharacters();
  const next = [...existing.filter((c) => c.id !== character.id), character];
  localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(next));
}

/**
 * Removes a custom character and its chat session.
 */
export function deleteCustomCharacter(id: string): void {
  const next = getCustomCharacters().filter((c) => c.id !== id);
  localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(next));
  deleteChatSession(id);
}

/**
 * Loads a chat session for the given character id.
 */
export function getChatSession(characterId: string): CharacterChatSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
    if (!raw) {
      return null;
    }
    const sessions = JSON.parse(raw) as Record<string, CharacterChatSession>;
    return sessions[characterId] ?? null;
  } catch {
    return null;
  }
}

/**
 * Saves messages for a character chat session.
 */
export function saveChatSession(session: CharacterChatSession): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
    const sessions = raw
      ? (JSON.parse(raw) as Record<string, CharacterChatSession>)
      : {};
    sessions[session.characterId] = session;
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    /* ignore */
  }
}

/**
 * Clears chat history for one character.
 */
export function deleteChatSession(characterId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
    if (!raw) {
      return;
    }
    const sessions = JSON.parse(raw) as Record<string, CharacterChatSession>;
    delete sessions[characterId];
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    /* ignore */
  }
}

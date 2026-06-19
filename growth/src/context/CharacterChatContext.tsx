"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addMessageFeedback,
  consumeReflectionDebrief,
  getCharacterMemory,
  getCoachingPackProgress,
  getInsightStats,
  getUserProfile,
  recordInsightEvent,
  saveCoachingPackProgress,
  saveUserProfile,
} from "@/lib/character-chat/growth-storage";
import {
  getCharacterRelationship,
  recordCharacterActivity,
} from "@/lib/character-chat/intimacy";
import {
  buildMemoryGreetingSuffix,
  saveLlmMemorySummary,
  shouldRefreshLlmMemory,
  summarizeRecentMessages,
  updateMemoryFromTurn,
} from "@/lib/character-chat/memory";
import {
  buildCoachingPackPrompt,
  COACHING_PACKS,
} from "@/lib/character-chat/coaching-packs";
import { recordMessageSent } from "@/lib/character-chat/usage-limits";
import {
  getBuiltinCharacter,
  getBuiltinCharacters,
} from "@/lib/character-chat/presets";
import { buildReflectionDebriefBlock } from "@/lib/character-chat/reflection-bridge";
import { getScenarioCards } from "@/lib/character-chat/scenarios";
import {
  deleteChatSession,
  deleteCustomCharacter,
  getChatSession,
  getCustomCharacters,
  saveChatSession,
  saveCustomCharacter,
} from "@/lib/character-chat/storage";
import { useGrowthSettings } from "@/context/GrowthSettingsContext";
import { useLocale } from "@/context/LocaleContext";
import type { CoachingPackId, ScenarioId } from "@/types/character-growth";
import type { CharacterRelationship } from "@/types/character-growth";
import type {
  ChatCharacter,
  ChatMessage,
  CharacterCategory,
} from "@/types/character-chat";

type CharacterChatContextValue = {
  characters: ChatCharacter[];
  activeCharacter: ChatCharacter | null;
  messages: ChatMessage[];
  isSending: boolean;
  crisisMessage: string | null;
  relationship: CharacterRelationship | null;
  profile: ReturnType<typeof getUserProfile>;
  selectCharacter: (character: ChatCharacter) => void;
  startScenario: (scenarioId: ScenarioId) => Promise<void>;
  startCoachingPack: (packId: CoachingPackId) => Promise<void>;
  createCharacter: (
    input: Omit<
      ChatCharacter,
      "id" | "isBuiltIn" | "createdAt" | "category"
    > & { category?: CharacterCategory }
  ) => ChatCharacter;
  removeCustomCharacter: (id: string) => void;
  clearChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  submitFeedback: (messageId: string, rating: "up" | "down") => void;
  updateProfile: (displayName: string, gradeOrRole: string) => void;
  setFavoriteCharacter: (characterId: string) => void;
  loadReflectionDebrief: () => Promise<void>;
};

const CharacterChatContext = createContext<CharacterChatContextValue | null>(
  null
);

function localizeCharacter(
  character: ChatCharacter,
  locale: ReturnType<typeof useLocale>["locale"]
): ChatCharacter {
  if (!character.isBuiltIn) {
    return character;
  }
  return getBuiltinCharacter(character.id, locale) ?? character;
}

/**
 * Provides character chat with memory, intimacy, scenarios, and reflection bridge.
 */
export function CharacterChatProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const { canSendMessage, refreshUsage, settings } = useGrowthSettings();

  const [customCharacters, setCustomCharacters] = useState<ChatCharacter[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [crisisMessage, setCrisisMessage] = useState<string | null>(null);
  const [relationship, setRelationship] = useState<CharacterRelationship | null>(
    null
  );
  const [profile, setProfile] = useState(getUserProfile());
  const [pendingReflectionContext, setPendingReflectionContext] = useState<
    string | null
  >(null);

  useEffect(() => {
    setCustomCharacters(getCustomCharacters());
    setProfile(getUserProfile());
  }, []);

  const characters = useMemo(
    () => [...getBuiltinCharacters(locale), ...customCharacters],
    [locale, customCharacters]
  );

  const activeCharacter = useMemo(() => {
    if (!activeCharacterId) {
      return null;
    }
    return characters.find((c) => c.id === activeCharacterId) ?? null;
  }, [activeCharacterId, characters]);

  const persistSession = useCallback(
    (characterId: string, nextMessages: ChatMessage[]) => {
      saveChatSession({
        characterId,
        messages: nextMessages,
        updatedAt: new Date().toISOString(),
      });
    },
    []
  );

  const makeGreeting = useCallback(
    (character: ChatCharacter): ChatMessage => {
      const suffix = buildMemoryGreetingSuffix(character.id, locale);
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `${character.greeting}${suffix}`,
        createdAt: new Date().toISOString(),
      };
    },
    [locale]
  );

  const initSession = useCallback(
    (character: ChatCharacter): ChatMessage[] => {
      const session = getChatSession(character.id);
      if (session?.messages.length) {
        return session.messages;
      }
      return [makeGreeting(character)];
    },
    [makeGreeting]
  );

  const selectCharacter = useCallback(
    (character: ChatCharacter) => {
      const localized = localizeCharacter(character, locale);
      setActiveCharacterId(localized.id);
      setCrisisMessage(null);
      setRelationship(getCharacterRelationship(localized.id));
      const initial = initSession(localized);
      setMessages(initial);
      persistSession(localized.id, initial);
    },
    [initSession, locale, persistSession]
  );

  const refreshLlmMemory = useCallback(
    async (character: ChatCharacter, history: ChatMessage[]) => {
      const memory = getCharacterMemory(character.id);
      try {
        const res = await fetch("/api/character-memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            characterId: character.id,
            characterName: character.name,
            facts: memory.facts,
            recentTurns: summarizeRecentMessages(history),
            locale,
          }),
        });
        const data = (await res.json()) as { summary?: string | null };
        if (data.summary) {
          saveLlmMemorySummary(character.id, data.summary);
        }
      } catch {
        /* non-blocking */
      }
    },
    [locale]
  );

  const postChat = useCallback(
    async (
      character: ChatCharacter,
      text: string,
      history: ChatMessage[],
      reflectionCtx?: string | null
    ) => {
      if (!text.trim() || isSending) {
        return;
      }
      if (!settings.isPremium && !canSendMessage) {
        return;
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };
      const withUser = [...history, userMessage];
      setMessages(withUser);
      setIsSending(true);
      setCrisisMessage(null);

      const rel = recordCharacterActivity(character.id);
      setRelationship(rel);
      const stats = getInsightStats();
      recordInsightEvent({
        totalMessages: stats.totalMessages + 1,
        activeDays: Math.max(stats.activeDays, rel.streakDays),
      });
      if (!settings.isPremium) {
        recordMessageSent();
        refreshUsage();
      }

      try {
        const res = await fetch("/api/character-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            character,
            messages: history,
            userMessage: text.trim(),
            locale,
            intimacyLevel: rel.intimacyLevel,
            reflectionContext: reflectionCtx ?? undefined,
          }),
        });

        const data = (await res.json()) as {
          blocked?: boolean;
          message?: ChatMessage;
          crisisMessage?: string;
        };

        if (data.blocked) {
          setCrisisMessage(data.crisisMessage ?? null);
          persistSession(character.id, withUser);
          return;
        }

        if (data.message) {
          updateMemoryFromTurn(character.id, text.trim(), data.message.content);
          const next = [...withUser, data.message];
          setMessages(next);
          persistSession(character.id, next);
          if (shouldRefreshLlmMemory(rel.messageCount)) {
            void refreshLlmMemory(character, next);
          }
        }
      } finally {
        setIsSending(false);
        setPendingReflectionContext(null);
      }
    },
    [
      canSendMessage,
      isSending,
      locale,
      persistSession,
      refreshUsage,
      settings.isPremium,
      refreshLlmMemory,
    ]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeCharacter) {
        return;
      }
      await postChat(activeCharacter, text, messages, pendingReflectionContext);
    },
    [activeCharacter, messages, pendingReflectionContext, postChat]
  );

  const startScenario = useCallback(
    async (scenarioId: ScenarioId) => {
      const card = getScenarioCards(locale).find((c) => c.id === scenarioId);
      if (!card) {
        return;
      }
      const character = characters.find((c) => c.id === card.characterId);
      if (!character) {
        return;
      }
      recordInsightEvent({ scenarioId });
      card.stressTags.forEach((tag) => recordInsightEvent({ stressTag: tag }));
      const localized = localizeCharacter(character, locale);
      setActiveCharacterId(localized.id);
      setRelationship(getCharacterRelationship(localized.id));
      const initial = initSession(localized);
      setMessages(initial);
      await postChat(localized, card.prompt, initial);
    },
    [characters, initSession, locale, postChat]
  );

  const startCoachingPack = useCallback(
    async (packId: CoachingPackId) => {
      const pack = COACHING_PACKS.find((p) => p.id === packId);
      if (!pack) {
        return;
      }
      const character = characters.find((c) => c.id === pack.characterId);
      if (!character) {
        return;
      }
      const existing = getCoachingPackProgress();
      const today = new Date().toISOString().slice(0, 10);
      let currentDay = 1;
      if (existing?.packId === packId) {
        const lastStart = existing.startedAt.slice(0, 10);
        if (lastStart !== today) {
          currentDay = Math.min(
            existing.currentDay + 1,
            pack.durationDays
          );
        } else {
          currentDay = existing.currentDay;
        }
      }
      saveCoachingPackProgress({
        packId,
        characterId: pack.characterId,
        startedAt: new Date().toISOString(),
        currentDay,
        completedDays: [
          ...new Set([...(existing?.completedDays ?? []), currentDay]),
        ],
      });
      recordInsightEvent({ scenarioId: `pack_${packId}` });
      const localized = localizeCharacter(character, locale);
      setActiveCharacterId(localized.id);
      setRelationship(getCharacterRelationship(localized.id));
      const initial = initSession(localized);
      setMessages(initial);
      const prompt = buildCoachingPackPrompt(packId, currentDay, locale);
      await postChat(localized, prompt, initial);
    },
    [characters, initSession, locale, postChat]
  );

  const loadReflectionDebrief = useCallback(async () => {
    const payload = consumeReflectionDebrief();
    if (!payload) {
      return;
    }
    const character =
      characters.find((c) => c.id === payload.suggestedCharacterId) ??
      getBuiltinCharacter(payload.suggestedCharacterId, locale);
    if (!character) {
      return;
    }
    const ctx = buildReflectionDebriefBlock(payload, locale);
    setPendingReflectionContext(ctx);
    const localized = localizeCharacter(character, locale);
    setActiveCharacterId(localized.id);
    const initial = initSession(localized);
    setMessages(initial);
    const prompt =
      locale === "zh"
        ? "我刚完成了一次情绪反思，请帮我总结并给我2-3条具体建议。"
        : "I just finished a wellbeing reflection. Please summarize and give me 2-3 concrete next steps.";
    await postChat(localized, prompt, initial, ctx);
  }, [characters, initSession, locale, postChat]);

  useEffect(() => {
    if (!activeCharacterId) {
      return;
    }
    const localized = characters.find((c) => c.id === activeCharacterId);
    if (!localized?.isBuiltIn) {
      return;
    }
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        const greeting = makeGreeting(localized);
        persistSession(activeCharacterId, [greeting]);
        return [greeting];
      }
      return prev;
    });
  }, [locale, activeCharacterId, characters, makeGreeting, persistSession]);

  const createCharacter = useCallback(
    (
      input: Omit<
        ChatCharacter,
        "id" | "isBuiltIn" | "createdAt" | "category"
      > & { category?: CharacterCategory }
    ) => {
      const character: ChatCharacter = {
        ...input,
        id: crypto.randomUUID(),
        category: input.category ?? "custom",
        isBuiltIn: false,
        createdAt: new Date().toISOString(),
      };
      saveCustomCharacter(character);
      setCustomCharacters(getCustomCharacters());
      return character;
    },
    []
  );

  const removeCustomCharacter = useCallback((id: string) => {
    deleteCustomCharacter(id);
    setCustomCharacters(getCustomCharacters());
    setActiveCharacterId((current) => {
      if (current === id) {
        setMessages([]);
        setRelationship(null);
        return null;
      }
      return current;
    });
  }, []);

  const clearChat = useCallback(() => {
    if (!activeCharacter) {
      return;
    }
    deleteChatSession(activeCharacter.id);
    const greeting = makeGreeting(activeCharacter);
    setMessages([greeting]);
    setCrisisMessage(null);
    persistSession(activeCharacter.id, [greeting]);
  }, [activeCharacter, makeGreeting, persistSession]);

  const submitFeedback = useCallback(
    (messageId: string, rating: "up" | "down") => {
      if (!activeCharacter) {
        return;
      }
      addMessageFeedback({
        messageId,
        characterId: activeCharacter.id,
        rating,
        createdAt: new Date().toISOString(),
      });
      recordInsightEvent({ feedback: rating });
    },
    [activeCharacter]
  );

  const updateProfile = useCallback(
    (displayName: string, gradeOrRole: string) => {
      const next = {
        ...getUserProfile(),
        displayName,
        gradeOrRole,
        updatedAt: new Date().toISOString(),
      };
      saveUserProfile(next);
      setProfile(next);
    },
    []
  );

  const setFavoriteCharacter = useCallback((characterId: string) => {
    const next = {
      ...getUserProfile(),
      favoriteCharacterId: characterId,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfile(next);
    setProfile(next);
  }, []);

  const value = useMemo(
    () => ({
      characters,
      activeCharacter,
      messages,
      isSending,
      crisisMessage,
      relationship,
      profile,
      selectCharacter,
      startScenario,
      startCoachingPack,
      createCharacter,
      removeCustomCharacter,
      clearChat,
      sendMessage,
      submitFeedback,
      updateProfile,
      setFavoriteCharacter,
      loadReflectionDebrief,
    }),
    [
      characters,
      activeCharacter,
      messages,
      isSending,
      crisisMessage,
      relationship,
      profile,
      selectCharacter,
      startScenario,
      startCoachingPack,
      createCharacter,
      removeCustomCharacter,
      clearChat,
      sendMessage,
      submitFeedback,
      updateProfile,
      setFavoriteCharacter,
      loadReflectionDebrief,
    ]
  );

  return (
    <CharacterChatContext.Provider value={value}>
      {children}
    </CharacterChatContext.Provider>
  );
}

export function useCharacterChat(): CharacterChatContextValue {
  const ctx = useContext(CharacterChatContext);
  if (!ctx) {
    throw new Error(
      "useCharacterChat must be used within CharacterChatProvider"
    );
  }
  return ctx;
}

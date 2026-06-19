export type CharacterCategory = "celebrity" | "religious" | "custom";

export type ChatCharacter = {
  id: string;
  name: string;
  avatar: string;
  category: CharacterCategory;
  description: string;
  greeting: string;
  personality: string;
  speakingStyle: string;
  isBuiltIn: boolean;
  createdAt?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type CharacterChatSession = {
  characterId: string;
  messages: ChatMessage[];
  updatedAt: string;
};

export type CharacterChatRequest = {
  character: ChatCharacter;
  messages: ChatMessage[];
  userMessage: string;
  locale: "en" | "zh";
  intimacyLevel?: 1 | 2 | 3;
  reflectionContext?: string;
};

export type CharacterChatResponse = {
  blocked: boolean;
  message?: ChatMessage;
  crisisMessage?: string;
};

import { NextResponse } from "next/server";
import { processCharacterChat } from "@/lib/character-chat/chat-engine";
import { DEFAULT_LOCALE } from "@/types/locale";
import type { CharacterChatRequest } from "@/types/character-chat";

/**
 * API route for character role-play chat (mock engine; swap for LLM later).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CharacterChatRequest;
    const { character, userMessage, messages = [] } = body;
    const locale =
      body.locale === "zh" || body.locale === "en"
        ? body.locale
        : DEFAULT_LOCALE;

    if (!character?.id || !userMessage?.trim()) {
      return NextResponse.json(
        { error: "Character and userMessage are required." },
        { status: 400 }
      );
    }

    const result = await processCharacterChat(
      character,
      userMessage.trim(),
      locale,
      Array.isArray(messages) ? messages : [],
      {
        intimacyLevel: body.intimacyLevel,
        reflectionContext: body.reflectionContext,
      }
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}

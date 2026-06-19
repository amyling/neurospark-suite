import { NextResponse } from "next/server";
import { completeChat } from "@/lib/ai/provider";
import { isLLMConfigured } from "@/lib/ai/config";
import { DEFAULT_LOCALE } from "@/types/locale";

type MemoryRequest = {
  characterId: string;
  characterName: string;
  facts: string[];
  recentTurns: string;
  locale?: "en" | "zh";
};

/**
 * API route that refreshes character long-term memory via LLM summarization.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MemoryRequest;
    const locale =
      body.locale === "zh" || body.locale === "en"
        ? body.locale
        : DEFAULT_LOCALE;

    if (!body.characterId || !Array.isArray(body.facts)) {
      return NextResponse.json(
        { error: "characterId and facts are required." },
        { status: 400 }
      );
    }

    if (!isLLMConfigured()) {
      const fallback = body.facts.slice(0, 4).join(" ");
      return NextResponse.json({ summary: fallback || null });
    }

    const prompt =
      locale === "zh"
        ? `你是记忆助手。为角色「${body.characterName}」整理用户长期记忆（3-5句中文），保留姓名、目标、烦恼、承诺。不要编造。\n事实：\n${body.facts.join("\n")}\n最近对话：\n${body.recentTurns}`
        : `You are a memory assistant. Summarize long-term user memory for character "${body.characterName}" in 3-5 English sentences. Keep name, goals, worries, commitments. Do not invent.\nFacts:\n${body.facts.join("\n")}\nRecent:\n${body.recentTurns}`;

    const summary = await completeChat({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return NextResponse.json({ summary: summary.trim() || null });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

import {
  applyDevProfileEnv,
  getProviderChain,
  isChainProviderConfigured,
  isLLMConfigured,
  resolveAIConfig,
  type ChainProviderId,
} from "./config";

export type AIProviderKind =
  | "mock"
  | "openai"
  | "gemini"
  | "groq"
  | "ollama";

export type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatRequest = {
  messages: ChatCompletionMessage[];
  temperature?: number;
};

export { isLLMConfigured, resolveAIConfig };

/**
 * Multi-turn chat completion with EDULENS provider chain fallback.
 */
export async function completeChat(request: AIChatRequest): Promise<string> {
  const chain = getProviderChain();
  if (chain.length > 0) {
    for (const id of chain) {
      if (!isChainProviderConfigured(id)) {
        continue;
      }
      try {
        const result = await callChainProviderChat(id, request);
        if (result.trim()) {
          return result;
        }
      } catch (error) {
        console.error(`[YouthMentor AI] ${id} failed:`, error);
      }
    }
    return "";
  }

  const cfg = resolveAIConfig();
  if (cfg.mode === "mock") {
    return "";
  }

  try {
    if (cfg.mode === "gemini" && cfg.gemini?.apiKey) {
      return await callGeminiChat(request, cfg.gemini.model);
    }

    if (cfg.openaiCompat?.apiKey || cfg.mode === "ollama") {
      const compat = cfg.openaiCompat!;
      const isOpenRouter =
        cfg.mode === "openrouter" ||
        process.env.EDULENS_USE_OPENROUTER === "true";
      return await callOpenAICompatibleChat(
        compat.baseUrl,
        compat.apiKey,
        compat.model,
        request,
        isOpenRouter
      );
    }
  } catch (error) {
    console.error("[YouthMentor AI] Provider error:", error);
  }
  return "";
}

/** Human-readable provider info for status UI */
export function getProviderInfo(): {
  configured: boolean;
  mode: string;
  textModel: string;
  profileLabel: string;
  providerChain?: string;
} {
  applyDevProfileEnv();
  const chain = getProviderChain().filter(isChainProviderConfigured);
  if (chain.length > 0) {
    return {
      configured: true,
      mode: "chain",
      textModel: process.env.OLLAMA_MODEL ?? "see chain",
      profileLabel: process.env.EDULENS_DEV_PROFILE ?? "chain",
      providerChain: chain.join(" → "),
    };
  }
  const cfg = resolveAIConfig();
  return {
    configured: cfg.mode !== "mock",
    mode: cfg.mode === "openrouter" ? "openrouter" : cfg.mode,
    textModel: cfg.textModel,
    profileLabel: cfg.profileLabel,
  };
}

async function callChainProviderChat(
  id: ChainProviderId,
  request: AIChatRequest
): Promise<string> {
  switch (id) {
    case "ollama":
      return callOpenAICompatibleChat(
        process.env.OLLAMA_API_URL ??
          "http://127.0.0.1:11434/v1/chat/completions",
        process.env.OLLAMA_API_KEY ?? "ollama",
        process.env.OLLAMA_MODEL ?? "llama3.2",
        request
      );
    case "gemini":
      return callGeminiChat(
        request,
        process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
      );
    case "groq":
      return callOpenAICompatibleChat(
        process.env.GROQ_API_URL ??
          "https://api.groq.com/openai/v1/chat/completions",
        process.env.GROQ_API_KEY ?? "",
        process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        request
      );
    case "deepseek":
      return callOpenAICompatibleChat(
        process.env.DEEPSEEK_API_URL ??
          "https://api.deepseek.com/v1/chat/completions",
        process.env.DEEPSEEK_API_KEY ?? "",
        process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
        request
      );
    case "openrouter":
      return callOpenAICompatibleChat(
        process.env.OPENROUTER_API_URL ??
          "https://openrouter.ai/api/v1/chat/completions",
        process.env.OPENROUTER_API_KEY ?? "",
        process.env.OPENROUTER_MODEL ?? "openrouter/free",
        request,
        true
      );
    case "nvidia":
      return callOpenAICompatibleChat(
        process.env.NVIDIA_API_URL ??
          "https://integrate.api.nvidia.com/v1/chat/completions",
        process.env.NVIDIA_API_KEY ?? "",
        process.env.NVIDIA_MODEL ?? "deepseek-ai/deepseek-r1-distill-qwen-32b",
        request
      );
    case "openai":
      return callOpenAICompatibleChat(
        process.env.OPENAI_API_URL ??
          "https://api.openai.com/v1/chat/completions",
        process.env.OPENAI_API_KEY ?? "",
        process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        request
      );
    default:
      return "";
  }
}

async function callOpenAICompatibleChat(
  url: string,
  apiKey: string,
  model: string,
  request: AIChatRequest,
  isOpenRouter = false
): Promise<string> {
  const isLocal = url.includes("127.0.0.1") || url.includes("localhost");
  if (!apiKey && !isLocal) {
    throw new Error("API key missing for OpenAI-compatible provider");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (isOpenRouter || url.includes("openrouter")) {
    headers["HTTP-Referer"] =
      process.env.OPENROUTER_REFERER ?? "http://localhost:3007";
    headers["X-Title"] = "YouthMentor AI";
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: request.temperature ?? 0.7,
      messages: request.messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `OpenAI-compatible API error: ${response.status} ${errText.slice(0, 200)}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callGeminiChat(
  request: AIChatRequest,
  model: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const systemParts = request.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content);
  const conversation = request.messages.filter((m) => m.role !== "system");

  const contents = conversation.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: systemParts.length
        ? { parts: [{ text: systemParts.join("\n\n") }] }
        : undefined,
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini API error: ${response.status} ${errText.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

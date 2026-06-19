import type { AIProviderKind } from "./provider";

/**
 * Dev profiles — switch one variable to change the whole stack.
 * All profiles keep the same code path; only env / endpoints differ.
 */
export type DevAIProfile =
  | "mock"
  | "agnes-free"
  | "gemini-free"
  | "groq-free"
  | "ollama-local"
  | "openai"
  | "openrouter-free";

/** Default Agnes API hub (OpenAI-compatible) */
export const AGNES_DEFAULT_API_URL =
  "https://apihub.agnes-ai.com/v1/chat/completions";

/** Default Agnes text + vision model id */
export const AGNES_DEFAULT_MODEL = "agnes-2.0-flash";

/** Provider ids in EDULENS_PROVIDER_CHAIN (comma-separated, tried in order) */
export type ChainProviderId =
  | "agnes"
  | "ollama"
  | "gemini"
  | "groq"
  | "deepseek"
  | "openrouter"
  | "nvidia"
  | "openai";

const CHAIN_ALIASES: Record<string, ChainProviderId> = {
  agnes: "agnes",
  ollama: "ollama",
  gemini: "gemini",
  groq: "groq",
  deepseek: "deepseek",
  openrouter: "openrouter",
  nvidia: "nvidia",
  openai: "openai",
};

export type ResolvedAIConfig = {
  mode: AIProviderKind | "openrouter" | "agnes";
  textModel: string;
  visionModel: string;
  openaiCompat?: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  gemini?: { apiKey: string; model: string; visionModel: string };
  profileLabel: string;
  hints: string[];
};

const PROFILE_DEFAULTS: Record<
  DevAIProfile,
  Partial<{
    mode: AIProviderKind | "openrouter";
    geminiModel: string;
    groqModel: string;
    groqVisionModel: string;
    ollamaModel: string;
    ollamaVisionModel: string;
    openaiModel: string;
    openaiVisionModel: string;
    openrouterModel: string;
    agnesModel: string;
  }>
> = {
  mock: { mode: "mock" },
  "agnes-free": {
    mode: "agnes",
    agnesModel: AGNES_DEFAULT_MODEL,
  },
  "gemini-free": {
    mode: "gemini",
    geminiModel: "gemini-2.0-flash",
  },
  "groq-free": {
    mode: "groq",
    groqModel: "llama-3.3-70b-versatile",
    groqVisionModel: "meta-llama/llama-4-scout-17b-16e-instruct",
  },
  "ollama-local": {
    mode: "ollama",
    ollamaModel: "llama3.2",
    ollamaVisionModel: "llama3.2-vision",
  },
  openai: {
    mode: "openai",
    openaiModel: "gpt-4o-mini",
    openaiVisionModel: "gpt-4o",
  },
  "openrouter-free": {
    mode: "openrouter",
    openrouterModel: "google/gemini-2.0-flash-exp:free",
  },
};

/**
 * Applies dev profile defaults when EDULENS_DEV_PROFILE is set.
 * Explicit EDULENS_AI_MODE always wins over profile.
 */
export function applyDevProfileEnv(): void {
  const profile = process.env.EDULENS_DEV_PROFILE?.toLowerCase() as
    | DevAIProfile
    | undefined;
  if (!profile || !PROFILE_DEFAULTS[profile]) {
    return;
  }

  const defaults = PROFILE_DEFAULTS[profile];
  const modeEnv = process.env.EDULENS_AI_MODE;
  if ((!modeEnv || modeEnv === "auto") && defaults.mode) {
    process.env.EDULENS_AI_MODE =
      defaults.mode === "openrouter" ? "openai" : defaults.mode;
    if (defaults.mode === "openrouter") {
      process.env.EDULENS_USE_OPENROUTER = "true";
    }
  }

  if (defaults.geminiModel && !process.env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = defaults.geminiModel;
    process.env.GEMINI_VISION_MODEL = defaults.geminiModel;
  }
  if (defaults.groqModel && !process.env.GROQ_MODEL) {
    process.env.GROQ_MODEL = defaults.groqModel;
  }
  if (defaults.groqVisionModel && !process.env.GROQ_VISION_MODEL) {
    process.env.GROQ_VISION_MODEL = defaults.groqVisionModel;
  }
  if (defaults.ollamaModel && !process.env.OLLAMA_MODEL) {
    process.env.OLLAMA_MODEL = defaults.ollamaModel;
  }
  if (defaults.ollamaVisionModel && !process.env.OLLAMA_VISION_MODEL) {
    process.env.OLLAMA_VISION_MODEL = defaults.ollamaVisionModel;
  }
  if (defaults.openaiModel && !process.env.OPENAI_MODEL) {
    process.env.OPENAI_MODEL = defaults.openaiModel;
  }
  if (defaults.openaiVisionModel && !process.env.OPENAI_VISION_MODEL) {
    process.env.OPENAI_VISION_MODEL = defaults.openaiVisionModel;
  }
  if (defaults.openrouterModel && !process.env.OPENROUTER_MODEL) {
    process.env.OPENROUTER_MODEL = defaults.openrouterModel;
  }
  if (defaults.agnesModel && !process.env.AGNES_MODEL) {
    process.env.AGNES_MODEL = defaults.agnesModel;
    process.env.AGNES_VISION_MODEL = defaults.agnesModel;
  }

  if (profile === "openrouter-free" && !process.env.OPENROUTER_API_URL) {
    process.env.OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
  }
}

/**
 * Parses EDULENS_PROVIDER_CHAIN — e.g. OLLAMA,GEMINI,GROQ,OPENROUTER,OPENAI
 */
export function getProviderChain(): ChainProviderId[] {
  const raw = process.env.EDULENS_PROVIDER_CHAIN;
  if (!raw?.trim()) {
    return [];
  }
  const chain = raw
    .split(",")
    .map((s) => CHAIN_ALIASES[s.trim().toLowerCase()])
    .filter(Boolean) as ChainProviderId[];

  if (process.env.EDULENS_SKIP_OLLAMA === "true") {
    return chain.filter((id) => id !== "ollama");
  }

  /** Cloud-first when Ollama is listed first but a configured cloud provider exists */
  if (
    process.env.EDULENS_PREFER_OLLAMA !== "true" &&
    chain[0] === "ollama" &&
    chain.length > 1
  ) {
    const hasCloud = chain
      .slice(1)
      .some((id) => id !== "ollama" && isChainProviderConfigured(id));
    if (hasCloud) {
      return [...chain.filter((id) => id !== "ollama"), "ollama"];
    }
  }

  return chain;
}

/** Whether a chain provider has credentials / can be attempted */
export function isChainProviderConfigured(id: ChainProviderId): boolean {
  switch (id) {
    case "agnes":
      return Boolean(process.env.AGNES_API_KEY?.trim());
    case "ollama":
      return true;
    case "gemini":
      return Boolean(process.env.GEMINI_API_KEY?.trim());
    case "groq":
      return Boolean(process.env.GROQ_API_KEY?.trim());
    case "deepseek":
      return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
    case "openrouter":
      return Boolean(process.env.OPENROUTER_API_KEY?.trim());
    case "nvidia":
      return Boolean(process.env.NVIDIA_API_KEY?.trim());
    case "openai":
      return Boolean(process.env.OPENAI_API_KEY?.trim());
    default:
      return false;
  }
}

/** Whether any provider in the chain supports vision OCR */
export function isChainVisionCapable(): boolean {
  const chain = getProviderChain();
  if (!chain.length) {
    return false;
  }
  return chain.some((id) => {
    if (!isChainProviderConfigured(id)) {
      return false;
    }
    if (id === "agnes") {
      return Boolean(process.env.AGNES_API_KEY?.trim());
    }
    if (id === "ollama") {
      return Boolean(process.env.OLLAMA_VISION_MODEL?.trim());
    }
    if (id === "groq") {
      return Boolean(process.env.GROQ_VISION_MODEL?.trim());
    }
    return (
      id === "gemini" ||
      id === "openrouter" ||
      id === "openai" ||
      id === "deepseek" ||
      id === "nvidia"
    );
  });
}

/** True only when EDULENS_AI_MODE is explicitly mock (demo data). */
export function isExplicitMockMode(): boolean {
  applyDevProfileEnv();
  return (process.env.EDULENS_AI_MODE ?? "").toLowerCase() === "mock";
}

/** Whether any real LLM provider is configured (chain or single mode). */
export function hasConfiguredAIProvider(): boolean {
  if (isExplicitMockMode()) {
    return false;
  }
  const chain = getProviderChain();
  if (chain.length > 0) {
    return chain.some(isChainProviderConfigured);
  }
  return autoDetectProvider() !== "mock";
}

/**
 * Auto-picks a free provider when mode is unset and keys exist.
 */
export function autoDetectProvider(): AIProviderKind | "openrouter" | "agnes" {
  if (process.env.EDULENS_PREFER_OLLAMA === "true") {
    return "ollama";
  }
  if (process.env.AGNES_API_KEY?.trim()) {
    return "agnes";
  }
  if (process.env.GEMINI_API_KEY?.trim()) {
    return "gemini";
  }
  if (process.env.GROQ_API_KEY?.trim()) {
    return "groq";
  }
  if (process.env.OPENROUTER_API_KEY?.trim()) {
    return "openrouter";
  }
  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai";
  }
  return "mock";
}

/**
 * Resolves effective AI configuration for status UI and provider layer.
 */
export function resolveAIConfig(): ResolvedAIConfig {
  applyDevProfileEnv();

  const useOpenRouter =
    process.env.EDULENS_USE_OPENROUTER === "true" &&
    getProviderChain().length === 0;
  let mode = (process.env.EDULENS_AI_MODE ?? "").toLowerCase();

  if (!mode || mode === "auto") {
    const detected = autoDetectProvider();
    if (detected === "openrouter") {
      mode = "openai";
      process.env.EDULENS_USE_OPENROUTER = "true";
    } else if (detected === "agnes") {
      mode = "agnes";
    } else {
      mode = detected;
    }
  }

  if (useOpenRouter || (process.env.OPENROUTER_API_KEY && getProviderChain().length === 0)) {
    return {
      mode: "openrouter",
      textModel: process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free",
      visionModel:
        process.env.OPENROUTER_VISION_MODEL ??
        process.env.OPENROUTER_MODEL ??
        "google/gemini-2.0-flash-exp:free",
      openaiCompat: {
        baseUrl:
          process.env.OPENROUTER_API_URL ??
          "https://openrouter.ai/api/v1/chat/completions",
        apiKey: process.env.OPENROUTER_API_KEY ?? "",
        model: process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free",
      },
      profileLabel: process.env.EDULENS_DEV_PROFILE ?? "openrouter",
      hints: [
        "OpenRouter free models — OpenAI-compatible; swap model id to switch Gemini/GPT-style models.",
        "Get key: https://openrouter.ai/keys",
      ],
    };
  }

  const profile = process.env.EDULENS_DEV_PROFILE ?? mode;

  if (mode === "agnes") {
    const model = process.env.AGNES_MODEL ?? AGNES_DEFAULT_MODEL;
    return {
      mode: "agnes",
      textModel: model,
      visionModel: process.env.AGNES_VISION_MODEL ?? model,
      openaiCompat: {
        baseUrl: process.env.AGNES_API_URL ?? AGNES_DEFAULT_API_URL,
        apiKey: process.env.AGNES_API_KEY ?? "",
        model,
      },
      profileLabel: profile,
      hints: [
        "One AGNES_API_KEY works for all models: agnes-2.0-flash (text), agnes-image-2.1-flash (diagrams), agnes-video-v2.0 (video).",
        "Register at https://platform.agnes-ai.com — no separate keys per model.",
        "Set EDULENS_MEDIA_ENABLED=false to skip image generation; EDULENS_LESSON_VIDEO=true to enable short animation clips.",
      ],
    };
  }

  if (mode === "gemini") {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    return {
      mode: "gemini",
      textModel: model,
      visionModel: process.env.GEMINI_VISION_MODEL ?? model,
      gemini: {
        apiKey: process.env.GEMINI_API_KEY ?? "",
        model,
        visionModel: process.env.GEMINI_VISION_MODEL ?? model,
      },
      profileLabel: profile,
      hints: [
        "Recommended free dev: Google AI Studio key, text + vision + JSON.",
        "https://aistudio.google.com/apikey",
        "Switch to GPT: EDULENS_AI_MODE=openai + OPENAI_API_KEY",
      ],
    };
  }

  if (mode === "groq") {
    const vision = process.env.GROQ_VISION_MODEL ?? "";
    return {
      mode: "groq",
      textModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      visionModel: vision || "N/A (set GROQ_VISION_MODEL)",
      openaiCompat: {
        baseUrl:
          process.env.GROQ_API_URL ??
          "https://api.groq.com/openai/v1/chat/completions",
        apiKey: process.env.GROQ_API_KEY ?? "",
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      },
      profileLabel: profile,
      hints: [
        "Free tier: very fast text; vision if GROQ_VISION_MODEL is set (e.g. llama-4-scout).",
        "https://console.groq.com/keys",
      ],
    };
  }

  if (mode === "ollama") {
    const vision = process.env.OLLAMA_VISION_MODEL ?? "";
    return {
      mode: "ollama",
      textModel: process.env.OLLAMA_MODEL ?? "llama3.2",
      visionModel: vision || "N/A (ollama pull llama3.2-vision)",
      openaiCompat: {
        baseUrl:
          process.env.OLLAMA_API_URL ??
          "http://127.0.0.1:11434/v1/chat/completions",
        apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
        model: process.env.OLLAMA_MODEL ?? "llama3.2",
      },
      profileLabel: profile,
      hints: [
        "Local free: ollama serve, then ollama pull llama3.2 && ollama pull llama3.2-vision",
        "Set OLLAMA_VISION_MODEL for OCR on homework images",
      ],
    };
  }

  if (mode === "openai") {
    return {
      mode: "openai",
      textModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      visionModel: process.env.OPENAI_VISION_MODEL ?? "gpt-4o",
      openaiCompat: {
        baseUrl:
          process.env.OPENAI_API_URL ??
          "https://api.openai.com/v1/chat/completions",
        apiKey: process.env.OPENAI_API_KEY ?? "",
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      },
      profileLabel: profile,
      hints: [
        "Production OpenAI — same code path as Groq/Ollama (OpenAI-compatible).",
        "Switch to Gemini: EDULENS_AI_MODE=gemini + GEMINI_API_KEY",
      ],
    };
  }

  return {
    mode: "mock",
    textModel: "mock",
    visionModel: "mock",
    profileLabel: "mock",
    hints: [
      "Demo mode. For free dev set EDULENS_DEV_PROFILE=gemini-free and GEMINI_API_KEY",
      "Or EDULENS_DEV_PROFILE=ollama-local with Ollama running",
    ],
  };
}

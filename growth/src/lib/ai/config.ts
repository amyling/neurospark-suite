import type { AIProviderKind } from "./provider";

/**
 * Dev profiles — same EDULENS_* env keys as EduTech for shared .env.local.
 */
export type DevAIProfile =
  | "mock"
  | "gemini-free"
  | "groq-free"
  | "ollama-local"
  | "openai"
  | "openrouter-free";

/** Provider ids in EDULENS_PROVIDER_CHAIN (comma-separated, tried in order) */
export type ChainProviderId =
  | "ollama"
  | "gemini"
  | "groq"
  | "deepseek"
  | "openrouter"
  | "nvidia"
  | "openai";

const CHAIN_ALIASES: Record<string, ChainProviderId> = {
  ollama: "ollama",
  gemini: "gemini",
  groq: "groq",
  deepseek: "deepseek",
  openrouter: "openrouter",
  nvidia: "nvidia",
  openai: "openai",
};

export type ResolvedAIConfig = {
  mode: AIProviderKind | "openrouter";
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
    ollamaModel: string;
    openaiModel: string;
    openrouterModel: string;
  }>
> = {
  mock: { mode: "mock" },
  "gemini-free": { mode: "gemini", geminiModel: "gemini-2.0-flash" },
  "groq-free": { mode: "groq", groqModel: "llama-3.3-70b-versatile" },
  "ollama-local": { mode: "ollama", ollamaModel: "llama3.2" },
  openai: { mode: "openai", openaiModel: "gpt-4o-mini" },
  "openrouter-free": {
    mode: "openrouter",
    openrouterModel: "google/gemini-2.0-flash-exp:free",
  },
};

/**
 * Applies dev profile defaults when EDULENS_DEV_PROFILE is set.
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
  }
  if (defaults.groqModel && !process.env.GROQ_MODEL) {
    process.env.GROQ_MODEL = defaults.groqModel;
  }
  if (defaults.ollamaModel && !process.env.OLLAMA_MODEL) {
    process.env.OLLAMA_MODEL = defaults.ollamaModel;
  }
  if (defaults.openaiModel && !process.env.OPENAI_MODEL) {
    process.env.OPENAI_MODEL = defaults.openaiModel;
  }
  if (defaults.openrouterModel && !process.env.OPENROUTER_MODEL) {
    process.env.OPENROUTER_MODEL = defaults.openrouterModel;
  }
}

/**
 * Parses EDULENS_PROVIDER_CHAIN — e.g. OLLAMA,GEMINI,GROQ,OPENAI
 */
export function getProviderChain(): ChainProviderId[] {
  const raw = process.env.EDULENS_PROVIDER_CHAIN;
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(",")
    .map((s) => CHAIN_ALIASES[s.trim().toLowerCase()])
    .filter(Boolean) as ChainProviderId[];
}

/** Whether a chain provider has credentials / can be attempted */
export function isChainProviderConfigured(id: ChainProviderId): boolean {
  switch (id) {
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

/**
 * Auto-picks a provider when mode is unset and keys exist.
 */
export function autoDetectProvider(): AIProviderKind | "openrouter" {
  if (process.env.EDULENS_PREFER_OLLAMA === "true") {
    return "ollama";
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
 * Resolves effective AI configuration (shared EDULENS_* env with EduTech).
 */
export function resolveAIConfig(): ResolvedAIConfig {
  applyDevProfileEnv();

  let mode = (process.env.EDULENS_AI_MODE ?? "").toLowerCase();

  if (!mode || mode === "auto") {
    const detected = autoDetectProvider();
    mode = detected === "openrouter" ? "openai" : detected;
    if (detected === "openrouter") {
      process.env.EDULENS_USE_OPENROUTER = "true";
    }
  }

  if (
    process.env.EDULENS_USE_OPENROUTER === "true" ||
    (process.env.OPENROUTER_API_KEY && getProviderChain().length === 0)
  ) {
    return {
      mode: "openrouter",
      textModel: process.env.OPENROUTER_MODEL ?? "openrouter/free",
      visionModel: process.env.OPENROUTER_VISION_MODEL ?? "openrouter/free",
      openaiCompat: {
        baseUrl:
          process.env.OPENROUTER_API_URL ??
          "https://openrouter.ai/api/v1/chat/completions",
        apiKey: process.env.OPENROUTER_API_KEY ?? "",
        model: process.env.OPENROUTER_MODEL ?? "openrouter/free",
      },
      profileLabel: process.env.EDULENS_DEV_PROFILE ?? "openrouter",
      hints: ["OpenRouter — OpenAI-compatible API."],
    };
  }

  const profile = process.env.EDULENS_DEV_PROFILE ?? mode;

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
      hints: ["Google Gemini via GEMINI_API_KEY."],
    };
  }

  if (mode === "groq") {
    return {
      mode: "groq",
      textModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      visionModel: process.env.GROQ_VISION_MODEL ?? "N/A",
      openaiCompat: {
        baseUrl:
          process.env.GROQ_API_URL ??
          "https://api.groq.com/openai/v1/chat/completions",
        apiKey: process.env.GROQ_API_KEY ?? "",
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      },
      profileLabel: profile,
      hints: ["Groq — OpenAI-compatible API."],
    };
  }

  if (mode === "ollama") {
    return {
      mode: "ollama",
      textModel: process.env.OLLAMA_MODEL ?? "llama3.2",
      visionModel: process.env.OLLAMA_VISION_MODEL ?? "N/A",
      openaiCompat: {
        baseUrl:
          process.env.OLLAMA_API_URL ??
          "http://127.0.0.1:11434/v1/chat/completions",
        apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
        model: process.env.OLLAMA_MODEL ?? "llama3.2",
      },
      profileLabel: profile,
      hints: ["Local Ollama at :11434."],
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
      hints: ["OpenAI API."],
    };
  }

  return {
    mode: "mock",
    textModel: "mock",
    visionModel: "mock",
    profileLabel: "mock",
    hints: ["No LLM configured — using mock replies."],
  };
}

/**
 * Returns true when any real LLM provider can be called.
 */
export function isLLMConfigured(): boolean {
  applyDevProfileEnv();
  const chain = getProviderChain();
  if (chain.some(isChainProviderConfigured)) {
    return true;
  }
  const cfg = resolveAIConfig();
  return cfg.mode !== "mock";
}

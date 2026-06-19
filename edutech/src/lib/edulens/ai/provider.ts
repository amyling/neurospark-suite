import {
  AGNES_DEFAULT_API_URL,
  AGNES_DEFAULT_MODEL,
  applyDevProfileEnv,
  getProviderChain,
  isChainProviderConfigured,
  isChainVisionCapable,
  resolveAIConfig,
  type ChainProviderId,
} from "./config";
import { isParseableLLMJson } from "./json-parser";
import {
  isRequestTooLargeError,
  resolveMaxOutputTokens,
  trimCompletionRequestForProvider,
} from "./prompt-trim";

export type AIProviderKind =
  | "mock"
  | "agnes"
  | "openai"
  | "gemini"
  | "groq"
  | "ollama";

export type AICompletionRequest = {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
};

export type VisionCompletionRequest = AICompletionRequest & {
  imageDataUrls: string[];
};

type OllamaCircuitState = { text: boolean; vision: boolean };

const OLLAMA_CIRCUIT_KEY = "__edulensOllamaCircuit";

/**
 * Persists Ollama circuit state across hot reloads in dev.
 */
function getOllamaCircuit(): OllamaCircuitState {
  const globalStore = globalThis as typeof globalThis & {
    [OLLAMA_CIRCUIT_KEY]?: OllamaCircuitState;
  };
  if (!globalStore[OLLAMA_CIRCUIT_KEY]) {
    globalStore[OLLAMA_CIRCUIT_KEY] = { text: false, vision: false };
  }
  return globalStore[OLLAMA_CIRCUIT_KEY];
}

/**
 * Returns true when the URL targets a local Ollama instance.
 */
function isOllamaUrl(url: string): boolean {
  return url.includes("127.0.0.1") || url.includes("localhost");
}

/**
 * Resolves fetch timeout — local Ollama uses a short limit so the chain can fall through quickly.
 */
function getFetchTimeoutMs(url: string, providerId?: ChainProviderId): number {
  if (isOllamaUrl(url)) {
    const ms = Number(process.env.EDULENS_OLLAMA_TIMEOUT_MS);
    return Number.isFinite(ms) && ms > 0 ? ms : 3_000;
  }
  if (providerId === "agnes" || url.includes("agnes-ai.com")) {
    const ms = Number(process.env.EDULENS_AGNES_TIMEOUT_MS);
    return Number.isFinite(ms) && ms > 0 ? ms : 240_000;
  }
  const ms = Number(process.env.EDULENS_CLOUD_TIMEOUT_MS);
  return Number.isFinite(ms) && ms > 0 ? ms : 180_000;
}

/**
 * fetch with AbortSignal timeout to avoid multi-minute hangs on unreachable Ollama.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs?: number
): Promise<Response> {
  const ms = timeoutMs ?? getFetchTimeoutMs(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${ms}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Opens the Ollama circuit breaker so later requests skip straight to cloud providers.
 */
function markOllamaCircuit(kind: "text" | "vision", error: unknown): void {
  const msg = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error && "cause" in error ? String(error.cause) : "";
  const combined = `${msg} ${cause}`;
  const isFatal =
    combined.includes("404") ||
    combined.includes("timeout") ||
    combined.includes("Timeout") ||
    combined.includes("fetch failed") ||
    combined.includes("ECONNREFUSED") ||
    combined.includes("UND_ERR_HEADERS_TIMEOUT");
  if (isFatal) {
    const circuit = getOllamaCircuit();
    circuit.text = true;
    circuit.vision = true;
  }
}

if (process.env.EDULENS_SKIP_OLLAMA === "true") {
  const circuit = getOllamaCircuit();
  circuit.text = true;
  circuit.vision = true;
}

const PROVIDER_CIRCUIT_KEY = "__edulensProviderCircuit";

/**
 * Skips cloud providers that recently returned quota / auth errors.
 */
function getProviderCircuit(): Partial<Record<ChainProviderId, boolean>> {
  const globalStore = globalThis as typeof globalThis & {
    [PROVIDER_CIRCUIT_KEY]?: Partial<Record<ChainProviderId, boolean>>;
  };
  if (!globalStore[PROVIDER_CIRCUIT_KEY]) {
    globalStore[PROVIDER_CIRCUIT_KEY] = {};
  }
  return globalStore[PROVIDER_CIRCUIT_KEY];
}

/**
 * Marks a chain provider unavailable after quota, timeout, or hard API errors.
 */
function markProviderCircuit(id: ChainProviderId, error: unknown): void {
  if (id === "ollama") {
    return;
  }
  const combined = error instanceof Error ? error.message : String(error);
  if (
    /429|413|quota|503|502|401|408|too large|TPM|RESOURCE_EXHAUSTED|rate limit|timeout|timed out|AbortError|ETIMEDOUT|ECONNRESET|fetch failed/i.test(
      combined
    )
  ) {
    getProviderCircuit()[id] = true;
  }
}

/**
 * Whether a provider should be skipped for this server session.
 */
function shouldSkipProvider(id: ChainProviderId, kind: "text" | "vision"): boolean {
  if (id === "ollama") {
    const circuit = getOllamaCircuit();
    return kind === "vision" ? circuit.vision : circuit.text;
  }
  return Boolean(getProviderCircuit()[id]);
}

/**
 * Resolves active AI provider from environment (supports auto + dev profiles).
 */
export function getActiveProvider(): AIProviderKind {
  applyDevProfileEnv();
  const chain = getProviderChain();
  if (chain.length > 0) {
    const first = chain.find(isChainProviderConfigured);
    if (first === "openrouter") {
      return "openai";
    }
    if (first && first !== "deepseek" && first !== "nvidia") {
      return first as AIProviderKind;
    }
    if (first === "deepseek" || first === "nvidia") {
      return "openai";
    }
  }
  const cfg = resolveAIConfig();
  if (cfg.mode === "openrouter") {
    return "openai";
  }
  return cfg.mode as AIProviderKind;
}

/** Whether the active provider supports image input (OCR / multimodal) */
export function isVisionCapable(): boolean {
  if (getProviderChain().length > 0) {
    return isChainVisionCapable();
  }
  const cfg = resolveAIConfig();
  if (cfg.mode === "mock") {
    return false;
  }
  if (cfg.mode === "gemini") {
    return Boolean(cfg.gemini?.apiKey);
  }
  if (cfg.mode === "groq") {
    return Boolean(
      cfg.openaiCompat?.apiKey &&
        cfg.visionModel &&
        !cfg.visionModel.startsWith("N/A")
    );
  }
  if (cfg.mode === "ollama") {
    return Boolean(process.env.OLLAMA_VISION_MODEL?.trim());
  }
  if (
    cfg.mode === "agnes" ||
    cfg.mode === "openai" ||
    cfg.mode === "openrouter"
  ) {
    return Boolean(cfg.openaiCompat?.apiKey);
  }
  return false;
}

/** Human-readable model info for UI */
export function getProviderInfo(): {
  mode: string;
  textModel: string;
  visionCapable: boolean;
  visionModel: string;
  profileLabel: string;
  hints: string[];
  providerChain?: string;
} {
  const chain = getProviderChain();
  if (chain.length > 0) {
    const configured = chain.filter(isChainProviderConfigured);
    return {
      mode: "chain (fallback)",
      textModel: process.env.OLLAMA_MODEL ?? "see chain",
      visionCapable: isChainVisionCapable(),
      visionModel:
        process.env.AGNES_VISION_MODEL ??
        process.env.OLLAMA_VISION_MODEL ??
        process.env.GEMINI_VISION_MODEL ??
        "chain",
      profileLabel: process.env.EDULENS_DEV_PROFILE ?? "chain",
      providerChain: configured.join(" → "),
      hints: [
        `Try order: ${chain.join(" → ")}`,
        "Ollama first for offline; cloud providers used when local fails",
        "Set EDULENS_PROVIDER_CHAIN to reorder",
      ],
    };
  }

  const cfg = resolveAIConfig();
  return {
    mode:
      cfg.mode === "openrouter"
        ? "openrouter (openai-compatible)"
        : cfg.mode === "agnes"
          ? "agnes (openai-compatible)"
          : cfg.mode,
    textModel: cfg.textModel,
    visionCapable: isVisionCapable(),
    visionModel: cfg.visionModel,
    profileLabel: cfg.profileLabel,
    hints: cfg.hints,
  };
}

/**
 * Calls LLM with provider chain fallback (Ollama → free cloud → paid).
 */
export async function completeJSON(
  request: AICompletionRequest
): Promise<string> {
  const chain = getProviderChain();
  if (chain.length > 0) {
    for (const id of chain) {
      if (!isChainProviderConfigured(id)) {
        continue;
      }
      if (shouldSkipProvider(id, "text")) {
        continue;
      }
      try {
        let result = await callChainProviderText(
          id,
          trimCompletionRequestForProvider(id, request)
        );
        if (!result.trim() && id === "groq") {
          result = await callChainProviderText(
            id,
            trimCompletionRequestForProvider(id, request, "aggressive")
          );
        }
        if (!result.trim()) {
          continue;
        }
        if (request.jsonMode && !isParseableLLMJson(result)) {
          console.error(
            `[EduLens AI] ${id} returned unparseable JSON (${result.length} chars), trying next provider`
          );
          continue;
        }
        return result;
      } catch (error) {
        if (id === "ollama") {
          markOllamaCircuit("text", error);
        } else if (isRequestTooLargeError(error) && id === "groq") {
          try {
            const retried = await callChainProviderText(
              id,
              trimCompletionRequestForProvider(id, request, "aggressive")
            );
            if (retried.trim()) {
              if (
                request.jsonMode &&
                !isParseableLLMJson(retried)
              ) {
                console.error(
                  `[EduLens AI] ${id} returned unparseable JSON after trim (${retried.length} chars), trying next provider`
                );
                continue;
              }
              return retried;
            }
          } catch (retryError) {
            markProviderCircuit(id, retryError);
            console.error(`[EduLens AI] ${id} failed after trim:`, retryError);
          }
        } else {
          markProviderCircuit(id, error);
        }
        console.error(`[EduLens AI] ${id} failed:`, error);
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
      return await callGeminiText(request, cfg.gemini.model);
    }

    if (cfg.openaiCompat?.apiKey || cfg.mode === "ollama") {
      const compat = cfg.openaiCompat!;
      return await callOpenAICompatible(
        compat.baseUrl,
        compat.apiKey,
        compat.model,
        request
      );
    }
  } catch (error) {
    console.error("[EduLens AI] Provider error:", error);
  }
  return "";
}

/**
 * Multimodal completion with provider chain fallback.
 */
export type VisionJSONResult = {
  text: string;
  providerId: ChainProviderId | "";
};

export async function completeVisionJSON(
  request: VisionCompletionRequest
): Promise<VisionJSONResult> {
  const chain = getProviderChain();
  if (chain.length > 0) {
    for (const id of chain) {
      if (!isChainProviderConfigured(id)) {
        continue;
      }
      if (shouldSkipProvider(id, "vision")) {
        continue;
      }
      try {
        const result = await callChainProviderVision(id, request);
        if (!result.trim()) {
          continue;
        }
        if (request.jsonMode && !isParseableLLMJson(result)) {
          console.error(
            `[EduLens Vision] ${id} returned unparseable JSON, trying next provider`
          );
          continue;
        }
        return { text: result, providerId: id };
      } catch (error) {
        if (id === "ollama") {
          markOllamaCircuit("vision", error);
        } else {
          markProviderCircuit(id, error);
        }
        console.error(`[EduLens Vision] ${id} failed:`, error);
      }
    }
    return { text: "", providerId: "" };
  }

  if (!isVisionCapable()) {
    return { text: "", providerId: "" };
  }

  const cfg = resolveAIConfig();

  const fallbackId = (cfg.mode === "openrouter" ? "openrouter" : cfg.mode) as ChainProviderId;

  try {
    if (cfg.mode === "gemini" && cfg.gemini?.apiKey) {
      const text = await callGeminiVision(request, cfg.gemini.visionModel);
      return { text, providerId: "gemini" };
    }

    const visionModel =
      cfg.mode === "groq"
        ? process.env.GROQ_VISION_MODEL
        : cfg.mode === "ollama"
          ? process.env.OLLAMA_VISION_MODEL
          : cfg.mode === "agnes"
            ? cfg.visionModel
            : cfg.mode === "openrouter"
              ? cfg.visionModel
              : process.env.OPENAI_VISION_MODEL ?? cfg.openaiCompat?.model;

    const baseUrl =
      cfg.mode === "groq"
        ? process.env.GROQ_API_URL ??
          "https://api.groq.com/openai/v1/chat/completions"
        : cfg.mode === "ollama"
          ? process.env.OLLAMA_API_URL ??
            "http://127.0.0.1:11434/v1/chat/completions"
          : cfg.openaiCompat?.baseUrl ??
            "https://api.openai.com/v1/chat/completions";

    const apiKey =
      cfg.mode === "groq"
        ? process.env.GROQ_API_KEY ?? ""
        : cfg.mode === "ollama"
          ? process.env.OLLAMA_API_KEY ?? "ollama"
          : cfg.openaiCompat?.apiKey ?? "";

    if (visionModel && (apiKey || baseUrl.includes("127.0.0.1"))) {
      const text = await callOpenAIVision(request, baseUrl, apiKey, visionModel);
      return { text, providerId: fallbackId };
    }
  } catch (error) {
    console.error("[EduLens Vision API]", error);
  }
  return { text: "", providerId: "" };
}

/** Dispatches text completion to a chain provider */
async function callChainProviderText(
  id: ChainProviderId,
  request: AICompletionRequest
): Promise<string> {
  switch (id) {
    case "agnes":
      return callOpenAICompatible(
        process.env.AGNES_API_URL ?? AGNES_DEFAULT_API_URL,
        process.env.AGNES_API_KEY ?? "",
        process.env.AGNES_MODEL ?? AGNES_DEFAULT_MODEL,
        request,
        false,
        "agnes"
      );
    case "ollama":
      return callOpenAICompatible(
        process.env.OLLAMA_API_URL ??
          "http://127.0.0.1:11434/v1/chat/completions",
        process.env.OLLAMA_API_KEY ?? "ollama",
        process.env.OLLAMA_MODEL ?? "llama3.2",
        request
      );
    case "gemini":
      return callGeminiText(
        request,
        process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
      );
    case "groq":
      return callOpenAICompatible(
        process.env.GROQ_API_URL ??
          "https://api.groq.com/openai/v1/chat/completions",
        process.env.GROQ_API_KEY ?? "",
        process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        request,
        false,
        "groq"
      );
    case "deepseek":
      return callOpenAICompatible(
        process.env.DEEPSEEK_API_URL ??
          "https://api.deepseek.com/v1/chat/completions",
        process.env.DEEPSEEK_API_KEY ?? "",
        process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
        request
      );
    case "openrouter":
      return callOpenAICompatible(
        process.env.OPENROUTER_API_URL ??
          "https://openrouter.ai/api/v1/chat/completions",
        process.env.OPENROUTER_API_KEY ?? "",
        process.env.OPENROUTER_MODEL ?? "openrouter/free",
        request,
        true
      );
    case "nvidia":
      return callOpenAICompatible(
        process.env.NVIDIA_API_URL ??
          "https://integrate.api.nvidia.com/v1/chat/completions",
        process.env.NVIDIA_API_KEY ?? "",
        process.env.NVIDIA_MODEL ?? "deepseek-ai/deepseek-r1-distill-qwen-32b",
        request
      );
    case "openai":
      return callOpenAICompatible(
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

/** Dispatches vision completion to a chain provider */
async function callChainProviderVision(
  id: ChainProviderId,
  request: VisionCompletionRequest
): Promise<string> {
  switch (id) {
    case "agnes":
      return callOpenAIVision(
        request,
        process.env.AGNES_API_URL ?? AGNES_DEFAULT_API_URL,
        process.env.AGNES_API_KEY ?? "",
        process.env.AGNES_VISION_MODEL ??
          process.env.AGNES_MODEL ??
          AGNES_DEFAULT_MODEL,
        false
      );
    case "ollama": {
      const model = process.env.OLLAMA_VISION_MODEL;
      if (!model) {
        throw new Error("OLLAMA_VISION_MODEL not set");
      }
      return callOpenAIVision(
        request,
        process.env.OLLAMA_API_URL ??
          "http://127.0.0.1:11434/v1/chat/completions",
        process.env.OLLAMA_API_KEY ?? "ollama",
        model
      );
    }
    case "gemini":
      return callGeminiVision(
        request,
        process.env.GEMINI_VISION_MODEL ??
          process.env.GEMINI_MODEL ??
          "gemini-2.0-flash"
      );
    case "groq": {
      const model = process.env.GROQ_VISION_MODEL;
      if (!model) {
        throw new Error("GROQ_VISION_MODEL not set");
      }
      return callOpenAIVision(
        request,
        process.env.GROQ_API_URL ??
          "https://api.groq.com/openai/v1/chat/completions",
        process.env.GROQ_API_KEY ?? "",
        model
      );
    }
    case "openrouter":
      return callOpenAIVision(
        request,
        process.env.OPENROUTER_API_URL ??
          "https://openrouter.ai/api/v1/chat/completions",
        process.env.OPENROUTER_API_KEY ?? "",
        process.env.OPENROUTER_VISION_MODEL ??
          process.env.OPENROUTER_MODEL ??
          "google/gemini-2.0-flash-exp:free",
        true
      );
    case "openai":
      return callOpenAIVision(
        request,
        process.env.OPENAI_API_URL ??
          "https://api.openai.com/v1/chat/completions",
        process.env.OPENAI_API_KEY ?? "",
        process.env.OPENAI_VISION_MODEL ??
          process.env.OPENAI_MODEL ??
          "gpt-4o",
        false
      );
    default:
      return callChainProviderText(id, request);
  }
}

async function callOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  request: AICompletionRequest,
  isOpenRouter = false,
  providerId?: ChainProviderId
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
      process.env.OPENROUTER_REFERER ?? "http://localhost:3006";
    headers["X-Title"] = "EduLens AI";
  }

  const maxTokens = resolveMaxOutputTokens(providerId, request);

  const response = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: request.jsonMode ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
      }),
    },
    getFetchTimeoutMs(url, providerId)
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `OpenAI-compatible API error: ${response.status} ${errText.slice(0, 200)}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callGeminiText(
  request: AICompletionRequest,
  model: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${request.systemPrompt}\n\n${request.userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 16_384,
        responseMimeType: request.jsonMode ? "application/json" : "text/plain",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Gemini API error: ${response.status} ${errText.slice(0, 200)}`
    );
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callOpenAIVision(
  request: VisionCompletionRequest,
  url: string,
  apiKey: string,
  model: string,
  isOpenRouter = false
): Promise<string> {
  const imageParts = request.imageDataUrls.slice(0, 4).map((dataUrl) => ({
    type: "image_url" as const,
    image_url: { url: dataUrl, detail: "high" as const },
  }));

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (isOpenRouter || url.includes("openrouter")) {
    headers["HTTP-Referer"] =
      process.env.OPENROUTER_REFERER ?? "http://localhost:3006";
    headers["X-Title"] = "EduLens AI";
  }

  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: request.jsonMode ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: request.systemPrompt },
        {
          role: "user",
          content: [{ type: "text", text: request.userPrompt }, ...imageParts],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Vision API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callGeminiVision(
  request: VisionCompletionRequest,
  model: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? "";

  const imageParts = request.imageDataUrls.slice(0, 4).flatMap((dataUrl) => {
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return [];
    }
    return [
      {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      },
    ];
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${request.systemPrompt}\n\n${request.userPrompt}` },
            ...imageParts,
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: request.jsonMode ? "application/json" : "text/plain",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Gemini vision error: ${response.status} ${errText.slice(0, 200)}`
    );
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

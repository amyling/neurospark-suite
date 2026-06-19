import type { ChainProviderId } from "./config";
import type { AICompletionRequest } from "./provider";

/** Groq free tier counts prompt + max_tokens toward a ~12k TPM per-request budget */
const GROQ_TPM_BUDGET = 11_500;

/**
 * Rough token estimate for English + CJK mixed prompts (chars / 3.5).
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 3.5);
}

/**
 * Truncates long text with an explicit marker for the model.
 */
export function shrinkText(
  text: string,
  maxChars: number,
  label?: string
): string {
  if (text.length <= maxChars) {
    return text;
  }
  const suffix = label ? ` (${label})` : "";
  return `${text.slice(0, maxChars)}\n...(truncated${suffix})`;
}

/**
 * True when an API error indicates the request exceeded provider token limits.
 */
export function isRequestTooLargeError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /413|too large|TPM|token.*limit|context length|maximum context/i.test(
    msg
  );
}

/**
 * Resolves max output tokens so Groq prompt + completion stays under TPM budget.
 */
export function resolveMaxOutputTokens(
  providerId: ChainProviderId | undefined,
  request: AICompletionRequest
): number | undefined {
  if (!request.jsonMode) {
    return undefined;
  }
  if (providerId !== "groq") {
    return 16_384;
  }

  const estimatedInput = estimateTokenCount(
    `${request.systemPrompt}\n${request.userPrompt}`
  );
  const headroom = GROQ_TPM_BUDGET - estimatedInput;
  return Math.max(1024, Math.min(4096, headroom));
}

/**
 * Trims prompt size for providers with strict per-request token limits.
 */
export function trimCompletionRequestForProvider(
  id: ChainProviderId | undefined,
  request: AICompletionRequest,
  level: "normal" | "aggressive" = "normal"
): AICompletionRequest {
  if (id !== "groq") {
    return request;
  }

  const limits =
    level === "aggressive"
      ? { system: 5_500, user: 1_200 }
      : { system: 9_000, user: 2_500 };

  return {
    ...request,
    systemPrompt: shrinkText(request.systemPrompt, limits.system, "system"),
    userPrompt: shrinkText(request.userPrompt, limits.user, "user"),
  };
}

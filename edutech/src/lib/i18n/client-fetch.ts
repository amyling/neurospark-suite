import type { Locale } from "./types";

/**
 * Fetch wrapper that sends the active locale to EduLens APIs.
 */
export async function fetchEdulens(
  input: string,
  locale: Locale,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("X-EduLens-Locale", locale);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}

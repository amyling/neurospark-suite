import type { Locale } from "./types";
import { DEFAULT_LOCALE } from "./types";

/**
 * Reads locale from API request header or query string.
 */
export function getLocaleFromRequest(request: Request): Locale {
  const header = request.headers.get("X-EduLens-Locale");
  if (header === "en" || header === "zh") {
    return header;
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("locale");
    if (query === "en" || query === "zh") {
      return query;
    }
  } catch {
    /* ignore */
  }

  return DEFAULT_LOCALE;
}

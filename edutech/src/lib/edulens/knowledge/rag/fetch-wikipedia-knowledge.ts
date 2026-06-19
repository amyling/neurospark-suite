import type { Locale } from "@/lib/i18n/types";
import type { RagChunk } from "./types";

const WIKI_CACHE_TTL_MS = 60 * 60 * 1000;
const WIKI_FETCH_TIMEOUT_MS = 8_000;

type CacheEntry = { chunks: RagChunk[]; expiresAt: number };

const wikiCache = new Map<string, CacheEntry>();

/**
 * True when live web retrieval is enabled (default on; set EDULENS_RAG_WEB_ENABLED=false to disable).
 */
export function isRagWebEnabled(): boolean {
  return process.env.EDULENS_RAG_WEB_ENABLED !== "false";
}

/**
 * True when any RAG layer is active.
 */
export function isRagEnabled(): boolean {
  return process.env.EDULENS_RAG_ENABLED !== "false";
}

/**
 * Picks Wikipedia language from app locale.
 */
function wikiLang(locale: Locale): "en" | "zh" {
  return locale === "zh" ? "zh" : "en";
}

/**
 * Builds a Wikipedia search query from lesson fields.
 */
function buildWikiQuery(subject: string, topic: string, locale: Locale): string {
  const base = `${topic} ${subject}`.trim();
  if (locale === "zh") {
    return base;
  }
  return `${base} chemistry physics biology`.replace(/\s+/g, " ").trim();
}

/**
 * Fetches JSON from Wikipedia API with timeout.
 */
async function wikiFetch<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WIKI_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "EduLens/1.0 (education RAG; contact: local-dev)" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

type WikiSearchResponse = {
  query?: { search?: { title: string; snippet: string }[] };
};

type WikiExtractResponse = {
  query?: {
    pages?: Record<
      string,
      { title?: string; extract?: string; fullurl?: string }
    >;
  };
};

/**
 * Retrieves introductory Wikipedia passages for a lesson topic (free, no API key).
 */
export async function fetchWikipediaChunks(
  subject: string,
  topic: string,
  locale: Locale
): Promise<RagChunk[]> {
  const lang = wikiLang(locale);
  const cacheKey = `${lang}:${subject}:${topic}`;
  const cached = wikiCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.chunks;
  }

  const query = buildWikiQuery(subject, topic, locale);
  const searchUrl =
    `https://${lang}.wikipedia.org/w/api.php?` +
    new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      format: "json",
      origin: "*",
      srlimit: "2",
    });

  const searchData = await wikiFetch<WikiSearchResponse>(searchUrl);
  const titles = searchData?.query?.search?.map((row) => row.title) ?? [];
  if (!titles.length) {
    wikiCache.set(cacheKey, { chunks: [], expiresAt: Date.now() + WIKI_CACHE_TTL_MS });
    return [];
  }

  const extractUrl =
    `https://${lang}.wikipedia.org/w/api.php?` +
    new URLSearchParams({
      action: "query",
      prop: "extracts",
      exintro: "true",
      explaintext: "true",
      titles: titles.join("|"),
      format: "json",
      origin: "*",
    });

  const extractData = await wikiFetch<WikiExtractResponse>(extractUrl);
  const pages = extractData?.query?.pages ?? {};

  const chunks: RagChunk[] = Object.values(pages)
    .filter((page) => page.extract && page.extract.length > 80)
    .map((page, index) => ({
      id: `wiki-${index}`,
      source: "wikipedia" as const,
      title: page.title ?? topic,
      content: trimToChars(stripHtml(page.extract ?? ""), 900),
      score: 55 - index * 5,
      url: page.fullurl ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title ?? topic)}`,
    }));

  wikiCache.set(cacheKey, { chunks, expiresAt: Date.now() + WIKI_CACHE_TTL_MS });
  return chunks;
}

/**
 * Strips basic HTML entities/tags from Wikipedia snippets.
 */
function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncates text to a maximum character count at word boundary.
 */
function trimToChars(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 200 ? cut.slice(0, lastSpace) : cut}…`;
}

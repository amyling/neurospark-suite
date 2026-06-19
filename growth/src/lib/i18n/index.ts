import type { Locale } from "@/types/locale";
import type { Dictionary } from "./dictionary";
import { en } from "./en";
import { zh } from "./zh";

const dictionaries: Record<Locale, Dictionary> = { en, zh };

/**
 * Returns the full UI dictionary for a locale.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };

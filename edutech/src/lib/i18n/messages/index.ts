import type { Locale } from "../types";
import { en } from "./en";
import { zh } from "./zh";
import type { Messages } from "./types";

const catalogs: Record<Locale, Messages> = { en, zh };

/** Returns message catalog for the given locale */
export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? en;
}

export { en, zh };
export type { Messages };

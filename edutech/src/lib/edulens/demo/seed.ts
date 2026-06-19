import type { Locale } from "@/lib/i18n/types";
import { createEnDemoStore } from "./seed-en";
import { createZhDemoStore } from "./seed-zh";

/** Returns locale-specific seeded demo store */
export function createDemoStore(locale: Locale = "en") {
  return locale === "zh" ? createZhDemoStore() : createEnDemoStore();
}

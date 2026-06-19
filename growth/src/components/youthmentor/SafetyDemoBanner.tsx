"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

/**
 * Prominent link to the guided safety guardrail demo (DSA portfolio highlight).
 */
export function SafetyDemoBanner() {
  const { t } = useLocale();

  return (
    <Link
      href="/youthmentor/safety-demo"
      className="mb-6 block rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 p-4 text-white shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
        DSA highlight
      </span>
      <span className="mt-1 block text-base font-semibold">
        {t.home.safetyDemoLink}
      </span>
      <span className="mt-1 block text-xs opacity-90">
        {t.safetyDemo.subtitle}
      </span>
    </Link>
  );
}

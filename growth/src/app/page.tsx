"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/youthmentor/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";

/**
 * Root landing with locale-aware copy (port 3007).
 */
export default function Home() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16">
      <div className="mb-6 flex justify-end">
        <LanguageSwitcher />
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-sky-600">
        {t.landing.badge}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-800">
        {t.landing.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {t.landing.portNote}
      </p>

      <ul className="mt-6 space-y-3">
        <li>
          <Link
            href="/youthmentor"
            className="block rounded-2xl bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
          >
            {t.landing.mentorLink}
          </Link>
        </li>
        <li>
          <Link
            href="/youthmentor/characters"
            className="block rounded-2xl bg-violet-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-violet-600"
          >
            {t.landing.charactersLink}
          </Link>
        </li>
      </ul>

      <p className="mt-8 text-center text-xs text-slate-500">
        {t.landing.edutechNote}:{" "}
        <a
          href="http://localhost:3006"
          className="text-sky-600 hover:underline"
        >
          localhost:3006
        </a>
      </p>
    </main>
  );
}

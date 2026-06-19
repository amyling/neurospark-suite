"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

const MODULES = [
  { href: "/edulens/homework-analyzer", key: "homework" as const },
  { href: "/edulens/lesson-generator", key: "lesson" as const },
  { href: "/edulens/mistake-book", key: "mistakeBook" as const },
  { href: "/edulens/dashboard", key: "dashboard" as const },
];

export default function EdulensHomePage() {
  const { t } = useLocale();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {t.home.heading}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">{t.home.subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((m) => {
          const mod = t.home.modules[m.key];
          return (
            <Link
              key={m.href}
              href={m.href}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-indigo-700 group-hover:text-indigo-800">
                {mod.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{mod.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                {mod.cta} →
              </span>
            </Link>
          );
        })}
      </div>

      <section className="mt-10 rounded-xl border border-indigo-100 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{t.home.demoTitle}</h2>
        <ul className="mt-2 space-y-1 text-sm text-indigo-800/90">
          <li>
            <Link
              href="/edulens/reports/demo-analysis-math-quadratic"
              className="hover:underline"
            >
              {t.home.demoMath}
            </Link>
          </li>
          <li>
            <Link
              href="/edulens/reports/demo-analysis-physics-electricity"
              className="hover:underline"
            >
              {t.home.demoPhysics}
            </Link>
          </li>
          <li>
            <Link
              href="/edulens/reports/demo-lesson-out-quadratic"
              className="hover:underline"
            >
              {t.home.demoLesson}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

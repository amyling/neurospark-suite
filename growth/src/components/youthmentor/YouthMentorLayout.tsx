"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLocale } from "@/context/LocaleContext";
import { LanguageSwitcher } from "@/components/youthmentor/LanguageSwitcher";

/**
 * Calm shell layout for all YouthMentor pages.
 */
export function YouthMentorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLocale();

  const NAV = [
    { href: "/youthmentor", label: t.nav.home },
    { href: "/youthmentor/characters", label: t.nav.characters },
    { href: "/youthmentor/settings", label: t.nav.settings },
    { href: "/youthmentor/check-in", label: t.nav.checkIn },
    { href: "/youthmentor/reflection", label: t.nav.reflection },
    { href: "/youthmentor/mentor-chat", label: t.nav.mentor },
    { href: "/youthmentor/action-plan", label: t.nav.actions },
    { href: "/youthmentor/safety", label: t.nav.safety },
    { href: "/youthmentor/history", label: t.nav.history },
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-violet-50/40 to-emerald-50/50">
      <header className="border-b border-sky-100/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-sky-600">
                {t.layout.badge}
              </p>
              <h1 className="text-xl font-semibold text-slate-800">
                {t.layout.appName}
              </h1>
              <p className="text-sm text-slate-500">{t.layout.tagline}</p>
            </div>
            <LanguageSwitcher />
          </div>
          <nav
            className="flex flex-wrap gap-1.5"
            aria-label={t.layout.navAria}
          >
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/youthmentor" &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white text-slate-600 ring-1 ring-sky-100 hover:bg-sky-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs text-slate-500">
        {t.layout.footer}
      </footer>
    </div>
  );
}

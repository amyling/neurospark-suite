"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";

const NAV_ITEMS = [
  { href: "/edulens", labelKey: "overview" as const, icon: "home" },
  { href: "/edulens/dashboard", labelKey: "dashboard" as const, icon: "chart" },
  {
    href: "/edulens/homework-analyzer",
    labelKey: "homeworkAnalyzer" as const,
    icon: "scan",
  },
  {
    href: "/edulens/lesson-generator",
    labelKey: "lessonGenerator" as const,
    icon: "book",
  },
  {
    href: "/edulens/mistake-book",
    labelKey: "mistakeBook" as const,
    icon: "bookmark",
  },
];

const icons: Record<string, string> = {
  home: "⌂",
  chart: "▤",
  scan: "◎",
  book: "☰",
  bookmark: "★",
};

/** Sidebar navigation for EduLens app shell */
export function EdulensSidebar() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <aside className="flex w-full flex-col border-r border-slate-200 bg-white md:w-60 md:min-h-screen">
      <div className="border-b border-slate-200 px-4 py-5">
        <Link href="/edulens" className="block">
          <span className="text-lg font-semibold text-indigo-700">
            {t.brand.title}
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            {t.brand.tagline}
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible md:p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/edulens" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span aria-hidden className="text-base opacity-70">
                {icons[item.icon]}
              </span>
              {t.nav[item.labelKey]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

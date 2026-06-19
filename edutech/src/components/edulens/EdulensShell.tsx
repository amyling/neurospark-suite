"use client";

import { EdulensSidebar } from "@/components/edulens/EdulensSidebar";
import { LanguageSwitcher } from "@/components/edulens/LanguageSwitcher";
import { SafetyBanner } from "@/components/edulens/SafetyBanner";
import { LocaleProvider } from "@/lib/i18n/locale-context";

/** Client shell wrapping EduLens pages with locale provider */
export function EdulensShell({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
        <EdulensSidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="sticky top-0 z-20 flex items-center justify-end border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur-sm md:px-8">
            <LanguageSwitcher />
          </header>
          <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-8">
            <SafetyBanner />
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </LocaleProvider>
  );
}

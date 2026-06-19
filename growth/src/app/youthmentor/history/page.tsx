"use client";

import Link from "next/link";
import { ProgressSteps } from "@/components/youthmentor/ProgressSteps";
import { ReflectionHistoryList } from "@/components/youthmentor/ReflectionHistoryList";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { useLocale } from "@/context/LocaleContext";

export default function HistoryPage() {
  const { t } = useLocale();

  return (
    <div>
      <ProgressSteps current={6} />
      <SafetyBanner />

      <h2 className="text-xl font-semibold text-slate-800">{t.history.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{t.history.subtitle}</p>

      <div className="mt-6">
        <ReflectionHistoryList />
      </div>

      <div className="mt-8">
        <Link
          href="/youthmentor"
          className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
        >
          {t.history.backHome}
        </Link>
      </div>
    </div>
  );
}

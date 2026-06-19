"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DemoCasePicker } from "@/components/youthmentor/DemoCasePicker";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { SafetyDemoBanner } from "@/components/youthmentor/SafetyDemoBanner";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";
import type { DemoCaseId } from "@/lib/youthmentor/demo-seed";

export default function YouthMentorHomePage() {
  const router = useRouter();
  const { t } = useLocale();
  const { initCheckIn, loadDemo, resetSession } = useYouthMentor();

  const startFresh = () => {
    resetSession();
    initCheckIn();
  };

  const handleDemo = (id: DemoCaseId) => {
    resetSession();
    loadDemo(id);
    router.push(
      id === "high_risk" ? "/youthmentor/reflection" : "/youthmentor/check-in"
    );
  };

  return (
    <div>
      <SafetyBanner />
      <SafetyDemoBanner />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
        <h2 className="text-2xl font-semibold text-slate-800">{t.home.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t.home.intro}
        </p>

        <ol className="mt-4 list-inside list-decimal space-y-1 text-sm text-slate-600">
          {t.home.flowList.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/youthmentor/check-in"
            onClick={startFresh}
            className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
          >
            {t.common.startCheckIn}
          </Link>
          <Link
            href="/youthmentor/characters"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50"
          >
            {t.nav.characters}
          </Link>
          <Link
            href="/youthmentor/settings"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            {t.nav.settings}
          </Link>
          <Link
            href="/youthmentor/characters/insights"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            {t.characterGrowth.insightsLink}
          </Link>
          <Link
            href="/youthmentor/history"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            {t.common.viewHistory}
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <DemoCasePicker onSelect={handleDemo} />
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">{t.home.demoHint}</p>
    </div>
  );
}

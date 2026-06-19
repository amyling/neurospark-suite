"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";

/**
 * Guided high-risk safety demo for DSA interviews and portfolio walkthroughs.
 */
export default function SafetyDemoPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { loadDemo, resetSession } = useYouthMentor();

  const runDemo = () => {
    resetSession();
    loadDemo("high_risk");
    router.push("/youthmentor/reflection");
  };

  return (
    <div>
      <SafetyBanner />

      <section className="rounded-3xl bg-rose-50 p-6 ring-1 ring-rose-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
          DSA · Portfolio highlight
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-rose-950">
          {t.safetyDemo.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-rose-900/80">
          {t.safetyDemo.subtitle}
        </p>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">
          {t.safetyDemo.whyTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t.safetyDemo.whyBody}
        </p>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">
          {t.safetyDemo.stepsTitle}
        </h3>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-600">
          {t.safetyDemo.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={runDemo}
          className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          {t.safetyDemo.runButton}
        </button>
        <Link
          href="/youthmentor/reflection"
          className="rounded-full px-6 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.safetyDemo.openReflection}
        </Link>
        <Link
          href="/youthmentor"
          className="rounded-full px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t.common.back}
        </Link>
      </div>

      <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
        {t.safetyDemo.note}
      </p>
    </div>
  );
}

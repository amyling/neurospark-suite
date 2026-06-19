"use client";

import { useLocale } from "@/context/LocaleContext";

/**
 * High-risk crisis panel — no coaching conversation.
 */
export function SafetyCrisisPanel({ message }: { message?: string }) {
  const { t } = useLocale();
  const c = t.crisisPanel;
  const body = message ?? t.risk.crisisMessage;

  return (
    <div
      className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5 text-slate-800"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-rose-900">{c.title}</h2>
      <p className="mt-3 text-sm leading-relaxed">{body}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <a
          href="#trusted-adult"
          className="rounded-xl bg-white px-3 py-3 text-center text-sm font-semibold text-rose-800 ring-1 ring-rose-200"
        >
          {c.talkAdult}
        </a>
        <a
          href="#counsellor"
          className="rounded-xl bg-white px-3 py-3 text-center text-sm font-semibold text-rose-800 ring-1 ring-rose-200"
        >
          {c.counsellor}
        </a>
        <a
          href="#emergency"
          className="rounded-xl bg-rose-600 px-3 py-3 text-center text-sm font-semibold text-white"
        >
          {c.emergency}
        </a>
      </div>

      <section id="trusted-adult" className="mt-6 text-sm text-slate-600">
        <h3 className="font-semibold text-slate-800">{c.adultTitle}</h3>
        <p className="mt-1">{c.adultBody}</p>
      </section>

      <section id="counsellor" className="mt-4 text-sm text-slate-600">
        <h3 className="font-semibold text-slate-800">{c.counsellorTitle}</h3>
        <p className="mt-1">{c.counsellorBody}</p>
      </section>

      <section id="emergency" className="mt-4 text-sm text-slate-600">
        <h3 className="font-semibold text-slate-800">{c.emergencyTitle}</h3>
        <p className="mt-1">{c.emergencyBody}</p>
      </section>

      <p className="mt-5 text-xs text-slate-500">{c.coachingPaused}</p>
    </div>
  );
}

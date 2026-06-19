"use client";

import { useLocale } from "@/context/LocaleContext";
import type { MentorResponse } from "@/types/youthmentor";

/**
 * Displays structured mentor output (not free-form chat).
 */
export function MentorResponseCard({ response }: { response: MentorResponse }) {
  const { t } = useLocale();
  const s = t.mentorCard.sections;

  const sections = [
    { title: s.heard, body: response.emotionalValidation },
    { title: s.summary, body: response.reflectionSummary },
    { title: s.reframe, body: response.reframedThought },
    { title: s.encouragement, body: response.encouragement },
    { title: s.seekHelp, body: response.whenToSeekHelp },
    { title: s.followUp, body: response.followUpPrompt },
  ];

  return (
    <article className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">
          {t.mentorCard.title}
        </h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            response.safetyLevel === "watch"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {response.safetyLevel === "watch"
            ? t.mentorCard.badges.watch
            : t.mentorCard.badges.normal}
        </span>
      </div>

      {response.suggestedTrustedAdult && (
        <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900">
          {t.mentorCard.trustedNamed}:{" "}
          <strong>{response.suggestedTrustedAdult}</strong>
        </p>
      )}

      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="text-sm font-semibold text-sky-700">{section.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {section.body}
          </p>
        </section>
      ))}

      <section>
        <h3 className="text-sm font-semibold text-sky-700">{s.actions}</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
          {response.smallActionSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

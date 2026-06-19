"use client";

import Link from "next/link";
import { useState } from "react";
import { ReflectionDebriefLink } from "@/components/character-chat/ReflectionDebriefButton";
import { ProgressSteps } from "@/components/youthmentor/ProgressSteps";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { SafetyCrisisPanel } from "@/components/youthmentor/SafetyCrisisPanel";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";

export default function SafetyPage() {
  const { t } = useLocale();
  const { isHighRiskBlocked, risk, safetyMessage, persistSession, resetSession } =
    useYouthMentor();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    persistSession();
    setSaved(true);
  };

  return (
    <div>
      <ProgressSteps current={5} />
      <SafetyBanner />

      <h2 className="text-xl font-semibold text-slate-800">{t.safety.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{t.safety.subtitle}</p>

      {isHighRiskBlocked ? (
        <div className="mt-6">
          <SafetyCrisisPanel message={safetyMessage} />
          {risk && (
            <p className="mt-3 text-xs text-slate-500">
              {t.safety.detection}: {risk.classifierReason}
              {risk.matchedKeywords.length > 0 &&
                ` · ${t.safety.keywords}: ${risk.matchedKeywords.join(", ")}`}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4 rounded-2xl bg-white p-5 ring-1 ring-sky-100">
          <p className="text-sm text-slate-600">{t.safety.normalIntro}</p>
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
            {t.safety.normalList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <SafetyCrisisPanel />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600"
        >
          {t.safety.save}
        </button>
        {saved && (
          <span className="self-center text-sm text-emerald-600">
            {t.safety.saved}
          </span>
        )}
        <Link
          href="/youthmentor/history"
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.common.viewHistory}
        </Link>
        <ReflectionDebriefLink />
        <button
          type="button"
          onClick={() => {
            resetSession();
            setSaved(false);
          }}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t.safety.newSession}
        </button>
      </div>
    </div>
  );
}

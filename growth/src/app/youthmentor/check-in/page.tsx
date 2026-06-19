"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IntensitySlider } from "@/components/youthmentor/IntensitySlider";
import { MentorPersonaCards } from "@/components/youthmentor/MentorPersonaCards";
import { MoodSelector } from "@/components/youthmentor/MoodSelector";
import { ProgressSteps } from "@/components/youthmentor/ProgressSteps";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { StressSourceChips } from "@/components/youthmentor/StressSourceChips";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";

export default function CheckInPage() {
  const router = useRouter();
  const { t } = useLocale();
  const {
    checkIn,
    mentorPersona,
    initCheckIn,
    setMood,
    setIntensity,
    setStressSource,
    setFreeText,
    setMentorPersona,
  } = useYouthMentor();

  useEffect(() => {
    if (!checkIn) {
      initCheckIn();
    }
  }, [checkIn, initCheckIn]);

  if (!checkIn) {
    return null;
  }

  const canContinue = mentorPersona !== null;

  return (
    <div>
      <ProgressSteps current={0} />
      <SafetyBanner />

      <h2 className="text-xl font-semibold text-slate-800">{t.checkIn.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{t.checkIn.subtitle}</p>

      <section className="mt-6 space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700">
            {t.checkIn.moodLabel}
          </h3>
          <MoodSelector value={checkIn.mood} onChange={setMood} />
        </div>

        <IntensitySlider value={checkIn.intensity} onChange={setIntensity} />

        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700">
            {t.checkIn.stressLabel}
          </h3>
          <StressSourceChips
            value={checkIn.stressSource}
            onChange={setStressSource}
          />
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t.checkIn.freeTextLabel} ({t.common.optional})
          </span>
          <textarea
            value={checkIn.freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={3}
            placeholder={t.checkIn.freeTextPlaceholder}
            className="mt-2 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-400"
          />
        </label>

        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700">
            {t.checkIn.mentorLabel}
          </h3>
          <MentorPersonaCards value={mentorPersona} onChange={setMentorPersona} />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => router.push("/youthmentor/reflection")}
          className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-violet-600"
        >
          {t.checkIn.continueReflection}
        </button>
        <Link
          href="/youthmentor"
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.common.back}
        </Link>
      </div>
    </div>
  );
}

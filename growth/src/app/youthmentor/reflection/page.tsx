"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProgressSteps } from "@/components/youthmentor/ProgressSteps";
import { ReflectionForm } from "@/components/youthmentor/ReflectionForm";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";

export default function ReflectionPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [processing, setProcessing] = useState(false);
  const {
    checkIn,
    mentorPersona,
    answers,
    setAnswer,
    processReflection,
  } = useYouthMentor();

  if (!checkIn || !mentorPersona) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-600 ring-1 ring-slate-200">
        <p>{t.reflection.needCheckIn}</p>
        <Link
          href="/youthmentor/check-in"
          className="mt-4 inline-block text-sky-600 font-medium hover:underline"
        >
          {t.common.goToCheckIn}
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    setProcessing(true);
    const blocked = await processReflection();
    setProcessing(false);
    router.push(blocked ? "/youthmentor/safety" : "/youthmentor/mentor-chat");
  };

  return (
    <div>
      <ProgressSteps current={2} />
      <SafetyBanner />

      <h2 className="text-xl font-semibold text-slate-800">
        {t.reflection.title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{t.reflection.subtitle}</p>

      <div className="mt-6">
        <ReflectionForm answers={answers} onChange={setAnswer} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={processing}
          onClick={handleSubmit}
          className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-sky-600"
        >
          {processing ? t.reflection.submitting : t.reflection.submit}
        </button>
        <Link
          href="/youthmentor/check-in"
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.common.back}
        </Link>
      </div>
    </div>
  );
}

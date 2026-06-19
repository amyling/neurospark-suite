"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReflectionDebriefButton } from "@/components/character-chat/ReflectionDebriefButton";
import { MentorResponseCard } from "@/components/youthmentor/MentorResponseCard";
import { ProgressSteps } from "@/components/youthmentor/ProgressSteps";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";

export default function MentorChatPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { response, isHighRiskBlocked, risk } = useYouthMentor();

  useEffect(() => {
    if (isHighRiskBlocked) {
      router.replace("/youthmentor/safety");
    }
  }, [isHighRiskBlocked, router]);

  if (isHighRiskBlocked) {
    return null;
  }

  if (!response) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-600 ring-1 ring-slate-200">
        <p>{t.mentorChat.needReflection}</p>
        <Link
          href="/youthmentor/reflection"
          className="mt-4 inline-block font-medium text-sky-600 hover:underline"
        >
          {t.common.goToReflection}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ProgressSteps current={3} />
      <SafetyBanner />

      <h2 className="text-xl font-semibold text-slate-800">
        {t.mentorChat.title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{t.mentorChat.subtitle}</p>

      {risk?.safetyLevel === "watch" && (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
          {t.mentorChat.watchNotice}
        </p>
      )}

      <div className="mt-6">
        <MentorResponseCard response={response} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/youthmentor/action-plan"
          className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          {t.mentorChat.buildActionPlan}
        </Link>
        <ReflectionDebriefButton />
        <Link
          href="/youthmentor/reflection"
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.common.back}
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ReflectionDebriefLink } from "@/components/character-chat/ReflectionDebriefButton";
import { ActionPlanChecklist } from "@/components/youthmentor/ActionPlanChecklist";
import { ProgressSteps } from "@/components/youthmentor/ProgressSteps";
import { SafetyBanner } from "@/components/youthmentor/SafetyBanner";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";

export default function ActionPlanPage() {
  const { t } = useLocale();
  const { actionPlan, toggleActionItem, response, isHighRiskBlocked } =
    useYouthMentor();

  if (isHighRiskBlocked) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-600 ring-1 ring-slate-200">
        <p>{t.actionPlan.paused}</p>
        <Link
          href="/youthmentor/safety"
          className="mt-3 inline-block text-rose-600 font-medium hover:underline"
        >
          {t.actionPlan.viewSafety}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ProgressSteps current={4} />
      <SafetyBanner />

      <h2 className="text-xl font-semibold text-slate-800">
        {t.actionPlan.title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{t.actionPlan.subtitle}</p>

      {response && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {response.encouragement}
        </p>
      )}

      <div className="mt-6">
        <ActionPlanChecklist items={actionPlan} onToggle={toggleActionItem} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/youthmentor/safety"
          className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
        >
          {t.actionPlan.safetyCheck}
        </Link>
        <ReflectionDebriefLink />
        <Link
          href="/youthmentor/mentor-chat"
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white"
        >
          {t.common.back}
        </Link>
      </div>
    </div>
  );
}

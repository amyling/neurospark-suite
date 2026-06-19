"use client";

import Link from "next/link";
import { InsightsDashboard } from "@/components/character-chat/InsightsDashboard";
import { useLocale } from "@/context/LocaleContext";

export default function CharacterInsightsPage() {
  const { t } = useLocale();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        {t.characterGrowth.insightsTitle}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {t.characterGrowth.insightsSubtitle}
      </p>
      <div className="mt-6">
        <InsightsDashboard />
      </div>
      <div className="mt-6">
        <Link
          href="/youthmentor/characters"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          {t.characterChat.changeCharacter}
        </Link>
      </div>
    </div>
  );
}

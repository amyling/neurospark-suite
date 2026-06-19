"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useYouthMentor } from "@/context/YouthMentorContext";
import { queueReflectionDebrief } from "@/lib/character-chat/start-debrief";

/**
 * Button to send reflection session to character mentor debrief.
 */
export function ReflectionDebriefButton() {
  const router = useRouter();
  const { t } = useLocale();
  const { checkIn, answers, mentorPersona, isHighRiskBlocked } = useYouthMentor();

  if (!checkIn || !mentorPersona || isHighRiskBlocked) {
    return null;
  }

  const handleDebrief = () => {
    queueReflectionDebrief(checkIn, answers, mentorPersona);
    router.push("/youthmentor/characters/chat?debrief=1");
  };

  return (
    <button
      type="button"
      onClick={handleDebrief}
      className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600"
    >
      {t.characterGrowth.debriefCta}
    </button>
  );
}

/**
 * Link variant for secondary placement.
 */
export function ReflectionDebriefLink() {
  const router = useRouter();
  const { t } = useLocale();
  const { checkIn, answers, mentorPersona, isHighRiskBlocked } = useYouthMentor();

  if (!checkIn || !mentorPersona || isHighRiskBlocked) {
    return null;
  }

  return (
    <Link
      href="/youthmentor/characters/chat?debrief=1"
      onClick={(e) => {
        e.preventDefault();
        queueReflectionDebrief(checkIn, answers, mentorPersona);
        router.push("/youthmentor/characters/chat?debrief=1");
      }}
      className="text-sm font-medium text-violet-600 hover:underline"
    >
      {t.characterGrowth.debriefLink}
    </Link>
  );
}

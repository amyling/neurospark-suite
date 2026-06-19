import type { CoachingPackId } from "@/types/character-growth";
import type { Locale } from "@/types/locale";

export type CoachingPackMeta = {
  id: CoachingPackId;
  characterId: string;
  durationDays: number;
  requiresPremium: boolean;
};

const PACK_META: Record<
  CoachingPackId,
  Record<Locale, { title: string; description: string; dayPrompt: (day: number) => string }>
> = {
  exam_30_inamori: {
    en: {
      title: "30-day exam companion (Inamori)",
      description: "Daily mindset + one small study action before exams.",
      dayPrompt: (day) =>
        `Day ${day} of my 30-day exam prep pack. Guide me with one mindset tip and one concrete study action for today.`,
    },
    zh: {
      title: "考前30天稻盛陪跑",
      description: "考前每日心态 + 一件可执行的小行动。",
      dayPrompt: (day) =>
        `这是我考前30天陪跑的第${day}天，请给我一条心态提醒和今天可做的一件小事。`,
    },
  },
  buddha_21_jingkong: {
    en: {
      title: "21-day calm practice (Chin Kung)",
      description: "Gentle daily practice for anxiety and sleep.",
      dayPrompt: (day) =>
        `Day ${day} of my 21-day calm practice. Give me today's short practice and encouragement.`,
    },
    zh: {
      title: "21天念佛静心引导",
      description: "针对焦虑与睡眠的温和每日练习。",
      dayPrompt: (day) =>
        `这是我21天静心引导的第${day}天，请给我今天的简短练习与鼓励。`,
    },
  },
  startup_21_jack_ma: {
    en: {
      title: "21-day startup courage (Jack Ma)",
      description: "One fear-facing action per day for young founders.",
      dayPrompt: (day) =>
        `Day ${day} of my 21-day startup courage pack. Help me face fear with one action today.`,
    },
    zh: {
      title: "21天创业勇气陪跑",
      description: "每天面对恐惧的一件小行动。",
      dayPrompt: (day) =>
        `这是我21天创业勇气陪跑的第${day}天，请帮我面对恐惧并给出今天的一件行动。`,
    },
  },
};

export const COACHING_PACKS: CoachingPackMeta[] = [
  { id: "exam_30_inamori", characterId: "kazuo_inamori", durationDays: 30, requiresPremium: true },
  { id: "buddha_21_jingkong", characterId: "jingkong_master", durationDays: 21, requiresPremium: false },
  { id: "startup_21_jack_ma", characterId: "jack_ma", durationDays: 21, requiresPremium: true },
];

/**
 * Returns localized coaching pack cards.
 */
export function getCoachingPacks(locale: Locale) {
  return COACHING_PACKS.map((pack) => ({
    ...pack,
    ...PACK_META[pack.id][locale],
  }));
}

/**
 * Builds the day prompt for an active coaching pack.
 */
export function buildCoachingPackPrompt(
  packId: CoachingPackId,
  day: number,
  locale: Locale
): string {
  return PACK_META[packId][locale].dayPrompt(day);
}

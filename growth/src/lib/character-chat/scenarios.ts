import type { ScenarioId } from "@/types/character-growth";
import type { Locale } from "@/types/locale";
import type { StressSource } from "@/types/youthmentor";

export type ScenarioCard = {
  id: ScenarioId;
  characterId: string;
  stressTags: string[];
};

const SCENARIO_META: Record<
  ScenarioId,
  Record<Locale, { title: string; description: string; prompt: string }>
> = {
  anxiety_sleep: {
    en: {
      title: "Anxious & cannot sleep",
      description: "Racing thoughts at night, need calm guidance.",
      prompt: "I feel anxious and cannot sleep well. My mind keeps racing.",
    },
    zh: {
      title: "焦虑睡不着",
      description: "夜里思绪很多，需要平静与安顿。",
      prompt: "我最近很焦虑，晚上睡不着，脑子停不下来。",
    },
  },
  exam_stress: {
    en: {
      title: "Exam pressure",
      description: "Grades, deadlines, fear of failure.",
      prompt: "Exam pressure is overwhelming me and I feel behind.",
    },
    zh: {
      title: "考试压力",
      description: "成绩、截止日期、害怕考砸。",
      prompt: "考试压力让我喘不过气，总觉得自己跟不上。",
    },
  },
  friend_conflict: {
    en: {
      title: "Friendship conflict",
      description: "Arguments, feeling hurt or lonely.",
      prompt: "I had a conflict with a friend and feel hurt and confused.",
    },
    zh: {
      title: "朋友矛盾",
      description: "吵架、受伤、孤独。",
      prompt: "和朋友闹矛盾了，心里委屈又不知道怎么办。",
    },
  },
  startup_fear: {
    en: {
      title: "Afraid to start a venture",
      description: "Ideas but fear of failure.",
      prompt: "I want to start something but I'm terrified of failing.",
    },
    zh: {
      title: "想创业但害怕",
      description: "有想法却不敢迈出第一步。",
      prompt: "我想创业/做项目，但特别害怕失败。",
    },
  },
  money_basics: {
    en: {
      title: "Money & investing basics",
      description: "Saving, risk, long-term thinking.",
      prompt: "I want to understand money and investing without gambling.",
    },
    zh: {
      title: "理财入门",
      description: "储蓄、风险、长期思维。",
      prompt: "我想学理财和投资基础，不想投机赌博。",
    },
  },
  work_ethics: {
    en: {
      title: "Work dilemma",
      description: "Ethics, effort, meaning at work.",
      prompt: "I'm struggling with motivation and what is right at work.",
    },
    zh: {
      title: "工作困惑",
      description: "努力、意义、职场选择。",
      prompt: "工作上很迷茫，不知道怎样努力才算对。",
    },
  },
  practice_discipline: {
    en: {
      title: "Cannot stay disciplined",
      description: "Procrastination, breaking promises to self.",
      prompt: "I keep procrastinating and breaking promises to myself.",
    },
    zh: {
      title: "自律做不到",
      description: "拖延、对自己食言。",
      prompt: "我总是拖延，答应自己的事做不到。",
    },
  },
  find_peace: {
    en: {
      title: "Seek inner peace",
      description: "Stress, clinging, need perspective.",
      prompt: "I want inner peace but keep getting pulled into worry.",
    },
    zh: {
      title: "寻找内心平静",
      description: "压力、执著、想安顿身心。",
      prompt: "我想内心平静，但总是被烦恼牵着走。",
    },
  },
};

export const SCENARIO_CARDS: ScenarioCard[] = [
  { id: "anxiety_sleep", characterId: "jingkong_master", stressTags: ["anxiety"] },
  { id: "exam_stress", characterId: "kazuo_inamori", stressTags: ["exam"] },
  { id: "friend_conflict", characterId: "hsing_yun_master", stressTags: ["friendship"] },
  { id: "startup_fear", characterId: "jack_ma", stressTags: ["career"] },
  { id: "money_basics", characterId: "warren_buffett", stressTags: ["money"] },
  { id: "work_ethics", characterId: "kazuo_inamori", stressTags: ["work"] },
  { id: "practice_discipline", characterId: "xuanhua_master", stressTags: ["discipline"] },
  { id: "find_peace", characterId: "buddha_teacher", stressTags: ["peace"] },
];

/**
 * Returns localized scenario cards.
 */
export function getScenarioCards(locale: Locale) {
  return SCENARIO_CARDS.map((card) => ({
    ...card,
    ...SCENARIO_META[card.id][locale],
  }));
}

/**
 * Maps YouthMentor stress source to a default character for debrief.
 */
export function stressSourceToCharacterId(source: StressSource): string {
  const map: Record<StressSource, string> = {
    exam: "kazuo_inamori",
    homework: "steve_jobs",
    friendship: "hsing_yun_master",
    family: "jingkong_master",
    teacher: "ren_zhengfei",
    cca: "jack_ma",
    future: "warren_buffett",
    self_confidence: "dalai_lama",
    other: "buddha_teacher",
  };
  return map[source];
}

/**
 * Maps mentor persona to character for reflection debrief.
 */
export function mentorPersonaToCharacterId(
  persona: string
): string {
  const map: Record<string, string> = {
    study_coach: "kazuo_inamori",
    mindful_mentor: "jingkong_master",
    scientist_mentor: "marie_curie",
    kindness_mentor: "hsing_yun_master",
    wisdom_mode: "buddha_teacher",
  };
  return map[persona] ?? "buddha_teacher";
}

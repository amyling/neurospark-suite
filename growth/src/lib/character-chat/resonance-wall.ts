import { getInsightStats } from "@/lib/character-chat/growth-storage";
import type { Locale } from "@/types/locale";

/**
 * Seeds a stable daily anonymous count from date + local stats.
 */
function dailySeedCount(): number {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i += 1) {
    hash = (hash * 31 + today.charCodeAt(i)) % 100000;
  }
  const stats = getInsightStats();
  const localBoost =
    Object.values(stats.scenarioStarts).reduce((a, b) => a + b, 0) * 3 +
    stats.totalMessages;
  return 280 + (hash % 120) + Math.min(localBoost, 40);
}

/**
 * Returns anonymous resonance message for a stress tag or default anxiety.
 */
export function getResonanceMessage(
  locale: Locale,
  stressTag = "anxiety"
): { count: number; message: string } {
  const count = dailySeedCount();
  const tagLabels: Record<string, Record<Locale, string>> = {
    anxiety: { en: "anxious tonight", zh: "今晚也很焦虑" },
    exam: { en: "stressed about exams", zh: "为考试焦虑" },
    friendship: { en: "hurt by friendship issues", zh: "因朋友关系受伤" },
    career: { en: "unsure about their future", zh: "对未来迷茫" },
    discipline: { en: "struggling with discipline", zh: "自律很难" },
    peace: { en: "seeking inner peace", zh: "寻找内心平静" },
  };
  const label = tagLabels[stressTag] ?? tagLabels.anxiety;
  const message =
    locale === "zh"
      ? `今天也有约 ${count} 位同学${label.zh}——你并不孤单。`
      : `About ${count} others felt ${label.en} today — you are not alone.`;
  return { count, message };
}

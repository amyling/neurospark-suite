import type { SyllabusTopicEntry } from "./types";

/** MOE syllabus section headings (English → Chinese) */
const SECTION_ZH: Record<string, string> = {
  "Matter – Structures and Properties": "物质的结构与性质",
  "Chemical Reactions": "化学反应",
  "Chemistry in a Sustainable World": "化学与可持续发展",
  "Newtonian Mechanics": "牛顿力学",
  "Thermal Physics": "热学",
  Waves: "波",
  "Electricity and Magnetism": "电磁学",
  Measurements: "测量",
  Radioactivity: "放射性",
  "Modern Physics (extension)": "现代物理（拓展）",
  "Continuity of Life": "生命的延续",
  "The Basic Unit of Life": "生命的基本单位",
  "Primary Science Themes": "小学科学主题",
  "Integrated Science": "综合科学",
  "Algebra and Graphs": "代数与图像",
  Calculus: "微积分",
  "The Human Body": "人体",
  "Cells and the Chemistry of Life": "细胞与生命的化学",
  "Listening and Viewing": "听力与视听",
  "Reading and Viewing": "阅读与视听",
  "Speaking and Representing": "口语与表达",
  "Writing and Representing": "写作与表达",
  "Language Use": "语言运用",
  "听说能力": "听说能力",
  "阅读": "阅读",
  "写作": "写作",
  "语文知识": "语文知识",
  "字词积累": "字词积累",
  "阅读理解": "阅读理解",
  "小说与叙事": "小说与叙事",
  "诗歌": "诗歌",
  "戏剧": "戏剧",
  "文学鉴赏": "文学鉴赏",
  "Movement and Games": "运动与游戏",
  "Health and Fitness": "健康与体能",
  "Athletics and Outdoor Education": "田径与户外教育",
  "Games and Sports": "球类与运动",
};

/** Curated English syllabus unit titles → Chinese (6091/6092/6093 and common) */
const UNIT_TITLE_ZH: Record<string, string> = {
  "Experimental Chemistry": "实验化学",
  "The Particulate Nature of Matter": "物质的粒子性",
  "Chemical Bonding and Structure": "化学键与结构",
  "Chemical Calculations": "化学计算",
  "Acid-Base Chemistry": "酸碱化学",
  "Qualitative Analysis": "定性分析",
  "Redox Chemistry": "氧化还原化学",
  "Patterns in the Periodic Table": "元素周期律",
  "Chemical Energetics & Rate of Reactions": "化学能量与反应速率",
  "Energetics and Rate of Reactions": "化学能量与反应速率",
  "Organic Chemistry": "有机化学",
  "Maintaining Air Quality": "维持空气质量",
  Measurements: "测量",
  "Newtonian Mechanics": "牛顿力学",
  "Thermal Physics": "热学",
  Waves: "波",
  "Electricity and Magnetism": "电磁学",
  Radioactivity: "放射性",
  "Content structure — Sections I–III": "内容结构（第一至第三部分）",
  "Upper Secondary Physics — content sections": "中学高级物理内容板块",
  "Primary Science — themes": "小学科学主题",
  "Lower Secondary Science": "中学低年级科学",
};

/**
 * Returns Chinese characters present in a string.
 */
function chineseChars(text: string): string {
  return (text.match(/[\u4e00-\u9fff]+/g) ?? []).join("");
}

/**
 * Picks the best Chinese label from match keywords.
 */
export function pickChineseKeywords(keywords: string[]): string {
  const zh = keywords.map(chineseChars).filter((s) => s.length >= 2);
  if (zh.length) {
    return zh.slice(0, 4).join("、");
  }
  return "";
}

/**
 * Parses the unit title from a MOE syllabusRef string.
 */
export function unitTitleFromRef(syllabusRef: string): string {
  const sectionMatch = syllabusRef.match(/§[\d–\-]+(?:–[\d]+)?\s*(.+)$/);
  if (sectionMatch?.[1]) {
    return sectionMatch[1].trim();
  }
  const themeMatch = syllabusRef.match(/Theme [IVX]+ — (.+)$/);
  if (themeMatch?.[1]) {
    return themeMatch[1].trim();
  }
  return syllabusRef;
}

/**
 * Localizes a numbered PDF chunk title such as "1. Experimental Chemistry".
 */
export function localizePdfTitle(title: string): { en: string; zh: string } {
  const stripped = title.replace(/^\d+\.\s*/, "").replace(/^\d+–\d+\.\s*/, "");
  const en = stripped.trim() || title;
  const mapped = UNIT_TITLE_ZH[en] ?? UNIT_TITLE_ZH[stripped.trim()];
  if (mapped) {
    const prefix = title.match(/^(\d+[.–\d]*\s*)/)?.[1] ?? "";
    return { en: title, zh: `${prefix}${mapped}` };
  }
  return { en: title, zh: title };
}

/**
 * Localizes a syllabus section heading.
 */
export function localizeSection(section: string): { en: string; zh: string } {
  return {
    en: section,
    zh: SECTION_ZH[section] ?? section,
  };
}

/**
 * Builds bilingual labels for one curated knowledge-base entry (unit level).
 */
export function localizeKnowledgeEntry(entry: SyllabusTopicEntry): {
  labelEn: string;
  labelZh: string;
  topicEn: string;
  topicZh: string;
  sectionEn: string;
  sectionZh: string;
} {
  const unitTitle = unitTitleFromRef(entry.syllabusRef);
  const section = localizeSection(entry.section);
  const zhKeywords = pickChineseKeywords(entry.matchKeywords);
  const unitZh = UNIT_TITLE_ZH[unitTitle] ?? (zhKeywords || section.zh);

  return {
    labelEn: unitTitle,
    labelZh: unitZh,
    topicEn: unitTitle,
    topicZh: zhKeywords ? `${unitZh}（${zhKeywords}）` : unitZh,
    sectionEn: section.en,
    sectionZh: section.zh,
  };
}

/**
 * Builds bilingual labels for one key-concept knowledge point.
 */
export function localizeKnowledgeConcept(
  entry: SyllabusTopicEntry,
  concept: string,
  index: number
): {
  labelEn: string;
  labelZh: string;
  topicEn: string;
  topicZh: string;
  sectionEn: string;
  sectionZh: string;
} {
  const unit = localizeKnowledgeEntry(entry);
  const zhKeywords = pickChineseKeywords(entry.matchKeywords);
  const conceptShort = concept.length > 72 ? `${concept.slice(0, 69)}…` : concept;

  return {
    labelEn: conceptShort,
    labelZh: zhKeywords
      ? `${unit.labelZh} · 知识点 ${index + 1}`
      : `${unit.sectionZh} · 知识点 ${index + 1}`,
    topicEn: `${unit.topicEn}: ${concept}`,
    topicZh: zhKeywords
      ? `${unit.labelZh}：${zhKeywords}（${conceptShort}）`
      : `${unit.sectionZh}：${conceptShort}`,
    sectionEn: unit.sectionEn,
    sectionZh: unit.sectionZh,
  };
}

/**
 * Resolves the topic string to send to lesson generation for the active locale.
 */
export function resolveTopicForLocale(
  option: { topicEn: string; topicZh: string },
  locale: "en" | "zh"
): string {
  return locale === "zh" ? option.topicZh : option.topicEn;
}

/**
 * Resolves dropdown display label for the active locale.
 */
export function resolveLabelForLocale(
  option: { labelEn: string; labelZh: string },
  locale: "en" | "zh"
): string {
  return locale === "zh" ? option.labelZh : option.labelEn;
}

/**
 * Resolves optgroup section label for the active locale.
 */
export function resolveSectionForLocale(
  option: { sectionEn: string; sectionZh: string },
  locale: "en" | "zh"
): string {
  return locale === "zh" ? option.sectionZh : option.sectionEn;
}

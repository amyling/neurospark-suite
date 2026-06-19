/** School band derived from syllabus folder layout */
export type SyllabusSchoolLevel = "primary" | "secondary";

/** Dropdown option with bilingual labels */
export type SyllabusOption = {
  id: string;
  labelEn: string;
  labelZh: string;
};

/** Topic option aligned to MOE syllabus knowledge base */
export type SyllabusTopicOption = {
  id: string;
  labelEn: string;
  labelZh: string;
  /** English topic string for AI / RAG */
  topicEn: string;
  /** Chinese topic string for AI / RAG */
  topicZh: string;
  /** @deprecated Use topicEn/topicZh — kept for backward compatibility */
  topic: string;
  sectionEn: string;
  sectionZh: string;
  /** @deprecated Use sectionEn/sectionZh */
  section: string;
  syllabusRef: string;
};

/** Full cascading options tree for lesson generator UI */
export type SyllabusOptionsTree = {
  schoolLevels: SyllabusOption[];
  subjectsByLevel: Record<SyllabusSchoolLevel, SyllabusOption[]>;
  gradesBySubject: Record<string, string[]>;
  topicsByGrade: Record<string, SyllabusTopicOption[]>;
};

const GRADE_LABELS_ZH: Record<string, string> = {
  P1: "小一",
  P2: "小二",
  P3: "小三",
  P4: "小四",
  P5: "小五",
  P6: "小六",
  "Sec 1": "中一",
  "Sec 2": "中二",
  "Sec 3": "中三",
  "Sec 4": "中四",
  "Sec 5": "中五",
};

/**
 * Builds a composite key for grade/topic lookups.
 */
export function syllabusSelectionKey(
  schoolLevel: SyllabusSchoolLevel,
  subject: string,
  grade?: string
): string {
  return grade
    ? `${schoolLevel}:${subject}:${grade}`
    : `${schoolLevel}:${subject}`;
}

/**
 * Returns bilingual grade label for UI display.
 */
export function gradeLabel(grade: string, locale: "en" | "zh"): string {
  if (locale === "zh") {
    return GRADE_LABELS_ZH[grade] ?? grade;
  }
  return grade;
}

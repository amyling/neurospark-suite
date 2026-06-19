import pdfChunkData from "./data/sg-syllabus-pdf-chunks.json";
import webChunkData from "./data/sg-syllabus-web-knowledge-chunks.json";
import { listSyllabusTopicEntries, levelToSyllabusBand } from "./retrieve-topic-knowledge";
import {
  localizeKnowledgeConcept,
  localizeKnowledgeEntry,
  localizePdfTitle,
  localizeSection,
  pickChineseKeywords,
} from "./syllabus-topic-localization";
import type {
  SyllabusOption,
  SyllabusOptionsTree,
  SyllabusSchoolLevel,
  SyllabusTopicOption,
} from "./syllabus-options-types";
import { syllabusSelectionKey } from "./syllabus-options-types";
import type { SyllabusTopicEntry } from "./types";

export type {
  SyllabusOption,
  SyllabusOptionsTree,
  SyllabusSchoolLevel,
  SyllabusTopicOption,
} from "./syllabus-options-types";
export { gradeLabel, syllabusSelectionKey } from "./syllabus-options-types";

/** One syllabus PDF mapped to subject and grade range */
export type SyllabusCatalogEntry = {
  id: string;
  schoolLevel: SyllabusSchoolLevel;
  subject: string;
  subjectLabelZh: string;
  grades: string[];
  file: string;
  code: string;
};

const PRIMARY_GRADES = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;
const LOWER_SEC_GRADES = ["Sec 1", "Sec 2"] as const;
const UPPER_SEC_GRADES = ["Sec 3", "Sec 4", "Sec 5"] as const;

/**
 * Catalog of MOE syllabus PDFs under `syllabus/` (primary + secondary).
 * Paths are relative to the syllabus root folder.
 */
export const SG_SYLLABUS_CATALOG: SyllabusCatalogEntry[] = [
  {
    id: "pri-math",
    schoolLevel: "primary",
    subject: "Mathematics",
    subjectLabelZh: "数学",
    grades: [...PRIMARY_GRADES],
    file: "primary/2021 Primary Mathematics Syllabus P1 to P6 Updated Dec 2024.pdf",
    code: "P1-P6",
  },
  {
    id: "pri-science",
    schoolLevel: "primary",
    subject: "Science",
    subjectLabelZh: "科学",
    grades: ["P3", "P4", "P5", "P6"],
    file: "primary/Primary Science Syllabus 2023_May24.pdf",
    code: "P3-P6",
  },
  {
    id: "pri-english",
    schoolLevel: "primary",
    subject: "English",
    subjectLabelZh: "英语",
    grades: [...PRIMARY_GRADES],
    file: "primary/2020-english-language-primary.pdf",
    code: "P1-P6-EL",
  },
  {
    id: "pri-chinese",
    schoolLevel: "primary",
    subject: "Chinese",
    subjectLabelZh: "华文",
    grades: [...PRIMARY_GRADES],
    file: "primary/CL Syllabus Pri 2024.pdf",
    code: "P1-P6-CL",
  },
  {
    id: "pri-hcl",
    schoolLevel: "primary",
    subject: "Higher Chinese",
    subjectLabelZh: "高级华文",
    grades: ["P1", "P2", "P3", "P4", "P5", "P6"],
    file: "primary/2024 Character List Primary One Higher Chinese.pdf",
    code: "P1-HCL",
  },
  {
    id: "pri-pe",
    schoolLevel: "primary",
    subject: "Physical Education",
    subjectLabelZh: "体育",
    grades: [...PRIMARY_GRADES],
    file: "2024 Physical Education Primary Secondary and PreUniversity Syllabus.pdf",
    code: "PE-Pri",
  },
  {
    id: "sec-math",
    schoolLevel: "secondary",
    subject: "Mathematics",
    subjectLabelZh: "数学",
    grades: [...LOWER_SEC_GRADES, ...UPPER_SEC_GRADES],
    file: "secondary/2020-express_na-maths_syllabuses.pdf",
    code: "Sec-Math",
  },
  {
    id: "sec-amath",
    schoolLevel: "secondary",
    subject: "Additional Mathematics",
    subjectLabelZh: "附加数学",
    grades: [...UPPER_SEC_GRADES],
    file: "secondary/2020-express_na-add-maths_syllabuses.pdf",
    code: "4049",
  },
  {
    id: "sec-science-lower",
    schoolLevel: "secondary",
    subject: "Science",
    subjectLabelZh: "科学",
    grades: [...LOWER_SEC_GRADES],
    file: "secondary/2021 Science Lower Secondary ExpressNormalAcademic Syllabus.pdf",
    code: "S1-S2",
  },
  {
    id: "sec-chemistry",
    schoolLevel: "secondary",
    subject: "Chemistry",
    subjectLabelZh: "化学",
    grades: [...UPPER_SEC_GRADES],
    file: "secondary/2023 OLevel Chemistry Syllabus Updated 2024.pdf",
    code: "6092",
  },
  {
    id: "sec-physics",
    schoolLevel: "secondary",
    subject: "Physics",
    subjectLabelZh: "物理",
    grades: [...UPPER_SEC_GRADES],
    file: "secondary/2023 OLevel Physics Syllabus Updated 2024.pdf",
    code: "6091",
  },
  {
    id: "sec-sc-chem",
    schoolLevel: "secondary",
    subject: "Science (Chemistry)",
    subjectLabelZh: "科学（化学）",
    grades: ["Sec 3", "Sec 4"],
    file: "secondary/2023 OLevel ScienceChemistry Syllabus Updated 2024.pdf",
    code: "5076-Chem",
  },
  {
    id: "sec-sc-phys",
    schoolLevel: "secondary",
    subject: "Science (Physics)",
    subjectLabelZh: "科学（物理）",
    grades: ["Sec 3", "Sec 4"],
    file: "secondary/2023 OLevel SciencePhysics Syllabus Updated 2024.pdf",
    code: "5076-Phys",
  },
  {
    id: "sec-lit-chinese",
    schoolLevel: "secondary",
    subject: "Literature in Chinese",
    subjectLabelZh: "华文文学",
    grades: [...LOWER_SEC_GRADES, "Sec 3", "Sec 4"],
    file: "secondary/2019-literature-in-chinese-syllabus-secondary.pdf",
    code: "Sec-Lit-CL",
  },
  {
    id: "sec-pe",
    schoolLevel: "secondary",
    subject: "Physical Education",
    subjectLabelZh: "体育",
    grades: [...LOWER_SEC_GRADES, ...UPPER_SEC_GRADES],
    file: "2024 Physical Education Primary Secondary and PreUniversity Syllabus.pdf",
    code: "PE-Sec",
  },
];

/**
 * Maps a subject string to the closest curated knowledge-base subject name.
 */
function normalizeKnowledgeSubject(subject: string): string {
  if (/science \(chemistry\)/i.test(subject)) return "Chemistry";
  if (/science \(physics\)/i.test(subject)) return "Physics";
  if (/additional mathematics/i.test(subject)) return "Mathematics";
  if (/literature in chinese/i.test(subject)) return "Literature in Chinese";
  if (/higher chinese/i.test(subject)) return "Higher Chinese";
  if (/physical education/i.test(subject)) return "Physical Education";
  if (/^chinese$/i.test(subject)) return "Chinese";
  return subject;
}

/**
 * Filters curated syllabus topic entries for a subject + grade selection.
 * Expands each entry into a unit topic plus individual key-concept knowledge points.
 */
function topicsFromKnowledgeBase(
  subject: string,
  grade: string
): SyllabusTopicOption[] {
  const levelBand = levelToSyllabusBand(grade);
  const knowledgeSubject = normalizeKnowledgeSubject(subject);

  const entries = listSyllabusTopicEntries().filter((entry) => {
    const subjectMatch =
      entry.subject.toLowerCase() === knowledgeSubject.toLowerCase() ||
      (knowledgeSubject === "Science" && entry.subject === "Science");
    if (!subjectMatch) return false;
    return entry.levelBands.includes(levelBand);
  });

  const options: SyllabusTopicOption[] = [];

  for (const entry of entries) {
    const unit = localizeKnowledgeEntry(entry);
    options.push({
      id: entry.id,
      labelEn: unit.labelEn,
      labelZh: unit.labelZh,
      topicEn: unit.topicEn,
      topicZh: unit.topicZh,
      topic: unit.topicEn,
      sectionEn: unit.sectionEn,
      sectionZh: unit.sectionZh,
      section: unit.sectionEn,
      syllabusRef: entry.syllabusRef,
    });

    entry.keyConcepts.forEach((concept, index) => {
      const localized = localizeKnowledgeConcept(entry, concept, index);
      options.push({
        id: `${entry.id}-kp-${index + 1}`,
        labelEn: localized.labelEn,
        labelZh: localized.labelZh,
        topicEn: localized.topicEn,
        topicZh: localized.topicZh,
        topic: localized.topicEn,
        sectionEn: localized.sectionEn,
        sectionZh: localized.sectionZh,
        section: localized.sectionEn,
        syllabusRef: entry.syllabusRef,
      });
    });
  }

  return options;
}

type SyllabusChunkRow = {
  id: string;
  subject: string;
  syllabusCode: string;
  title: string;
  content: string;
  matchKeywords?: string[];
};

const ALL_SYLLABUS_CHUNKS: SyllabusChunkRow[] = [
  ...(pdfChunkData as { chunks: SyllabusChunkRow[] }).chunks,
  ...(webChunkData as { chunks: SyllabusChunkRow[] }).chunks,
];

/**
 * True when a chunk matches the selected catalog syllabus code.
 */
function chunkMatchesCatalogCode(
  chunk: SyllabusChunkRow,
  catalogCode: string,
  knowledgeSubject: string
): boolean {
  if (!catalogCode) {
    return chunk.subject.toLowerCase() === knowledgeSubject.toLowerCase();
  }
  if (chunk.syllabusCode === catalogCode) {
    return true;
  }
  if (catalogCode === "5076-Chem" && /5076|6092/i.test(chunk.syllabusCode)) {
    return chunk.subject.toLowerCase() === "chemistry";
  }
  if (catalogCode === "5076-Phys" && /5076|6091/i.test(chunk.syllabusCode)) {
    return chunk.subject.toLowerCase() === "physics";
  }
  if (catalogCode === "S1-S2" && chunk.syllabusCode === "S1-S2") return true;
  if ((catalogCode === "P3-P6" || catalogCode === "P1-P6") && chunk.syllabusCode.startsWith("P")) {
    return true;
  }
  if (catalogCode === "Sec-Math" && /Sec|4049|4052|P1-P6/.test(chunk.syllabusCode)) {
    return chunk.subject.toLowerCase() === "mathematics";
  }
  if (catalogCode === "4049" && chunk.subject.toLowerCase() === "mathematics") {
    return true;
  }
  if (catalogCode === "P1-P6-EL" && /english|el|language primary/i.test(chunk.id + chunk.title)) {
    return chunk.subject.toLowerCase() === "english";
  }
  if (catalogCode === "P1-P6-CL" && /chinese|cl|华文/i.test(chunk.id + chunk.title)) {
    return chunk.subject.toLowerCase() === "chinese";
  }
  if (catalogCode === "P1-HCL" && /higher|hcl|高华/i.test(chunk.id + chunk.title)) {
    return chunk.subject.toLowerCase() === "higher chinese";
  }
  if (catalogCode === "Sec-Lit-CL" && /literature|文学/i.test(chunk.id + chunk.title)) {
    return chunk.subject.toLowerCase() === "literature in chinese";
  }
  if ((catalogCode === "PE-Pri" || catalogCode === "PE-Sec") && /pe|physical|体育/i.test(chunk.id + chunk.title + chunk.subject)) {
    return /physical education|science|pe/i.test(chunk.subject);
  }
  return false;
}

/**
 * Builds topic options from offline PDF / web syllabus index chunks.
 */
function topicsFromSyllabusChunks(
  subject: string,
  catalogCode: string
): SyllabusTopicOption[] {
  const knowledgeSubject = normalizeKnowledgeSubject(subject);
  const options: SyllabusTopicOption[] = [];

  for (const chunk of ALL_SYLLABUS_CHUNKS) {
    if (chunk.subject.toLowerCase() !== knowledgeSubject.toLowerCase()) {
      continue;
    }
    if (!chunkMatchesCatalogCode(chunk, catalogCode, knowledgeSubject)) {
      continue;
    }

    const { en, zh } = localizePdfTitle(chunk.title);
    const zhKeywords = pickChineseKeywords(chunk.matchKeywords ?? []);
    const sectionGuess = chunk.content.split(":")[0]?.trim() ?? "Syllabus units";
    const section = localizeSection(
      sectionGuess.length > 60 ? "Syllabus units" : sectionGuess
    );

    options.push({
      id: `chunk-${chunk.id}`,
      labelEn: en,
      labelZh: zhKeywords ? `${zh}（${zhKeywords}）` : zh,
      topicEn: en,
      topicZh: zhKeywords ? `${zh}（${zhKeywords}）` : zh,
      topic: en,
      sectionEn: section.en,
      sectionZh: section.zh,
      section: section.en,
      syllabusRef: chunk.syllabusCode,
    });
  }

  return options;
}

/**
 * Removes duplicate topic options by stable id.
 */
function dedupeTopicOptions(options: SyllabusTopicOption[]): SyllabusTopicOption[] {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

/**
 * Sorts topics by section then label for stable dropdown order.
 */
function sortTopicOptions(options: SyllabusTopicOption[]): SyllabusTopicOption[] {
  return [...options].sort((a, b) => {
    const sectionCmp = a.sectionEn.localeCompare(b.sectionEn);
    if (sectionCmp !== 0) return sectionCmp;
    return a.labelEn.localeCompare(b.labelEn);
  });
}

/**
 * Resolves topics for a school level + subject + grade triple.
 */
export function getSyllabusTopics(
  schoolLevel: SyllabusSchoolLevel,
  subject: string,
  grade: string
): SyllabusTopicOption[] {
  const catalog = SG_SYLLABUS_CATALOG.find(
    (row) => row.schoolLevel === schoolLevel && row.subject === subject
  );

  const merged = dedupeTopicOptions([
    ...topicsFromKnowledgeBase(subject, grade),
    ...topicsFromSyllabusChunks(subject, catalog?.code ?? ""),
  ]);

  return sortTopicOptions(merged);
}

/**
 * Builds the full syllabus options tree for cascading dropdowns.
 */
export function buildSyllabusOptionsTree(): SyllabusOptionsTree {
  const schoolLevels: SyllabusOption[] = [
    { id: "primary", labelEn: "Primary", labelZh: "小学" },
    { id: "secondary", labelEn: "Secondary", labelZh: "中学" },
  ];

  const subjectsByLevel: SyllabusOptionsTree["subjectsByLevel"] = {
    primary: [],
    secondary: [],
  };
  const gradesBySubject: Record<string, string[]> = {};
  const topicsByGrade: Record<string, SyllabusTopicOption[]> = {};

  for (const level of schoolLevels) {
    const subjectMap = new Map<string, SyllabusOption>();
    const gradeMap = new Map<string, Set<string>>();

    for (const row of SG_SYLLABUS_CATALOG.filter(
      (entry) => entry.schoolLevel === level.id
    )) {
      if (!subjectMap.has(row.subject)) {
        subjectMap.set(row.subject, {
          id: row.subject,
          labelEn: row.subject,
          labelZh: row.subjectLabelZh,
        });
      }
      const key = syllabusSelectionKey(level.id as SyllabusSchoolLevel, row.subject);
      if (!gradeMap.has(key)) {
        gradeMap.set(key, new Set());
      }
      for (const grade of row.grades) {
        gradeMap.get(key)!.add(grade);
      }
    }

    subjectsByLevel[level.id as SyllabusSchoolLevel] = [...subjectMap.values()].sort(
      (a, b) => a.labelEn.localeCompare(b.labelEn)
    );

    for (const [key, grades] of gradeMap) {
      const sorted = [...grades].sort((a, b) => {
        const order = (g: string) => {
          if (g.startsWith("P")) return Number(g.slice(1));
          if (g.startsWith("Sec")) return 10 + Number(g.replace(/\D/g, ""));
          return 99;
        };
        return order(a) - order(b);
      });
      gradesBySubject[key] = sorted;

      const [schoolLevel, subject] = key.split(":");
      for (const grade of sorted) {
        const topicKey = syllabusSelectionKey(
          schoolLevel as SyllabusSchoolLevel,
          subject,
          grade
        );
        topicsByGrade[topicKey] = getSyllabusTopics(
          schoolLevel as SyllabusSchoolLevel,
          subject,
          grade
        );
      }
    }
  }

  return { schoolLevels, subjectsByLevel, gradesBySubject, topicsByGrade };
}

/**
 * Returns sensible defaults for the lesson generator form.
 */
export function defaultSyllabusSelection(): {
  schoolLevel: SyllabusSchoolLevel;
  subject: string;
  grade: string;
  topic: string;
} {
  const tree = buildSyllabusOptionsTree();
  const schoolLevel: SyllabusSchoolLevel = "secondary";
  const subject = "Mathematics";
  const grade = "Sec 4";
  const topicKey = syllabusSelectionKey(schoolLevel, subject, grade);
  const topics = tree.topicsByGrade[topicKey] ?? [];
  const topic =
    topics.find((row) => /quadratic|函数|graph|algebra/i.test(row.topicEn))?.topicEn ??
    topics[0]?.topicEn ??
    "Quadratic functions";

  return { schoolLevel, subject, grade, topic };
}

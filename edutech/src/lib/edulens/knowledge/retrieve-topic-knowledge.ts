import type { LessonVisualType } from "../types";
import syllabusData from "./data/sg-syllabus-topics.json";
import syllabusExtData from "./data/sg-syllabus-topics-olevel-ext.json";
import syllabusComprehensiveData from "./data/sg-syllabus-topics-comprehensive-ext.json";
import syllabusLanguageData from "./data/sg-syllabus-topics-language-ext.json";
import type {
  SyllabusLevelBand,
  SyllabusTopicEntry,
  TopicKnowledgeContext,
  TopicKnowledgeMatch,
} from "./types";

/** Curated topics plus O-Level / Primary / A-Math extension entries. */
const ALL_ENTRIES = [
  ...(syllabusData.entries as SyllabusTopicEntry[]),
  ...(syllabusExtData.entries as SyllabusTopicEntry[]),
  ...(syllabusComprehensiveData.entries as SyllabusTopicEntry[]),
  ...(syllabusLanguageData.entries as SyllabusTopicEntry[]),
];

/**
 * Maps EduLens level string to Singapore syllabus band.
 */
export function levelToSyllabusBand(level: string): SyllabusLevelBand {
  const normalized = level.toLowerCase();
  if (/^p\d|primary|小学/.test(normalized)) {
    return "primary";
  }
  if (/jc|j1|j2|初级学院/.test(normalized)) {
    return "jc";
  }
  if (/sec\s*[34]|s[34]|sec\s*5|s5|o.?level|upper/.test(normalized)) {
    return "sec_upper";
  }
  return "sec_lower";
}

/**
 * Scores how well a syllabus entry matches subject, level, and topic query.
 */
function scoreEntry(
  entry: SyllabusTopicEntry,
  subject: string,
  levelBand: SyllabusLevelBand,
  topicHaystack: string
): number {
  let score = 0;

  const subjectMatch =
    entry.subject.toLowerCase() === subject.toLowerCase() ||
    topicHaystack.includes(entry.subject.toLowerCase());

  if (!subjectMatch && !entry.matchKeywords.some((kw) => topicHaystack.includes(kw.toLowerCase()))) {
    return 0;
  }

  if (entry.subject.toLowerCase() === subject.toLowerCase()) {
    score += 12;
  }

  if (entry.levelBands.includes(levelBand)) {
    score += 6;
  } else if (levelBand === "sec_upper" && entry.levelBands.includes("sec_lower")) {
    score += 2;
  }

  for (const keyword of entry.matchKeywords) {
    if (topicHaystack.includes(keyword.toLowerCase())) {
      score += 8;
    }
  }

  for (const concept of entry.keyConcepts) {
    const token = concept.split(" ")[0]?.toLowerCase();
    if (token && token.length > 4 && topicHaystack.includes(token)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Retrieves top syllabus-aligned topic entries for a lesson request.
 */
export function retrieveTopicKnowledge(
  subject: string,
  level: string,
  topic: string,
  limit = 3
): TopicKnowledgeMatch[] {
  const levelBand = levelToSyllabusBand(level);
  const topicHaystack = `${topic} ${subject}`.toLowerCase();

  return ALL_ENTRIES.map((entry) => ({
    entry,
    score: scoreEntry(entry, subject, levelBand, topicHaystack),
  }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Suggests visualType for a step using matched syllabus entry hints.
 */
export function suggestVisualTypeFromKnowledge(
  stepTitle: string,
  stepBody: string,
  matches: TopicKnowledgeMatch[]
): LessonVisualType | undefined {
  const haystack = `${stepTitle} ${stepBody}`.toLowerCase();

  for (const { entry } of matches) {
    for (const hint of entry.stepVisualHints) {
      try {
        if (new RegExp(hint.pattern, "i").test(haystack)) {
          return hint.visualType;
        }
      } catch {
        continue;
      }
    }
  }

  return matches[0]?.entry.visualTypes[0];
}

/**
 * Builds prompt context and visual-type constraints from syllabus knowledge.
 */
export function buildTopicKnowledgeContext(
  subject: string,
  level: string,
  topic: string
): TopicKnowledgeContext {
  const matches = retrieveTopicKnowledge(subject, level, topic);

  if (!matches.length) {
    return {
      matches: [],
      promptBlock: `TOPIC KNOWLEDGE (no curated syllabus match for "${topic}"):
- Align content to Subject "${subject}" and Level "${level}" (Singapore MOE-style).
- Choose visualType per step from step content — do NOT default all chemistry to chemistry_reaction or all physics to physics_spacetime.
- Use concept_process for models/diagrams; formula_spotlight for laws; chemistry_reaction only when a reaction equation is central.`,
      allowedVisualTypes: [
        "concept_process",
        "concept_map",
        "writing_structure",
        "formula_spotlight",
        "chemistry_reaction",
        "equation_balance",
        "mistake_compare",
        "generic",
        "physics_spacetime",
        "integral_area",
        "parabola_graph",
      ],
      syllabusRefs: [],
    };
  }

  const allowedVisualTypes = [
    ...new Set(matches.flatMap((m) => m.entry.visualTypes)),
  ] as LessonVisualType[];

  const lines = matches.map(({ entry, score }, index) => {
    const concepts = entry.keyConcepts.map((c) => `  - ${c}`).join("\n");
    const diagrams = entry.diagramCaptions.map((d) => `  - ${d}`).join("\n");
    const formulas =
      entry.formulas.length > 0
        ? entry.formulas.map((f) => `  - $${f}$`).join("\n")
        : "  - (use words/diagrams; formulas only if syllabus-appropriate)";
    const visuals = entry.visualTypes.join(" | ");
    const misconceptions = entry.misconceptions?.length
      ? entry.misconceptions.map((m) => `  - ${m}`).join("\n")
      : "";

    return `Match ${index + 1} (score ${score}) — ${entry.syllabusRef}
Section: ${entry.section}
Key concepts:
${concepts}
Syllabus-appropriate formulas:
${formulas}
Diagram / animation captions (use in teachingContent diagram blocks and step bodies):
${diagrams}
Suggested visualTypes for learningVisualLessons steps: ${visuals}
${misconceptions ? `Common misconceptions:\n${misconceptions}` : ""}`;
  });

  const promptBlock = `SINGAPORE SYLLABUS KNOWLEDGE BASE (curated from MOE/SEAB; align lesson to this — do not invent off-syllabus physics in chemistry or vice versa):
Level band: ${levelToSyllabusBand(level)} | Subject: ${subject} | Topic: ${topic}

${lines.join("\n\n")}

VISUAL TYPE RULES (per step — pick ONE that fits the step content):
- concept_process: models, particle diagrams, circuits, energy profiles, process flows
- concept_map: concept maps, mind maps, topic structure (language/humanities)
- writing_structure: email/essay paragraph structure, salutation, subject line, closing
- formula_spotlight: highlight one law or equation for this syllabus topic
- chemistry_reaction: ONLY when balancing/displaying a chemical reaction is the focus
- equation_balance: stoichiometry, mole ratio, solving equations
- physics_spacetime: ONLY for relativity / spacetime topics (NOT electricity, waves, or mechanics)
- integral_area / parabola_graph: mathematics topics only
- mistake_compare: common errors listed above`;

  return {
    matches,
    promptBlock,
    allowedVisualTypes,
    syllabusRefs: matches.map((m) => m.entry.syllabusRef),
  };
}

/**
 * Returns all curated entries (for admin/debug).
 */
export function listSyllabusTopicEntries(): SyllabusTopicEntry[] {
  return ALL_ENTRIES;
}

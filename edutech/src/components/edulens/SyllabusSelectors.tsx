"use client";

import { useEffect, useMemo, useState } from "react";
import {
  resolveLabelForLocale,
  resolveSectionForLocale,
  resolveTopicForLocale,
} from "@/lib/edulens/knowledge/syllabus-topic-localization";
import {
  gradeLabel,
  syllabusSelectionKey,
  type SyllabusOptionsTree,
  type SyllabusSchoolLevel,
  type SyllabusTopicOption,
} from "@/lib/edulens/knowledge/syllabus-options-types";
import { fetchEdulens } from "@/lib/i18n/client-fetch";
import { useLocale } from "@/lib/i18n/locale-context";

type SyllabusSelectorsProps = {
  schoolLevel: SyllabusSchoolLevel;
  subject: string;
  grade: string;
  topic: string;
  onSchoolLevelChange: (value: SyllabusSchoolLevel) => void;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onTopicChange: (value: string) => void;
};

/**
 * Groups topic options by syllabus section for optgroup rendering.
 */
function groupTopicsBySection(
  topics: SyllabusTopicOption[],
  locale: "en" | "zh"
): { section: string; items: SyllabusTopicOption[] }[] {
  const map = new Map<string, SyllabusTopicOption[]>();
  for (const row of topics) {
    const section = resolveSectionForLocale(row, locale);
    if (!map.has(section)) {
      map.set(section, []);
    }
    map.get(section)!.push(row);
  }
  return [...map.entries()].map(([section, items]) => ({ section, items }));
}

/**
 * Cascading syllabus dropdowns sourced from MOE PDF catalog and knowledge base.
 */
export function SyllabusSelectors({
  schoolLevel,
  subject,
  grade,
  topic,
  onSchoolLevelChange,
  onSubjectChange,
  onGradeChange,
  onTopicChange,
}: SyllabusSelectorsProps) {
  const { locale, t } = useLocale();
  const [tree, setTree] = useState<SyllabusOptionsTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchEdulens("/api/edulens/syllabus-options", locale)
      .then((res) => res.json())
      .then((data: SyllabusOptionsTree) => {
        if (!cancelled) {
          setTree(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTree(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const subjects = useMemo(
    () => tree?.subjectsByLevel[schoolLevel] ?? [],
    [tree, schoolLevel]
  );

  const grades = useMemo(() => {
    if (!tree) return [];
    return tree.gradesBySubject[syllabusSelectionKey(schoolLevel, subject)] ?? [];
  }, [tree, schoolLevel, subject]);

  const topics = useMemo(() => {
    if (!tree) return [];
    return (
      tree.topicsByGrade[syllabusSelectionKey(schoolLevel, subject, grade)] ?? []
    );
  }, [tree, schoolLevel, subject, grade]);

  const topicGroups = useMemo(
    () => groupTopicsBySection(topics, locale),
    [topics, locale]
  );

  const label = (en: string, zh: string) => (locale === "zh" ? zh : en);

  /** Sync selected topic id when upstream filters change */
  useEffect(() => {
    if (!tree) return;

    const levelSubjects = tree.subjectsByLevel[schoolLevel] ?? [];
    if (levelSubjects.length && !levelSubjects.some((row) => row.id === subject)) {
      onSubjectChange(levelSubjects[0].id);
      return;
    }

    const gradeList =
      tree.gradesBySubject[syllabusSelectionKey(schoolLevel, subject)] ?? [];
    if (gradeList.length && !gradeList.includes(grade)) {
      onGradeChange(gradeList[0]);
      return;
    }

    if (!topics.length) {
      setSelectedTopicId("");
      onTopicChange("");
      return;
    }

    const current =
      topics.find((row) => row.id === selectedTopicId) ??
      topics.find(
        (row) =>
          row.topicEn === topic ||
          row.topicZh === topic ||
          row.topic === topic
      );

    const next = current ?? topics[0];
    if (next.id !== selectedTopicId) {
      setSelectedTopicId(next.id);
    }
    const localized = resolveTopicForLocale(next, locale);
    if (localized !== topic) {
      onTopicChange(localized);
    }
  }, [
    tree,
    schoolLevel,
    subject,
    grade,
    topics,
    selectedTopicId,
    topic,
    locale,
    onSubjectChange,
    onGradeChange,
    onTopicChange,
  ]);

  /** Re-emit localized topic when locale toggles */
  useEffect(() => {
    if (!selectedTopicId || !topics.length) return;
    const option = topics.find((row) => row.id === selectedTopicId);
    if (!option) return;
    const localized = resolveTopicForLocale(option, locale);
    if (localized !== topic) {
      onTopicChange(localized);
    }
  }, [locale, selectedTopicId, topics, topic, onTopicChange]);

  if (loading && !tree) {
    return (
      <p className="text-sm text-slate-500">{t.lesson.syllabusLoading}</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">
            {t.lesson.schoolLevel}
          </span>
          <select
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={schoolLevel}
            onChange={(e) => onSchoolLevelChange(e.target.value as SyllabusSchoolLevel)}
          >
            {(tree?.schoolLevels ?? []).map((row) => (
              <option key={row.id} value={row.id}>
                {label(row.labelEn, row.labelZh)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">{t.common.subject}</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
          >
            {subjects.map((row) => (
              <option key={row.id} value={row.id}>
                {label(row.labelEn, row.labelZh)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">{t.common.level}</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={grade}
            onChange={(e) => onGradeChange(e.target.value)}
          >
            {grades.map((row) => (
              <option key={row} value={row}>
                {gradeLabel(row, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">{t.lesson.topicLabel}</span>
          <select
            className="mt-1.5 w-full max-h-48 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={selectedTopicId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedTopicId(id);
              const option = topics.find((row) => row.id === id);
              if (option) {
                onTopicChange(resolveTopicForLocale(option, locale));
              }
            }}
            required
          >
            {topics.length ? (
              topicGroups.map((group) => (
                <optgroup key={group.section} label={group.section}>
                  {group.items.map((row) => (
                    <option key={row.id} value={row.id}>
                      {resolveLabelForLocale(row, locale)}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : (
              <option value="">{t.lesson.noSyllabusTopics}</option>
            )}
          </select>
          {topics.length > 0 ? (
            <p className="mt-1 text-xs text-slate-500">
              {t.lesson.topicCount.replace("{count}", String(topics.length))}
            </p>
          ) : null}
        </label>
      </div>
    </div>
  );
}

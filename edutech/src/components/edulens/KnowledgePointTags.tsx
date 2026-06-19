"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Knowledge point tag chips */
export function KnowledgePointTags({
  mainTopic,
  subTopics,
  prerequisites,
}: {
  mainTopic: string;
  subTopics: string[];
  prerequisites: string[];
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
        {mainTopic}
      </span>
      {subTopics.map((topic) => (
        <span
          key={topic}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
        >
          {topic}
        </span>
      ))}
      {prerequisites.map((topic) => (
        <span
          key={`pre-${topic}`}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
        >
          {t.knowledge.prerequisite}: {topic}
        </span>
      ))}
    </div>
  );
}

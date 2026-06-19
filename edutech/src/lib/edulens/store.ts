import { createDemoStore } from "./demo/seed";
import type { Locale } from "@/lib/i18n/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/types";
import type {
  EduLensStore,
  HomeworkAnalysis,
  HomeworkSubmission,
  LessonOutput,
  LessonRequest,
  MistakeBookEntry,
} from "./types";

const globalStores = globalThis as typeof globalThis & {
  __edulensStores?: Partial<Record<Locale, EduLensStore>>;
};

/**
 * In-memory store per locale with demo seed.
 */
export function getStore(locale: Locale = DEFAULT_LOCALE): EduLensStore {
  if (!globalStores.__edulensStores) {
    globalStores.__edulensStores = {};
  }
  if (!globalStores.__edulensStores[locale]) {
    globalStores.__edulensStores[locale] = createDemoStore(locale);
  }
  return globalStores.__edulensStores[locale]!;
}

export function addSubmission(
  submission: HomeworkSubmission,
  locale: Locale = DEFAULT_LOCALE
): void {
  getStore(locale).submissions.unshift(submission);
}

export function addAnalysis(
  analysis: HomeworkAnalysis,
  locale: Locale = DEFAULT_LOCALE
): void {
  getStore(locale).analyses.unshift(analysis);
}

export function addLessonRequest(
  request: LessonRequest,
  locale: Locale = DEFAULT_LOCALE
): void {
  getStore(locale).lessonRequests.unshift(request);
}

export function addLessonOutput(
  output: LessonOutput,
  locale: Locale = DEFAULT_LOCALE
): void {
  getStore(locale).lessonOutputs.unshift(output);
}

export function addMistakeBookEntry(
  entry: MistakeBookEntry,
  locale: Locale = DEFAULT_LOCALE
): void {
  getStore(locale).mistakeBook.unshift(entry);
}

export function getAnalysisById(
  id: string,
  locale: Locale = DEFAULT_LOCALE
): HomeworkAnalysis | undefined {
  return getStore(locale).analyses.find((a) => a.id === id);
}

export function getSubmissionById(
  id: string,
  locale: Locale = DEFAULT_LOCALE
): HomeworkSubmission | undefined {
  return getStore(locale).submissions.find((s) => s.id === id);
}

export function getLessonOutputById(
  id: string,
  locale: Locale = DEFAULT_LOCALE
): LessonOutput | undefined {
  return getStore(locale).lessonOutputs.find((o) => o.id === id);
}

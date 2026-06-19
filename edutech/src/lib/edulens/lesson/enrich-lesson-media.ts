import type { Locale } from "@/lib/i18n/types";
import {
  buildEducationalImagePrompt,
  buildEducationalVideoPrompt,
  generateAgnesImage,
  generateAgnesVideo,
  isAgnesMediaEnabled,
  isAgnesVideoEnabled,
} from "../ai/agnes-media";
import type {
  LearningVisualLesson,
  LearningVisualStep,
  LessonOutput,
  RichContentBlock,
} from "../types";

const MAX_DIAGRAM_IMAGES = 6;
const MAX_STEP_IMAGES = 6;

/**
 * Runs async tasks with a concurrency limit.
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function runWorker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    runWorker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Generates Agnes images for diagram blocks and animation steps.
 */
export async function enrichLessonWithMedia(
  output: LessonOutput,
  subject: string,
  topic: string,
  locale: Locale
): Promise<LessonOutput> {
  if (!isAgnesMediaEnabled()) {
    return output;
  }

  const teachingContent = await enrichTeachingContentDiagrams(
    output.teachingContent,
    subject,
    topic,
    locale
  );

  const learningVisualLessons = await enrichVisualLessonSteps(
    output.learningVisualLessons,
    subject,
    topic,
    locale
  );

  return {
    ...output,
    teachingContent,
    learningVisualLessons,
  };
}

/**
 * Adds imageUrl to diagram blocks missing visuals.
 */
async function enrichTeachingContentDiagrams(
  blocks: RichContentBlock[] | undefined,
  subject: string,
  topic: string,
  locale: Locale
): Promise<RichContentBlock[] | undefined> {
  if (!blocks?.length) {
    return blocks;
  }

  const diagramIndexes = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === "diagram" && !block.imageUrl)
    .slice(0, MAX_DIAGRAM_IMAGES);

  if (!diagramIndexes.length) {
    return blocks;
  }

  const enriched = [...blocks];
  await mapWithConcurrency(diagramIndexes, 2, async ({ block, index }) => {
    const prompt = buildEducationalImagePrompt(
      subject,
      topic,
      block.content,
      locale
    );
    const imageUrl = await generateAgnesImage(prompt);
    if (imageUrl) {
      enriched[index] = { ...block, imageUrl };
    }
  });

  return enriched;
}

/**
 * Adds imageUrl (and optional videoUrl on step 0) to micro-lesson steps.
 */
async function enrichVisualLessonSteps(
  lessons: LearningVisualLesson[] | undefined,
  subject: string,
  topic: string,
  locale: Locale
): Promise<LearningVisualLesson[] | undefined> {
  if (!lessons?.length) {
    return lessons;
  }

  const result: LearningVisualLesson[] = [];

  for (const lesson of lessons) {
    const stepsToImage = lesson.steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) => !step.imageUrl)
      .slice(0, MAX_STEP_IMAGES);

    const newSteps = [...lesson.steps];

    await mapWithConcurrency(stepsToImage, 2, async ({ step, index }) => {
      const prompt = buildEducationalImagePrompt(
        subject,
        topic,
        `${step.title}. ${step.body.slice(0, 400)}`,
        locale
      );
      const imageUrl = await generateAgnesImage(prompt);
      if (imageUrl) {
        newSteps[index] = { ...step, imageUrl };
      }
    });

    if (isAgnesVideoEnabled() && newSteps[0] && !newSteps[0].videoUrl) {
      const videoPrompt = buildEducationalVideoPrompt(
        subject,
        topic,
        newSteps[0].title,
        newSteps[0].body,
        locale
      );
      const videoUrl = await generateAgnesVideo(videoPrompt);
      if (videoUrl) {
        newSteps[0] = { ...newSteps[0], videoUrl };
      }
    }

    result.push({ ...lesson, steps: newSteps });
  }

  return result;
}

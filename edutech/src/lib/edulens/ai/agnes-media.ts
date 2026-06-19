import type { Locale } from "@/lib/i18n/types";

export const AGNES_MEDIA_BASE_URL =
  process.env.AGNES_MEDIA_BASE_URL ?? "https://apihub.agnes-ai.com/v1";

export const AGNES_IMAGE_MODEL =
  process.env.AGNES_IMAGE_MODEL ?? "agnes-image-2.1-flash";

export const AGNES_VIDEO_MODEL =
  process.env.AGNES_VIDEO_MODEL ?? "agnes-video-v2.0";

const IMAGE_TIMEOUT_MS = 90_000;
const VIDEO_POLL_INTERVAL_MS = 8_000;
const VIDEO_POLL_TIMEOUT_MS = 120_000;

type AgnesImageResponse = {
  data?: { url?: string; b64_json?: string }[];
};

type AgnesVideoTask = {
  id?: string;
  status?: string;
  progress?: number;
  video_url?: string;
  error?: string;
};

/**
 * True when Agnes image/video generation is enabled (requires AGNES_API_KEY).
 */
export function isAgnesMediaEnabled(): boolean {
  if (process.env.EDULENS_MEDIA_ENABLED === "false") {
    return false;
  }
  return Boolean(process.env.AGNES_API_KEY?.trim());
}

/**
 * True when short lesson animation videos should be generated (slow; opt-in).
 */
export function isAgnesVideoEnabled(): boolean {
  return (
    isAgnesMediaEnabled() && process.env.EDULENS_LESSON_VIDEO === "true"
  );
}

/**
 * Builds an educational diagram prompt for Agnes Image.
 */
export function buildEducationalImagePrompt(
  subject: string,
  topic: string,
  sceneDescription: string,
  locale: Locale
): string {
  const lang = locale === "zh" ? "Chinese labels" : "English labels";
  return [
    `Professional MOE Singapore ${subject} textbook illustration.`,
    `Topic: ${topic}.`,
    sceneDescription,
    `${lang}, clean white background, accurate science diagram,`,
    "vector-style educational infographic, high contrast, no watermark, no decorative clutter.",
  ].join(" ");
}

/**
 * Builds a cinematic but educational micro-lesson video prompt.
 */
export function buildEducationalVideoPrompt(
  subject: string,
  topic: string,
  stepTitle: string,
  stepBody: string,
  locale: Locale
): string {
  const lang = locale === "zh" ? "Chinese narration context" : "English context";
  return [
    `Educational animation for ${subject} — ${topic}.`,
    `Step: ${stepTitle}.`,
    stepBody.slice(0, 280),
    `${lang}, smooth camera, labeled particles or process flow, classroom-safe, scientific accuracy.`,
  ].join(" ");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Generates one educational diagram via Agnes Image 2.1 Flash.
 */
export async function generateAgnesImage(
  prompt: string,
  size = "1024x768"
): Promise<string | null> {
  const apiKey = process.env.AGNES_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const url = `${AGNES_MEDIA_BASE_URL}/images/generations`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: AGNES_IMAGE_MODEL,
            prompt,
            size,
            n: 1,
          }),
        },
        IMAGE_TIMEOUT_MS
      );

      if (response.status === 429) {
        await sleep(10_000 * (attempt + 1));
        continue;
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`Agnes image ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = (await response.json()) as AgnesImageResponse;
      const item = data.data?.[0];
      if (item?.url) {
        return item.url;
      }
      if (item?.b64_json) {
        return `data:image/png;base64,${item.b64_json}`;
      }
      return null;
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await sleep(4_000 * (attempt + 1));
      }
    }
  }

  console.error("[Agnes Image]", lastError);
  return null;
}

/**
 * Creates and polls an Agnes Video V2.0 task until complete or timeout.
 */
export async function generateAgnesVideo(
  prompt: string,
  options?: { width?: number; height?: number; numFrames?: number }
): Promise<string | null> {
  const apiKey = process.env.AGNES_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const width = options?.width ?? 768;
  const height = options?.height ?? 512;
  const numFrames = options?.numFrames ?? 81;

  try {
    const createUrl = `${AGNES_MEDIA_BASE_URL}/videos`;
    const createRes = await fetchWithTimeout(
      createUrl,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AGNES_VIDEO_MODEL,
          prompt,
          width,
          height,
          num_frames: numFrames,
          frame_rate: 24,
        }),
      },
      30_000
    );

    if (!createRes.ok) {
      const errText = await createRes.text().catch(() => "");
      throw new Error(`Agnes video create ${createRes.status}: ${errText.slice(0, 200)}`);
    }

    const task = (await createRes.json()) as AgnesVideoTask;
    const taskId = task.id;
    if (!taskId) {
      return null;
    }

    const deadline = Date.now() + VIDEO_POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await sleep(VIDEO_POLL_INTERVAL_MS);
      const pollRes = await fetchWithTimeout(
        `${AGNES_MEDIA_BASE_URL}/videos/${taskId}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
        15_000
      );

      if (!pollRes.ok) {
        continue;
      }

      const status = (await pollRes.json()) as AgnesVideoTask;
      if (status.status === "completed" && status.video_url) {
        return status.video_url;
      }
      if (status.status === "failed" || status.error) {
        throw new Error(status.error ?? "Agnes video task failed");
      }
    }

    console.warn("[Agnes Video] Poll timeout — skipping video");
    return null;
  } catch (error) {
    console.error("[Agnes Video]", error);
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

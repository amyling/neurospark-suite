import { NextResponse } from "next/server";
import { getProviderInfo, isVisionCapable } from "@/lib/edulens/ai/provider";
import {
  isRagEnabled,
  isRagWebEnabled,
} from "@/lib/edulens/knowledge/rag/fetch-wikipedia-knowledge";
import { getOfflinePdfChunkCount } from "@/lib/edulens/knowledge/retrieve-pdf-chunks";

export async function GET() {
  const info = getProviderInfo();
  return NextResponse.json({
    mode: info.mode,
    textModel: info.textModel,
    visionModel: info.visionModel,
    visionCapable: isVisionCapable(),
    devProfile: process.env.EDULENS_DEV_PROFILE ?? null,
    profileLabel: info.profileLabel,
    providerChain: info.providerChain ?? null,
    hints: info.hints,
    rag: {
      enabled: isRagEnabled(),
      webRetrieval: isRagWebEnabled(),
      mode: "offline-first",
      sources: [
        "sg-syllabus-topics.json",
        "sg-syllabus-pdf-chunks.json",
        ...(isRagWebEnabled() ? ["wikipedia-api (live)"] : []),
      ],
      offlinePdfChunks: getOfflinePdfChunkCount(),
    },
    ocrNote: info.visionCapable
      ? `Vision OCR active (${info.visionModel})`
      : info.mode === "mock"
        ? "Demo mode — set EDULENS_DEV_PROFILE=agnes-free + AGNES_API_KEY, gemini-free, or ollama-local"
        : `Text-only (${info.mode}) — set vision model env for OCR`,
  });
}

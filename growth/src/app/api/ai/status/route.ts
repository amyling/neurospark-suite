import { NextResponse } from "next/server";
import { getProviderInfo } from "@/lib/ai/provider";

/**
 * Returns active LLM provider info (EDULENS_* env, shared with EduTech).
 */
export async function GET() {
  const info = getProviderInfo();
  return NextResponse.json(info);
}

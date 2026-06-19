import { NextResponse } from "next/server";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import { saveMistakeBookEntry } from "@/lib/edulens/services/edulens-service";
import { getStore } from "@/lib/edulens/store";

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);
  return NextResponse.json({ entries: getStore(locale).mistakeBook });
}

export async function POST(request: Request) {
  try {
    const locale = getLocaleFromRequest(request);
    const body = (await request.json()) as { analysisId?: string };
    if (!body.analysisId) {
      return NextResponse.json({ error: "analysisId required" }, { status: 400 });
    }
    const entry = saveMistakeBookEntry(body.analysisId, locale);
    if (!entry) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }
    return NextResponse.json({ entry });
  } catch (error) {
    console.error("[API] mistake-book:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

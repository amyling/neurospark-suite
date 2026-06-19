import { NextResponse } from "next/server";
import { getLocaleFromRequest } from "@/lib/i18n/locale-server";
import { getDashboardStats } from "@/lib/edulens/services/edulens-service";

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);
  return NextResponse.json(getDashboardStats(locale));
}

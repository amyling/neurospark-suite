import { NextResponse } from "next/server";
import {
  buildSyllabusOptionsTree,
  getSyllabusTopics,
  type SyllabusSchoolLevel,
} from "@/lib/edulens/knowledge/syllabus-options";

/**
 * GET /api/edulens/syllabus-options
 * Returns cascading syllabus dropdown data (school level → subject → grade → topic).
 * Optional query: schoolLevel, subject, grade — when all three are set, returns topics only.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolLevel = searchParams.get("schoolLevel") as SyllabusSchoolLevel | null;
  const subject = searchParams.get("subject");
  const grade = searchParams.get("grade");

  if (schoolLevel && subject && grade) {
    const topics = getSyllabusTopics(schoolLevel, subject, grade);
    return NextResponse.json({ topics });
  }

  return NextResponse.json(buildSyllabusOptionsTree());
}

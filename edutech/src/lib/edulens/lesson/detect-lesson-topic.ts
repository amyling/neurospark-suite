export type LessonTopicCategory = "calculus" | "quadratic" | "generic";

/**
 * Infers lesson template category from topic, subject, and optional teacher notes.
 */
export function detectLessonTopicCategory(
  topic: string,
  subject?: string,
  teacherContent?: string
): LessonTopicCategory {
  const haystack = `${topic} ${subject ?? ""} ${teacherContent ?? ""}`.toLowerCase();

  if (
    /微积分|calculus|积分|integral|定积分|不定积分|导数|derivative|微分|differential|极限|\blimit\b|原函数|antiderivative|莱布尼茨|leibniz|牛顿|newton.?leibniz|曲边|riemann/.test(
      haystack
    )
  ) {
    return "calculus";
  }

  if (
    /二次|抛物线|quadratic|parabola|判别式|discriminant|顶点式|vertex\s*form/.test(
      haystack
    )
  ) {
    return "quadratic";
  }

  return "generic";
}

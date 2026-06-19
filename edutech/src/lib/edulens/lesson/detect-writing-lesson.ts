/**
 * True when the lesson is about writing, composition, or correspondence.
 */
export function isWritingLesson(topic: string, subject?: string): boolean {
  const haystack = `${topic} ${subject ?? ""}`.toLowerCase();
  return /作文|composition|writing|电邮|email|e-mail|信件|letter|公文|essay|叙事|说明文|议论文|应用文|correspondence|report writing/.test(
    haystack
  );
}

/**
 * True when the lesson focuses on formal or official email structure.
 */
export function isEmailWritingLesson(topic: string, subject?: string): boolean {
  const haystack = `${topic} ${subject ?? ""}`.toLowerCase();
  return /电邮|email|e-mail|公务.?邮|official.?email|business.?email|formal.?email/.test(
    haystack
  );
}

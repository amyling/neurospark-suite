/** Safety disclaimers shown across EduLens UI */

export const SAFETY_DISCLAIMERS = {
  teacherReview:
    "AI analysis may require teacher review. Do not treat results as official marking.",
  openEndedScore:
    "For open-ended answers, the score is estimated and confidence may be low.",
  classroomMaterial:
    "Generated material should be checked before classroom use.",
  noPerfectMarking:
    "EduLens does not claim 100% automatic marking accuracy.",
  noCheating:
    "Use EduLens to learn from mistakes, not to bypass honest practice.",
} as const;

export const EDULENS_NAV = [
  { href: "/edulens", label: "Overview", icon: "home" },
  { href: "/edulens/dashboard", label: "Dashboard", icon: "chart" },
  { href: "/edulens/homework-analyzer", label: "Homework Analyzer", icon: "scan" },
  { href: "/edulens/lesson-generator", label: "Lesson Generator", icon: "book" },
  { href: "/edulens/mistake-book", label: "Mistake Book", icon: "bookmark" },
] as const;

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Chinese",
  "History",
  "Geography",
] as const;

export const LEVELS = [
  "Sec 1",
  "Sec 2",
  "Sec 3",
  "Sec 4",
  "Sec 5",
  "JC 1",
  "JC 2",
] as const;

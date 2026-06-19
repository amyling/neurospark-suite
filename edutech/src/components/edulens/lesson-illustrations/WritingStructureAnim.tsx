import type { LearningVisualStep } from "@/lib/edulens/types";

type EmailSection = {
  id: string;
  label: string;
  sample: string;
  keywords: RegExp;
};

const EMAIL_SECTIONS: EmailSection[] = [
  {
    id: "subject",
    label: "Subject line",
    sample: "Re: Lab equipment request",
    keywords: /主题|subject|标题|title/i,
  },
  {
    id: "salutation",
    label: "Salutation",
    sample: "Dear Mr Tan,",
    keywords: /称呼|salutation|greeting|dear/i,
  },
  {
    id: "purpose",
    label: "Opening / purpose",
    sample: "I am writing to request…",
    keywords: /目的|purpose|opening|开头|引言/i,
  },
  {
    id: "situation",
    label: "Situation & impact",
    sample: "Last week, the projector failed during…",
    keywords: /情况|situation|背景|background|影响|impact/i,
  },
  {
    id: "request",
    label: "Request / suggestion",
    sample: "Could we arrange a replacement by Friday?",
    keywords: /建议|request|suggestion|要求|行动/i,
  },
  {
    id: "closing",
    label: "Closing & signature",
    sample: "Yours sincerely,  \nAlex Lim",
    keywords: /结尾|closing|署名|signature|敬语/i,
  },
];

/**
 * Resolves which email section to highlight from step title and body.
 */
function resolveActiveSection(step: LearningVisualStep, stepIndex: number): number {
  const haystack = `${step.title} ${step.body}`;
  const byKeyword = EMAIL_SECTIONS.findIndex((section) =>
    section.keywords.test(haystack)
  );
  if (byKeyword >= 0) {
    return byKeyword;
  }
  return Math.min(stepIndex, EMAIL_SECTIONS.length - 1);
}

/**
 * Step-by-step official email structure panel for writing lessons.
 */
export function WritingStructureAnim({
  step,
  stepIndex,
}: {
  step: LearningVisualStep;
  stepIndex: number;
}) {
  const activeIndex = resolveActiveSection(step, stepIndex);

  return (
    <div className="w-full max-w-md rounded-xl border border-indigo-200 bg-white p-4 shadow-inner">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-indigo-700">
        Official email structure
      </p>
      <div className="space-y-2">
        {EMAIL_SECTIONS.map((section, index) => {
          const active = index === activeIndex;
          return (
            <div
              key={section.id}
              className={`rounded-lg border px-3 py-2 transition-all ${
                active
                  ? "border-indigo-400 bg-indigo-50 shadow-sm"
                  : "border-slate-200 bg-slate-50 opacity-70"
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  active ? "text-indigo-800" : "text-slate-500"
                }`}
              >
                {section.label}
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  active ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {section.sample}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Animated concept-map preview for micro-lesson steps (compact radial layout).
 */
export function ConceptMapAnim({
  step,
  stepIndex,
}: {
  step: LearningVisualStep;
  stepIndex: number;
}) {
  const branches = [
    "Format",
    "Content",
    "Tone",
    "Pitfalls",
  ];
  const active = stepIndex % branches.length;

  return (
    <div className="relative flex h-52 w-52 items-center justify-center">
      <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-500 bg-indigo-50 text-center text-[10px] font-bold leading-tight text-indigo-900">
        {step.title.length > 12 ? `${step.title.slice(0, 11)}…` : step.title}
      </div>
      {branches.map((label, index) => {
        const angle = (Math.PI * 2 * index) / branches.length - Math.PI / 2;
        const x = Math.cos(angle) * 78;
        const y = Math.sin(angle) * 78;
        const isActive = index === active;
        return (
          <div key={label} className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
            <div
              className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${
                isActive
                  ? "border-indigo-400 bg-indigo-100 text-indigo-900"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {label}
            </div>
          </div>
        );
      })}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {branches.map((_, index) => {
          const angle = (Math.PI * 2 * index) / branches.length - Math.PI / 2;
          const x2 = 104 + Math.cos(angle) * 58;
          const y2 = 104 + Math.sin(angle) * 58;
          return (
            <line
              key={`line-${index}`}
              x1="104"
              y1="104"
              x2={x2}
              y2={y2}
              stroke="#c7d2fe"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}

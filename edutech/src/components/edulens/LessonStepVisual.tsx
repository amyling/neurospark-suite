"use client";

import {
  IntegralAreaPhased,
  NumberLinePhased,
  ParabolaGraphPhased,
} from "./LessonCoordinateAnim";
import { SpacetimeIllustration } from "./lesson-illustrations/SpacetimeIllustration";
import { ParticulateMatterDiagram } from "./lesson-illustrations/ParticulateMatterDiagram";
import {
  ConceptMapAnim,
  WritingStructureAnim,
} from "./lesson-illustrations/WritingStructureAnim";
import { parseMistakeCompareLines } from "@/lib/edulens/lesson/parse-concept-map";
import { MathRichText } from "./MathRichText";
import { detectLessonVisualType } from "@/lib/edulens/math/detect-visual-type";
import { getLessonAnimPhase } from "@/lib/edulens/lesson/lesson-anim-phase";
import { wrapAsDisplayMath } from "@/lib/edulens/math/normalize-math-text";
import type { LearningVisualStep } from "@/lib/edulens/types";

/**
 * Visual stage header — title only; full narration lives below the stage.
 */
function VisualStageHeader({ title }: { title: string }) {
  return (
    <p className="mb-4 text-center text-sm font-semibold text-indigo-800">{title}</p>
  );
}

/**
 * Animated teaching illustration for one lesson step (diagram on top, text below in parent).
 */
export function LessonStepVisual({
  step,
  stepIndex,
}: {
  step: LearningVisualStep;
  stepIndex: number;
}) {
  const visualType = detectLessonVisualType(step);
  const phase = getLessonAnimPhase(stepIndex, visualType);

  return (
    <div className="lesson-visual-stage w-full overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-b from-white via-indigo-50/40 to-indigo-100/30 px-4 py-5 shadow-sm">
      <VisualStageHeader title={step.title} />
      <div className="flex min-h-[240px] items-center justify-center">
        {visualType === "integral_area" ? (
          <IntegralAreaPhased phase={phase} step={step} />
        ) : null}
        {visualType === "parabola_graph" ? (
          <ParabolaGraphPhased phase={phase} step={step} />
        ) : null}
        {visualType === "factor_pairs" ? <FactorPairsAnim step={step} /> : null}
        {visualType === "equation_balance" ? (
          <EquationBalanceAnim step={step} />
        ) : null}
        {visualType === "number_line" ? <NumberLinePhased phase={phase} /> : null}
        {visualType === "mistake_compare" ? (
          <MistakeCompareAnim step={step} />
        ) : null}
        {visualType === "formula_spotlight" ? (
          <FormulaSpotlightAnim step={step} />
        ) : null}
        {visualType === "chemistry_reaction" ? (
          <ChemistryReactionAnim step={step} />
        ) : null}
        {visualType === "concept_process" ? (
          <ConceptProcessAnim step={step} stepIndex={stepIndex} />
        ) : null}
        {visualType === "concept_map" ? (
          <ConceptMapAnim step={step} stepIndex={stepIndex} />
        ) : null}
        {visualType === "writing_structure" ? (
          <WritingStructureAnim step={step} stepIndex={stepIndex} />
        ) : null}
        {visualType === "physics_spacetime" ? <PhysicsSpacetimeAnim step={step} /> : null}
        {visualType === "generic" ? <GenericConceptAnim step={step} /> : null}
      </div>
    </div>
  );
}

function FactorPairsAnim({ step }: { step: LearningVisualStep }) {
  const vars = step.highlightVars?.slice(0, 2) ?? ["m", "n"];
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-4">
        <span className="rounded-lg border border-violet-300 bg-violet-100 px-4 py-3 text-xl font-bold text-violet-800">
          {vars[0]}
        </span>
        <span className="text-2xl text-amber-600">×</span>
        <span className="rounded-lg border border-violet-300 bg-violet-100 px-4 py-3 text-xl font-bold text-violet-800">
          {vars[1] ?? "n"}
        </span>
      </div>
      <div className="text-amber-600">↓</div>
      <div className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-sm text-emerald-800">
        product = c · sum = b
      </div>
      {step.latex ? (
        <MathRichText text={wrapAsDisplayMath(step.latex)} className="text-slate-800" />
      ) : null}
    </div>
  );
}

function EquationBalanceAnim({ step }: { step: LearningVisualStep }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900">
          LHS
        </div>
        <div className="text-2xl font-bold text-amber-600">=</div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900">
          RHS
        </div>
      </div>
      {step.latex ? (
        <MathRichText text={wrapAsDisplayMath(step.latex)} className="text-slate-800" />
      ) : null}
    </div>
  );
}

function MistakeCompareAnim({ step }: { step: LearningVisualStep }) {
  const parsed = parseMistakeCompareLines(step.body);
  const wrong =
    parsed.wrong ??
    (step.body.match(/语气随意|vague|format error|空泛|格式错误/i)
      ? step.body.slice(0, 120)
      : undefined);
  const correct =
    parsed.correct ??
    (step.body.match(/正式|礼貌|具体|formal|polite|specific/i)
      ? step.body.slice(0, 120)
      : undefined);

  return (
    <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
      <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-center text-sm text-rose-900">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide">✗ Common mistake</p>
        <p className="text-xs leading-relaxed">
          {wrong ?? "Using casual tone or missing key email parts"}
        </p>
      </div>
      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-center text-sm text-emerald-900">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide">✓ Correct approach</p>
        <p className="text-xs leading-relaxed">
          {correct ?? "Formal tone, clear purpose, and complete structure"}
        </p>
      </div>
      {step.latex ? (
        <div className="col-span-2">
          <MathRichText text={wrapAsDisplayMath(step.latex)} className="text-slate-800" />
        </div>
      ) : null}
    </div>
  );
}

function FormulaSpotlightAnim({ step }: { step: LearningVisualStep }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-indigo-200 bg-white px-8 py-6 shadow-inner">
      <div className="h-20 w-20 rounded-full border-4 border-indigo-200 bg-indigo-50" />
      {step.latex ? (
        <MathRichText
          text={wrapAsDisplayMath(step.latex)}
          className="text-lg text-slate-900"
        />
      ) : (
        <p className="text-sm font-medium text-indigo-800">{step.title}</p>
      )}
    </div>
  );
}

function GenericConceptAnim({ step }: { step: LearningVisualStep }) {
  if (step.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={step.imageUrl}
        alt={step.title}
        className="max-h-64 w-full rounded-lg object-contain"
      />
    );
  }

  const haystack = `${step.title} ${step.body}`.toLowerCase();
  if (/particle|粒子|固体|liquid|gas|三态/.test(haystack)) {
    return <ParticulateMatterDiagram caption={step.title} />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-amber-300 bg-amber-50 text-4xl shadow-sm">
        💡
      </div>
      <p className="max-w-md text-center text-sm font-medium text-slate-700">
        {step.title}
      </p>
    </div>
  );
}

function ChemistryReactionAnim({ step }: { step: LearningVisualStep }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4">
        <div className="rounded-lg border-2 border-sky-300 bg-sky-50 px-5 py-3 text-lg font-bold text-sky-900">
          R
        </div>
        <span className="text-2xl text-amber-600">→</span>
        <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 px-5 py-3 text-lg font-bold text-emerald-900">
          P
        </div>
      </div>
      {step.latex ? (
        <MathRichText text={wrapAsDisplayMath(step.latex)} className="text-slate-800" />
      ) : null}
    </div>
  );
}

function ConceptProcessAnim({
  step,
  stepIndex,
}: {
  step: LearningVisualStep;
  stepIndex: number;
}) {
  if (step.videoUrl) {
    return (
      <video
        src={step.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-64 w-full rounded-lg object-contain"
      />
    );
  }

  if (step.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={step.imageUrl}
        alt={step.title}
        className="max-h-64 w-full rounded-lg object-contain shadow-sm"
      />
    );
  }

  const haystack = `${step.title} ${step.body}`.toLowerCase();
  if (/particle|粒子|固体|liquid|gas|三态|晶格|particulate|kinetic|扩散/.test(haystack)) {
    return <ParticulateMatterDiagram phase={stepIndex} caption={step.title} />;
  }

  const labels = step.title.split(/[：:，,]/).filter(Boolean).slice(0, 5);
  const fallback = labels.length >= 2 ? labels : [step.title, "Observe", "Explain", "Apply", "Check"];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4">
      {fallback.map((label, i) => (
        <div key={`${label}-${i}`} className="flex items-center gap-2">
          <span
            className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
              i <= stepIndex
                ? "border-indigo-400 bg-indigo-100 text-indigo-900"
                : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            {label.trim()}
          </span>
          {i < fallback.length - 1 ? (
            <span className="text-slate-300">→</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PhysicsSpacetimeAnim({ step }: { step: LearningVisualStep }) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <SpacetimeIllustration />
      {step.latex ? (
        <MathRichText text={wrapAsDisplayMath(step.latex)} className="text-slate-800" />
      ) : null}
    </div>
  );
}

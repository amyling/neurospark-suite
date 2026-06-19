"use client";

import { useState } from "react";
import { detectDiagramType } from "@/lib/edulens/lesson/detect-diagram-type";
import { parseConceptMapCaption } from "@/lib/edulens/lesson/parse-concept-map";
import { EvolutionTreeIllustration } from "./lesson-illustrations/EvolutionTreeIllustration";
import { SpacetimeIllustration } from "./lesson-illustrations/SpacetimeIllustration";
import { ParticulateMatterDiagram } from "./lesson-illustrations/ParticulateMatterDiagram";
import { ConceptMapDiagram } from "./lesson-illustrations/ConceptMapDiagram";
import { MathRichText } from "./MathRichText";

/**
 * SVG shaded area under a curve (definite integral interpretation).
 */
function IntegralAreaDiagram() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="mx-auto h-52 w-full max-w-lg"
      role="img"
      aria-label="Integral area diagram"
    >
      <defs>
        <linearGradient id="integralFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <line x1="40" y1="180" x2="330" y2="180" stroke="#64748b" strokeWidth="2" />
      <line x1="40" y1="25" x2="40" y2="180" stroke="#64748b" strokeWidth="2" />
      <path
        d="M 55 155 Q 120 45, 185 75 T 295 50 L 295 180 L 55 180 Z"
        fill="url(#integralFill)"
        className="lesson-area-fill"
      />
      <path
        d="M 55 155 Q 120 45, 185 75 T 295 50"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="3"
        className="lesson-curve-draw"
      />
      <text x="48" y="198" fill="#64748b" fontSize="11">
        a
      </text>
      <text x="278" y="198" fill="#64748b" fontSize="11">
        b
      </text>
      <text x="24" y="38" fill="#64748b" fontSize="11">
        y=f(x)
      </text>
    </svg>
  );
}

/**
 * SVG parabola with vertex, axis of symmetry, and x-intercepts.
 */
function ParabolaDiagram() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="mx-auto h-52 w-full max-w-lg"
      role="img"
      aria-label="Parabola diagram"
    >
      <defs>
        <linearGradient id="parabolaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="40" y1="180" x2="330" y2="180" stroke="#64748b" strokeWidth="2" />
      <line x1="40" y1="30" x2="40" y2="180" stroke="#64748b" strokeWidth="2" />
      <line
        x1="185"
        y1="25"
        x2="185"
        y2="180"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <path
        d="M 70 165 Q 185 35 300 165"
        fill="url(#parabolaFill)"
        stroke="#6366f1"
        strokeWidth="3"
        className="lesson-curve-draw"
      />
      <circle cx="185" cy="52" r="6" fill="#f59e0b" className="lesson-dot-pop" />
      <circle cx="115" cy="180" r="5" fill="#10b981" className="lesson-dot-pop lesson-delay-2" />
      <circle cx="255" cy="180" r="5" fill="#10b981" className="lesson-dot-pop lesson-delay-3" />
      <text x="192" y="48" fill="#b45309" fontSize="11" fontWeight="600">
        vertex
      </text>
      <text x="168" y="198" fill="#64748b" fontSize="11">
        x
      </text>
      <text x="24" y="38" fill="#64748b" fontSize="11">
        y
      </text>
      <text x="100" y="172" fill="#059669" fontSize="10">
        x₁
      </text>
      <text x="240" y="172" fill="#059669" fontSize="10">
        x₂
      </text>
    </svg>
  );
}

/**
 * Simple coordinate axes placeholder diagram.
 */
function CoordinateAxesDiagram() {
  return (
    <svg
      viewBox="0 0 360 200"
      className="mx-auto h-44 w-full max-w-lg"
      role="img"
      aria-label="Coordinate axes"
    >
      <line x1="40" y1="160" x2="320" y2="160" stroke="#64748b" strokeWidth="2" />
      <line x1="180" y1="20" x2="180" y2="160" stroke="#64748b" strokeWidth="2" />
      <path
        d="M 60 140 Q 180 60 300 130"
        fill="none"
        stroke="#818cf8"
        strokeWidth="2.5"
        className="lesson-curve-draw"
      />
      <polygon points="318,160 308,155 308,165" fill="#64748b" />
      <polygon points="180,22 175,32 185,32" fill="#64748b" />
    </svg>
  );
}

/**
 * Chemistry reaction schematic: reactants → conditions → products.
 */
function ChemistryReactionDiagram({ caption }: { caption: string }) {
  return (
    <svg
      viewBox="0 0 360 200"
      className="mx-auto h-48 w-full max-w-lg"
      role="img"
      aria-label="Chemistry reaction diagram"
    >
      <rect x="28" y="70" width="72" height="90" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
      <rect x="36" y="78" width="56" height="50" rx="4" fill="#93c5fd" opacity="0.5" />
      <text x="64" y="118" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">
        A
      </text>
      <text x="64" y="148" textAnchor="middle" fill="#475569" fontSize="9">
        reactant
      </text>

      <text x="128" y="108" fill="#f59e0b" fontSize="22" fontWeight="700">
        +
      </text>

      <rect x="148" y="70" width="72" height="90" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
      <rect x="156" y="78" width="56" height="50" rx="4" fill="#93c5fd" opacity="0.5" />
      <text x="184" y="118" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">
        B
      </text>
      <text x="184" y="148" textAnchor="middle" fill="#475569" fontSize="9">
        reactant
      </text>

      <path d="M 232 115 L 262 115" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
      <polygon points="262,115 254,111 254,119" fill="#64748b" />
      <text x="247" y="98" textAnchor="middle" fill="#b45309" fontSize="8">
        Δ
      </text>

      <rect x="272" y="70" width="72" height="90" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
      <rect x="280" y="78" width="56" height="50" rx="4" fill="#86efac" opacity="0.5" />
      <text x="308" y="118" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="600">
        P
      </text>
      <text x="308" y="148" textAnchor="middle" fill="#475569" fontSize="9">
        product
      </text>

      <rect x="118" y="168" width="124" height="22" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
      <text x="180" y="183" textAnchor="middle" fill="#92400e" fontSize="9">
        conditions / catalyst
      </text>
    </svg>
  );
}

/**
 * Subject concept board — fallback when caption is not a structured concept map.
 */
function ConceptBoardDiagram({ caption }: { caption: string }) {
  const label = caption.trim() || "Key concept";
  const isChem = /化学|反应|chemistry|reaction/i.test(caption);
  const icon = isChem ? "⚗️" : "📋";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-4 shadow-sm">
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Concept focus
          </p>
          <p className="mt-1 line-clamp-4 text-sm font-medium leading-snug text-slate-800">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * SVG exponential and logarithmic curves (a>1 and 0<a<1).
 */
function ExponentialLogDiagram() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="mx-auto h-52 w-full max-w-lg"
      role="img"
      aria-label="Exponential and logarithmic graphs"
    >
      <line x1="40" y1="180" x2="330" y2="180" stroke="#64748b" strokeWidth="2" />
      <line x1="60" y1="25" x2="60" y2="180" stroke="#64748b" strokeWidth="2" />
      <path
        d="M 60 175 Q 120 170, 160 120 T 280 35"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        className="lesson-curve-draw"
      />
      <path
        d="M 60 35 Q 100 80, 140 130 T 280 175"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        className="lesson-curve-draw"
      />
      <path
        d="M 65 175 C 120 175, 140 140, 160 100 T 280 40"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <text x="285" y="40" fill="#6366f1" fontSize="10">
        y=a^x (a&gt;1)
      </text>
      <text x="285" y="175" fill="#10b981" fontSize="10">
        y=a^x (0&lt;a&lt;1)
      </text>
      <text x="285" y="108" fill="#f59e0b" fontSize="10">
        y=log_a x
      </text>
    </svg>
  );
}

/**
 * Renders diagram SVG fallback from caption when remote image fails.
 */
function DiagramSvgFallback({ caption }: { caption: string }) {
  const diagramType = detectDiagramType(caption);
  const conceptMap = parseConceptMapCaption(caption);

  return (
    <>
      {diagramType === "integral_area" ? <IntegralAreaDiagram /> : null}
      {diagramType === "parabola" ? <ParabolaDiagram /> : null}
      {diagramType === "exponential_graph" ? <ExponentialLogDiagram /> : null}
      {diagramType === "coordinate_axes" ? <CoordinateAxesDiagram /> : null}
      {diagramType === "particulate_matter" ? (
        <ParticulateMatterDiagram caption={caption} />
      ) : null}
      {diagramType === "chemistry_reaction" ? (
        <ChemistryReactionDiagram caption={caption} />
      ) : null}
      {diagramType === "physics_spacetime" ? <SpacetimeIllustration /> : null}
      {diagramType === "biology_evolution" ? <EvolutionTreeIllustration /> : null}
      {diagramType === "concept_map" && conceptMap ? (
        <ConceptMapDiagram data={conceptMap} />
      ) : null}
      {diagramType === "concept_board" || diagramType === "generic" ? (
        <ConceptBoardDiagram caption={caption} />
      ) : null}
    </>
  );
}

/**
 * Renders an SVG diagram or Agnes-generated image from a diagram block.
 */
export function LessonDiagramVisual({
  caption,
  imageUrl,
  videoUrl,
}: {
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  if (videoUrl) {
    return (
      <div className="mt-2 overflow-hidden rounded-lg border border-indigo-100 bg-slate-50 p-2">
        <video
          src={videoUrl}
          controls
          playsInline
          className="mx-auto max-h-80 w-full rounded-md object-contain"
        />
        {caption.trim() ? (
          <p className="mt-2 text-center text-xs text-slate-600">
            <MathRichText text={caption} className="inline text-xs" />
          </p>
        ) : null}
      </div>
    );
  }

  if (imageUrl && !imageFailed) {
    return (
      <div className="mt-2 overflow-hidden rounded-lg border border-indigo-100 bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={caption.trim() || "Lesson diagram"}
          className="mx-auto max-h-80 w-full rounded-md object-contain"
          onError={() => setImageFailed(true)}
        />
        {caption.trim() ? (
          <div className="mt-2 text-center text-xs text-slate-600">
            <MathRichText text={caption} className="inline text-xs" />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-indigo-100 bg-gradient-to-b from-slate-50 to-indigo-50/40 p-3">
      <DiagramSvgFallback caption={caption} />
      {caption.trim() ? (
        <div className="mt-2 text-center text-xs text-slate-600">
          <MathRichText text={caption} className="inline text-xs" />
        </div>
      ) : null}
    </div>
  );
}

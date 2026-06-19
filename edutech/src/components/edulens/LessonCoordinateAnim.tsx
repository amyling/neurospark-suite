"use client";

import { MathRichText } from "./MathRichText";
import { wrapAsDisplayMath } from "@/lib/edulens/math/normalize-math-text";
import type { LearningVisualStep } from "@/lib/edulens/types";

type CoordAnimProps = {
  phase: number;
  step?: LearningVisualStep;
};

/**
 * Phased definite-integral area animation on a coordinate plane.
 */
export function IntegralAreaPhased({ phase, step }: CoordAnimProps) {
  const showRects = phase >= 3;
  const showBounds = phase >= 2;

  return (
    <div className="lesson-anim-integral w-full">
      <svg viewBox="0 0 400 240" className="mx-auto h-[min(280px,50vw)] w-full max-w-2xl">
        <defs>
          <linearGradient id="lessonAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        <g className={phase >= 0 ? "lesson-axis-draw" : "opacity-0"}>
          <line x1="48" y1="200" x2="370" y2="200" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="48" y1="28" x2="48" y2="200" stroke="#94a3b8" strokeWidth="2.5" />
          <polygon points="370,200 360,195 360,205" fill="#94a3b8" />
          <polygon points="48,28 43,38 53,38" fill="#94a3b8" />
          <text x="358" y="218" fill="#cbd5e1" fontSize="13">
            x
          </text>
          <text x="28" y="36" fill="#cbd5e1" fontSize="13">
            y
          </text>
        </g>

        {showRects
          ? [90, 130, 170, 210, 250].map((x, i) => (
              <rect
                key={`riemann-${x}`}
                x={x}
                y={200 - 35 - i * 8}
                width={36}
                height={35 + i * 8}
                fill="#a5b4fc"
                fillOpacity={0.15 + i * 0.04}
                className={`lesson-riemann-bar lesson-delay-${Math.min(i + 1, 4)}`}
              />
            ))
          : null}

        <path
          d="M 70 175 Q 130 55, 200 90 T 310 62"
          fill="none"
          stroke="#c7d2fe"
          strokeWidth="3.5"
          className={phase >= 1 ? "lesson-curve-draw" : "opacity-0"}
        />

        <path
          d="M 70 175 Q 130 55, 200 90 T 310 62 L 310 200 L 70 200 Z"
          fill="url(#lessonAreaFill)"
          className={phase >= 2 ? "lesson-area-fill" : "opacity-0"}
        />

        {showBounds ? (
          <g className="lesson-bound-pulse">
            <line
              x1="70"
              y1="200"
              x2="70"
              y2="175"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="lesson-delay-1"
            />
            <line
              x1="310"
              y1="200"
              x2="310"
              y2="62"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="lesson-delay-2"
            />
            <text x="62" y="218" fill="#fde68a" fontSize="13" fontWeight="600">
              a
            </text>
            <text x="302" y="218" fill="#fde68a" fontSize="13" fontWeight="600">
              b
            </text>
          </g>
        ) : null}

        {phase >= 4 ? (
          <text
            x="200"
            y="24"
            fill="#e0e7ff"
            fontSize="12"
            textAnchor="middle"
            className="lesson-label-pop"
          >
            ∫ₐᵇ f(x) dx = F(b) − F(a)
          </text>
        ) : null}
      </svg>
      {step?.latex ? (
        <div className="lesson-formula-reveal mt-3 text-center">
          <MathRichText
            text={wrapAsDisplayMath(step.latex)}
            className="inline text-indigo-100"
            skipNormalize
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Phased parabola graph with vertex, axis, and intercepts.
 */
export function ParabolaGraphPhased({ phase, step }: CoordAnimProps) {
  return (
    <div className="w-full">
      <svg viewBox="0 0 400 240" className="mx-auto h-[min(280px,50vw)] w-full max-w-2xl">
        <g className={phase >= 0 ? "lesson-axis-draw" : "opacity-0"}>
          <line x1="48" y1="200" x2="370" y2="200" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="200" y1="28" x2="200" y2="200" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 4" />
        </g>

        <path
          d="M 80 170 Q 200 30 320 170"
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="3.5"
          className={phase >= 1 ? "lesson-curve-draw" : "opacity-0"}
        />

        {phase >= 2 ? (
          <g className="lesson-bound-pulse">
            <circle cx="200" cy="52" r="7" fill="#fbbf24" className="lesson-dot-pop" />
            <text x="208" y="48" fill="#fde68a" fontSize="12" fontWeight="600">
              vertex
            </text>
          </g>
        ) : null}

        {phase >= 3 ? (
          <g>
            <circle cx="120" cy="200" r="5" fill="#34d399" className="lesson-dot-pop lesson-delay-1" />
            <circle cx="280" cy="200" r="5" fill="#34d399" className="lesson-dot-pop lesson-delay-2" />
            <text x="108" y="192" fill="#6ee7b7" fontSize="11">
              x₁
            </text>
            <text x="268" y="192" fill="#6ee7b7" fontSize="11">
              x₂
            </text>
          </g>
        ) : null}
      </svg>
      {step?.latex ? (
        <div className="lesson-formula-reveal mt-3 text-center">
          <MathRichText
            text={wrapAsDisplayMath(step.latex)}
            className="inline text-indigo-100"
            skipNormalize
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Phased number-line highlight animation.
 */
export function NumberLinePhased({ phase }: { phase: number }) {
  const points = [80, 160, 240, 320];
  return (
    <svg viewBox="0 0 400 100" className="mx-auto h-24 w-full max-w-2xl">
      <line
        x1="40"
        y1="50"
        x2="360"
        y2="50"
        stroke="#94a3b8"
        strokeWidth="2.5"
        className={phase >= 0 ? "lesson-axis-draw" : "opacity-0"}
      />
      {points.map((x, i) =>
        i <= phase ? (
          <g key={x}>
            <line x1={x} y1="42" x2={x} y2="58" stroke="#64748b" strokeWidth="2" />
            <circle
              cx={x}
              cy="50"
              r="6"
              fill="#fbbf24"
              className={`lesson-dot-pop lesson-delay-${Math.min(i + 1, 4)}`}
            />
          </g>
        ) : null
      )}
    </svg>
  );
}

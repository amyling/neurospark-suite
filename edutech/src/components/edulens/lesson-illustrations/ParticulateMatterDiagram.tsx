"use client";

/**
 * Animated SVG for solid / liquid / gas particle arrangements (MOE chemistry & science).
 */
export function ParticulateMatterDiagram({
  phase = 0,
  caption = "",
}: {
  phase?: number;
  caption?: string;
}) {
  const text = caption.toLowerCase();
  const state =
    /liquid|液体|液态/.test(text) ? "liquid"
    : /gas|气体|气态/.test(text) ? "gas"
    : /solid|固体|固态|晶格|振动/.test(text) ? "solid"
    : (["solid", "liquid", "gas"] as const)[phase % 3];

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <svg
        viewBox="0 0 360 200"
        className="h-48 w-full max-w-md"
        role="img"
        aria-label={caption || "Particulate matter diagram"}
      >
        <rect x="0" y="0" width="360" height="200" fill="#f8fafc" rx="12" />
        <text x="180" y="22" textAnchor="middle" className="fill-indigo-700 text-[11px] font-semibold">
          {state === "solid" ? "Solid — regular lattice" : state === "liquid" ? "Liquid — close but mobile" : "Gas — far apart, random motion"}
        </text>

        {state === "solid" ? <SolidParticles /> : null}
        {state === "liquid" ? <LiquidParticles /> : null}
        {state === "gas" ? <GasParticles /> : null}

        <text x="180" y="188" textAnchor="middle" className="fill-slate-500 text-[10px]">
          {state === "solid" ? "Strong forces · fixed shape" : state === "liquid" ? "Weaker forces · fixed volume" : "Very weak forces · fills container"}
        </text>
      </svg>
    </div>
  );
}

function SolidParticles() {
  const positions = [
    [60, 60], [100, 60], [140, 60], [180, 60], [220, 60], [260, 60], [300, 60],
    [60, 100], [100, 100], [140, 100], [180, 100], [220, 100], [260, 100], [300, 100],
    [60, 140], [100, 140], [140, 140], [180, 140], [220, 140], [260, 140], [300, 140],
  ];

  return (
    <g>
      {positions.map(([cx, cy], i) => (
        <g key={i} className="particle-vibrate">
          <circle cx={cx} cy={cy} r="10" fill="#6366f1" opacity="0.9" />
          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="#4338ca" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
    </g>
  );
}

function LiquidParticles() {
  const positions = [
    [70, 75], [110, 90], [150, 70], [190, 95], [230, 78], [270, 88], [310, 72],
    [90, 120], [130, 135], [170, 115], [210, 130], [250, 118], [290, 132],
    [110, 155], [150, 148], [190, 160], [230, 145], [270, 158],
  ];

  return (
    <g>
      {positions.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="11"
          fill="#0ea5e9"
          opacity="0.85"
          className="particle-drift"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </g>
  );
}

function GasParticles() {
  const positions = [
    [50, 50], [130, 80], [220, 45], [300, 90],
    [80, 130], [170, 150], [260, 120], [320, 160],
    [140, 170], [240, 65],
  ];

  return (
    <g>
      {positions.map(([cx, cy], i) => (
        <g key={i}>
          <circle
            cx={cx}
            cy={cy}
            r="9"
            fill="#f59e0b"
            opacity="0.9"
            className="particle-drift"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
          <line
            x1={cx}
            y1={cy}
            x2={cx + (i % 2 === 0 ? 18 : -18)}
            y2={cy + (i % 3 === 0 ? -12 : 12)}
            stroke="#d97706"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
            opacity="0.7"
          />
        </g>
      ))}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d97706" />
        </marker>
      </defs>
    </g>
  );
}

import type { ConceptMapData } from "@/lib/edulens/lesson/parse-concept-map";

const BRANCH_COLORS = [
  { fill: "#eef2ff", stroke: "#6366f1", text: "#3730a3" },
  { fill: "#ecfdf5", stroke: "#10b981", text: "#065f46" },
  { fill: "#fff7ed", stroke: "#f59e0b", text: "#92400e" },
  { fill: "#fdf2f8", stroke: "#ec4899", text: "#9d174d" },
  { fill: "#f0f9ff", stroke: "#0ea5e9", text: "#0c4a6e" },
  { fill: "#faf5ff", stroke: "#a855f7", text: "#6b21a8" },
];

/**
 * Radial SVG concept map with a center node and branch labels.
 */
export function ConceptMapDiagram({ data }: { data: ConceptMapData }) {
  const branches = data.branches.slice(0, 6);
  const width = 360;
  const height = 280;
  const cx = width / 2;
  const cy = height / 2 + 8;
  const radius = 92;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto h-56 w-full max-w-lg"
      role="img"
      aria-label={data.title ?? "Concept map"}
    >
      {data.title ? (
        <text
          x={cx}
          y={18}
          textAnchor="middle"
          fill="#4f46e5"
          fontSize="11"
          fontWeight="700"
        >
          {data.title}
        </text>
      ) : null}

      {branches.map((branch, index) => {
        const angle = (Math.PI * 2 * index) / branches.length - Math.PI / 2;
        const x2 = cx + Math.cos(angle) * radius;
        const y2 = cy + Math.sin(angle) * radius;
        const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
        const labelX = cx + Math.cos(angle) * (radius + 52);
        const labelY = cy + Math.sin(angle) * (radius + 52);
        const anchor =
          Math.abs(Math.cos(angle)) < 0.2
            ? "middle"
            : Math.cos(angle) > 0
              ? "start"
              : "end";

        return (
          <g key={`branch-${index}`}>
            <line
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={color.stroke}
              strokeWidth="2"
              opacity="0.7"
            />
            <rect
              x={labelX - (anchor === "middle" ? 54 : anchor === "start" ? 0 : 108)}
              y={labelY - 18}
              width={108}
              height={branch.detail ? 36 : 28}
              rx="8"
              fill={color.fill}
              stroke={color.stroke}
              strokeWidth="1.5"
            />
            <text
              x={labelX + (anchor === "start" ? 6 : anchor === "end" ? -6 : 0)}
              y={labelY - (branch.detail ? 2 : 0)}
              textAnchor={anchor}
              fill={color.text}
              fontSize="9"
              fontWeight="600"
            >
              {branch.label.length > 14
                ? `${branch.label.slice(0, 13)}…`
                : branch.label}
            </text>
            {branch.detail ? (
              <text
                x={labelX + (anchor === "start" ? 6 : anchor === "end" ? -6 : 0)}
                y={labelY + 12}
                textAnchor={anchor}
                fill="#64748b"
                fontSize="7.5"
              >
                {branch.detail.length > 18
                  ? `${branch.detail.slice(0, 17)}…`
                  : branch.detail}
              </text>
            ) : null}
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r="34" fill="#4f46e5" opacity="0.12" />
      <circle
        cx={cx}
        cy={cy}
        r="30"
        fill="#eef2ff"
        stroke="#4f46e5"
        strokeWidth="2.5"
      />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#312e81"
        fontSize="10"
        fontWeight="700"
      >
        {data.center.length > 10 ? `${data.center.slice(0, 9)}…` : data.center}
      </text>
    </svg>
  );
}

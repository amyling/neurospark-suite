/**
 * Twin-clock / spacetime schematic for physics and relativity lessons (light theme).
 */
export function SpacetimeIllustration({ compact = false }: { compact?: boolean }) {
  const height = compact ? "h-40" : "h-52";

  return (
    <svg
      viewBox="0 0 360 200"
      className={`mx-auto w-full max-w-lg ${height}`}
      role="img"
      aria-label="Twin clock spacetime diagram"
    >
      <rect x="20" y="35" width="130" height="115" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
      <text x="85" y="58" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="600">
        Observer A (rest)
      </text>
      <circle cx="85" cy="98" r="30" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
      <line x1="85" y1="82" x2="85" y2="108" stroke="#2563eb" strokeWidth="2.5" />
      <line x1="70" y1="98" x2="100" y2="98" stroke="#2563eb" strokeWidth="2.5" />
      <text x="85" y="132" textAnchor="middle" fill="#334155" fontSize="10">
        Δt = 1.0 s
      </text>

      <path d="M 158 95 L 202 95" stroke="#d97706" strokeWidth="2.5" />
      <polygon points="202,95 194,91 194,99" fill="#d97706" />
      <text x="180" y="82" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="600">
        v →
      </text>

      <rect x="210" y="35" width="130" height="115" rx="12" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />
      <text x="275" y="58" textAnchor="middle" fill="#5b21b6" fontSize="11" fontWeight="600">
        Observer B (moving)
      </text>
      <circle cx="275" cy="98" r="30" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
      <line x1="275" y1="86" x2="275" y2="104" stroke="#7c3aed" strokeWidth="2" />
      <line x1="268" y1="95" x2="282" y2="95" stroke="#7c3aed" strokeWidth="2" />
      <text x="275" y="132" textAnchor="middle" fill="#334155" fontSize="10">
        Δt&apos; &lt; Δt
      </text>

      <text x="180" y="178" textAnchor="middle" fill="#475569" fontSize="11">
        Time dilation — moving clock ticks slower
      </text>
    </svg>
  );
}

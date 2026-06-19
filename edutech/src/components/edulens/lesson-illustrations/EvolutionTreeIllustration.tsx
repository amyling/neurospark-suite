/**
 * Simple phylogenetic tree SVG for biology / evolution lessons.
 */
export function EvolutionTreeIllustration() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="mx-auto h-52 w-full max-w-lg"
      role="img"
      aria-label="Evolutionary tree diagram"
    >
      <line x1="40" y1="180" x2="200" y2="180" stroke="#78716c" strokeWidth="2" />
      <line x1="200" y1="180" x2="200" y2="40" stroke="#78716c" strokeWidth="2" />
      <line x1="200" y1="120" x2="300" y2="80" stroke="#16a34a" strokeWidth="2.5" />
      <line x1="200" y1="120" x2="300" y2="140" stroke="#16a34a" strokeWidth="2.5" />
      <line x1="200" y1="80" x2="300" y2="50" stroke="#22c55e" strokeWidth="2" />
      <line x1="200" y1="80" x2="300" y2="110" stroke="#22c55e" strokeWidth="2" />

      <circle cx="40" cy="180" r="6" fill="#a8a29e" />
      <text x="28" y="200" fill="#57534e" fontSize="9">
        ancestor
      </text>

      <circle cx="300" cy="50" r="5" fill="#15803d" />
      <circle cx="300" cy="80" r="5" fill="#15803d" />
      <circle cx="300" cy="110" r="5" fill="#15803d" />
      <circle cx="300" cy="140" r="5" fill="#15803d" />

      <text x="308" y="54" fill="#166534" fontSize="9">
        Species A
      </text>
      <text x="308" y="84" fill="#166534" fontSize="9">
        Species B
      </text>
      <text x="308" y="114" fill="#166534" fontSize="9">
        Species C
      </text>
      <text x="308" y="144" fill="#166534" fontSize="9">
        Species D
      </text>

      <text x="180" y="28" textAnchor="middle" fill="#44403c" fontSize="11" fontWeight="600">
        Phylogenetic tree
      </text>
      <text x="180" y="210" textAnchor="middle" fill="#78716c" fontSize="10">
        Branch length ≈ time · Nodes = common ancestors
      </text>
    </svg>
  );
}

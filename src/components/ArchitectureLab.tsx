import { useState } from "react";
const parts = [
  {
    name: "Browser UI",
    x: 15,
    y: 20,
    description:
      "Captures a learner action and renders the result. It has no production database credentials.",
  },
  {
    name: "Validation",
    x: 325,
    y: 20,
    description:
      "Checks the action shape, known lesson IDs and progress schema before accepting state.",
  },
  {
    name: "Local storage",
    x: 325,
    y: 160,
    description:
      "Persists versioned progress on this browser. Export is needed for a portable backup.",
  },
  {
    name: "SQL worker",
    x: 15,
    y: 160,
    description:
      "Runs an isolated in-memory SQLite practice database. A timeout terminates a long query.",
  },
];
export default function ArchitectureLab() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="panel">
      <span className="eyebrow">EXPLORE THE ARCHITECTURE</span>
      <h2>Where does the work happen?</h2>
      <figure>
        <svg
          viewBox="0 0 600 260"
          role="img"
          aria-label="Browser actions pass through validation to local storage. SQL practice runs in a separate browser worker."
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8" fill="var(--muted)" />
            </marker>
          </defs>
          <g
            stroke="var(--muted)"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrow)"
          >
            <path d="M255 60 H315" />
            <path d="M445 100 V150" />
            <path d="M135 100 V150" />
          </g>
          {parts.map((p, i) => (
            <g key={p.name}>
              <rect
                x={p.x}
                y={p.y}
                width="240"
                height="80"
                rx="13"
                fill={selected === i ? "var(--soft)" : "var(--bg)"}
                stroke={selected === i ? "var(--accent)" : "var(--line)"}
              />
              <text
                x={p.x + 120}
                y={p.y + 46}
                textAnchor="middle"
                fontSize="17"
                fill="currentColor"
              >
                {p.name}
              </text>
            </g>
          ))}
        </svg>
        <figcaption>
          All four components run on the learner’s device. Select a component
          for its responsibility.
        </figcaption>
      </figure>
      <div className="button-row">
        {parts.map((p, i) => (
          <button
            key={p.name}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <p className="architecture-detail" aria-live="polite">
        {parts[selected].description}
      </p>
    </section>
  );
}

export default function ChipGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <rect
        x="24"
        y="24"
        width="16"
        height="16"
        fill="var(--accent-2)"
        opacity="0.6"
      />
      {[0, 12, 24, 44, 56].map((pos) =>
        [8, 20].map((side, i) => (
          <line
            key={`${pos}-${side}-${i}`}
            x1={pos}
            y1={i === 0 ? 16 : 48}
            x2={pos}
            y2={i === 0 ? 8 : 56}
            stroke="var(--accent)"
            strokeWidth="2"
          />
        ))
      )}
    </svg>
  );
}

"use client";

// Decorative hexagons/circles/squares that sit behind a content section.
// Unlike a site-wide fixed background, this is scoped to whichever
// `relative`-positioned section it's dropped into — cheap, simple CSS
// shapes rather than complex SVG, and clearly visible at these opacities.
export default function FloatingGeometries({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const shapes = [
    { type: "hexagon", top: "8%", left: "4%", size: 90, color: "var(--accent)", opacity: 0.15 },
    { type: "circle", top: "18%", right: "6%", size: 64, color: "var(--accent-2)", opacity: 0.2 },
    { type: "square", top: "55%", left: "9%", size: 48, color: "var(--accent-3)", opacity: 0.18 },
    { type: "hexagon", bottom: "12%", right: "10%", size: 110, color: "var(--accent)", opacity: 0.12 },
    { type: "circle", bottom: "30%", left: "7%", size: 56, color: "var(--accent-2)", opacity: 0.18 },
    { type: "square", top: "70%", right: "14%", size: 40, color: "var(--accent-3)", opacity: 0.16 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {shapes.slice(0, count).map((s, i) => {
        const base: React.CSSProperties = {
          position: "absolute",
          width: s.size,
          height: s.size,
          opacity: s.opacity,
          top: s.top,
          bottom: s.bottom,
          left: s.left,
          right: s.right,
        };
        if (s.type === "hexagon") {
          return (
            <div
              key={i}
              className="geometric-hexagon"
              style={{ ...base, background: `linear-gradient(135deg, ${s.color}, var(--accent-2))` }}
            />
          );
        }
        if (s.type === "circle") {
          return (
            <div
              key={i}
              style={{ ...base, border: `2px solid ${s.color}`, borderRadius: "50%" }}
            />
          );
        }
        return <div key={i} style={{ ...base, border: `2px solid ${s.color}` }} />;
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import ChipGlyph from "./ChipGlyph";

// A fixed, subtle parallax layer that sits behind every page's content.
// Each glyph moves at a different fraction of scroll speed, so as you
// scroll through any page — not just the homepage hero — there's a
// continuous sense of depth. Kept low-opacity and pointer-events-none so
// it never competes with or blocks actual content.
export default function ParallaxBackground() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const speeds = [0.06, 0.1, 0.04, 0.08, 0.05, 0.09];
      layerRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${y * speeds[i % speeds.length]}px)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chips = [
    { top: "8%", left: "4%", size: "w-10", opacity: "opacity-20" },
    { top: "22%", left: "92%", size: "w-14", opacity: "opacity-[0.15]" },
    { top: "45%", left: "8%", size: "w-8", opacity: "opacity-20" },
    { top: "60%", left: "88%", size: "w-12", opacity: "opacity-[0.18]" },
    { top: "78%", left: "6%", size: "w-16", opacity: "opacity-[0.12]" },
    { top: "92%", left: "90%", size: "w-10", opacity: "opacity-20" },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {chips.map((c, i) => (
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute"
          style={{ top: c.top, left: c.left }}
        >
          <ChipGlyph className={`${c.size} ${c.opacity}`} />
        </div>
      ))}
    </div>
  );
}

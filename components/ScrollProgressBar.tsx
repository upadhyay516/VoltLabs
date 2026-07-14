"use client";

import { useEffect, useState } from "react";

// Fixed neon bar at the top of the viewport that fills as the person
// scrolls. Mounted once in the root layout, so it appears on every page.
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden>
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

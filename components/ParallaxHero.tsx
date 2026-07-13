"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ChipGlyph from "./ChipGlyph";

export default function ParallaxHero() {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (farRef.current) farRef.current.style.transform = `translateY(${y * 0.15}px)`;
      if (midRef.current) midRef.current.style.transform = `translateY(${y * 0.35}px)`;
      if (nearRef.current) nearRef.current.style.transform = `translateY(${y * 0.3}px)`;
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
    <section className="relative h-[92vh] min-h-[560px] overflow-hidden flex items-center justify-center">
      {/* Layer 1 — far: static pixel grid */}
      <div
        ref={farRef}
        className="absolute inset-0 pixel-grid opacity-60"
        style={{ willChange: "transform" }}
        aria-hidden
      />

      {/* Layer 2 — mid: floating circuit chips */}
      <div ref={midRef} className="absolute inset-0" style={{ willChange: "transform" }} aria-hidden>
        <ChipGlyph className="absolute top-[15%] left-[8%] w-16 opacity-70 animate-flicker" />
        <ChipGlyph className="absolute top-[60%] left-[18%] w-10 opacity-50" />
        <ChipGlyph className="absolute top-[25%] right-[12%] w-20 opacity-60 animate-flicker" />
        <ChipGlyph className="absolute top-[70%] right-[20%] w-12 opacity-40" />
      </div>

      {/* Layer 3 — near: title, moves fastest for depth */}
      <div ref={nearRef} className="relative z-10 text-center px-4" style={{ willChange: "transform" }}>
        <h1 className="font-bubble text-4xl sm:text-6xl md:text-8xl leading-tight neon-text mb-6">
          VOLTLAB
          <br />
          <span className="text-[var(--accent-2)]">BUILDS</span>
        </h1>
        <p className="font-terminal text-lg sm:text-2xl text-[var(--text-dim)] max-w-xl mx-auto mb-8">
          Turn breadboard ideas into real builds.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/products" className="btn-pixel">
            Browse kits
          </Link>
          <Link href="/signup" className="btn-pixel-outline">
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
}

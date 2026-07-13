"use client";

import { useEffect, useRef } from "react";

// A hand-routed PCB-style circuit board rendered as background art, with
// two depth layers (far/near) that drift at different rates as the page
// scrolls, plus a few "signal" pulses animating along real trace paths.
// Everything is theme-aware (uses CSS custom properties), low-opacity so
// it never competes with foreground content, and pointer-events:none.

function FarLayer() {
  const vias = [
    [230, 190], [670, 170], [210, 430], [690, 460],
    [240, 950], [660, 850], [250, 1200], [660, 1420],
    [260, 1620], [640, 1830], [230, 2050], [660, 2250],
  ];
  return (
    <svg
      viewBox="0 0 900 2400"
      preserveAspectRatio="xMidYMin slice"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "220vh" }}
    >
      <g fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.4">
        <path d="M50,30 L50,190 L230,190 L230,350" />
        <path d="M850,20 L850,170 L670,170 L670,330 L500,330" />
        <path d="M40,430 L210,430 L210,560 L380,560 L380,700" />
        <path d="M860,460 L690,460 L690,620 L830,620 L830,780" />
        <path d="M60,800 L60,950 L240,950 L240,1100" />
        <path d="M840,850 L660,850 L660,1010 L500,1010 L500,1160" />
        <path d="M70,1200 L250,1200 L250,1350 L110,1350 L110,1500" />
        <path d="M830,1250 L830,1420 L660,1420 L660,1580" />
        <path d="M90,1620 L260,1620 L260,1780 L420,1780 L420,1930" />
        <path d="M810,1660 L640,1660 L640,1830 L790,1830 L790,2000" />
        <path d="M60,2050 L230,2050 L230,2210 L390,2210 L390,2360" />
        <path d="M830,2080 L830,2250 L660,2250 L660,2380" />
      </g>
      {vias.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" opacity="0.45" />
      ))}
    </svg>
  );
}

function NearLayer() {
  return (
    <svg
      viewBox="0 0 900 2400"
      preserveAspectRatio="xMidYMin slice"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "240vh" }}
    >
      {/* Traces */}
      <g fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.65">
        <path id="nt1" d="M230,250 L230,340 L350,340 L350,170 L470,170" />
        <path d="M190,220 L190,100 L340,100" />
        <path d="M60,260 L60,480 L140,480" />
        <path d="M560,910 L400,910 L400,700 L380,700" />
        <path id="nt5" d="M660,940 L820,940 L820,1120 L880,1120" />
        <path d="M610,880 L610,720 L720,720 L720,560" />
        <path d="M700,1230 L620,1230" />
        <path d="M620,1200 L500,1200 L500,1400 L310,1400 L310,1560" />
        <path d="M260,1610 L100,1610 L100,1780" />
        <path id="nt10" d="M310,1610 L460,1610 L460,1820 L620,1820" />
        <path d="M160,1900 L160,1750" />
        <path d="M160,1940 L160,2100 L340,2100" />
        <path d="M720,1850 L720,2020 L560,2020 L560,2180" />
        <path d="M60,2200 L220,2200 L220,2350" />
        <path d="M840,2220 L840,2380 L680,2380" />
      </g>

      {/* Vias */}
      <g>
        {[
          [350, 340], [400, 700], [820, 940], [720, 720],
          [500, 1200], [310, 1400], [460, 1820], [220, 2200],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="var(--panel)"
            stroke="var(--accent)"
            strokeWidth="1.6"
            opacity="0.65"
          />
        ))}
      </g>

      {/* IC footprints: rect body + pin stubs on both sides */}
      {[
        { x: 140, y: 220, w: 90, h: 54, label: "U1" },
        { x: 560, y: 880, w: 100, h: 60, label: "U2" },
        { x: 230, y: 1560, w: 80, h: 50, label: "U3" },
      ].map((ic, i) => {
        const pinYs = [0.22, 0.5, 0.78].map((f) => ic.y + ic.h * f);
        return (
          <g key={i} opacity="0.75">
            <rect
              x={ic.x}
              y={ic.y}
              width={ic.w}
              height={ic.h}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth="1.8"
            />
            <circle cx={ic.x + 8} cy={ic.y + 8} r="2" fill="var(--accent-2)" />
            {pinYs.map((py, j) => (
              <g key={j} stroke="var(--accent-2)" strokeWidth="1.8">
                <line x1={ic.x - 10} y1={py} x2={ic.x} y2={py} />
                <line x1={ic.x + ic.w} y1={py} x2={ic.x + ic.w + 10} y2={py} />
              </g>
            ))}
            <text
              x={ic.x + ic.w / 2}
              y={ic.y - 8}
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fill="var(--text-dim)"
            >
              {ic.label}
            </text>
          </g>
        );
      })}

      {/* Resistors: lead + zigzag + lead */}
      <g fill="none" stroke="var(--accent)" strokeWidth="1.6" opacity="0.6">
        <path d="M470,170 L478,170 L484,158 L496,182 L508,158 L520,182 L532,170 L540,170" />
        <path d="M620,1230 L628,1230 L634,1218 L646,1242 L658,1218 L670,1242 L682,1230 L690,1230" />
      </g>
      <text x="505" y="150" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-dim)" opacity="0.55">R1</text>
      <text x="655" y="1210" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-dim)" opacity="0.55">R2</text>

      {/* Capacitors: lead, two plates, lead */}
      <g stroke="var(--accent)" strokeWidth="1.6" opacity="0.6">
        <line x1="380" y1="680" x2="380" y2="695" />
        <line x1="372" y1="695" x2="388" y2="695" />
        <line x1="372" y1="705" x2="388" y2="705" />
        <line x1="380" y1="705" x2="380" y2="720" />
        <line x1="160" y1="1900" x2="160" y2="1912" />
        <line x1="152" y1="1912" x2="168" y2="1912" />
        <line x1="152" y1="1928" x2="168" y2="1928" />
        <line x1="160" y1="1928" x2="160" y2="1940" />
      </g>
      <text x="380" y="672" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-dim)" opacity="0.55">C1</text>
      <text x="180" y="1920" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-dim)" opacity="0.55">C2</text>

      {/* Ground pour hatch, bottom-right corner */}
      <g stroke="var(--accent)" strokeWidth="0.6" opacity="0.22">
        <rect x="700" y="2380" width="180" height="180" fill="none" strokeDasharray="4 3" />
        {Array.from({ length: 22 }).map((_, i) => {
          const off = i * 16 - 180;
          return (
            <line
              key={i}
              x1={700 + Math.max(off, 0)}
              y1={2380 + Math.max(-off, 0)}
              x2={700 + Math.min(off + 180, 180)}
              y2={2380 + Math.min(360 - off, 180)}
            />
          );
        })}
      </g>

      {/* Animated signal pulses traveling along real traces */}
      {["nt1", "nt5", "nt10"].map((id, i) => (
        <g key={id}>
          <circle r="6" fill="var(--accent-2)" opacity="0.7">
            <animateMotion dur={`${4 + i * 1.6}s`} repeatCount="indefinite">
              <mpath href={`#${id}`} xlinkHref={`#${id}`} />
            </animateMotion>
          </circle>
          <circle r="2.5" fill="var(--accent-2)" opacity="1">
            <animateMotion dur={`${4 + i * 1.6}s`} repeatCount="indefinite">
              <mpath href={`#${id}`} xlinkHref={`#${id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
}

export default function CircuitParallax() {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (farRef.current) farRef.current.style.transform = `translateY(${y * 0.04}px)`;
      if (nearRef.current) nearRef.current.style.transform = `translateY(${y * 0.09}px)`;
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
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden
    >
      <div ref={farRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <FarLayer />
      </div>
      <div ref={nearRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <NearLayer />
      </div>
    </div>
  );
}

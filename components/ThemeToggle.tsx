"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { THEMES, getTheme } from "@/lib/themes";

// Compact picker for the Account page — shows the current theme plus a
// handful of quick options, with a link out to the full gallery for the
// rest. Keeps Account from turning into a 24-button wall.
const QUICK_PICKS = ["y2k", "midnight", "paper", "slate", "sage", "dusk"] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = getTheme(theme);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 overflow-hidden border" style={{ borderColor: "var(--border)" }}>
          <div className="w-1/2 h-full" style={{ background: current.colors.bg }} />
          <div className="w-1/4 h-full" style={{ background: current.colors.accent }} />
          <div className="w-1/4 h-full" style={{ background: current.colors.accent2 }} />
        </div>
        <div>
          <p className="font-terminal text-xl">{current.label}</p>
          <p className="font-data text-xs text-[var(--text-dim)]">{current.category}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        {THEMES.filter((t) => QUICK_PICKS.includes(t.value as any)).map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`px-4 py-2 font-terminal text-lg border ${
              theme === t.value
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-dim)]"
            }`}
          >
            {t.shortLabel}
          </button>
        ))}
      </div>

      <Link href="/themes" className="btn-pixel-outline inline-block">
        🎨 Browse all {THEMES.length} themes →
      </Link>
    </div>
  );
}

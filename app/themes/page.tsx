"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { THEMES, THEME_CATEGORIES } from "@/lib/themes";

export default function ThemeGalleryPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <h1 className="font-display text-lg text-[var(--accent-2)]">
          🎨 THEME_GALLERY
        </h1>
        <Link href="/account" className="font-terminal text-lg text-[var(--text-dim)] hover:text-[var(--accent)]">
          ← Back to Account
        </Link>
      </div>
      <p className="font-data text-sm text-[var(--text-dim)] mb-10">
        {THEMES.length} themes, grouped by mood. Click any card to apply it —
        it saves to your account instantly if you're signed in.
      </p>

      {THEME_CATEGORIES.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="font-terminal text-2xl mb-5 text-[var(--accent)]">
            {category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {THEMES.filter((t) => t.category === category).map((t) => {
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`text-left glass p-0 overflow-hidden transition-transform hover:scale-[1.02] ${
                    isActive ? "shadow-neon" : ""
                  }`}
                  style={{
                    borderColor: isActive ? t.colors.accent : "var(--border)",
                    borderWidth: isActive ? "2px" : "1px",
                  }}
                >
                  {/* Swatch strip: bg / panel / accent / accent2 */}
                  <div className="flex h-16 w-full">
                    <div className="w-1/3 h-full" style={{ background: t.colors.bg }} />
                    <div className="w-1/6 h-full" style={{ background: t.colors.panel }} />
                    <div className="w-1/4 h-full" style={{ background: t.colors.accent }} />
                    <div className="w-1/4 h-full" style={{ background: t.colors.accent2 }} />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-terminal text-lg">{t.label}</p>
                      {isActive && (
                        <span
                          className="text-xs font-data"
                          style={{ color: t.colors.accent }}
                        >
                          ● active
                        </span>
                      )}
                    </div>
                    <p className="font-data text-xs text-[var(--text-dim)] mt-1 leading-snug">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

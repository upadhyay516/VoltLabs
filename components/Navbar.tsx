"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { getTheme } from "@/lib/themes";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { count } = useCart();
  const { theme } = useTheme();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = getTheme(theme);

  return (
    <header className="sticky top-0 z-50 glass-elevated border-b">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3 gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-[var(--accent)] text-xs sm:text-sm neon-text">
            VL
          </span>
          <span className="font-terminal text-lg sm:text-xl tracking-wide whitespace-nowrap">
            VoltLab<span className="text-[var(--accent-2)]">.builds</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 font-terminal text-lg">
          <Link href="/products" className="hover:text-[var(--accent)]">
            Products
          </Link>
          {user && (
            <Link href="/orders" className="hover:text-[var(--accent)]">
              Orders
            </Link>
          )}
          {profile?.role === "staff" && (
            <Link
              href="/staff"
              className="text-[var(--accent-2)] hover:opacity-80"
            >
              Staff Console
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/themes"
            title="Browse themes"
            className="glass px-2 sm:px-3 py-1.5 flex items-center gap-1.5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: current.colors.accent }}
            />
            <span className="font-data text-[10px] sm:text-xs text-[var(--accent)]">
              {current.shortLabel}
            </span>
          </Link>

          <Link href="/cart" className="relative glass px-2.5 sm:px-3 py-1.5">
            <span className="font-terminal text-base sm:text-lg">Cart</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--accent-2)] text-[var(--bg)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-data">
                {count}
              </span>
            )}
          </Link>

          {/* Account button/menu — hidden on the smallest screens, folded into the hamburger instead */}
          <div className="relative hidden sm:block">
            {user ? (
              <>
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="glass px-3 py-1.5 font-terminal text-lg"
                >
                  {profile?.username ?? "Account"}
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-44 glass-elevated py-2 font-terminal text-lg">
                    <Link
                      href="/account"
                      className="block px-4 py-2 hover:text-[var(--accent)]"
                      onClick={() => setAccountOpen(false)}
                    >
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setAccountOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:text-[var(--accent-2)]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="btn-pixel-outline">
                Sign in
              </Link>
            )}
          </div>

          {/* Hamburger — visible below md, covers nav links + account on small phones */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden glass px-2.5 py-1.5 font-terminal text-lg"
            aria-label="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden glass-elevated border-t px-4 py-4 space-y-3 font-terminal text-lg">
          <Link
            href="/products"
            className="block hover:text-[var(--accent)]"
            onClick={() => setMobileOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/themes"
            className="block hover:text-[var(--accent)]"
            onClick={() => setMobileOpen(false)}
          >
            🎨 Themes
          </Link>
          {user && (
            <Link
              href="/orders"
              className="block hover:text-[var(--accent)]"
              onClick={() => setMobileOpen(false)}
            >
              Orders
            </Link>
          )}
          {profile?.role === "staff" && (
            <Link
              href="/staff"
              className="block text-[var(--accent-2)]"
              onClick={() => setMobileOpen(false)}
            >
              Staff Console
            </Link>
          )}
          <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block py-1 hover:text-[var(--accent)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Account ({profile?.username ?? "settings"})
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left py-1 hover:text-[var(--accent-2)]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-1 text-[var(--accent)]"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

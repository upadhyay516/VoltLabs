"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import ThemeToggle from "@/components/ThemeToggle";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AccountPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveUsername() {
    setSavingUsername(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user!.id);
    setSavingUsername(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Username updated");
      refreshProfile();
    }
  }

  async function savePassword() {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      setNewPassword("");
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <h1 className="font-display text-lg text-[var(--accent)]">
          &gt; ACCOUNT_SETTINGS
        </h1>

        <GlassCard>
          <h2 className="font-terminal text-2xl mb-4">Signed in as</h2>
          <p className="font-data text-sm text-[var(--text-dim)]">
            {user?.email}
          </p>
          {profile?.role === "staff" && (
            <span className="inline-block mt-2 text-xs font-data text-[var(--accent-2)] border px-2 py-1" style={{ borderColor: "var(--accent-2)" }}>
              STAFF ACCOUNT
            </span>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="font-terminal text-2xl mb-4">Username</h2>
          <div className="flex gap-3">
            <input
              className="flex-1 bg-transparent border px-4 py-2 font-data outline-none focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="btn-pixel-outline"
              disabled={savingUsername}
              onClick={saveUsername}
            >
              Save
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-terminal text-2xl mb-4">Change password</h2>
          <p className="font-data text-xs text-[var(--text-dim)] mb-3">
            Only works if you also set up email/password sign-in — Google
            accounts manage their password with Google directly.
          </p>
          <div className="flex gap-3">
            <input
              type="password"
              className="flex-1 bg-transparent border px-4 py-2 font-data outline-none focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="btn-pixel-outline"
              disabled={savingPassword}
              onClick={savePassword}
            >
              Update
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-terminal text-2xl mb-4">Theme</h2>
          <ThemeToggle />
        </GlassCard>
      </div>
    </ProtectedRoute>
  );
}

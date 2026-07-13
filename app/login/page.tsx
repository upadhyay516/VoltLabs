"use client";

import { useAuth } from "@/lib/auth-context";
import GlassCard from "@/components/GlassCard";
import GoogleIcon from "@/components/GoogleIcon";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <GlassCard elevated className="text-center py-12">
        <p className="font-display text-xs text-[var(--accent)] mb-4">
          &gt; ACCESS_TERMINAL
        </p>
        <h1 className="font-terminal text-3xl mb-6">Sign in to VoltLab</h1>
        <p className="font-data text-sm text-[var(--text-dim)] mb-8">
          One account for ordering kits, tracking orders, and (if you're
          staff) managing the catalog.
        </p>
        <button
          onClick={signInWithGoogle}
          className="btn-pixel w-full flex items-center justify-center gap-3"
        >
          <span className="bg-white rounded-sm p-1 flex items-center justify-center">
            <GoogleIcon size={16} />
          </span>
          Continue with Google
        </button>
      </GlassCard>
    </div>
  );
}

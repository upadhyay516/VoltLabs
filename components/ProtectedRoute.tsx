"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProtectedRoute({
  children,
  staffOnly = false,
}: {
  children: React.ReactNode;
  staffOnly?: boolean;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (staffOnly && profile && profile.role !== "staff") {
      router.replace("/");
    }
  }, [loading, user, profile, staffOnly, router]);

  if (loading || !user || (staffOnly && profile?.role !== "staff")) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-terminal text-2xl text-[var(--accent)]">
        LOADING…
      </div>
    );
  }

  return <>{children}</>;
}

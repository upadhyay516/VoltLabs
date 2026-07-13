import Link from "next/link";
import GlassCard from "@/components/GlassCard";

export default function LegalLayout({
  title,
  tag,
  lastUpdated,
  children,
}: {
  title: string;
  tag: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <p className="font-display text-xs text-[var(--accent)]">&gt; {tag}</p>
        <Link
          href="/"
          className="font-terminal text-lg text-[var(--text-dim)] hover:text-[var(--accent)]"
        >
          ← Back home
        </Link>
      </div>
      <h1 className="font-terminal text-4xl mb-2">{title}</h1>
      <p className="font-data text-xs text-[var(--text-dim)] mb-10">
        Last updated: {lastUpdated}
      </p>

      <GlassCard elevated className="font-data text-sm leading-relaxed space-y-6">
        {children}
      </GlassCard>

      <p className="font-data text-xs text-[var(--text-dim)] mt-8">
        Questions about this policy? DM{" "}
        <a
          href="https://www.instagram.com/voltlab.builds/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-2)]"
        >
          @voltlab.builds
        </a>{" "}
        on Instagram or reach us at the contact details on our profile.
      </p>
    </div>
  );
}

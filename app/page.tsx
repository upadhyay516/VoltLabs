import ParallaxHero from "@/components/ParallaxHero";
import GlassCard from "@/components/GlassCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import FloatingGeometries from "@/components/FloatingGeometries";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function HomePage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div>
      <ParallaxHero />

      <section className="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
        <FloatingGeometries count={3} />
        <h2 className="relative font-display text-lg mb-8 text-[var(--accent)]">
          &gt; HOW_IT_WORKS
        </h2>
        <div className="relative grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Pick a build",
              body: "Browse Arduino & non-Arduino kits designed for real coursework and hobby projects.",
            },
            {
              title: "We hand-assemble it",
              body: "Every unit is built and tested by us before it ships — not mass-produced.",
            },
          ].map((step, i) => (
            <RevealOnScroll key={step.title} delay={i * 120}>
              <GlassCard>
                <span className="font-display text-xs text-[var(--accent-2)]">
                  0{i + 1}
                </span>
                <h3 className="font-bubble text-xl mt-2 mb-1">{step.title}</h3>
                <p className="text-[var(--text-dim)] font-data text-sm">
                  {step.body}
                </p>
              </GlassCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
        <FloatingGeometries count={3} className="opacity-70" />
        <div className="relative flex items-center justify-between mb-8">
          <h2 className="font-display text-lg text-[var(--accent)]">
            &gt; LATEST_BUILDS
          </h2>
          <Link href="/products" className="font-terminal text-lg text-[var(--accent-2)]">
            View all →
          </Link>
        </div>
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((p, i) => (
            <RevealOnScroll key={p.id} delay={i * 100}>
              <ProductCard product={p as any} />
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
}

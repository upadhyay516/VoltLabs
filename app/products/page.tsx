import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import FloatingGeometries from "@/components/FloatingGeometries";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop All Kits",
  description:
    "Browse hand-assembled Arduino and non-Arduino electronics kits — gas leakage detectors, fire alarms, water level indicators, and more.",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; sort?: string };
}) {
  const { category = "", q = "", sort = "newest" } = searchParams;

  let query = supabase.from("products").select("*").eq("is_published", true);

  if (category) {
    query = query.eq("category", category);
  }
  if (q) {
    // Search both name and description, case-insensitive
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  const categories = [
    { value: "", label: "All" },
    { value: "arduino", label: "Arduino" },
    { value: "non-arduino", label: "Non-Arduino" },
    { value: "accessory", label: "Accessories" },
  ];

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-12 overflow-hidden">
      <FloatingGeometries count={2} className="opacity-60" />
      <h1 className="relative font-display text-lg text-[var(--accent)] mb-2">
        &gt; PRODUCT_CATALOG
      </h1>
      <p className="relative font-terminal text-xl text-[var(--text-dim)] mb-8">
        Every kit is hand-built and tested before it ships.
      </p>

      {/* Plain GET form — no JS needed, works even if hydration is slow */}
      <form className="relative flex flex-col sm:flex-row gap-3 mb-6" action="/products">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search kits (e.g. gas, rain, thermometer)..."
          className="flex-1 bg-transparent border px-4 py-2 font-data outline-none focus:border-[var(--accent)]"
          style={{ borderColor: "var(--border)" }}
        />
        <select
          name="sort"
          defaultValue={sort}
          className="bg-transparent border px-4 py-2 font-data"
          style={{ borderColor: "var(--border)" }}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value} style={{ color: "#111827", background: "#ffffff" }}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-pixel-outline whitespace-nowrap">
          Search
        </button>
      </form>

      <div className="relative flex items-center justify-between mb-10 flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap">
          {categories.map((c) => {
            const params = new URLSearchParams();
            if (c.value) params.set("category", c.value);
            if (q) params.set("q", q);
            if (sort !== "newest") params.set("sort", sort);
            const href = params.toString() ? `/products?${params}` : "/products";
            return (
              <a
                key={c.value}
                href={href}
                className={`px-4 py-2 font-terminal text-lg border ${
                  category === c.value
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text-dim)]"
                }`}
              >
                {c.label}
              </a>
            );
          })}
        </div>
        {q && (
          <p className="font-data text-xs text-[var(--text-dim)]">
            {products?.length ?? 0} result{products?.length === 1 ? "" : "s"} for "{q}"
          </p>
        )}
      </div>

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p, i) => (
          <RevealOnScroll key={p.id} delay={(i % 6) * 80}>
            <ProductCard product={p as any} />
          </RevealOnScroll>
        ))}
        {products?.length === 0 && (
          <p className="font-terminal text-xl text-[var(--text-dim)]">
            {q ? `No builds match "${q}".` : "No builds in this category yet."}
          </p>
        )}
      </div>
    </div>
  );
}

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import AddToCartControls from "@/components/AddToCartControls";
import StockBadge from "@/components/StockBadge";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data: product } = await supabase
    .from("products")
    .select("name, description, price, image_url")
    .eq("id", params.id)
    .single();

  if (!product) {
    return { title: "Product not found" };
  }

  const title = `${product.name} — ₹${product.price}`;
  const description =
    product.description ||
    `Hand-assembled ${product.name} kit from VoltLab Builds — ₹${product.price}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url
        ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }]
        : [`/products/${params.id}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-[var(--panel)] pixel-grid glass flex items-center justify-center">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-display text-sm text-[var(--accent)] p-8 text-center">
            {product.name}
          </span>
        )}
      </div>

      <div>
        <span className="font-data text-xs uppercase text-[var(--accent-2)]">
          {product.category}
        </span>
        <h1 className="font-bubble text-3xl md:text-4xl mt-1 mb-4">{product.name}</h1>
        <p className="font-data text-sm text-[var(--text-dim)] mb-6">
          {product.description}
        </p>

        <ul className="mb-6 space-y-2 font-terminal text-lg">
          {product.features?.map((f: string) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-[var(--accent)]">■</span> {f}
            </li>
          ))}
        </ul>

        <p className="font-terminal text-3xl text-[var(--accent-2)] mb-2">
          ₹{product.price}
        </p>
        <div className="mb-6">
          <StockBadge stock={product.stock} />
        </div>

        <AddToCartControls product={product as any} />
      </div>
    </div>
  );
}

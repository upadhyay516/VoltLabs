"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import GlassCard from "./GlassCard";
import StockBadge from "./StockBadge";
import { useCart } from "@/lib/cart-context";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  category: string;
  features: string[];
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <GlassCard className="flex flex-col group hover:shadow-neon transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square w-full bg-[var(--panel)] pixel-grid flex items-center justify-center mb-3 overflow-hidden">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="font-display text-xs text-[var(--accent)] p-4 text-center">
              {product.name}
            </span>
          )}
        </div>
        <h3 className="font-bubble text-xl group-hover:text-[var(--accent)]">
          {product.name}
        </h3>
      </Link>
      <ul className="text-sm text-[var(--text-dim)] font-data my-2 space-y-1">
        {product.features.slice(0, 3).map((f) => (
          <li key={f}>· {f}</li>
        ))}
      </ul>
      <StockBadge stock={product.stock} />
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="font-terminal text-2xl text-[var(--accent-2)]">
          ₹{product.price}
        </span>
        <button
          className="btn-pixel-outline text-xs"
          disabled={product.stock <= 0}
          onClick={() => {
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            });
            toast.success(`${product.name} added to cart`);
          }}
        >
          {product.stock > 0 ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </GlassCard>
  );
}

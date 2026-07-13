"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import GlassCard from "@/components/GlassCard";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-xs text-[var(--accent)] mb-4">
          &gt; CART_EMPTY
        </p>
        <h1 className="font-terminal text-3xl mb-6">Nothing here yet</h1>
        <Link href="/products" className="btn-pixel">
          Browse builds
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-lg text-[var(--accent)] mb-8">
        &gt; YOUR_CART
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <GlassCard key={item.id} className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--panel)] flex items-center justify-center shrink-0">
              <span className="font-display text-[8px] text-[var(--accent)] text-center px-1">
                {item.name.slice(0, 10)}
              </span>
            </div>
            <div className="flex-1 min-w-[140px]">
              <h3 className="font-terminal text-lg sm:text-xl">{item.name}</h3>
              <p className="font-data text-sm text-[var(--text-dim)]">
                ₹{item.price} each
              </p>
            </div>
            <div className="flex items-center border" style={{ borderColor: "var(--border)" }}>
              <button
                className="px-3 py-1 font-terminal text-lg"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="px-3 font-data">{item.quantity}</span>
              <button
                className="px-3 py-1 font-terminal text-lg"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <p className="font-terminal text-lg sm:text-xl w-20 text-right text-[var(--accent-2)]">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-[var(--text-dim)] hover:text-[var(--accent-2)] font-data text-sm ml-auto sm:ml-0"
            >
              remove
            </button>
          </GlassCard>
        ))}
      </div>

      <GlassCard elevated className="flex items-center justify-between">
        <div>
          <p className="font-data text-sm text-[var(--text-dim)]">Subtotal</p>
          <p className="font-terminal text-3xl text-[var(--accent)]">
            ₹{subtotal.toFixed(2)}
          </p>
        </div>
        <Link href="/checkout" className="btn-pixel">
          Checkout
        </Link>
      </GlassCard>
    </div>
  );
}

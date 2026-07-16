"use client";

import Link from "next/link";
import {
  useCart,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_CHARGE,
  PROJECT_REPORT_FEE,
} from "@/lib/cart-context";
import GlassCard from "@/components/GlassCard";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    projectReport,
    setProjectReport,
    deliveryCharge,
    reportFee,
    total,
  } = useCart();

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

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-lg text-[var(--accent)] mb-8">
        &gt; YOUR_CART
      </h1>

      <div className="space-y-4 mb-6">
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

      {/* Free delivery nudge */}
      {deliveryCharge > 0 && (
        <p className="font-data text-xs text-[var(--accent-2)] mb-6">
          Add ₹{amountToFreeDelivery.toFixed(2)} more to get FREE delivery
          (orders ₹{FREE_DELIVERY_THRESHOLD}+ ship free — otherwise a flat ₹
          {DELIVERY_CHARGE} delivery charge applies)
        </p>
      )}

      {/* Project report add-on — cart only */}
      <GlassCard className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-terminal text-xl">📄 Add a Project Report</p>
          <p className="font-data text-xs text-[var(--text-dim)]">
            A written report explaining the circuit, components, and working
            — handy for submitting alongside your kit for coursework.
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={projectReport}
            onChange={(e) => setProjectReport(e.target.checked)}
            className="w-5 h-5 accent-[var(--accent)]"
          />
          <span className="font-terminal text-lg text-[var(--accent-2)]">
            +₹{PROJECT_REPORT_FEE}
          </span>
        </label>
      </GlassCard>

      <GlassCard elevated>
        <div className="space-y-2 mb-4 font-data text-sm">
          <div className="flex justify-between text-[var(--text-dim)]">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-dim)]">
            <span>Delivery</span>
            <span>
              {deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : "FREE"}
            </span>
          </div>
          {reportFee > 0 && (
            <div className="flex justify-between text-[var(--text-dim)]">
              <span>Project Report</span>
              <span>₹{reportFee.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="font-data text-sm text-[var(--text-dim)]">Total</p>
            <p className="font-terminal text-3xl text-[var(--accent)]">
              ₹{total.toFixed(2)}
            </p>
          </div>
          <Link href="/checkout" className="btn-pixel">
            Checkout
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

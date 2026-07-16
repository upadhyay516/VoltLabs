"use client";

import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import RazorpayButton from "@/components/RazorpayButton";
import { useCart } from "@/lib/cart-context";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CheckoutPage() {
  const { items, subtotal, deliveryCharge, reportFee, projectReport, total } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <GlassCard>
          <h2 className="font-terminal text-2xl mb-4">Shipping details</h2>
          <div className="space-y-4">
            <input
              className="w-full bg-transparent border px-4 py-2 font-data outline-none focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full bg-transparent border px-4 py-2 font-data outline-none focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Full address (hostel/room, street, city, PIN)"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div>
              <input
                type="tel"
                inputMode="numeric"
                className="w-full bg-transparent border px-4 py-2 font-data outline-none focus:border-[var(--accent)]"
                style={{
                  borderColor:
                    phone && !isValidPhone ? "#ff4444" : "var(--border)",
                }}
                placeholder="Phone number (10 digits)"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  // Strip anything that isn't a digit as the person types —
                  // no letters, symbols, or spaces can even get in.
                  const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(digitsOnly);
                }}
              />
              {phone && !isValidPhone && (
                <p className="text-xs font-data mt-1" style={{ color: "#ff4444" }}>
                  Enter a valid 10-digit phone number
                </p>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard elevated>
          <h2 className="font-terminal text-2xl mb-4">Order summary</h2>
          <ul className="space-y-2 mb-4 font-data text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>₹{(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
            {projectReport && (
              <li className="flex justify-between text-[var(--accent-2)]">
                <span>Project Report</span>
                <span>₹{reportFee.toFixed(2)}</span>
              </li>
            )}
          </ul>
          <div className="space-y-1 mb-4 font-data text-xs text-[var(--text-dim)] pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : "FREE"}</span>
            </div>
          </div>
          <div className="flex justify-between font-terminal text-2xl mb-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <span>Total</span>
            <span className="text-[var(--accent-2)]">₹{total.toFixed(2)}</span>
          </div>
          <RazorpayButton
            shippingName={name}
            shippingAddress={address}
            shippingPhone={phone}
          />
          <p className="text-xs font-data text-[var(--text-dim)] mt-3">
            Payments are processed securely by Razorpay. VoltLab Builds never
            sees or stores your card/UPI details.
          </p>
        </GlassCard>
      </div>
    </ProtectedRoute>
  );
}

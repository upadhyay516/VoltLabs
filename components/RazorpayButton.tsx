"use client";

import Script from "next/script";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({
  shippingName,
  shippingAddress,
  shippingPhone,
}: {
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
}) {
  const { user, profile } = useAuth();
  const { items, total, deliveryCharge, reportFee, projectReport, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePay() {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!shippingName || !shippingAddress || !shippingPhone) {
      toast.error("Fill in your shipping details first");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(shippingPhone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      // 1. Ask our own API to create a Razorpay order (server-side, uses secret key)
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, items }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not create order");

      // 2. Open Razorpay's hosted checkout modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "VoltLab Builds",
        description: `${items.length} item(s)`,
        order_id: order.id,
        prefill: {
          name: shippingName,
          contact: shippingPhone,
          email: user.email,
        },
        theme: { color: "#00f0ff" },
        handler: async function (response: any) {
          // 3. Verify payment signature + save the order in Supabase
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id,
              items,
              total,
              deliveryCharge,
              reportFee,
              projectReport,
              shippingName,
              shippingAddress,
              shippingPhone,
            }),
          });
          const result = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart();
            toast.success("Payment successful! Order placed.");
            router.push("/orders");
          } else {
            toast.error(result.error || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button onClick={handlePay} disabled={loading} className="btn-pixel w-full">
        {loading ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
      </button>
    </>
  );
}

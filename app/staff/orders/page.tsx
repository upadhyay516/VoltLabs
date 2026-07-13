"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  created_at: string;
};

const STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as any) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/orders/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status }),
    });
    const result = await res.json();
    if (!res.ok) {
      toast.error(result.error || "Could not update order");
    } else {
      toast.success("Order updated — customer notified by email");
      load();
    }
  }

  async function deleteOrder(id: string, name: string) {
    if (
      !confirm(
        `Permanently delete this order from ${name}? This cannot be undone.`
      )
    ) {
      return;
    }
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  }

  return (
    <ProtectedRoute staffOnly>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="font-display text-lg text-[var(--accent-2)] mb-8">
          &gt; MANAGE_ORDERS
        </h1>
        <div className="space-y-4">
          {orders.map((o) => (
            <GlassCard key={o.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-terminal text-xl">{o.shipping_name}</p>
                  <p className="font-data text-xs text-[var(--text-dim)]">
                    #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="font-terminal text-2xl text-[var(--accent)]">
                  ₹{o.total}
                </p>
              </div>
              <p className="font-data text-sm text-[var(--text-dim)] mb-3">
                {o.shipping_address} · {o.shipping_phone}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="bg-transparent border px-3 py-2 font-data"
                  style={{ borderColor: "var(--border)" }}
                >
                  {STATUSES.map((s) => (
                    <option
                      key={s}
                      value={s}
                      style={{ color: "#111827", background: "#ffffff" }}
                    >
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => deleteOrder(o.id, o.shipping_name)}
                  className="text-xs font-data text-[var(--accent-2)] hover:opacity-80"
                >
                  Delete order
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth-context";
import GlassCard from "@/components/GlassCard";
import ProtectedRoute from "@/components/ProtectedRoute";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
};

const STATUS_COLOR: Record<string, string> = {
  pending: "var(--text-dim)",
  paid: "var(--accent)",
  processing: "var(--accent-3)",
  shipped: "var(--accent-2)",
  completed: "var(--success)",
  cancelled: "#ff4444",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, status, total, created_at, order_items(product_name, quantity, unit_price)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as any) ?? []));
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display text-lg text-[var(--accent)] mb-8">
          &gt; ORDER_HISTORY
        </h1>
        {orders.length === 0 && (
          <p className="font-terminal text-xl text-[var(--text-dim)]">
            No orders yet.
          </p>
        )}
        <div className="space-y-4">
          {orders.map((o) => (
            <GlassCard key={o.id}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-data text-xs text-[var(--text-dim)]">
                    #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}
                  </p>
                  <p
                    className="font-terminal text-xl uppercase"
                    style={{ color: STATUS_COLOR[o.status] }}
                  >
                    {o.status}
                  </p>
                </div>
                <p className="font-terminal text-2xl text-[var(--accent-2)]">
                  ₹{o.total}
                </p>
              </div>
              <ul className="font-data text-sm text-[var(--text-dim)] space-y-1">
                {o.order_items?.map((it, idx) => (
                  <li key={idx}>
                    {it.product_name} × {it.quantity} — ₹{it.unit_price}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}

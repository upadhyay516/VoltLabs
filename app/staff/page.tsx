"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StaffDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    async function load() {
      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      const { data: orders, count: orderCount } = await supabase
        .from("orders")
        .select("total", { count: "exact" });
      const revenue = (orders ?? []).reduce((s, o: any) => s + Number(o.total), 0);
      setStats({
        products: productCount ?? 0,
        orders: orderCount ?? 0,
        revenue,
      });
    }
    load();
  }, []);

  return (
    <ProtectedRoute staffOnly>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="font-display text-lg text-[var(--accent-2)] mb-8">
          &gt; STAFF_CONSOLE
        </h1>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <GlassCard>
            <p className="font-data text-xs text-[var(--text-dim)]">PRODUCTS</p>
            <p className="font-terminal text-4xl text-[var(--accent)]">
              {stats.products}
            </p>
          </GlassCard>
          <GlassCard>
            <p className="font-data text-xs text-[var(--text-dim)]">ORDERS</p>
            <p className="font-terminal text-4xl text-[var(--accent)]">
              {stats.orders}
            </p>
          </GlassCard>
          <GlassCard>
            <p className="font-data text-xs text-[var(--text-dim)]">REVENUE</p>
            <p className="font-terminal text-4xl text-[var(--accent-2)]">
              ₹{stats.revenue.toFixed(2)}
            </p>
          </GlassCard>
        </div>

        <div className="flex gap-4">
          <Link href="/staff/products" className="btn-pixel">
            Manage products
          </Link>
          <Link href="/staff/orders" className="btn-pixel-outline">
            Manage orders
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUploader from "@/components/ImageUploader";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  features: string[] | null;
  is_published: boolean;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "arduino",
  stock: "",
  image_url: "",
  features: "",
};

// Shared field shape used by both the "add new" form and the "edit" form.
type FieldsState = typeof emptyForm;

function rowToFields(p: ProductRow): FieldsState {
  return {
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    price: String(p.price),
    category: p.category,
    stock: String(p.stock),
    image_url: p.image_url ?? "",
    features: (p.features ?? []).join(", "),
  };
}

export default function StaffProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FieldsState>(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, description, price, category, stock, image_url, features, is_published"
      )
      .order("created_at", { ascending: false });
    setProducts((data as any) ?? []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct() {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock) || 0,
      image_url: form.image_url || null,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product added");
      setForm(emptyForm);
      loadProducts();
    }
  }

  function startEditing(p: ProductRow) {
    setEditingId(p.id);
    setEditForm(rowToFields(p));
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  async function saveEdit(id: string) {
    if (!editForm.name || !editForm.price) {
      toast.error("Name and price are required");
      return;
    }
    setSavingEdit(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: editForm.name,
        slug: editForm.slug || editForm.name.toLowerCase().replace(/\s+/g, "-"),
        description: editForm.description,
        price: Number(editForm.price),
        category: editForm.category,
        stock: Number(editForm.stock) || 0,
        image_url: editForm.image_url || null,
        features: editForm.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      })
      .eq("id", id);
    setSavingEdit(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product updated");
      cancelEditing();
      loadProducts();
    }
  }

  async function togglePublish(p: ProductRow) {
    await supabase
      .from("products")
      .update({ is_published: !p.is_published })
      .eq("id", p.id);
    loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  const inputClass =
    "bg-transparent border px-3 py-2 font-data w-full";

  return (
    <ProtectedRoute staffOnly>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="font-display text-lg text-[var(--accent-2)] mb-8">
          &gt; MANAGE_PRODUCTS
        </h1>

        <GlassCard className="mb-10">
          <h2 className="font-terminal text-2xl mb-4">Add new build</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Name"
              className={inputClass}
              style={{ borderColor: "var(--border)" }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Price (₹)"
              type="number"
              className={inputClass}
              style={{ borderColor: "var(--border)" }}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <select
              className={inputClass}
              style={{ borderColor: "var(--border)" }}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="arduino" style={{ color: "#111827", background: "#ffffff" }}>Arduino</option>
              <option value="non-arduino" style={{ color: "#111827", background: "#ffffff" }}>Non-Arduino</option>
              <option value="accessory" style={{ color: "#111827", background: "#ffffff" }}>Accessory</option>
            </select>
            <input
              placeholder="Stock quantity"
              type="number"
              className={inputClass}
              style={{ borderColor: "var(--border)" }}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <ImageUploader
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
            />
            <textarea
              placeholder="Description"
              className={`${inputClass} sm:col-span-2`}
              style={{ borderColor: "var(--border)" }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              placeholder="Features, comma separated"
              className={`${inputClass} sm:col-span-2`}
              style={{ borderColor: "var(--border)" }}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </div>
          <button onClick={addProduct} disabled={saving} className="btn-pixel mt-4">
            Add product
          </button>
        </GlassCard>

        <div className="space-y-3">
          {products.map((p) =>
            editingId === p.id ? (
              <GlassCard key={p.id} elevated>
                <h3 className="font-terminal text-xl mb-3 text-[var(--accent)]">
                  Editing: {p.name}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Name"
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Price (₹)"
                    type="number"
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                  />
                  <select
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                  >
                    <option value="arduino" style={{ color: "#111827", background: "#ffffff" }}>Arduino</option>
                    <option value="non-arduino" style={{ color: "#111827", background: "#ffffff" }}>Non-Arduino</option>
                    <option value="accessory" style={{ color: "#111827", background: "#ffffff" }}>Accessory</option>
                  </select>
                  <input
                    placeholder="Stock quantity"
                    type="number"
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                    value={editForm.stock}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stock: e.target.value })
                    }
                  />
                  <ImageUploader
                    value={editForm.image_url}
                    onChange={(url) =>
                      setEditForm({ ...editForm, image_url: url })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    className={`${inputClass} sm:col-span-2`}
                    style={{ borderColor: "var(--border)" }}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                  <input
                    placeholder="Features, comma separated"
                    className={`${inputClass} sm:col-span-2`}
                    style={{ borderColor: "var(--border)" }}
                    value={editForm.features}
                    onChange={(e) =>
                      setEditForm({ ...editForm, features: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => saveEdit(p.id)}
                    disabled={savingEdit}
                    className="btn-pixel"
                  >
                    {savingEdit ? "Saving…" : "Save changes"}
                  </button>
                  <button onClick={cancelEditing} className="btn-pixel-outline">
                    Cancel
                  </button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard key={p.id} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[var(--panel)] pixel-grid flex items-center justify-center shrink-0 overflow-hidden">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="font-display text-[7px] text-[var(--accent)] text-center px-1">
                      no image
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-terminal text-xl">{p.name}</p>
                  <p className="font-data text-xs text-[var(--text-dim)]">
                    {p.category} · ₹{p.price} · stock {p.stock} ·{" "}
                    {p.is_published ? "published" : "hidden"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(p)}
                    className="btn-pixel-outline text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => togglePublish(p)}
                    className="btn-pixel-outline text-xs"
                  >
                    {p.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-xs font-data text-[var(--accent-2)] px-3"
                  >
                    Delete
                  </button>
                </div>
              </GlassCard>
            )
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/cart-context";
import { Product } from "./ProductCard";

export default function AddToCartControls({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border" style={{ borderColor: "var(--border)" }}>
        <button
          className="px-3 py-2 font-terminal text-xl"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="px-4 font-data">{qty}</span>
        <button
          className="px-3 py-2 font-terminal text-xl"
          onClick={() =>
            setQty((q) => {
              if (q >= product.stock) {
                toast.error(`Only ${product.stock} in stock`);
                return q;
              }
              return q + 1;
            })
          }
        >
          +
        </button>
      </div>
      <button
        className="btn-pixel"
        disabled={product.stock <= 0}
        onClick={() => {
          addItem(
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            },
            qty
          );
          toast.success(`Added ${qty} × ${product.name}`);
        }}
      >
        {product.stock > 0 ? "Add to cart" : "Sold out"}
      </button>
    </div>
  );
}

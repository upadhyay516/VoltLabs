import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: product } = await supabase
    .from("products")
    .select("name, price, category")
    .eq("id", params.id)
    .single();

  const name = product?.name ?? "VoltLab Builds";
  const price = product?.price ? `₹${product.price}` : "";
  const category = product?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a12",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#00f0ff", letterSpacing: 2 }}>
          VOLTLAB BUILDS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            marginTop: 20,
            maxWidth: 1000,
            textAlign: "center",
          }}
        >
          {name}
        </div>
        {category && (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#8b8bb0",
              marginTop: 16,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {category}
          </div>
        )}
        {price && (
          <div
            style={{
              display: "flex",
              fontSize: 48,
              color: "#ff2ee6",
              fontWeight: 700,
              marginTop: 24,
            }}
          >
            {price}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

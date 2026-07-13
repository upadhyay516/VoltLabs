import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

// Razorpay has no official typed SDK import here to keep the project
// dependency-light — we call its REST API directly with fetch.
export async function POST(req: NextRequest) {
  try {
    const { amount, items } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Check stock BEFORE opening the payment modal — no point letting
    // someone pay for something that just sold out.
    if (Array.isArray(items) && items.length > 0) {
      const db = supabaseAdmin();
      const { data: products, error: stockErr } = await db
        .from("products")
        .select("id, name, stock")
        .in(
          "id",
          items.map((i: any) => i.id)
        );

      if (stockErr) throw stockErr;

      for (const item of items) {
        const product = products?.find((p) => p.id === item.id);
        if (!product) {
          return NextResponse.json(
            { error: `Product not found: ${item.name}` },
            { status: 400 }
          );
        }
        if (product.stock < item.quantity) {
          return NextResponse.json(
            {
              error:
                product.stock === 0
                  ? `${product.name} just sold out — remove it from your cart.`
                  : `Only ${product.stock} of "${product.name}" left in stock — please lower the quantity.`,
            },
            { status: 409 }
          );
        }
      }
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      // Razorpay expects amount in the smallest currency unit (paise for INR)
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `voltlab_${Date.now()}`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.description || "Razorpay order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

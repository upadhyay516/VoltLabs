import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { sendOrderConfirmation, sendOwnerNewOrderAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      items,
      total,
      shippingName,
      shippingAddress,
      shippingPhone,
    } = await req.json();

    // Recreate Razorpay's HMAC signature and compare — this is what proves
    // the payment actually happened and wasn't forged client-side.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment signature mismatch — verification failed" },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();

    const { data: order, error: orderErr } = await db
      .from("orders")
      .insert({
        user_id,
        status: "paid",
        total,
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        shipping_phone: shippingPhone,
        razorpay_order_id,
        razorpay_payment_id,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    const orderItems = items.map((i: any) => ({
      order_id: order.id,
      product_id: i.id,
      product_name: i.name,
      unit_price: i.price,
      quantity: i.quantity,
    }));

    const { error: itemsErr } = await db.from("order_items").insert(orderItems);
    if (itemsErr) throw itemsErr;

    // Decrement stock for each purchased item. Uses a Postgres function
    // (decrement_stock) so the read-then-write happens atomically in the
    // database, not as two separate round-trips from this server that could
    // race with another concurrent order.
    for (const item of items) {
      const { error: stockErr } = await db.rpc("decrement_stock", {
        p_product_id: item.id,
        p_qty: item.quantity,
      });
      if (stockErr) {
        // Payment already succeeded and the order is already saved — don't
        // fail the whole request over a stock-sync issue, just log it so
        // staff can reconcile manually if it ever happens.
        console.error(`Failed to decrement stock for ${item.id}:`, stockErr);
      }
    }

    // Look up the customer's email (needed for the confirmation email —
    // orders only store user_id, not email, so we ask Supabase Auth admin).
    const { data: userData } = await db.auth.admin.getUserById(user_id);
    const customerEmail = userData?.user?.email;

    if (customerEmail) {
      await sendOrderConfirmation({
        to: customerEmail,
        orderId: order.id,
        items,
        total,
        shippingName,
        shippingAddress,
      });
    }

    await sendOwnerNewOrderAlert({
      orderId: order.id,
      items,
      total,
      shippingName,
      shippingAddress,
      shippingPhone,
    });

    return NextResponse.json({ success: true, order_id: order.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Confirm the caller is actually signed in and actually staff — reading
    // their session from cookies rather than trusting anything the client
    // sends, since this route is what's allowed to email customers.
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "staff") {
      return NextResponse.json({ error: "Staff only" }, { status: 403 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data: order, error } = await db
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("id, user_id")
      .single();

    if (error) throw error;

    const { data: userData } = await db.auth.admin.getUserById(order.user_id);
    const customerEmail = userData?.user?.email;

    if (customerEmail) {
      await sendOrderStatusUpdate({ to: customerEmail, orderId: order.id, status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

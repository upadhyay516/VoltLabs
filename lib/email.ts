import { Resend } from "resend";

// Lazily construct the client so builds don't fail if the env var is
// missing during local dev before you've set up Resend yet.
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_ADDRESS = "VoltLab Builds <onboarding@resend.dev>";
// ^ "onboarding@resend.dev" works immediately with zero setup, but Resend
// stamps a "via resend.dev" note on it. Once you verify your own domain in
// Resend, swap this to e.g. "VoltLab Builds <orders@voltlabbuilds.com>" —
// see docs/EMAIL_SETUP.md.

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

function layout(title: string, bodyHtml: string) {
  // Inline styles only — email clients strip <style> tags and ignore most
  // modern CSS, so this deliberately avoids the site's glassmorphism/Tailwind
  // and just uses plain, compatible table-safe HTML.
  return `
  <div style="background:#0a0a12;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#12121f;border:1px solid #2a2a3d;border-radius:8px;overflow:hidden;">
      <div style="background:#00f0ff;padding:18px 24px;">
        <span style="font-weight:bold;font-size:18px;color:#0a0a12;letter-spacing:0.5px;">VOLTLAB BUILDS</span>
      </div>
      <div style="padding:24px;color:#e8e8ff;">
        <h1 style="font-size:20px;margin:0 0 16px;color:#ffffff;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px;background:#0a0a12;color:#8b8bb0;font-size:12px;">
        VoltLab Builds · Noida, IN · Built for HS, college &amp; uni students
      </div>
    </div>
  </div>`;
}

function itemsTable(items: OrderItem[]) {
  const rows = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3d;color:#e8e8ff;">${i.name} × ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3d;color:#e8e8ff;text-align:right;">₹${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">${rows}</table>`;
}

function extraChargesRows(deliveryCharge: number, reportFee: number) {
  let rows = "";
  if (deliveryCharge > 0) {
    rows += `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3d;color:#8b8bb0;">Delivery</td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3d;color:#8b8bb0;text-align:right;">₹${deliveryCharge.toFixed(2)}</td>
    </tr>`;
  }
  if (reportFee > 0) {
    rows += `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3d;color:#8b8bb0;">Project Report</td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3d;color:#8b8bb0;text-align:right;">₹${reportFee.toFixed(2)}</td>
    </tr>`;
  }
  return rows;
}

export async function sendOrderConfirmation(opts: {
  to: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  deliveryCharge?: number;
  reportFee?: number;
  shippingName: string;
  shippingAddress: string;
}) {
  const html = layout(
    "Order confirmed ✅",
    `
    <p style="color:#c0c0d8;">Hey ${opts.shippingName}, thanks for your order — we're getting it assembled.</p>
    <p style="color:#8b8bb0;font-size:13px;">Order #${opts.orderId.slice(0, 8)}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${itemsTable(opts.items).replace(/<\/?table[^>]*>/g, "")}
      ${extraChargesRows(opts.deliveryCharge ?? 0, opts.reportFee ?? 0)}
    </table>
    <p style="text-align:right;font-size:18px;color:#ff2ee6;font-weight:bold;">Total: ₹${opts.total.toFixed(2)}</p>
    <p style="color:#c0c0d8;margin-top:20px;">Shipping to:<br/>${opts.shippingAddress}</p>
    <p style="color:#8b8bb0;font-size:13px;margin-top:20px;">You can track this order's status anytime from your Orders page on the site.</p>
    `
  );

  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.to,
      subject: `Order confirmed — #${opts.orderId.slice(0, 8)}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

export async function sendOwnerNewOrderAlert(opts: {
  orderId: string;
  items: OrderItem[];
  total: number;
  deliveryCharge?: number;
  reportFee?: number;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
}) {
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  if (!ownerEmail) return;

  const html = layout(
    "🔔 New order received",
    `
    <p style="color:#c0c0d8;">Order #${opts.orderId.slice(0, 8)} just came in.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${itemsTable(opts.items).replace(/<\/?table[^>]*>/g, "")}
      ${extraChargesRows(opts.deliveryCharge ?? 0, opts.reportFee ?? 0)}
    </table>
    <p style="text-align:right;font-size:18px;color:#ff2ee6;font-weight:bold;">Total: ₹${opts.total.toFixed(2)}</p>
    <p style="color:#c0c0d8;margin-top:20px;">
      Ship to: <strong>${opts.shippingName}</strong><br/>
      ${opts.shippingAddress}<br/>
      ${opts.shippingPhone}
    </p>
    `
  );

  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: ownerEmail,
      subject: `New order — ₹${opts.total.toFixed(2)} — #${opts.orderId.slice(0, 8)}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send owner order alert:", err);
  }
}

export async function sendOrderStatusUpdate(opts: {
  to: string;
  orderId: string;
  status: string;
}) {
  const statusCopy: Record<string, string> = {
    processing: "Your order is now being assembled by hand.",
    shipped: "Your order is on its way!",
    completed: "Your order has been delivered. Enjoy building!",
    cancelled: "Your order has been cancelled. If a refund is due, it'll be processed shortly.",
  };

  const html = layout(
    `Order update: ${opts.status.toUpperCase()}`,
    `
    <p style="color:#c0c0d8;">Order #${opts.orderId.slice(0, 8)}</p>
    <p style="color:#e8e8ff;font-size:15px;margin-top:12px;">
      ${statusCopy[opts.status] ?? `Status changed to "${opts.status}".`}
    </p>
    `
  );

  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.to,
      subject: `Order #${opts.orderId.slice(0, 8)} — ${opts.status}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send order status update email:", err);
  }
}

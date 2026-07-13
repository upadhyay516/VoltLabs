# Payment gateway setup — Razorpay

You asked for a free-to-use payment gateway. There's no such thing as a
gateway with zero transaction fees anywhere (someone always processes the
card/UPI rails), but **Razorpay has no setup fee, no monthly fee, and free
test mode** — you only pay ~2% when a real payment actually succeeds. It's
also built for Indian businesses (UPI, cards, netbanking, wallets all work
out of the box), which fits VoltLab Builds being based in India.

If you later want a non-Indian alternative with the same free-to-integrate
model, Stripe works almost identically — the integration pattern below
(create order → open checkout → verify signature) is the same shape either
way.

## 1. Create a Razorpay account
1. Sign up at https://dashboard.razorpay.com/signup
2. You can fully build and test everything in **Test Mode** without any
   business verification. Test mode is free and unlimited.
3. To accept real money later, submit KYC (PAN, bank account, business
   proof) — this is Razorpay's requirement, not a fee.

## 2. Get your API keys
1. Dashboard → **Settings → API Keys → Generate Test Key**.
2. Copy the **Key ID** (starts `rzp_test_...`) into
   `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
3. Copy the **Key Secret** into `RAZORPAY_KEY_SECRET` — this one must never
   be exposed to the browser, which is why it's only read inside
   `app/api/razorpay/*` server routes.

## 3. How the flow works in this codebase
```
Customer clicks "Pay"
        │
        ▼
POST /api/razorpay/create-order   (server creates a Razorpay order, using the secret key)
        │
        ▼
Razorpay's checkout.js modal opens in the browser
        │
        ▼
Customer pays with test card / test UPI
        │
        ▼
POST /api/razorpay/verify   (server re-computes the HMAC signature to confirm
                              the payment is real, then writes the order +
                              order_items rows into Supabase)
```
The signature check in `verify/route.ts` is the important security step —
without it, anyone could call your API and claim they paid without actually
paying.

## 4. Test card / UPI numbers (test mode only)
- Card: `4111 1111 1111 1111`, any future expiry, any CVV.
- UPI: use `success@razorpay` as the UPI ID to simulate a successful payment.
Full list: https://razorpay.com/docs/payments/payments/test-card-upi-details/

## 5. Going live
1. Complete KYC in the Razorpay dashboard.
2. Generate **Live** API keys (Settings → API Keys → Live Mode).
3. Replace the test keys in your production environment variables
   (Vercel/Netlify project settings, not `.env.local`) with the live ones.
4. Nothing else in the code changes — same routes, same flow.

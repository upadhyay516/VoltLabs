<div align="center">

# ⚡ VoltLab Builds

### *Turn breadboard ideas into real builds.*

Hand-assembled Arduino & non-Arduino electronics kits for school, college and university students — built and shipped by real people, not a factory line.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![Instagram](https://img.shields.io/badge/Instagram-@voltlab.builds-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/voltlab.builds/)

</div>

---

## > INSERT_COIN_TO_CONTINUE_

VoltLab Builds is a full e-commerce storefront wrapped in a Y2K/pixel aesthetic — glassmorphism panels, neon glow, chunky pixel buttons, and a parallax hero — built for a real business selling hand-made Arduino and non-Arduino kits (gas leakage detectors, fire detection systems, water level indicators, and more) to students.

This isn't a template. It's a working full-stack app: real authentication, a real database with row-level security, a real payment gateway, and a real staff dashboard — all built with tools that are free to start with.

---

## ✨ Features

| | |
|---|---|
| 🔐 **Google Sign-In** | One-click auth via Supabase, auto-creates a profile on first login |
| 🛒 **Cart & Checkout** | Per-account cart (localStorage-backed), quantity controls, live subtotal |
| 💳 **Razorpay Payments** | Server-verified signature checks — no fake "paid" orders possible |
| 📦 **Order Tracking** | Customers see their order history and live status updates |
| 🧑‍💻 **Staff Console** | Role-gated dashboard — add/edit/publish/delete products, update order status, revenue at a glance |
| 🛡️ **Row Level Security** | Enforced at the *database* level — not just hidden UI. A tampered frontend still can't touch what it shouldn't |
| 🎨 **11 Themes** | Y2K Neon, Midnight Violet, Paper Lab, Slate, Sage, Dusk, Solaris, Aurora, Blossom, Citrus, Obsidian — switchable per-account, saved to your profile |
| 📱 **Mobile-First** | Hamburger nav, responsive grids, and touch-friendly controls that don't break on a phone |
| 🖼️ **Glassmorphism + Parallax** | Frosted glass cards, pixel-grid backdrops, and a floating-chip parallax hero |

---

## 🧱 Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) + TypeScript | Server components, API routes, one deploy target |
| Styling | **Tailwind CSS** | Fast iteration on a fully custom design system |
| Auth + DB | **Supabase** | Free tier, built-in Google OAuth, Postgres + RLS out of the box |
| Payments | **Razorpay** | No setup/monthly fee, free unlimited test mode, built for Indian UPI/cards |
| Hosting | **Vercel** | Zero-config Next.js deploys, generous free tier |

---

## 🚀 Live deployment (Vercel)

This project is deployed on **Vercel**, connected directly to this GitHub repo — every push to `main` auto-redeploys.

### Deploying your own copy

1. **Push to GitHub** (skip if already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. **Import into Vercel**
   - Go to [vercel.com](https://vercel.com) → **Add New → Project**
   - Import your GitHub repo — Vercel auto-detects Next.js, no config needed

3. **Add environment variables** (Project Settings → Environment Variables):

   | Variable | Where to find it |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (keep secret!) |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay → Settings → API Keys |
   | `RAZORPAY_KEY_SECRET` | Razorpay → Settings → API Keys (keep secret!) |
   | `NEXT_PUBLIC_SITE_URL` | Your Vercel URL, e.g. `https://voltlab-builds.vercel.app` |

4. **Click Deploy** — build takes ~1–2 minutes.

5. **Update Supabase redirect URLs** so Google login works in production:
   - Supabase → Authentication → URL Configuration
   - Set **Site URL** and add a **Redirect URL** for `https://<your-vercel-url>/auth/callback`

6. **Push updates any time**:
   ```bash
   git add .
   git commit -m "your change"
   git push
   ```
   Vercel picks up the push automatically — no manual redeploy needed.

> Prefer Netlify instead? See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the equivalent steps.

---

## 🛠️ Local development

```bash
npm install
cp .env.local.example .env.local   # fill in real values, see docs/ below
npm run dev
```
Open **http://localhost:3000**.

---

## 📚 Setup guides

| Guide | Covers |
|---|---|
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) | Creating the project, running the schema, enabling Google login, promoting an account to staff |
| [`docs/PAYMENT_SETUP.md`](docs/PAYMENT_SETUP.md) | Razorpay keys, test cards/UPI, how the signature-verification flow works |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Full Vercel *and* Netlify deployment walkthroughs, post-deploy checklist |

---

## 🗂️ Project structure

```
app/                  Next.js App Router pages + API routes
  api/razorpay/       create-order & verify server routes (signature-checked)
  auth/callback/      Google OAuth redirect handler
  products/           catalog + product detail pages
  cart/ checkout/     shopping flow
  orders/             customer order history
  account/            username / password / theme settings
  staff/              staff-only dashboard, product & order management
components/           Navbar, ProductCard, GlassCard, ParallaxHero, RazorpayButton…
lib/                  Supabase clients, auth / cart / theme React contexts
supabase/schema.sql   full DB schema + RLS policies + seed products
docs/                 setup guides referenced above
```

---

## 🔒 Security notes

- Every table (`profiles`, `products`, `orders`, `order_items`) has **Row Level Security** enabled — customers can only read/write their own data, and only accounts with `role = 'staff'` can manage products or order statuses. This is enforced by Postgres itself, not the frontend.
- The Razorpay **Key Secret** and Supabase **service role key** are only ever read inside server-side API routes (`app/api/**`) — never shipped to the browser.
- Payment confirmation re-computes Razorpay's HMAC signature server-side before an order is ever written to the database, so a tampered client request can't fake a "successful" payment.

---

<div align="center">

Built for HS, college & uni students · 📍 Noida, IN

[Instagram](https://www.instagram.com/voltlab.builds/) · DM to order

</div>

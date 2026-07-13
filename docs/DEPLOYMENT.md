# Deploying VoltLab Builds

Recommendation: **Vercel**, because this is a Next.js app (Vercel made
Next.js, so App Router features, API routes, and edge middleware all work
with zero extra config). Netlify works too — steps for both below.

## Option A — Vercel (recommended)
1. Push this project to a GitHub repo.
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. Vercel auto-detects Next.js, no build settings needed.
4. Before deploying, add environment variables (**Settings → Environment
   Variables**), same names as `.env.local.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_SITE_URL` → your production URL, e.g.
     `https://voltlabbuilds.vercel.app`
5. Click **Deploy**.
6. Back in Supabase → **Authentication → URL Configuration**, add your
   production URL to **Site URL** and **Redirect URLs**
   (`https://voltlabbuilds.vercel.app/auth/callback`), otherwise Google
   login will redirect to the wrong place.
7. Back in Google Cloud Console → your OAuth client → **Authorized redirect
   URIs**, this stays as Supabase's callback URL (unchanged) — you don't
   need to add your Vercel URL there, only in Supabase.

## Option B — Netlify
1. Push to GitHub, then **Add new site → Import an existing project** in
   Netlify.
2. Install the Next.js Runtime plugin (Netlify offers to add
   `@netlify/plugin-nextjs` automatically when it detects Next.js — accept
   it, since API routes need it to work as serverless functions).
3. Add the same environment variables as above under **Site settings →
   Environment variables**.
4. Deploy, then update Supabase's Site URL/Redirect URLs to your Netlify
   domain, same as step 6 above.

## Custom domain
Both platforms let you add a custom domain for free (you pay only for the
domain registration itself, e.g. via Namecheap/GoDaddy) — just point your
domain's DNS to the records Vercel/Netlify give you, then repeat the
Supabase Site URL / Redirect URL update with your final domain.

## Post-deploy checklist
- [ ] Sign in with Google on the live URL — confirm redirect works
- [ ] Promote your own account to `staff` via the SQL snippet in
      `SUPABASE_SETUP.md`
- [ ] Add a real product with a real image URL from Staff Console
- [ ] Run one test-mode payment end-to-end
- [ ] Switch Razorpay + env vars to live keys when ready to accept real money

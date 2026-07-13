# Supabase setup

Supabase gives you the database, Google login, and row-level security for
free on its Free tier (2 projects, 500MB DB, 50k monthly active users).

## 1. Create the project
1. Go to https://supabase.com → **New project**.
2. Pick a name (`voltlab-builds`), a strong database password (save it), and
   the region closest to your users (Mumbai/`ap-south-1` for India).
3. Wait ~2 minutes for provisioning.

## 2. Run the schema
1. In the left sidebar, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` (included in this
   project) and click **Run**.
3. This creates: `profiles`, `products`, `orders`, `order_items`, Row Level
   Security policies for each, a trigger that auto-creates a profile on
   signup, and 10 seed products matching your Instagram catalog.

## 3. Turn on Google login
1. Go to **Authentication → Providers → Google**.
2. You need a Google OAuth Client ID/Secret:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create an **OAuth client ID** → Application type: **Web application**.
   - Under **Authorized redirect URIs**, add the callback URL Supabase shows
     you on the same screen (looks like
     `https://YOUR-PROJECT.supabase.co/auth/v1/callback`).
   - Copy the generated Client ID and Client Secret back into Supabase's
     Google provider screen, and toggle it **on**.
3. Also add your production domain later (Step in DEPLOYMENT.md).

## 4. Grab your API keys
1. Go to **Settings → API**.
2. Copy the **Project URL** and the **anon public key** into your
   `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Copy the **service_role key** (keep this secret, never expose it to the
   browser) into `SUPABASE_SERVICE_ROLE_KEY`. It's only used inside the
   `/api/razorpay/verify` server route to write orders after payment.

## 5. Make your own account "staff"
1. Run the app locally (or in production) and sign in once with Google —
   this auto-creates your profile row with `role = 'customer'`.
2. Back in Supabase → **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'staff'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
3. Refresh the site — you'll now see the **Staff Console** link in the navbar,
   which lets you add/edit/publish products and update order statuses.

## 6. How the data access rules work
Every table has Row Level Security turned on, so:
- Anyone (even logged out) can read **published** products.
- Only signed-in users can create orders, and only for themselves.
- Only profiles with `role = 'staff'` can add/edit/delete products or change
  order status — enforced in the database itself, not just hidden UI.

## Managing products day-to-day
You don't need to touch SQL for regular catalog updates — the **Staff
Console → Manage products** page in the app lets you add, publish/unpublish,
and delete builds directly. Use SQL only for bulk imports or one-off fixes.

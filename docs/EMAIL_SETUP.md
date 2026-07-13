# Email notifications setup (Resend)

Three emails now go out automatically:

| When | Who gets it |
|---|---|
| Payment succeeds | Customer gets an order confirmation |
| Payment succeeds | You (the owner) get a "new order" alert |
| Staff changes an order's status | Customer gets a status update |

This uses **Resend** — free for up to 3,000 emails/month (100/day), no
credit card required to start.

## 1. Create a Resend account
1. Go to **https://resend.com/signup**
2. Sign up (GitHub or email)

## 2. Get your API key
1. Dashboard → **API Keys** → **Create API Key**
2. Name it `voltlab-builds`, leave permissions as **Full access**
3. Copy the key (starts with `re_...`) — shown only once

## 3. Add to your environment variables
In `.env.local` (and later, Vercel's environment variables):
```
RESEND_API_KEY=re_your_actual_key
OWNER_NOTIFICATION_EMAIL=biz.voltlab@gmail.com
```
`OWNER_NOTIFICATION_EMAIL` is whichever inbox you want new-order alerts sent
to — doesn't have to match any Supabase/Google account.

## 4. That's it for testing
Out of the box, emails send from `onboarding@resend.dev` — Resend's shared
sending address that works immediately with zero domain setup, capped at
100 emails/day. Good enough to fully test the flow right now.

## 5. (Later) Use your own domain for sending
Once you have a custom domain for the business:
1. Resend dashboard → **Domains** → **Add Domain**
2. Enter your domain (e.g. `voltlabbuilds.com`)
3. Add the DNS records Resend shows you (in whichever service you bought the
   domain from — GoDaddy, Namecheap, etc.)
4. Once verified, open `lib/email.ts` and change:
   ```ts
   const FROM_ADDRESS = "VoltLab Builds <onboarding@resend.dev>";
   ```
   to:
   ```ts
   const FROM_ADDRESS = "VoltLab Builds <orders@voltlabbuilds.com>";
   ```
   This removes the "via resend.dev" note Gmail shows and raises your
   sending limits.

## Testing it
1. Place a test order end-to-end (Razorpay test mode) using an email you
   can actually check
2. You should get both the customer confirmation and (separately, in your
   `OWNER_NOTIFICATION_EMAIL` inbox) the new-order alert
3. As staff, change that order's status in **Staff Console → Manage
   Orders** — the customer should get a status-update email

## Notes
- If `RESEND_API_KEY` isn't set, email sending fails silently (logged to
  the server console) rather than breaking checkout — so it's safe to
  deploy before setting this up, orders will still go through.
- Emails use plain, inline-styled HTML (not the site's Tailwind/glass
  design) since most email clients strip modern CSS — this is normal and
  expected for transactional email.

import { createClient } from "@supabase/supabase-js";

// Server-side client using the service role key. NEVER import this in
// client components — it bypasses Row Level Security. Only use it inside
// app/api/** route handlers.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

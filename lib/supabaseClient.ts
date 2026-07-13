import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Single browser-side Supabase client, reused across the app.
// Using the auth-helpers client (rather than a plain @supabase/supabase-js
// client) is what matters here: it stores the session in cookies as well
// as localStorage, which is required for server-side API routes (like
// /api/orders/update-status) to be able to read "who's signed in" via
// createRouteHandlerClient. A plain client only writes to localStorage,
// which the server can never see.
export const supabase = createClientComponentClient();

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/** Lazily create the admin client (read envs at call time, not import time). */
export function getSupabaseAdmin(): SupabaseClient {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL; // fallback so builds don’t crash if only public is present

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing SUPABASE_URL');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, key, { auth: { persistSession: false } });
}

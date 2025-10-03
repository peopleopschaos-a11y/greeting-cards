cat > route.ts <<'EOF'
import { supabaseAdmin } from './lib/supabaseAdmin';

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ ok: false, reason: 'Missing Supabase env vars' }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

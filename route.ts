import { supabaseAdmin } from './lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing ?id' }), { status: 400 });
    if (!supabaseAdmin) return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500 });

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, credits_remaining, referral_code, referred_by, updated_at, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    if (!data) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    return new Response(JSON.stringify({ user: data }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

npm run dev


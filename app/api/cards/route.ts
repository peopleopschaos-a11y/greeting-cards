import { supabaseAdmin } from '../../../lib/supabaseAdmin';

/** GET /api/cards – list recent public cards */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('cards')
    .select('id, title, message, image_url, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true, data }), { status: 200 });
}

/** POST /api/cards – TEMP admin-only create (guarded by a secret header) */
export async function POST(req: Request) {
  const secret = process.env.CARDS_ADMIN_SECRET;
  if (!secret || req.headers.get('x-admin-secret') !== secret) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401 });
  }

  try {
    const { title, message, image_url, is_public = true } = await req.json();

    if (!title || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'title and message are required' }), { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('cards')
      .insert([{ title, message, image_url, is_public }])
      .select('id, title, message, image_url, created_at')
      .single();

    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ ok: true, data }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? 'unknown error' }), { status: 500 });
  }
}
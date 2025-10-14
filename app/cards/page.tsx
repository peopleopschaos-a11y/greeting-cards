import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Card = {
  id: string;
  title: string;
  message: string;
  image_url?: string | null;
  created_at: string;
};

export default async function CardsPage() {
  const res = await fetch('/api/cards', { cache: 'no-store' });
  const json = await res.json();
  const cards: Card[] = json?.data ?? [];

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 20 }}>
      <h1 style={{ marginBottom: 16 }}>Public Cards</h1>
      {cards.length === 0 && <p>No cards yet. Add one via POST and refresh.</p>}

      <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
        {cards.map((c) => (
          <li key={c.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <h3 style={{ margin: '0 0 8px' }}>{c.title}</h3>
            <p style={{ margin: '0 0 8px' }}>{c.message}</p>
            {typeof c.image_url === 'string' && c.image_url.startsWith('http') ? (
              <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56%' }}>
                <Image
                  src={c.image_url}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 100vw, 720px"
                  style={{ objectFit: 'cover', borderRadius: 6 }}
                  priority={false}
                />
              </div>
            ) : null}
            <small style={{ color: '#666' }}>
              {new Date(c.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
}

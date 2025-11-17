import Link from 'next/link';

async function getItems() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/items`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export default async function ItemsPage() {
    const items = await getItems();
    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Items</h1>
                <Link href="/items/new" className="bg-blue-600 text-white px-3 py-2 rounded">Buat Baru</Link>
            </div>

            <ul className="mt-4 space-y-3">
                {items.length === 0 && <p>Tidak ada item.</p>}
                {items.map((it: any) => (
                    <li key={it.id} className="border p-3 rounded">
                        <Link href={`/items/${it.id}`} className="font-semibold">{it.title}</Link>
                        <p className="text-sm text-gray-600">{new Date(it.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}

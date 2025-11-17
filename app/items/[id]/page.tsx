'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ItemDetail() {
    const params = useParams();
    const id = params?.id;
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/items/${id}`)
            .then((r) => r.json())
            .then((data) => setItem(data))
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        if (!id) return;
        if (!confirm('Hapus item ini?')) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal menghapus');
            router.push('/items');
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setDeleting(false);
        }
    }

    if (loading) return <p className="p-6">Memuat...</p>;
    if (!item || item?.error) return <p className="p-6 text-red-600">Item tidak ditemukan.</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <p className="mt-2">{item.content}</p>

            <div className="mt-4 flex gap-2">
                <Link href={`/items/${id}/edit`} className="px-3 py-2 bg-yellow-500 rounded">Edit</Link>
                <button onClick={handleDelete} disabled={deleting} className="px-3 py-2 bg-red-600 text-white rounded">
                    {deleting ? 'Menghapus...' : 'Hapus'}
                </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </main>
    );
}

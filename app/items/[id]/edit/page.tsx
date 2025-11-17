'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditItemPage() {
    const params = useParams();
    const id = params?.id;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/items/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data?.id) {
                    setTitle(data.title || '');
                    setContent(data.content || '');
                } else {
                    setError('Item tidak ditemukan');
                }
            })
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!id) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (!res.ok) throw new Error('Gagal mengupdate');
            router.push(`/items/${id}`);
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p className="p-6">Memuat...</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Edit Item</h1>
            <form onSubmit={handleSubmit} className="mt-4 max-w-md">
                <label className="block">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
                <label className="block mt-3">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border p-2 rounded" />
                {error && <p className="text-red-600 mt-2">{error}</p>}
                <button type="submit" disabled={saving} className="mt-3 px-4 py-2 rounded bg-amber-600 text-white">
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </form>
        </main>
    );
}

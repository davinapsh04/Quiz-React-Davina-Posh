'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewItemPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (!res.ok) throw new Error('Gagal membuat item');
            setTitle('');
            setContent('');
            router.push('/items');
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Buat Item Baru</h1>
            <form onSubmit={handleSubmit} className="mt-4 max-w-md">
                <label className="block">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
                <label className="block mt-3">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border p-2 rounded" />
                {error && <p className="text-red-600 mt-2">{error}</p>}
                <button type="submit" disabled={loading} className="mt-3 px-4 py-2 rounded bg-blue-600 text-white">
                    {loading ? 'Menyimpan...' : 'Buat'}
                </button>
            </form>
        </main>
    );
}

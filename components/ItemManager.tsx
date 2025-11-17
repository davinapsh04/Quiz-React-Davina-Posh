'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Item = {
    id: string
    title: string
    tag?: string
    note?: string
    favorite?: boolean
    createdAt: number
}

const STORAGE_KEY = 'dapcopItems'
const SAMPLE: Item[] = [
    { id: 's1', title: 'Surf Session', tag: '🏄‍♀️ Surf', note: 'Sunrise, sunset and small waves.', favorite: true, createdAt: Date.now() - 1000 * 60 * 60 * 24 },
    { id: 's2', title: 'Beach Bum', tag: '☀️ Sunbum', note: 'Use sunscreen and bring some snackiee.', favorite: false, createdAt: Date.now() - 1000 * 60 * 60 * 48 },
    { id: 's3', title: 'Mancing Mania', tag: '🎣Fishing', note: 'Go get some nice fissshh.', favorite: false, createdAt: Date.now() - 1000 * 60 * 60 * 72 }
]

const TAGS = ['🏄‍♀️ Surf', '🎣Fishing', '☀️ Sunbum', '📷 Photo', '🍴 Food']

export default function ItemManager() {
    const [items, setItems] = useState<Item[]>([])
    const [title, setTitle] = useState('')
    const [tag, setTag] = useState(TAGS[0])
    const [note, setNote] = useState('')
    const [query, setQuery] = useState('')
    const [filterTag, setFilterTag] = useState('')

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                setItems(JSON.parse(raw))
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE))
                setItems(SAMPLE)
            }
        } catch (e) {
            console.error('Yahh! Gagal load localStorage', e)
        }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch (e) {
            console.error('Yahh! Gagal simpan localStorage', e)
        }
    }, [items])

    function addItem(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!title.trim()) return
        const newItem: Item = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            title: title.trim(),
            tag: tag,
            note: note.trim(),
            favorite: false,
            createdAt: Date.now()
        }
        setItems(prev => [newItem, ...prev])
        setTitle(''); setNote(''); setTag(TAGS[0])
    }

    function deleteItem(id: string) {
        if (!confirm('Yakin u mau apus note ini?')) return
        setItems(prev => prev.filter(i => i.id !== id))
    }

    function toggleFavorite(id: string) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i))
    }

    const filtered = items.filter(i => {
        const matchesQuery = !query || i.title.toLowerCase().includes(query.toLowerCase()) || (i.note || '').toLowerCase().includes(query.toLowerCase())
        const matchesTag = !filterTag || i.tag === filterTag
        return matchesQuery && matchesTag
    }).sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt)

    return (
        <div>
            <div className="card card-beach mb-4 p-3">
                <div className="card-body">
                    <h5 className="card-title">Tambah Notes</h5>
                    <form onSubmit={addItem}>
                        <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                                <input className="form-control" placeholder="Judul (ex: Early Surf)" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <select className="form-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 d-grid">
                                <button type="submit" className="btn btn-pink">Tambah Item</button>
                            </div>
                        </div>

                        <div className="mt-2">
                            <textarea className="form-control" rows={3} placeholder="Lil notes. Type here..." value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>
                    </form>
                </div>
            </div>

            <div className="mb-3 d-flex gap-2 flex-row flex-wrap">
                <input className="form-control me-2" style={{ maxWidth: 240 }} placeholder="Cari..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="form-select" style={{ maxWidth: 180 }} value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
                    <option value=''>Filter</option>
                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button className="btn btn-outline-secondary" onClick={() => { setQuery(''); setFilterTag('') }}>Reset</button>
            </div>

            <div className="row gx-3 gy-3">
                {filtered.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-info small-muted">Based on filter, gaada notesnya.</div>
                    </div>
                )}

                {filtered.map(item => (
                    <div key={item.id} className="col-sm-6 col-lg-4">
                        <div className="card card-beach h-100 hover-raise">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="card-title mb-1">{item.title}</h6>
                                        <p className="mb-1 small-muted">{item.tag}</p>
                                    </div>
                                    <div className="text-end">
                                        <button className="btn btn-sm btn-link" onClick={() => toggleFavorite(item.id)} title="Toggle favorite">{item.favorite ? '⭐' : '☆'}</button>
                                        <small className="text-muted d-block">{new Date(item.createdAt).toLocaleDateString()}</small>
                                    </div>
                                </div>
                                <p className="flex-grow-1">{item.note ? item.note : <em className="small-muted">(tidak ada deskripsi)</em>}</p>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <Link href={`/list/${item.id}`} className="btn btn-sm btn-outline-primary">Detail</Link>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item.id)}>Hapus</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Item = { id: string; title: string; tag?: string; note?: string; favorite?: boolean; createdAt: number }
const STORAGE_KEY = 'dapcopItems'

export default function DetailPage() {
    const params = useParams()
    const id = params?.id as string | undefined

    const [item, setItem] = useState<Item | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            const items: Item[] = raw ? JSON.parse(raw) : []
            const found = items.find(i => i.id === id) ?? null
            setItem(found)
        } catch (e) {
            console.error(e)
            setItem(null)
        } finally {
            setLoading(false)
        }
    }, [id])

    if (!id) return <div className="small-muted">Invalid id.</div>
    if (loading) return <div className="small-muted">Memuat...</div>
    if (!item) return (
        <div>
            <div className="alert alert-warning">Catatan tidak ditemukan.</div>
            <Link href="/list" className="btn btn-pink">Kembali ke List</Link>
        </div>
    )

    return (
        <div>
            <div className="mb-3 d-flex justify-content-between align-items-start">
                <div>
                    <h3 className="header-title">{item.title} {item.favorite ? '⭐' : ''}</h3>
                    <small className="small-muted">{item.tag ? item.tag + ' • ' : ''}{new Date(item.createdAt).toLocaleString()}</small>
                </div>
            </div>

            <div className="card card-beach mb-3">
                <div className="card-body">
                    <p>{item.note ?? <em>Tidak ada deskripsi</em>}</p>
                    <div className="mt-3">
                        <Link href="/list" className="btn btn-pink me-2">Kembali</Link>
                        <button className="btn btn-outline-danger" onClick={() => {
                            if (!confirm('Hapus note ini?')) return
                            try {
                                const raw = localStorage.getItem(STORAGE_KEY)
                                const items: Item[] = raw ? JSON.parse(raw) : []
                                const next = items.filter(i => i.id !== item.id)
                                localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
                                window.location.href = '/list'
                            } catch (e) {
                                console.error(e)
                                alert('Gagal menghapus')
                            }
                        }}>Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

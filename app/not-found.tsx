export default function NotFound() {
    return (
        <main className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center p-8 rounded-2xl shadow-lg bg-white/80">
                <h1 className="text-4xl font-bold mb-2">404</h1>
                <p className="mb-4">Halaman tidak ditemukan.</p>
                <a href="/" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">Kembali ke Beranda</a>
            </div>
        </main>
    );
}

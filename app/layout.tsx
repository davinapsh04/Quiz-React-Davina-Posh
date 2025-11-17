import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Summer Notes - Davina Posh'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="page-wrap with-bg">
          <header className="site-header">
            <div className="container d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center gap-3">
                <img src="/beach.png" alt="logo" width={50} height={50} style={{ borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <h1 className="m-0 site-title">Beach Surf Notes</h1>
                  <div className="small-muted">Davina Posh • 535240145</div>
                </div>
              </div>

              <nav className="nav-actions">
                <a className="btn btn-home me-2" href="/">Home</a>
                <a className="btn btn-pink" href="/list">My Notes</a>
              </nav>
            </div>

            <div className="wave-divider" aria-hidden></div>
          </header>

          <main className="container content-area py-4">
            {children}
          </main>

          <footer className="text-center py-4 small-muted">
            © {new Date().getFullYear()} Summer Notes — Dapcop
          </footer>
        </div>
      </body>
    </html>
  )
}

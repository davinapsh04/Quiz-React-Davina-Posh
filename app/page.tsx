import Link from 'next/link'

export default function Home() {
  return (
    <section>
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="card card-beach p-4 mb-3">
            <h2 className="header-title">Summer Notes</h2>
            <p className="lead small-muted">Drop your daily notes here!</p>
            <Link href="/list" className="btn btn-pink btn-lg mt-2">Open My Notes</Link>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card card-beach p-3 text-center">
            <div className="beach-visual p-3">
              <div className="sun"></div>
              <div className="surfboard">🏄‍♀️</div>
            </div>
            <p className="small-muted mt-2">Have Fun Fellaz!</p>
            <ul className="list-unstyled">
              <li><strong>Nama:</strong> Davina Posh</li>
              <li><strong>NIM:</strong> 535240145</li>
              <li><strong>Topik:</strong> Beach / Summer </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

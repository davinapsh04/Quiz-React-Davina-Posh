import ItemManager from '../../components/ItemManager'
import Link from 'next/link'

export default function ListPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0 header-title">My Summer Notes</h2>
          <small className="small-muted">Beach · summer · surf </small>
        </div>
        <Link href="/" className="btn btn-outline-secondary">Kembali Home</Link>
      </div>

      <ItemManager />
    </div>
  )
}

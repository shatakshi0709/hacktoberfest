import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mc-panel p-6">
        <div className="text-lg font-semibold">Page not found</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted))]">
          The page you requested doesn’t exist.
        </div>
        <div className="mt-4">
          <Link to="/iss" className="mc-button">
            <ArrowLeft className="h-4 w-4" />
            Go to ISS Tracking
          </Link>
        </div>
      </div>
    </div>
  )
}


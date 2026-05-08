import { Link, NavLink } from 'react-router-dom'
import { Menu, Orbit, Radar } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useUiStore } from '../store/uiStore'

function navCls({ isActive }: { isActive: boolean }) {
  return [
    'rounded-xl px-3 py-2 text-sm transition',
    isActive
      ? 'bg-[rgb(var(--panel-2))] text-[rgb(var(--text))]'
      : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--panel-2))]/70 hover:text-[rgb(var(--text))]',
  ].join(' ')
}

export function Navbar() {
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="mc-button lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link to="/" className="group flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--panel-2))]">
              <Orbit className="h-5 w-5 text-[rgb(var(--accent))]" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Mission Control</div>
              <div className="text-xs text-[rgb(var(--muted))]">
                Real-time ISS & News intelligence
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/iss" className={navCls}>
            ISS Tracking
          </NavLink>
          <NavLink to="/news" className={navCls}>
            News
          </NavLink>
          <NavLink to="/ai" className={navCls}>
            AI Assistant
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="mc-chip hidden md:inline-flex">
            <Radar className="h-3.5 w-3.5 text-[rgb(var(--accent))]" />
            <span>Live telemetry</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}


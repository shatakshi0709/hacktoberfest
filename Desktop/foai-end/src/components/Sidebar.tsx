import { NavLink } from 'react-router-dom'
import { Bot, Newspaper, Satellite } from 'lucide-react'

function itemCls({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-3 rounded-xl border px-4 py-3 transition',
    isActive
      ? 'border-transparent bg-[rgb(var(--panel-2))] text-[rgb(var(--text))]'
      : 'border-[rgb(var(--border))] bg-[rgb(var(--panel))]/50 text-[rgb(var(--muted))] hover:bg-[rgb(var(--panel-2))]/70 hover:text-[rgb(var(--text))]',
  ].join(' ')
}

export function Sidebar() {
  return (
    <div className="mc-panel-glass p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
        Modules
      </div>
      <div className="grid gap-2">
        <NavLink to="/iss" className={itemCls}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--panel-2))]">
            <Satellite className="h-5 w-5 text-[rgb(var(--accent))]" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[rgb(var(--text))]">ISS Live Tracking</div>
            <div className="truncate text-xs">Orbit, speed, trajectory & crew</div>
          </div>
        </NavLink>

        <NavLink to="/news" className={itemCls}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--panel-2))]">
            <Newspaper className="h-5 w-5 text-[rgb(var(--accent-2))]" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[rgb(var(--text))]">News Dashboard</div>
            <div className="truncate text-xs">Search, sort & intelligence briefs</div>
          </div>
        </NavLink>

        <NavLink to="/ai" className={itemCls}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--panel-2))]">
            <Bot className="h-5 w-5 text-[rgb(var(--ok))]" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[rgb(var(--text))]">AI Chatbot</div>
            <div className="truncate text-xs">Answers only from dashboard data</div>
          </div>
        </NavLink>
      </div>

      <div className="mt-4 border-t border-[rgb(var(--border))] pt-4 text-xs text-[rgb(var(--muted))]">
        Tip: Use the auto-refresh toggle to pause telemetry polling.
      </div>
    </div>
  )
}


import type { ReactNode } from 'react'

type Props = {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: ReactNode
}

export function StatCard({ label, value, hint, icon }: Props) {
  return (
    <div className="mc-panel-glass p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            {label}
          </div>
          <div className="mt-2 truncate text-2xl font-semibold tracking-tight">{value}</div>
        </div>
        {icon ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-3">
            {icon}
          </div>
        ) : null}
      </div>
      {hint ? <div className="mt-3 text-sm text-[rgb(var(--muted))]">{hint}</div> : null}
    </div>
  )
}


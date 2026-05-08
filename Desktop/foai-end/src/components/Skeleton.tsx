import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/60',
        className,
      )}
    />
  )
}


import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  right?: ReactNode
}

export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <motion.h1
          className="truncate text-2xl font-semibold tracking-tight sm:text-3xl"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            className="mt-1 text-sm text-[rgb(var(--muted))]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}


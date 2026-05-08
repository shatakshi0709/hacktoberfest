import { useEffect, useRef } from 'react'
import { useIssStore } from '../store/issStore'

const INTERVAL_MS = 15000

export function useIssPolling() {
  const autoRefresh = useIssStore((s) => s.autoRefresh)
  const refreshIss = useIssStore((s) => s.refreshIss)
  const refreshAstros = useIssStore((s) => s.refreshAstros)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    void refreshIss({ silent: true })
    void refreshAstros({ silent: true })
  }, [refreshIss, refreshAstros])

  useEffect(() => {
    if (!autoRefresh) return
    const id = window.setInterval(() => {
      void refreshIss({ silent: true })
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [autoRefresh, refreshIss])
}


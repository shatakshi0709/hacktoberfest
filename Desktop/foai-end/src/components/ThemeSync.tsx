import { useEffect } from 'react'
import { syncThemeToDom, useUiStore } from '../store/uiStore'

export function ThemeSync() {
  const theme = useUiStore((s) => s.theme)
  useEffect(() => {
    syncThemeToDom(theme)
  }, [theme])
  return null
}


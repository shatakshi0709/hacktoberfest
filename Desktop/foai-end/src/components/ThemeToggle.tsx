import { Moon, Sun } from 'lucide-react'
import { useUiStore } from '../store/uiStore'

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme)
  const toggle = useUiStore((s) => s.toggleTheme)

  return (
    <button type="button" className="mc-button" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <>
          <Moon className="h-4 w-4 text-[rgb(var(--muted))]" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-[rgb(var(--muted))]" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  )
}


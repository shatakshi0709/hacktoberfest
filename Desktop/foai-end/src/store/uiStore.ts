import { create } from 'zustand'

export type ThemeMode = 'dark' | 'light'

type UiState = {
  theme: ThemeMode
  sidebarOpen: boolean
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
}

const THEME_KEY = 'mc_theme'

function readInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersLight =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)')?.matches
  return prefersLight ? 'light' : 'dark'
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: readInitialTheme(),
  sidebarOpen: false,
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme)
    set({ theme })
  },
  toggleTheme: () => {
    const next: ThemeMode = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, next)
    set({ theme: next })
  },
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

export function syncThemeToDom(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
}


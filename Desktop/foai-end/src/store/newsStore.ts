import { create } from 'zustand'
import toast from 'react-hot-toast'
import { fetchNews, type NewsArticle } from '../services/newsService'

export type NewsSort = 'date' | 'source'

type NewsState = {
  articles: NewsArticle[]
  isLoading: boolean
  lastError?: string
  lastFetchedAt?: number
  query: string
  sortBy: NewsSort
  activeSource?: string

  setQuery: (q: string) => void
  setSortBy: (s: NewsSort) => void
  setActiveSource: (source?: string) => void
  refresh: (opts?: { silent?: boolean }) => Promise<void>
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  isLoading: false,
  query: '',
  sortBy: 'date',

  setQuery: (q) => set({ query: q }),
  setSortBy: (s) => set({ sortBy: s }),
  setActiveSource: (source) => set({ activeSource: source }),

  refresh: async (opts) => {
    const silent = opts?.silent ?? false
    set({ isLoading: true, lastError: undefined })
    try {
      const { query, sortBy } = get()
      const data = await fetchNews({ q: query, sortBy })
      set({ articles: data, lastFetchedAt: Date.now() })
      if (!silent) toast.success('News updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load news'
      set({ lastError: msg })
      toast.error(msg)
    } finally {
      set({ isLoading: false })
    }
  },
}))


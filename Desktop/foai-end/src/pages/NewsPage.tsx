import { RefreshCcw, Search, SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useEffect } from 'react'
import { useNewsStore } from '../store/newsStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { Skeleton } from '../components/Skeleton'
import { NewsArticleCard } from '../components/NewsArticleCard'

export function NewsPage() {
  const query = useNewsStore((s) => s.query)
  const sortBy = useNewsStore((s) => s.sortBy)
  const setQuery = useNewsStore((s) => s.setQuery)
  const setSortBy = useNewsStore((s) => s.setSortBy)
  const refresh = useNewsStore((s) => s.refresh)
  const isLoading = useNewsStore((s) => s.isLoading)
  const articles = useNewsStore((s) => s.articles)
  const activeSource = useNewsStore((s) => s.activeSource)
  const setActiveSource = useNewsStore((s) => s.setActiveSource)

  const dq = useDebouncedValue(query, 350)

  useEffect(() => {
    void refresh({ silent: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void refresh({ silent: true })
  }, [dq, sortBy, refresh])

  const sources = Array.from(new Set(articles.map((a) => a.source))).sort()
  const filtered = activeSource ? articles.filter((a) => a.source === activeSource) : articles

  return (
    <div className="space-y-6">
      <PageHeader
        title="News Dashboard"
        subtitle="Search, sort, and refresh. Cached in localStorage for 15 minutes."
        right={
          <button type="button" className="mc-button-primary" onClick={() => refresh()} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <div className="mc-panel-glass p-5">
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/60 px-3 py-2">
            <Search className="h-4 w-4 text-[rgb(var(--muted))]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[rgb(var(--muted))]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="mc-chip">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[rgb(var(--muted))]" />
              <span>Sort</span>
            </div>
            <button
              type="button"
              className={sortBy === 'date' ? 'mc-button-primary' : 'mc-button'}
              onClick={() => setSortBy('date')}
            >
              Date
            </button>
            <button
              type="button"
              className={sortBy === 'source' ? 'mc-button-primary' : 'mc-button'}
              onClick={() => setSortBy('source')}
            >
              Source
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
            <div className="mc-chip">Filter</div>
            <button
              type="button"
              className={!activeSource ? 'mc-button-primary' : 'mc-button'}
              onClick={() => setActiveSource(undefined)}
            >
              All
            </button>
            {sources.slice(0, 4).map((s) => (
              <button
                key={s}
                type="button"
                className={activeSource === s ? 'mc-button-primary' : 'mc-button'}
                onClick={() => setActiveSource(s)}
                title={s}
              >
                {s.length > 16 ? `${s.slice(0, 16)}…` : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && articles.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <NewsArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}


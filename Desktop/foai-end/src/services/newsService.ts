import { http } from './http'
import { getCache, setCache } from '../utils/storage'
import { withRetry } from '../utils/retry'

export type NewsArticle = {
  id: string
  title: string
  description?: string
  imageUrl?: string
  url: string
  source: string
  author?: string
  publishedAt: string
  category?: string
}

type NewsQuery = {
  q?: string
  sortBy?: 'date' | 'source'
}

const TTL_MS = 15 * 60 * 1000

function normalizeSpaceflight(item: any): NewsArticle {
  const id = String(item?.id ?? item?.url ?? Math.random())
  return {
    id,
    title: String(item?.title ?? 'Untitled'),
    description: item?.summary ? String(item.summary) : undefined,
    imageUrl: item?.image_url ? String(item.image_url) : undefined,
    url: String(item?.url ?? '#'),
    source: item?.news_site ? String(item.news_site) : 'Spaceflight News',
    author: item?.authors?.[0]?.name ? String(item.authors[0].name) : undefined,
    publishedAt: String(item?.published_at ?? new Date().toISOString()),
    category: item?.launches?.length ? 'Launch' : item?.events?.length ? 'Event' : 'Space',
  }
}

async function fetchFromSpaceflight(): Promise<NewsArticle[]> {
  const { data } = await http.get('https://api.spaceflightnewsapi.net/v4/articles/', {
    params: { limit: 10, offset: 0 },
  })
  const results: any[] = Array.isArray(data?.results) ? data.results : []
  return results.map(normalizeSpaceflight)
}

export async function fetchNews(query: NewsQuery): Promise<NewsArticle[]> {
  const cacheKey = `news_v1_${(query.q ?? '').trim().toLowerCase()}`
  const cached = getCache<NewsArticle[]>(cacheKey)
  if (cached) return applyClientFilters(cached, query)

  const items = await withRetry(fetchFromSpaceflight, { retries: 2 })
  setCache(cacheKey, items, TTL_MS)
  return applyClientFilters(items, query)
}

function applyClientFilters(items: NewsArticle[], query: NewsQuery) {
  let next = items.slice()

  const q = (query.q ?? '').trim().toLowerCase()
  if (q) {
    next = next.filter((a) => {
      const blob = `${a.title} ${a.description ?? ''} ${a.source} ${a.author ?? ''}`.toLowerCase()
      return blob.includes(q)
    })
  }

  if (query.sortBy === 'source') {
    next.sort((a, b) => a.source.localeCompare(b.source))
  } else {
    next.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  return next.slice(0, 10)
}


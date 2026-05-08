import { create } from 'zustand'
import toast from 'react-hot-toast'
import { inferWithHuggingFace, type HfChatMessage } from '../services/hfService'
import { safeJsonParse } from '../utils/storage'
import type { IssPosition, SpeedPoint } from './issStore'
import type { NewsArticle } from '../services/newsService'

export type ChatMsg = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

type ChatState = {
  open: boolean
  isTyping: boolean
  messages: ChatMsg[]
  setOpen: (v: boolean) => void
  toggle: () => void
  clear: () => void
  send: (userText: string) => Promise<void>
}

const KEY = 'mc_chat_v1'

function loadInitial(): ChatMsg[] {
  const raw = safeJsonParse<ChatMsg[]>(localStorage.getItem(KEY))
  return Array.isArray(raw) ? raw.slice(-30) : []
}

function persist(messages: ChatMsg[]) {
  localStorage.setItem(KEY, JSON.stringify(messages.slice(-30)))
}

function id() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function buildSystemPrompt(ctx: {
  iss: {
    positions: IssPosition[]
    speedHistory: SpeedPoint[]
    placeLabel?: string
    astronautCount: number
  }
  news: { articles: NewsArticle[] }
}) {
  const latest = ctx.iss.positions.at(-1)
  const latestSpeed = ctx.iss.speedHistory.at(-1)?.speedKmh
  const issSummary = latest
    ? {
        lat: latest.lat,
        lng: latest.lng,
        timestamp: latest.timestamp,
        place: ctx.iss.placeLabel ?? latest.placeName ?? null,
        astronautCount: ctx.iss.astronautCount,
        latestSpeedKmh: typeof latestSpeed === 'number' && Number.isFinite(latestSpeed) ? Math.round(latestSpeed) : null,
        lastPositions: ctx.iss.positions.slice(-15).map((p) => ({
          lat: p.lat,
          lng: p.lng,
          timestamp: p.timestamp,
          place: p.placeName ?? null,
        })),
        speedKmhTrend: ctx.iss.speedHistory.slice(-30).map((s) => ({
          timestamp: s.timestamp,
          speedKmh: Math.round(s.speedKmh),
        })),
      }
    : { note: 'No ISS telemetry available yet.', astronautCount: ctx.iss.astronautCount }

  const newsSummary = ctx.news.articles.slice(0, 10).map((a) => ({
    title: a.title,
    source: a.source,
    author: a.author ?? null,
    publishedAt: a.publishedAt,
    description: a.description ?? null,
    url: a.url,
    category: a.category ?? null,
  }))

  return [
    'You are a dashboard assistant. Only answer from dashboard data.',
    'You MUST ONLY answer using the ISS tracking data and the news articles provided in DASHBOARD_CONTEXT below.',
    'If unavailable, say: "I only have access to dashboard data, and that information is not available right now."',
    'Do NOT use general internet knowledge. Do NOT guess.',
    '',
    'DASHBOARD_CONTEXT (JSON):',
    JSON.stringify(
      {
        iss: issSummary,
        news: {
          latestHeadlines: newsSummary.map((n) => n.title),
          articles: newsSummary,
        },
      },
      null,
      2,
    ),
  ].join('\n')
}

export const useChatStore = create<ChatState>((set, get) => ({
  open: false,
  isTyping: false,
  messages: loadInitial(),

  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),

  clear: () => {
    localStorage.removeItem(KEY)
    set({ messages: [] })
  },

  send: async (userText) => {
    const text = userText.trim()
    if (!text) return

    const userMsg: ChatMsg = { id: id(), role: 'user', content: text, createdAt: Date.now() }
    const next = [...get().messages, userMsg].slice(-30)
    set({ messages: next, isTyping: true })
    persist(next)

    try {
      // Lazy-import stores to avoid circular imports at module init time.
      const { useIssStore } = await import('./issStore')
      const { useNewsStore } = await import('./newsStore')

      const iss = useIssStore.getState()
      const news = useNewsStore.getState()

      const system = buildSystemPrompt({
        iss: {
          positions: iss.positions,
          speedHistory: iss.speedHistory,
          placeLabel: iss.placeLabel,
          astronautCount: iss.astronautsCount || iss.astronauts.length,
        },
        news: { articles: news.articles },
      })

      const hfMessages: HfChatMessage[] = [
        { role: 'system', content: system },
        ...get()
          .messages.slice(-8)
          .map((m) => ({ role: m.role, content: m.content }) as HfChatMessage),
        { role: 'user', content: text },
      ]

      const answer = await inferWithHuggingFace(hfMessages)
      const assistantMsg: ChatMsg = {
        id: id(),
        role: 'assistant',
        content: answer,
        createdAt: Date.now(),
      }

      const finalMsgs = [...get().messages, assistantMsg].slice(-30)
      set({ messages: finalMsgs })
      persist(finalMsgs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI request failed'
      toast.error(msg)
      const assistantMsg: ChatMsg = {
        id: id(),
        role: 'assistant',
        content: `I can’t answer right now. ${msg}`,
        createdAt: Date.now(),
      }
      const finalMsgs = [...get().messages, assistantMsg].slice(-30)
      set({ messages: finalMsgs })
      persist(finalMsgs)
    } finally {
      set({ isTyping: false })
    }
  },
}))


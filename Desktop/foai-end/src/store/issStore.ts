import { create } from 'zustand'
import toast from 'react-hot-toast'
import { fetchAstros, fetchIssNow, reverseGeocode } from '../services/issService'
import { haversineDistanceKm, type LatLng } from '../utils/haversine'

export type IssPosition = {
  lat: number
  lng: number
  timestamp: number
  placeName?: string
}

export type SpeedPoint = {
  timestamp: number
  speedKmh: number
}

type IssState = {
  positions: IssPosition[]
  speedHistory: SpeedPoint[]
  autoRefresh: boolean
  isLoadingIss: boolean
  isLoadingAstros: boolean
  isResolvingPlace: boolean
  lastError?: string
  placeLabel?: string
  astronauts: { name: string; craft: string }[]
  astronautsCount: number
  lastUpdatedAt?: number

  setAutoRefresh: (v: boolean) => void
  refreshIss: (opts?: { silent?: boolean }) => Promise<void>
  refreshAstros: (opts?: { silent?: boolean }) => Promise<void>
  resolvePlace: (pos: IssPosition) => Promise<void>
  clearError: () => void
}

function clampArr<T>(arr: T[], max: number) {
  if (arr.length <= max) return arr
  return arr.slice(arr.length - max)
}

function parseLatLng(rawLat: string, rawLng: string): LatLng {
  const lat = Number(rawLat)
  const lng = Number(rawLng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error('Invalid ISS coordinates received')
  }
  return { lat, lng }
}

function computeSpeedKmh(prev: IssPosition, next: IssPosition) {
  const dtSec = Math.max(1, next.timestamp - prev.timestamp)
  const distKm = haversineDistanceKm({ lat: prev.lat, lng: prev.lng }, { lat: next.lat, lng: next.lng })
  return (distKm / dtSec) * 3600
}

export const useIssStore = create<IssState>((set, get) => ({
  positions: [],
  speedHistory: [],
  autoRefresh: true,
  isLoadingIss: false,
  isLoadingAstros: false,
  isResolvingPlace: false,
  astronauts: [],
  astronautsCount: 0,

  setAutoRefresh: (v) => set({ autoRefresh: v }),

  clearError: () => set({ lastError: undefined }),

  refreshIss: async (opts) => {
    const silent = opts?.silent ?? false
    if (!silent) get().clearError()
    set({ isLoadingIss: true })
    try {
      const data = await fetchIssNow()
      const { lat, lng } = parseLatLng(data.iss_position.latitude, data.iss_position.longitude)
      const pos: IssPosition = { lat, lng, timestamp: data.timestamp }

      const prev = get().positions.at(-1)
      const nextPositions = clampArr([...get().positions, pos], 15)
      set({
        positions: nextPositions,
        lastUpdatedAt: Date.now(),
      })

      if (prev) {
        const speedKmh = computeSpeedKmh(prev, pos)
        const nextSpeed = clampArr([...get().speedHistory, { timestamp: pos.timestamp, speedKmh }], 30)
        set({ speedHistory: nextSpeed })
      }

      void get().resolvePlace(pos)
      if (!silent) toast.success('ISS location updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load ISS telemetry'
      set({ lastError: msg })
      toast.error(msg)
    } finally {
      set({ isLoadingIss: false })
    }
  },

  refreshAstros: async (opts) => {
    const silent = opts?.silent ?? false
    if (!silent) get().clearError()
    set({ isLoadingAstros: true })
    try {
      const data = await fetchAstros()
      set({ astronauts: data.people ?? [], astronautsCount: data.number ?? 0 })
      if (!silent) toast.success('Crew roster updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load astronauts'
      set({ lastError: msg })
      toast.error(msg)
    } finally {
      set({ isLoadingAstros: false })
    }
  },

  resolvePlace: async (pos) => {
    set({ isResolvingPlace: true })
    try {
      const r = await reverseGeocode(pos.lat, pos.lng)
      set({ placeLabel: r.shortName })
      const positions = get().positions
      const idx = positions.findIndex((p) => p.timestamp === pos.timestamp)
      if (idx >= 0) {
        const next = positions.slice()
        next[idx] = { ...next[idx], placeName: r.shortName }
        set({ positions: next })
      }
    } catch {
      // Place resolution is best-effort; no toast.
    } finally {
      set({ isResolvingPlace: false })
    }
  },
}))


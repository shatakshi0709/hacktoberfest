import { http } from './http'
import { getCache, setCache } from '../utils/storage'
import { withRetry } from '../utils/retry'

export type IssNowResponse = {
  message: string
  timestamp: number
  iss_position: { latitude: string; longitude: string }
}

export type AstrosResponse = {
  message: string
  number: number
  people: { name: string; craft: string }[]
}

export type ReverseGeocodeResult = {
  displayName: string
  shortName: string
}

export async function fetchIssNow() {
  return withRetry(async () => {
    const { data } = await http.get<IssNowResponse>('http://api.open-notify.org/iss-now.json')
    return data
  }, { retries: 2 })
}

export async function fetchAstros() {
  return withRetry(async () => {
    const { data } = await http.get<AstrosResponse>('http://api.open-notify.org/astros.json')
    return data
  }, { retries: 2 })
}

const GEO_TTL_MS = 60 * 60 * 1000

export async function reverseGeocode(lat: number, lng: number) {
  const key = `geo_${lat.toFixed(2)}_${lng.toFixed(2)}`
  const cached = getCache<ReverseGeocodeResult>(key)
  if (cached) return cached

  const { data } = await withRetry(
    async () =>
      http.get('https://nominatim.openstreetmap.org/reverse', {
        params: { format: 'jsonv2', lat, lon: lng, zoom: 6 },
        headers: {
          'Accept-Language': 'en',
          // Nominatim asks for a descriptive UA; browsers restrict User-Agent,
          // but custom headers are allowed and accepted by many deployments.
          'X-Requested-With': 'mission-control-dashboard',
        },
      }),
    { retries: 1 },
  )

  const displayName: string = data?.display_name ?? 'Unknown location'
  const shortName =
    typeof displayName === 'string'
      ? displayName
          .split(',')
          .slice(0, 2)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .join(', ')
      : 'Unknown'

  const result = { displayName, shortName }
  setCache(key, result, GEO_TTL_MS)
  return result
}


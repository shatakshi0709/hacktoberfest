export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export type CacheEnvelope<T> = { v: T; expiresAt: number }

export function getCache<T>(key: string): T | null {
  const env = safeJsonParse<CacheEnvelope<T>>(localStorage.getItem(key))
  if (!env) return null
  if (Date.now() > env.expiresAt) {
    localStorage.removeItem(key)
    return null
  }
  return env.v
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  const env: CacheEnvelope<T> = { v: value, expiresAt: Date.now() + ttlMs }
  localStorage.setItem(key, JSON.stringify(env))
}


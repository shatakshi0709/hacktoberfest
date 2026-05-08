export type RetryOptions = {
  retries: number
  baseDelayMs?: number
  maxDelayMs?: number
  shouldRetry?: (err: unknown) => boolean
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions): Promise<T> {
  const retries = Math.max(0, opts.retries)
  const base = opts.baseDelayMs ?? 350
  const max = opts.maxDelayMs ?? 3000
  const shouldRetry = opts.shouldRetry ?? (() => true)

  let attempt = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn()
    } catch (err) {
      if (attempt >= retries || !shouldRetry(err)) throw err
      const delay = Math.min(max, base * 2 ** attempt) + Math.round(Math.random() * 120)
      attempt++
      await sleep(delay)
    }
  }
}


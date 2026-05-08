import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Send, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useChatStore } from '../store/chatStore'
import toast from 'react-hot-toast'

function Spinner() {
  return (
    <div
      className="h-4 w-4 animate-spin rounded-full border-2 border-[rgb(var(--border))] border-t-[rgb(var(--accent))]"
      aria-label="Loading"
    />
  )
}

function Bubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const mine = role === 'user'
  return (
    <div className={mine ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={[
          'max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed',
          mine
            ? 'border-transparent bg-[rgb(var(--accent))] text-slate-950'
            : 'border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/65 text-[rgb(var(--text))]',
        ].join(' ')}
      >
        {content}
      </div>
    </div>
  )
}

export function ChatWidget() {
  const open = useChatStore((s) => s.open)
  const toggle = useChatStore((s) => s.toggle)
  const setOpen = useChatStore((s) => s.setOpen)
  const clear = useChatStore((s) => s.clear)
  const send = useChatStore((s) => s.send)
  const messages = useChatStore((s) => s.messages)
  const isTyping = useChatStore((s) => s.isTyping)

  const [text, setText] = useState('')

  const envToken = import.meta.env.VITE_AI_TOKEN as string | undefined
  const token = (envToken && envToken !== 'undefined' ? String(envToken) : '')
    .replace(/^["']|["']$/g, '')
    .trim()
  const hasToken = Boolean(token)

  const placeholder = useMemo(
    () => 'Ask about ISS position/speed or the loaded news only…',
    [],
  )

  async function onSend() {
    if (!hasToken) {
      toast.error('Missing VITE_AI_TOKEN. Add it to root .env and restart `npm run dev`.')
      return
    }
    const t = text.trim()
    if (!t) return
    setText('')
    await send(t)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            className="mc-panel-glass w-[360px] max-w-[92vw] overflow-hidden"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-[rgb(var(--panel-2))] p-2">
                  <Bot className="h-5 w-5 text-[rgb(var(--ok))]" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Dashboard Assistant</div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    Only answers from ISS + News state · Token {hasToken ? 'configured' : 'missing'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="mc-button" onClick={clear} title="Clear chat">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button type="button" className="mc-button" onClick={() => setOpen(false)} title="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-auto p-4">
              {messages.length === 0 ? (
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/60 p-4 text-sm text-[rgb(var(--muted))]">
                  Try: “What is the latest ISS latitude/longitude?” or “Summarize the newest article.”
                </div>
              ) : null}

              {messages.map((m) => (
                <Bubble key={m.id} role={m.role} content={m.content} />
              ))}

              {isTyping ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/65 px-4 py-3 text-sm text-[rgb(var(--muted))]">
                    <Spinner />
                    <span>Thinking…</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-[rgb(var(--border))] p-3">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/60 px-3 py-2 text-sm outline-none placeholder:text-[rgb(var(--muted))]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void onSend()
                  }}
                />
                <button
                  type="button"
                  className="mc-button-primary"
                  onClick={() => void onSend()}
                  disabled={isTyping}
                  title={isTyping ? 'Waiting for response…' : 'Send'}
                >
                  {isTyping ? <Spinner /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        className="mc-button-primary mt-3 h-12 w-12 rounded-2xl p-0"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open assistant"
        title="Open assistant"
      >
        <Bot className="h-5 w-5" />
      </motion.button>
    </div>
  )
}


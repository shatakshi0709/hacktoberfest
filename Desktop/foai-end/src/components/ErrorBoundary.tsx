import type { ReactNode } from 'react'
import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

type Props = { children: ReactNode }
type State = { hasError: boolean; message?: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : 'Unknown error' }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center p-6">
        <div className="mc-panel w-full p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-2">
              <AlertTriangle className="h-5 w-5 text-[rgb(var(--warning))]" />
            </div>
            <div>
              <div className="text-lg font-semibold">Something went wrong</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                Try refreshing the page. If it keeps happening, check the console.
              </div>
            </div>
          </div>

          {this.state.message ? (
            <pre className="mt-4 overflow-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-4 text-xs text-[rgb(var(--muted))]">
              {this.state.message}
            </pre>
          ) : null}
        </div>
      </div>
    )
  }
}


import { Bot, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

export function AiAssistantPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="This assistant will answer ONLY from the ISS + News data in dashboard state."
        right={
          <div className="mc-chip">
            <ShieldCheck className="h-3.5 w-3.5 text-[rgb(var(--ok))]" />
            <span>Restricted mode</span>
          </div>
        }
      />

      <div className="mc-panel-glass p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-3">
            <Bot className="h-5 w-5 text-[rgb(var(--ok))]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">How it works</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              Open the floating assistant (bottom-right). It can only answer from the ISS telemetry
              currently stored in the dashboard and the 10 loaded news articles.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="mc-chip">ISS location</div>
              <div className="mc-chip">ISS speed</div>
              <div className="mc-chip">Astronaut count</div>
              <div className="mc-chip">Latest headlines</div>
            </div>
            <div className="mt-4 text-sm text-[rgb(var(--muted))]">
              If you ask something outside the dashboard context, it will reply that it only has access
              to dashboard data.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


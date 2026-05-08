import { Activity, Clock, MapPin, RefreshCcw, Satellite, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/PageHeader'
import { IssMap } from '../map/IssMap'
import { StatCard } from '../components/StatCard'
import { Skeleton } from '../components/Skeleton'
import { useIssPolling } from '../hooks/useIssPolling'
import { useIssStore } from '../store/issStore'
import { formatDistanceToNow } from 'date-fns'
import { IssSpeedTrendChart } from '../charts/IssSpeedTrendChart'

export function IssTrackingPage() {
  useIssPolling()

  const positions = useIssStore((s) => s.positions)
  const speedHistory = useIssStore((s) => s.speedHistory)
  const autoRefresh = useIssStore((s) => s.autoRefresh)
  const setAutoRefresh = useIssStore((s) => s.setAutoRefresh)
  const refreshIss = useIssStore((s) => s.refreshIss)
  const refreshAstros = useIssStore((s) => s.refreshAstros)
  const isLoadingIss = useIssStore((s) => s.isLoadingIss)
  const isLoadingAstros = useIssStore((s) => s.isLoadingAstros)
  const isResolvingPlace = useIssStore((s) => s.isResolvingPlace)
  const placeLabel = useIssStore((s) => s.placeLabel)
  const astronauts = useIssStore((s) => s.astronauts)
  const astronautsCount = useIssStore((s) => s.astronautsCount)
  const lastUpdatedAt = useIssStore((s) => s.lastUpdatedAt)

  const last = positions.at(-1)
  const lastSpeed = speedHistory.at(-1)?.speedKmh

  return (
    <div className="space-y-6">
      <PageHeader
        title="ISS Live Tracking"
        subtitle="Live orbital telemetry with path trail, speed trend, and crew roster."
        right={
          <div className="flex items-center gap-2">
            <div className="mc-chip">
              <Activity className="h-3.5 w-3.5 text-[rgb(var(--ok))]" />
              <span>{autoRefresh ? 'Auto refresh ON' : 'Auto refresh OFF'}</span>
            </div>
            <button
              type="button"
              className="mc-button"
              onClick={() => refreshAstros()}
              disabled={isLoadingAstros}
              title="Refresh people in space"
            >
              <Users className="h-4 w-4" />
              Crew
            </button>
            <button
              type="button"
              className="mc-button-primary"
              onClick={() => refreshIss()}
              disabled={isLoadingIss}
              title="Refresh ISS position"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="mc-panel-glass overflow-hidden lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgb(var(--border))] p-5">
            <div>
              <div className="text-sm font-semibold">Interactive Map</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                Trajectory shows the last {positions.length} stored positions.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="mc-chip cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-[rgb(var(--accent))]"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <span>Auto refresh</span>
              </label>

              {lastUpdatedAt ? (
                <div className="mc-chip">
                  <Clock className="h-3.5 w-3.5 text-[rgb(var(--muted))]" />
                  <span>Updated {formatDistanceToNow(lastUpdatedAt, { addSuffix: true })}</span>
                </div>
              ) : null}
            </div>
          </div>

          {last ? (
            <IssMap positions={positions} height={460} />
          ) : (
            <div className="p-5">
              <Skeleton className="h-[460px] w-full" />
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-1">
          <StatCard
            label="Latitude"
            value={last ? last.lat.toFixed(4) : <Skeleton className="mt-2 h-8 w-36" />}
            hint={<span>Current ISS latitude</span>}
            icon={<Satellite className="h-5 w-5 text-[rgb(var(--accent))]" />}
          />

          <StatCard
            label="Longitude"
            value={last ? last.lng.toFixed(4) : <Skeleton className="mt-2 h-8 w-36" />}
            hint={<span>Current ISS longitude</span>}
            icon={<Satellite className="h-5 w-5 text-[rgb(var(--accent))]" />}
          />

          <StatCard
            label="Speed (km/h)"
            value={
              typeof lastSpeed === 'number' && Number.isFinite(lastSpeed) ? (
                Math.round(lastSpeed).toLocaleString()
              ) : (
                <span className="text-[rgb(var(--muted))]">—</span>
              )
            }
            hint={<span>Calculated using Haversine distance</span>}
            icon={<Activity className="h-5 w-5 text-[rgb(var(--ok))]" />}
          />

          <StatCard
            label="Nearest place"
            value={
              last ? (
                <span className="truncate">{placeLabel ?? (isResolvingPlace ? 'Resolving…' : '—')}</span>
              ) : (
                <Skeleton className="mt-2 h-8 w-40" />
              )
            }
            hint={<span>Reverse geocoded (best-effort)</span>}
            icon={<MapPin className="h-5 w-5 text-[rgb(var(--accent-2))]" />}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IssSpeedTrendChart data={speedHistory} />
        </div>

        <div className="mc-panel-glass p-5 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Stored positions</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                The dashboard keeps the last 15 telemetry points for the path trail.
              </div>
            </div>
            <div className="mc-chip">{positions.length} / 15</div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {last ? (
              <div className="mc-panel p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Latest point
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-[rgb(var(--muted))]">Lat</span>{' '}
                  <span className="font-semibold">{last.lat.toFixed(4)}</span> ·{' '}
                  <span className="text-[rgb(var(--muted))]">Lng</span>{' '}
                  <span className="font-semibold">{last.lng.toFixed(4)}</span>
                </div>
                <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Timestamp: {new Date(last.timestamp * 1000).toLocaleString()}
                </div>
              </div>
            ) : (
              <Skeleton className="h-[92px] w-full" />
            )}

            <div className="mc-panel p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Telemetry controls
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="mc-button" onClick={() => refreshIss()}>
                  <RefreshCcw className="h-4 w-4" />
                  Refresh now
                </button>
                <button type="button" className="mc-button" onClick={() => setAutoRefresh(!autoRefresh)}>
                  {autoRefresh ? 'Pause auto refresh' : 'Resume auto refresh'}
                </button>
              </div>
              <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                Auto refresh interval: 15 seconds
              </div>
            </div>
          </div>
        </div>

        <div className="mc-panel-glass p-5 lg:col-span-1 lg:row-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">People in space</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                Live roster from Open Notify
              </div>
            </div>
            <div className="mc-chip">
              <Users className="h-3.5 w-3.5 text-[rgb(var(--accent))]" />
              <span>{astronautsCount || astronauts.length}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {isLoadingAstros && astronauts.length === 0 ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : astronauts.length > 0 ? (
              astronauts.slice(0, 12).map((p) => (
                <motion.div
                  key={`${p.craft}:${p.name}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/60 px-4 py-3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">{p.craft}</div>
                  </div>
                  <div className="mc-chip">Active</div>
                </motion.div>
              ))
            ) : (
              <div className="text-sm text-[rgb(var(--muted))]">
                No crew data yet. Try refresh.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


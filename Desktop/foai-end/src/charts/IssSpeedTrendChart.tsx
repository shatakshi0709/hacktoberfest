import { format } from 'date-fns'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SpeedPoint } from '../store/issStore'

export function IssSpeedTrendChart({ data }: { data: SpeedPoint[] }) {
  const series = data.map((p) => ({
    t: format(new Date(p.timestamp * 1000), 'HH:mm:ss'),
    speed: Number.isFinite(p.speedKmh) ? Math.round(p.speedKmh) : 0,
  }))

  return (
    <div className="mc-panel-glass min-w-0 p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">ISS Speed Trend</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">Last 30 calculated speeds</div>
        </div>
        <div className="mc-chip">km/h</div>
      </div>

      <div className="mt-4 h-[220px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: 'rgba(148, 163, 184, 0.9)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: 'rgba(148, 163, 184, 0.9)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={42}
              domain={['dataMin - 2000', 'dataMax + 2000']}
            />
            <Tooltip
              contentStyle={{
                background: 'rgb(var(--panel))',
                border: '1px solid rgb(var(--border))',
                borderRadius: 14,
                color: 'rgb(var(--text))',
              }}
              labelStyle={{ color: 'rgb(var(--muted))' }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="rgb(var(--accent))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


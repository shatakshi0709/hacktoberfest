import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { IssPosition } from '../store/issStore'

function buildIssIcon() {
  return L.divIcon({
    className: 'iss-div-icon',
    html: `
      <div class="iss-pulse">
        <div class="iss-core"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function MapUpdater({ position }: { position?: IssPosition }) {
  const map = useMap()
  useEffect(() => {
    if (!position) return
    map.setView([position.lat, position.lng], map.getZoom(), { animate: true })
  }, [map, position?.lat, position?.lng])
  return null
}

export function IssMap({
  positions,
  height = 420,
}: {
  positions: IssPosition[]
  height?: number
}) {
  const last = positions.at(-1)
  const icon = useMemo(() => buildIssIcon(), [])

  const path = useMemo(() => positions.map((p) => [p.lat, p.lng] as [number, number]), [positions])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <style>{`
        .iss-div-icon { background: transparent; border: 0; }
        .iss-pulse {
          width: 28px; height: 28px; border-radius: 9999px;
          background: rgba(34, 211, 238, 0.18);
          box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.35);
          position: relative;
          animation: iss-pulse 1.6s ease-in-out infinite;
        }
        .iss-core {
          position: absolute; inset: 7px;
          border-radius: 9999px;
          background: rgb(34, 211, 238);
          box-shadow: 0 10px 30px rgba(34, 211, 238, 0.35);
        }
        @keyframes iss-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

      <div style={{ height }} className="w-full">
        <MapContainer
          center={last ? [last.lat, last.lng] : [0, 0]}
          zoom={last ? 3 : 2}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater position={last} />

          {path.length >= 2 ? (
            <Polyline
              positions={path}
              pathOptions={{ color: 'rgba(34, 211, 238, 0.9)', weight: 3, opacity: 0.9 }}
            />
          ) : null}

          {last ? (
            <Marker position={[last.lat, last.lng]} icon={icon}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs">
                  <div>
                    <span className="font-semibold">Lat:</span> {last.lat.toFixed(3)}
                  </div>
                  <div>
                    <span className="font-semibold">Lng:</span> {last.lng.toFixed(3)}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ) : null}
        </MapContainer>
      </div>
    </div>
  )
}


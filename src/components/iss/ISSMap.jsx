import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom satellite icon
const satelliteIcon = new L.DivIcon({
  html: `<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🛰️</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: 'satellite-marker',
});

function MapUpdater({ center }) {
  const map = useMap();
  const prevCenter = useRef(center);
  useEffect(() => {
    if (center && (center[0] !== prevCenter.current?.[0] || center[1] !== prevCenter.current?.[1])) {
      map.setView(center, map.getZoom(), { animate: true, duration: 1 });
      prevCenter.current = center;
    }
  }, [center, map]);
  return null;
}

export default function ISSMap({ positions, currentPos, speed }) {
  if (!currentPos) {
    return (
      <div className="w-full h-[300px] sm:h-[380px] rounded-xl bg-slate-100 dark:bg-neutral-800/50 flex items-center justify-center">
        <div className="text-slate-400 dark:text-neutral-400 animate-pulse">Loading map…</div>
      </div>
    );
  }

  const center = [currentPos.latitude, currentPos.longitude];
  const polylinePositions = positions.slice(-15).map((p) => [p.latitude, p.longitude]);

  return (
    <div className="w-full h-[300px] sm:h-[380px] rounded-xl overflow-hidden border border-black/5 dark:border-white/5">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        <Marker position={center} icon={satelliteIcon}>
          <Tooltip direction="top" offset={[0, -18]} permanent={false}>
            <div className="text-xs">
              <div className="font-bold">ISS Position</div>
              <div>Lat: {currentPos.latitude.toFixed(4)}</div>
              <div>Lon: {currentPos.longitude.toFixed(4)}</div>
              <div>Speed: {speed} km/h</div>
            </div>
          </Tooltip>
        </Marker>
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#dc2626',
              weight: 2.5,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

// File: src/components/map/MapTools.tsx
//
// OPTIONAL drop-in. Place <MapTools /> *inside* a <MapContainer>…</MapContainer>
// to add: live mouse coordinates, a scale bar, a fullscreen button, and a
// compass rose. Purely additive — it changes nothing else on the map.

import { useState } from "react";
import { ScaleControl, useMap, useMapEvents } from "react-leaflet";
import { Maximize2, Minimize2, Navigation } from "lucide-react";

function CoordinateReadout() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  useMapEvents({
    mousemove: (e) => setPos({ lat: e.latlng.lat, lng: e.latlng.lng }),
    mouseout: () => setPos(null),
  });
  return (
    <div
      className="pointer-events-none absolute bottom-2 left-1/2 z-[1000] -translate-x-1/2 rounded-md
        border border-white/10 bg-[#0b1220]/85 px-2.5 py-1 font-mono text-[10px] text-slate-300 backdrop-blur"
    >
      {pos ? `${pos.lat.toFixed(4)}°N, ${pos.lng.toFixed(4)}°E` : "— move over map —"}
    </div>
  );
}

function FullscreenButton() {
  const map = useMap();
  const [full, setFull] = useState(false);
  const toggle = () => {
    const el = map.getContainer();
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setFull(true);
    } else {
      document.exitFullscreen?.();
      setFull(false);
    }
  };
  return (
    <button
      onClick={toggle}
      className="absolute right-4 top-16 z-[1000] grid h-9 w-9 place-items-center rounded-lg
        border border-white/10 bg-[#0b1220]/85 text-slate-200 backdrop-blur transition
        hover:border-amber-300/40 hover:text-amber-200"
      title="Toggle fullscreen"
    >
      {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    </button>
  );
}

function CompassRose() {
  return (
    <div
      className="pointer-events-none absolute left-4 bottom-16 z-[1000] grid h-11 w-11 place-items-center
        rounded-full border border-white/10 bg-[#0b1220]/85 backdrop-blur"
      title="North"
    >
      <Navigation className="h-5 w-5 text-amber-300" />
      <span className="absolute top-0.5 text-[8px] font-bold text-slate-300">N</span>
    </div>
  );
}

export default function MapTools() {
  return (
    <>
      <ScaleControl position="bottomleft" imperial={false} />
      <CoordinateReadout />
      <FullscreenButton />
      <CompassRose />
    </>
  );
}
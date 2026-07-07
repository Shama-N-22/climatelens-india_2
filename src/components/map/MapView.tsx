// File: src/components/map/MapView.tsx
//
// Map panel. Tile URLs now come from the backend (fresh, never-expiring) based
// on the selected city + index + year + month. Shows loading / error / no-data
// states gracefully. Everything else (basemap switcher, opacity, legend) stays.

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import MapLegend from "../dashboard/MapLegend";
import BasemapSwitcher from "./BasemapSwitcher";
import { BASEMAPS, DEFAULT_BASEMAP } from "../../data/basemaps";
import { monthLabel, DEFAULT_TIMELINE } from "../../data/geeTimeline";
import { API_BASE } from "../../config";
import { Building2 } from "lucide-react";
import type { ParamKey } from "../../data/legendRamps";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [23.0225, 72.5714]; // Ahmedabad

interface MapViewProps {
  parameter?: ParamKey;
  center?: [number, number];
  zoom?: number;
  cityId?: string;
  year?: number;
  month?: number;
}

function FlyToCity({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

type Status = "loading" | "ok" | "empty" | "error";

export default function MapView({
  parameter = "ndvi",
  center = DEFAULT_CENTER,
  zoom = 11,
  cityId = "ahmedabad",
  year = DEFAULT_TIMELINE.year,
  month = DEFAULT_TIMELINE.month,
}: MapViewProps) {
  const [basemapId, setBasemapId] = useState(DEFAULT_BASEMAP.id);
  const [opacity, setOpacity] = useState(0.75);
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [showBuildings, setShowBuildings] = useState(false);
  const [buildingsUrl, setBuildingsUrl] = useState<string | null>(null);

  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? DEFAULT_BASEMAP;

  // fetch the tile URL from the backend whenever the selection changes
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setTileUrl(null);

    fetch(
      `${API_BASE}/api/tiles/${parameter}?city=${cityId}&year=${year}&month=${month}`,
    )
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d && d.url) {
          setTileUrl(d.url);
          setStatus("ok");
        } else {
          setStatus("empty");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [parameter, cityId, year, month]);

  // fetch building footprints once per city, only when toggled on
  useEffect(() => {
    if (!showBuildings) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/buildings?city=${cityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.url) setBuildingsUrl(d.url);
      })
      .catch(() => {
        if (!cancelled) setBuildingsUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showBuildings, cityId]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="h-full w-full bg-[#0b1220]"
      >
        <TileLayer
          key={basemap.id}
          url={basemap.url}
          attribution={basemap.attribution}
          {...(basemap.subdomains ? { subdomains: basemap.subdomains } : {})}
          maxZoom={basemap.maxZoom ?? 19}
        />

        {status === "ok" && tileUrl && (
          <TileLayer
            key={`${cityId}-${parameter}-${year}-${month}`}
            url={tileUrl}
            attribution="Google Earth Engine &middot; Landsat"
            opacity={opacity}
            zIndex={400}
            maxZoom={18}
          />
        )}

        {showBuildings && buildingsUrl && (
          <TileLayer
            key={`buildings-${cityId}`}
            url={buildingsUrl}
            attribution="Google Open Buildings"
            zIndex={500}
            maxZoom={20}
          />
        )}

        <FlyToCity center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* opacity (only when a layer is showing) */}
      {status === "ok" && (
        <div className="absolute left-4 top-4 z-[1000] w-56 rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] uppercase tracking-wider text-slate-400"
            >
              Layer opacity
            </span>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] text-slate-300"
            >
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-teal-400"
          />
        </div>
      )}

      {/* status badge for loading / no-data / error */}
      {status !== "ok" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0B1220]/85 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium text-slate-100">
            {monthLabel(month)} {year}
          </p>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-1 text-[11px] text-slate-400"
          >
            {status === "loading" && "loading layer…"}
            {status === "empty" && "no data for this month"}
            {status === "error" && "backend not reachable"}
          </p>
        </div>
      )}

      {/* top-right: buildings toggle + base map style */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-col items-end gap-2">
        <button
          onClick={() => setShowBuildings((v) => !v)}
          title="Show or hide building footprints"
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur-md transition ${
            showBuildings
              ? "border-slate-300/40 bg-slate-200/15 text-slate-100"
              : "border-white/10 bg-[#0B1220]/85 text-slate-300 hover:border-white/25"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Buildings
          <span
            className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
              showBuildings
                ? "bg-emerald-400/20 text-emerald-200"
                : "bg-white/10 text-slate-400"
            }`}
          >
            {showBuildings ? "ON" : "OFF"}
          </span>
        </button>
        <BasemapSwitcher value={basemapId} onChange={setBasemapId} />
      </div>

      {/* bottom-right: dynamic legend */}
      <div className="absolute bottom-6 right-4 z-[1000]">
        <MapLegend parameter={parameter} />
      </div>
    </div>
  );
}

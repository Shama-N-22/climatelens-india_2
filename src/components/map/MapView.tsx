// File: src/components/map/MapView.tsx
//
// Map panel. Index tiles + buildings come from the backend. Hospitals and ward
// boundaries are vector overlays from /public/geojson.
// Backward compatible: Heat & Health dashboard passes nothing new.
// New props (used by Flood / Landslide):
//   hotspotLabel  - label for the hotspot opacity slider ("Flood Hotspot" etc.)
//   comingSoon    - true = skip index/hotspot fetch, show "awaiting data" badge
//                   (basemap + buildings/hospitals/wards still work)

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MapLegend from "../dashboard/MapLegend";
import BasemapSwitcher from "./BasemapSwitcher";
import { BASEMAPS, DEFAULT_BASEMAP } from "../../data/basemaps";
import { monthLabel, DEFAULT_TIMELINE } from "../../data/geeTimeline";
import { API_BASE } from "../../config";
import type { ParamKey } from "../../data/legendRamps";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [23.0225, 72.5714];

interface MapViewProps {
  parameter?: string;
  center?: [number, number];
  zoom?: number;
  cityId?: string;
  year?: number;
  month?: number;
  showBuildings?: boolean;
  showHospitals?: boolean;
  showWards?: boolean;
  showUHI?: boolean;
  showIndex?: boolean;
  hotspotLabel?: string;
  comingSoon?: boolean;
  onSelectFeature?: (
    f: { type: "hospital" | "ward"; props: Record<string, any> } | null,
  ) => void;
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

type Status = "loading" | "ok" | "empty" | "error" | "soon";

export default function MapView({
  parameter = "ndvi",
  center = DEFAULT_CENTER,
  zoom = 11,
  cityId = "ahmedabad",
  year = DEFAULT_TIMELINE.year,
  month = DEFAULT_TIMELINE.month,
  showBuildings = false,
  showHospitals = false,
  showWards = false,
  showUHI = false,
  showIndex = true,
  hotspotLabel = "UHI",
  comingSoon = false,
  onSelectFeature,
}: MapViewProps) {
  const [basemapId, setBasemapId] = useState(DEFAULT_BASEMAP.id);
  const [opacity, setOpacity] = useState(0.75);
  const [uhiOpacity, setUhiOpacity] = useState(0.8);
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [buildingsUrl, setBuildingsUrl] = useState<string | null>(null);
  const [uhiUrl, setUhiUrl] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? DEFAULT_BASEMAP;

  // index tiles
  useEffect(() => {
    if (comingSoon) {
      setStatus("soon");
      setTileUrl(null);
      return;
    }
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
        } else setStatus("empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [parameter, cityId, year, month, comingSoon]);

  // buildings (backend tile)
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

  // hotspot (backend tile) — skipped when comingSoon
  useEffect(() => {
    if (comingSoon || !showUHI) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/uhi?city=${cityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.url) setUhiUrl(d.url);
      })
      .catch(() => {
        if (!cancelled) setUhiUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showUHI, cityId, comingSoon]);

  // hospitals (local geojson)
  useEffect(() => {
    if (!showHospitals) {
      setHospitals(null);
      return;
    }
    let cancelled = false;
    fetch(`/geojson/hospitals-${cityId}.geojson`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setHospitals(d);
      })
      .catch(() => {
        if (!cancelled) setHospitals(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showHospitals, cityId]);

  // wards (local geojson)
  useEffect(() => {
    if (!showWards) {
      setWards(null);
      return;
    }
    let cancelled = false;
    fetch(`/geojson/wards-${cityId}.geojson`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setWards(d);
      })
      .catch(() => {
        if (!cancelled) setWards(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showWards, cityId]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        preferCanvas={true}
        className="h-full w-full bg-[#0b1220]"
      >
        <TileLayer
          key={basemap.id}
          url={basemap.url}
          attribution={basemap.attribution}
          {...(basemap.subdomains ? { subdomains: basemap.subdomains } : {})}
          maxZoom={basemap.maxZoom ?? 19}
        />

        {!comingSoon && showIndex && status === "ok" && tileUrl && (
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
            zIndex={450}
            maxZoom={20}
          />
        )}

        {!comingSoon && showUHI && uhiUrl && (
          <TileLayer
            key={`uhi-${cityId}`}
            url={uhiUrl}
            attribution="Hotspots &middot; Earth Engine"
            opacity={uhiOpacity}
            zIndex={500}
            maxZoom={18}
          />
        )}

        {showWards && wards && (
          <GeoJSON
            key={`wards-${cityId}`}
            data={wards}
            style={{
              color: "#000000",
              weight: 1.4,
              fillColor: "#000000",
              fillOpacity: 0,
            }}
            onEachFeature={(f, layer) => {
              const p = f.properties || {};
              const label =
                p.village != null
                  ? `${p.village}${p.district ? ` (${p.district})` : ""}`
                  : p.ward_no != null
                    ? `Ward ${p.ward_no}`
                    : `Ward ${p.name ?? ""}`;
              layer.bindTooltip(label, { sticky: true, direction: "top" });
              layer.on("click", (e: any) => {
                if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
                onSelectFeature && onSelectFeature({ type: "ward", props: p });
              });
            }}
          />
        )}

        {showHospitals && hospitals && (
          <GeoJSON
            key={`hosp-${cityId}`}
            data={hospitals}
            pointToLayer={(_f, latlng) =>
              L.marker(latlng, {
                icon: L.divIcon({
                  className: "",
                  html:
                    '<div style="display:flex;align-items:center;justify-content:center;width:16px;height:16px;">' +
                    '<svg width="16" height="16" viewBox="0 0 16 16">' +
                    '<path d="M6.4 1.6h3.2v4.8h4.8v3.2H9.6v4.8H6.4V9.6H1.6V6.4h4.8z" fill="#f97316" stroke="#7c2d12" stroke-width="1"/>' +
                    "</svg></div>",
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                }),
              })
            }
            onEachFeature={(f, layer) => {
              const p = f.properties || {};
              layer.bindTooltip(p.name ?? "Healthcare facility", {
                direction: "top",
              });
              layer.on("click", (e: any) => {
                if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
                onSelectFeature &&
                  onSelectFeature({ type: "hospital", props: p });
              });
            }}
          />
        )}

        <FlyToCity center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* opacity sliders (hidden while coming soon) */}
      {!comingSoon && ((showIndex && status === "ok") || showUHI) && (
        <div className="absolute left-4 top-4 z-[1000] flex w-56 flex-col gap-2">
          {!showUHI && showIndex && status === "ok" && (
            <div className="rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
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

          {showUHI && (
            <div className="rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                >
                  {hotspotLabel} opacity
                </span>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[11px] text-slate-300"
                >
                  {Math.round(uhiOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(uhiOpacity * 100)}
                onChange={(e) => setUhiOpacity(Number(e.target.value) / 100)}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-orange-400"
              />
            </div>
          )}
        </div>
      )}

      {/* coming soon badge */}
      {comingSoon && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0B1220]/85 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium text-slate-100">
            Live data layers coming soon
          </p>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-1 text-[11px] text-slate-400"
          >
            awaiting GEE datasets · map is interactive
          </p>
        </div>
      )}

      {/* index status badge (Heat & Health) */}
      {!comingSoon && showIndex && status !== "ok" && status !== "soon" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0B1220]/85 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium text-slate-100">
            {monthLabel(month)} {year}
          </p>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-1 text-[11px] text-slate-400"
          >
            {status === "loading" && "loading layer…"}
            {status === "empty" && "no cloud-free image for this month"}
            {status === "error" && "backend not reachable"}
          </p>
        </div>
      )}

      <div className="absolute right-4 top-4 z-[1000]">
        <BasemapSwitcher value={basemapId} onChange={setBasemapId} />
      </div>

      {!comingSoon && (
        <div className="absolute bottom-6 right-4 z-[1000]">
          <MapLegend parameter={parameter as ParamKey} />
        </div>
      )}
    </div>
  );
}

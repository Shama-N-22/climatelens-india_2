// File: src/components/map/MapView.tsx
//
// Map panel. Index tiles + buildings come from the backend. Hospitals and ward
// boundaries are vector overlays loaded from /public/geojson (clickable, with
// attributes in popups). All overlays are toggled from the "Layers" dropdown.

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
  parameter?: ParamKey;
  center?: [number, number];
  zoom?: number;
  cityId?: string;
  year?: number;
  month?: number;
  showBuildings?: boolean;
  showHospitals?: boolean;
  showWards?: boolean;
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
  showBuildings = false,
  showHospitals = false,
  showWards = false,
}: MapViewProps) {
  const [basemapId, setBasemapId] = useState(DEFAULT_BASEMAP.id);
  const [opacity, setOpacity] = useState(0.75);
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [buildingsUrl, setBuildingsUrl] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? DEFAULT_BASEMAP;

  // index tiles
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
        } else setStatus("empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [parameter, cityId, year, month]);

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

  // wards (local geojson; only Mumbai & Hyderabad have them)
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

        {showWards && wards && (
          <GeoJSON
            key={`wards-${cityId}`}
            data={wards}
            style={{
              color: "#f59e0b",
              weight: 1,
              fillColor: "#f59e0b",
              fillOpacity: 0.06,
            }}
            onEachFeature={(f, layer) => {
              const p = f.properties || {};
              const pop =
                p.population != null
                  ? `<br/>Population: <b>${Number(p.population).toLocaleString("en-IN")}</b>`
                  : "";
              const zone = p.zone ? `<br/>Zone: ${p.zone}` : "";
              layer.bindPopup(`<b>Ward ${p.name ?? ""}</b>${pop}${zone}`);
            }}
          />
        )}

        {showHospitals && hospitals && (
          <GeoJSON
            key={`hosp-${cityId}`}
            data={hospitals}
            pointToLayer={(_f, latlng) =>
              L.circleMarker(latlng, {
                radius: 4,
                color: "#38bdf8",
                weight: 1,
                fillColor: "#38bdf8",
                fillOpacity: 0.75,
              })
            }
            onEachFeature={(f, layer) =>
              layer.bindPopup(
                `<b>${f.properties?.name ?? "Healthcare facility"}</b>`,
              )
            }
          />
        )}

        <FlyToCity center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
      </MapContainer>

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
            {status === "empty" && "no cloud-free image for this month"}
            {status === "error" && "backend not reachable"}
          </p>
        </div>
      )}

      <div className="absolute right-4 top-4 z-[1000]">
        <BasemapSwitcher value={basemapId} onChange={setBasemapId} />
      </div>

      <div className="absolute bottom-6 right-4 z-[1000]">
        <MapLegend parameter={parameter} />
      </div>
    </div>
  );
}

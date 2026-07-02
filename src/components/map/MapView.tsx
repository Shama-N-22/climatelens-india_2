// File: src/components/map/MapView.tsx
//
// Map panel. The sidebar index now drives BOTH the live GEE layer on the map
// AND the legend, so they always match. An opacity slider controls how much
// the base map shows through the index layer.

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import MapLegend from "../dashboard/MapLegend";
import BasemapSwitcher from "./BasemapSwitcher";
import { BASEMAPS, DEFAULT_BASEMAP, GEE_TILE_URLS } from "../../data/basemaps";
import type { ParamKey } from "../../data/legendRamps";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [23.0225, 72.5714]; // Ahmedabad

interface MapViewProps {
  parameter?: ParamKey;
  center?: [number, number];
  zoom?: number;
  cityId?: string; // accepted for compatibility; not used
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

export default function MapView({
  parameter = "ndvi",
  center = DEFAULT_CENTER,
  zoom = 11,
}: MapViewProps) {
  const [basemapId, setBasemapId] = useState(DEFAULT_BASEMAP.id);
  const [opacity, setOpacity] = useState(0.75);

  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? DEFAULT_BASEMAP;
  const geeUrl = GEE_TILE_URLS[parameter]; // matches the selected sidebar index

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="h-full w-full bg-[#0b1220]"
      >
        {/* base map */}
        <TileLayer
          key={basemap.id}
          url={basemap.url}
          attribution={basemap.attribution}
          {...(basemap.subdomains ? { subdomains: basemap.subdomains } : {})}
          maxZoom={basemap.maxZoom ?? 19}
        />

        {/* live GEE index layer, matched to the sidebar index */}
        {geeUrl && (
          <TileLayer
            key={parameter}
            url={geeUrl}
            attribution="Google Earth Engine &middot; Landsat"
            opacity={opacity}
            zIndex={400}
            maxZoom={18}
          />
        )}

        <FlyToCity center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* top-left: layer opacity */}
      {geeUrl && (
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

      {/* top-right: base map style */}
      <div className="absolute right-4 top-4 z-[1000]">
        <BasemapSwitcher value={basemapId} onChange={setBasemapId} />
      </div>

      {/* bottom-right: dynamic legend (follows the same index) */}
      <div className="absolute bottom-6 right-4 z-[1000]">
        <MapLegend parameter={parameter} />
      </div>
    </div>
  );
}

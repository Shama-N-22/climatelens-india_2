// File: src/components/map/MapView.tsx
//
// Map panel. Additive update:
//  - basemap switcher (Voyager / real OSM / Dark / Light / Satellite)
//  - flies to the selected city's center & zoom
//  - the Ahmedabad blue overlay now only shows when the city IS Ahmedabad

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import AhmedabadFloodOverlay, {
  AHMEDABAD_OVERLAY_BOUNDS,
} from "./AhmedabadFloodOverlay";
import OverlayControl from "../dashboard/controls/OverlayControl";
import MapLegend from "../dashboard/MapLegend";
import BasemapSwitcher from "./BasemapSwitcher";
import { BASEMAPS, DEFAULT_BASEMAP } from "../../data/basemaps";
import type { ParamKey } from "../../data/legendRamps";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  parameter?: ParamKey;
  center?: [number, number];
  zoom?: number;
  cityId?: string;
}

// flies the map to a new city when center/zoom change
function FlyToCity({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

export default function MapView({
  parameter = "flood",
  center = [
    AHMEDABAD_OVERLAY_BOUNDS.getCenter().lat,
    AHMEDABAD_OVERLAY_BOUNDS.getCenter().lng,
  ],
  zoom = 11,
  cityId = "ahmedabad",
}: MapViewProps) {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.7);
  const [basemapId, setBasemapId] = useState(DEFAULT_BASEMAP.id);

  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? DEFAULT_BASEMAP;

  // overlay only applies to Ahmedabad + flood/ndwi indices
  const overlayApplies =
    cityId === "ahmedabad" && (parameter === "flood" || parameter === "ndwi");

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

        <FlyToCity center={center} zoom={zoom} />

        <AhmedabadFloodOverlay
          visible={overlayVisible && overlayApplies}
          opacity={overlayOpacity}
        />

        {/* Windy-style corner controls */}
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* top-left: overlay control (only meaningful for Ahmedabad) */}
      {overlayApplies && (
        <div className="absolute left-4 top-4 z-[1000] w-64">
          <OverlayControl
            visible={overlayVisible}
            opacity={overlayOpacity}
            onToggle={setOverlayVisible}
            onOpacity={setOverlayOpacity}
          />
        </div>
      )}

      {/* top-right: basemap switcher */}
      <div className="absolute right-4 top-4 z-[1000]">
        <BasemapSwitcher value={basemapId} onChange={setBasemapId} />
      </div>

      {/* bottom-right: dynamic legend */}
      <div className="absolute bottom-6 right-4 z-[1000]">
        <MapLegend parameter={parameter} />
      </div>
    </div>
  );
}
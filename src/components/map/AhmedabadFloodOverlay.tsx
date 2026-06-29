// File: src/components/map/AhmedabadFloodOverlay.tsx
//
// Drops the blue-classified flood surface over Ahmedabad as a Leaflet
// ImageOverlay. Supports opacity, show/hide, and an animated fade-in.
//
// ⚠ SET THE REAL CORNER COORDINATES below. These are the south-west and
//   north-east corners of the satellite footprint. If you still have the
//   source GeoTIFF, run:  gdalinfo your.tif  and copy the corner lat/lng.
//   The defaults below are an Ahmedabad-centred placeholder.

import { useEffect, useState } from "react";
import { ImageOverlay, useMap } from "react-leaflet";
import { latLngBounds } from "leaflet";
import overlayUrl from "../../assets/overlays/ahmedabad-flood-overlay.png";

// [south, west] and [north, east]  — REPLACE with real GeoTIFF corners.
export const AHMEDABAD_OVERLAY_BOUNDS = latLngBounds(
  [22.92, 72.47], // SW corner
  [23.13, 72.69], // NE corner
);

interface AhmedabadFloodOverlayProps {
  visible: boolean;
  opacity: number; // 0..1
  fitOnMount?: boolean;
}

export default function AhmedabadFloodOverlay({
  visible,
  opacity,
  fitOnMount = false,
}: AhmedabadFloodOverlayProps) {
  const map = useMap();
  const [shown, setShown] = useState(false);

  // animated fade so it doesn't pop in
  useEffect(() => {
    if (visible) {
      const t = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(t);
    }
    setShown(false);
  }, [visible]);

  useEffect(() => {
    if (fitOnMount && visible) {
      map.fitBounds(AHMEDABAD_OVERLAY_BOUNDS, {
        padding: [40, 40],
        animate: true,
      });
    }
  }, [fitOnMount, visible, map]);

  if (!visible) return null;

  return (
    <ImageOverlay
      url={overlayUrl}
      bounds={AHMEDABAD_OVERLAY_BOUNDS}
      opacity={shown ? opacity : 0}
      zIndex={400}
      className="transition-opacity duration-700 ease-out"
      interactive={false}
    />
  );
}

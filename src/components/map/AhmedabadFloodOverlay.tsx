// File: src/components/map/AhmedabadFloodOverlay.tsx
//
// Shows the real Ahmedabad index rasters (NDVI / NDWI / NDBI) over the map,
// switching with the selected parameter. Flood & LST have no raster here
// (flood overlay was the wrong region; LST export was blank).
//
// ⚠ Bounds are still placeholders — replace with the GeoTIFF corner
//   coordinates (gdalinfo) for exact alignment.

import { useEffect, useState } from "react";
import { ImageOverlay } from "react-leaflet";
import { latLngBounds } from "leaflet";
import type { ParamKey } from "../../data/legendRamps";
import ndvi from "../../assets/overlays/ndvi-ahmedabad.png";
import ndwi from "../../assets/overlays/ndwi-ahmedabad.png";
import ndbi from "../../assets/overlays/ndbi-ahmedabad.png";

// [south, west] -> [north, east]
// Extent chosen to match the raster's aspect ratio (no stretching) over
// greater Ahmedabad. Replace with real GeoTIFF corners for exact alignment.
export const AHMEDABAD_OVERLAY_BOUNDS = latLngBounds(
  [22.65, 72.02],
  [23.35, 73.1],
);

const IMAGES: Partial<Record<ParamKey, string>> = { ndvi, ndwi, ndbi };

interface AhmedabadFloodOverlayProps {
  parameter: ParamKey;
  visible: boolean;
  opacity: number; // 0..1
}

export default function AhmedabadFloodOverlay({
  parameter,
  visible,
  opacity,
}: AhmedabadFloodOverlayProps) {
  const url = IMAGES[parameter];
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (visible && url) {
      const t = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(t);
    }
    setShown(false);
  }, [visible, url]);

  if (!visible || !url) return null;

  return (
    <ImageOverlay
      key={parameter}
      url={url}
      bounds={AHMEDABAD_OVERLAY_BOUNDS}
      opacity={shown ? opacity : 0}
      zIndex={400}
      className="transition-opacity duration-700 ease-out"
      interactive={false}
    />
  );
}

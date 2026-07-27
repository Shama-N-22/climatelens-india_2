// File: src/pages/Landslide.tsx
import { Mountain, TrendingUp, Layers, Map } from "lucide-react";
import HazardDashboard, { type HazardConfig } from "./HazardDashboard";

const config: HazardConfig = {
  title: "Landslide",
  hotspotLabel: "Landslide Hotspot",
  hotspotIcon: Mountain,
  parameters: [
    {
      key: "dem",
      label: "DEM (Elevation)",
      icon: Mountain,
      blurb: "Digital elevation model — terrain height above sea level.",
    },
    {
      key: "slope",
      label: "Slope",
      icon: TrendingUp,
      blurb: "Terrain steepness derived from the DEM.",
    },
    {
      key: "soil",
      label: "Soil",
      icon: Layers,
      blurb: "Soil type / texture influencing landslide susceptibility.",
    },
    {
      key: "lulc",
      label: "LULC",
      icon: Map,
      blurb: "Land use / land cover classification.",
    },
  ],
  insight: {
    summary:
      "Landslide susceptibility layers (DEM, slope, soil, LULC) and the landslide hotspot model are being prepared. DEM and slope are computable from SRTM; soil and LULC use public datasets.",
    recommendation:
      "Connect the terrain, soil and land-cover datasets to activate live landslide layers.",
    priority: "High",
    budget: "—",
    improvement: "Pending data",
    confidence: 0,
  },
};

export default function Landslide() {
  return <HazardDashboard config={config} />;
}

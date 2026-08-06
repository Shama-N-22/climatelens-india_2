// File: src/pages/Flood.tsx
import {
  Droplets,
  CloudRain,
  Map,
  Mountain,
  TrendingUp,
  Waves,
} from "lucide-react";
import HazardDashboard, { type HazardConfig } from "./HazardDashboard";

const config: HazardConfig = {
  title: "Flood",
  hotspotLabel: "Flood Susceptibility",
  hotspotIcon: Waves,
  parameters: [
    {
      key: "river",
      label: "River",
      icon: Droplets,
      blurb: "River network and proximity to water channels.",
    },
    {
      key: "rainfall",
      label: "Rainfall",
      icon: CloudRain,
      blurb: "Rainfall intensity and accumulation.",
    },
    {
      key: "lulc",
      label: "LULC",
      icon: Map,
      blurb: "Land use / land cover classification.",
    },
    {
      key: "dem",
      label: "DEM",
      icon: Mountain,
      blurb: "Digital elevation model — terrain height above sea level.",
    },
    {
      key: "slope",
      label: "Slope",
      icon: TrendingUp,
      blurb: "Terrain steepness derived from the DEM.",
    },
  ],
  insight: {
    summary:
      "Flood susceptibility layers (River, Rainfall, LULC, DEM, Slope) are being prepared for India scale. The map, buildings, hospitals and ward overlays are already live.",
    recommendation:
      "Connect the river, rainfall, land-cover and terrain datasets to activate live flood layers.",
    priority: "High",
    budget: "—",
    improvement: "Pending data",
    confidence: 0,
  },
};

export default function Flood() {
  return <HazardDashboard config={config} />;
}

// File: src/pages/Flood.tsx
import { Droplets, Waves, CloudRain } from "lucide-react";
import HazardDashboard, { type HazardConfig } from "./HazardDashboard";

const config: HazardConfig = {
  title: "Flood",
  hotspotLabel: "Flood Hotspot",
  hotspotIcon: Waves,
  parameters: [
    {
      key: "rp5",
      label: "5-Year Return Period",
      icon: Droplets,
      blurb: "Flood extent expected once every 5 years on average.",
    },
    {
      key: "rp10",
      label: "10-Year Return Period",
      icon: Droplets,
      blurb: "Flood extent expected once every 10 years on average.",
    },
    {
      key: "rp50",
      label: "50-Year Return Period",
      icon: Waves,
      blurb: "Flood extent expected once every 50 years on average.",
    },
    {
      key: "rp100",
      label: "100-Year Return Period",
      icon: CloudRain,
      blurb: "Flood extent expected once every 100 years on average.",
    },
  ],
  insight: {
    summary:
      "Flood return-period layers and the flood hotspot model are being prepared. The map, buildings, hospitals and ward overlays are already live for all three cities.",
    recommendation:
      "Connect the hydrological return-period datasets to activate live flood layers.",
    priority: "High",
    budget: "—",
    improvement: "Pending data",
    confidence: 0,
  },
};

export default function Flood() {
  return <HazardDashboard config={config} />;
}

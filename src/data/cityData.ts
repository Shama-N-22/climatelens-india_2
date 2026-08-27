// File: src/data/cityData.ts
import type { ParamKey } from "./legendRamps";

export type Trend = "up" | "down" | "flat";
export type Status = "good" | "watch" | "warn" | "critical";

export interface Kpi {
  key: string;
  label: string;
  value: number;
  unit: string;
  decimals?: number;
  trend: Trend;
  delta: string; // e.g. "+2.4%"
  status: Status;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Status;
  time: string;
}

export interface Insight {
  summary: string;
  recommendation: string;
  confidence: number; // 0..100
  priority: "Low" | "Medium" | "High" | "Critical";
  budget: string;
  improvement: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  center: [number, number];
  zoom: number;
  kpis: Kpi[];
  alerts: Alert[];
  insights: Record<ParamKey, Insight>;
}

export const CITIES: City[] = [
  {
    id: "telangana",
    name: "Telangana",
    state: "Telangana",
    center: [17.8764, 79.2793],
    zoom: 7,
    kpis: [
      {
        key: "pop",
        label: "Population",
        value: 39000000,
        unit: "",
        trend: "up",
        delta: "+1.5%",
        status: "watch",
      },
      {
        key: "temp",
        label: "Temperature",
        value: 35.4,
        unit: "°C",
        decimals: 1,
        trend: "up",
        delta: "+1.4°",
        status: "watch",
      },
      {
        key: "humidity",
        label: "Humidity",
        value: 48,
        unit: "%",
        trend: "flat",
        delta: "+1%",
        status: "good",
      },
      {
        key: "rain",
        label: "Rainfall (24h)",
        value: 9.6,
        unit: "mm",
        decimals: 1,
        trend: "down",
        delta: "-2 mm",
        status: "good",
      },
      {
        key: "flood",
        label: "Flood Risk",
        value: 49,
        unit: "/100",
        trend: "flat",
        delta: "+3",
        status: "watch",
      },
      {
        key: "aqi",
        label: "AQI",
        value: 92,
        unit: "",
        trend: "down",
        delta: "-11",
        status: "good",
      },
      {
        key: "veg",
        label: "Vegetation",
        value: 44,
        unit: "%",
        trend: "up",
        delta: "+1.8%",
        status: "good",
      },
      {
        key: "reservoir",
        label: "Reservoir",
        value: 61,
        unit: "%",
        trend: "down",
        delta: "-5%",
        status: "watch",
      },
    ],
    alerts: [
      {
        id: "a1",
        title: "Reservoir Watch",
        message:
          "Multiple district reservoirs trending below seasonal average.",
        severity: "watch",
        time: "18 min ago",
      },
      {
        id: "a2",
        title: "Urban Heat Pocket",
        message: "Hyderabad IT corridor registering localised heat build-up.",
        severity: "watch",
        time: "44 min ago",
      },
      {
        id: "a3",
        title: "Village-Level Water Stress",
        message:
          "Change detection flags shrinking tank/pond cover in southern districts.",
        severity: "warn",
        time: "2 hr ago",
      },
    ],
    insights: {
      flood: {
        summary:
          "Flood risk concentrates around lake overflow zones and choked drains in the Hyderabad metro core, with scattered village-level tank overflow elsewhere in the state.",
        recommendation:
          "Restore full-tank-level buffers around major lakes/tanks and clear interconnecting channels statewide.",
        confidence: 81,
        priority: "High",
        budget: "₹96 Cr",
        improvement: "-22% overflow risk",
      },
      lst: {
        summary:
          "Urban corridors run notably hotter than the surrounding rural and forested districts.",
        recommendation:
          "Deploy reflective surfaces and shade corridors across dense urban belts; track rural LST drift separately.",
        confidence: 78,
        priority: "Medium",
        budget: "₹31 Cr",
        improvement: "-1.9°C corridor LST",
      },
      ndvi: {
        summary:
          "Forested northern districts hold steady vegetation while southern/central districts show more variability.",
        recommendation:
          "Sustain forestry programs in the north and target afforestation in low-NDVI southern districts.",
        confidence: 83,
        priority: "Medium",
        budget: "₹19 Cr",
        improvement: "+4% connected canopy",
      },
      ndbi: {
        summary:
          "Built-up growth is concentrated around Hyderabad and district headquarters, with village footprints comparatively stable.",
        recommendation:
          "Maintain growth boundaries near urban centres and monitor peri-urban sprawl.",
        confidence: 74,
        priority: "Medium",
        budget: "₹17 Cr",
        improvement: "-10% fringe sprawl",
      },
      ndwi: {
        summary:
          "Village tank and pond extent is a key hydrological feature and shows pressure in several districts.",
        recommendation:
          "Enforce tank/pond protection zones and monitor inflow channels for blockage at village scale.",
        confidence: 80,
        priority: "High",
        budget: "₹23 Cr",
        improvement: "+9% water body extent",
      },
    },
  },
];

export const getCity = (id: string) =>
  CITIES.find((c) => c.id === id) ?? CITIES[0];

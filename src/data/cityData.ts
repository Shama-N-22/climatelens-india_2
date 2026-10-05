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

// Full list of Indian states and union territories for the sidebar dropdown,
// each with an approximate map centre and a zoom level sized to the state.
// Only the states present in CITIES below have live data layers; selecting any
// other state still flies the map to it and shows an "awaiting data" state.
export interface StateView {
  name: string;
  center: [number, number];
  zoom: number;
}

export const INDIAN_STATES: StateView[] = [
  { name: "Andhra Pradesh", center: [15.9129, 79.74], zoom: 7 },
  { name: "Arunachal Pradesh", center: [28.218, 94.7278], zoom: 7 },
  { name: "Assam", center: [26.2006, 92.9376], zoom: 7 },
  { name: "Bihar", center: [25.0961, 85.3131], zoom: 7 },
  { name: "Chhattisgarh", center: [21.2787, 81.8661], zoom: 7 },
  { name: "Goa", center: [15.2993, 74.124], zoom: 10 },
  { name: "Gujarat", center: [22.2587, 71.1924], zoom: 7 },
  { name: "Haryana", center: [29.0588, 76.0856], zoom: 8 },
  { name: "Himachal Pradesh", center: [31.1048, 77.1734], zoom: 8 },
  { name: "Jharkhand", center: [23.6102, 85.2799], zoom: 7 },
  { name: "Karnataka", center: [15.3173, 75.7139], zoom: 7 },
  { name: "Kerala", center: [10.8505, 76.2711], zoom: 7 },
  { name: "Madhya Pradesh", center: [22.9734, 78.6569], zoom: 6 },
  { name: "Maharashtra", center: [19.7515, 75.7139], zoom: 6 },
  { name: "Manipur", center: [24.6637, 93.9063], zoom: 8 },
  { name: "Meghalaya", center: [25.467, 91.3662], zoom: 8 },
  { name: "Mizoram", center: [23.1645, 92.9376], zoom: 8 },
  { name: "Nagaland", center: [26.1584, 94.5624], zoom: 8 },
  { name: "Odisha", center: [20.9517, 85.0985], zoom: 7 },
  { name: "Punjab", center: [31.1471, 75.3412], zoom: 8 },
  { name: "Rajasthan", center: [27.0238, 74.2179], zoom: 6 },
  { name: "Sikkim", center: [27.533, 88.5122], zoom: 9 },
  { name: "Tamil Nadu", center: [11.1271, 78.6569], zoom: 7 },
  { name: "Telangana", center: [17.8764, 79.2793], zoom: 7 },
  { name: "Tripura", center: [23.9408, 91.9882], zoom: 9 },
  { name: "Uttar Pradesh", center: [26.8467, 80.9462], zoom: 6 },
  { name: "Uttarakhand", center: [30.0668, 79.0193], zoom: 8 },
  { name: "West Bengal", center: [22.9868, 87.855], zoom: 7 },
  { name: "Andaman and Nicobar Islands", center: [11.7401, 92.6586], zoom: 7 },
  { name: "Chandigarh", center: [30.7333, 76.7794], zoom: 12 },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    center: [20.3974, 72.8328],
    zoom: 10,
  },
  { name: "Delhi", center: [28.7041, 77.1025], zoom: 10 },
  { name: "Jammu and Kashmir", center: [33.7782, 76.5762], zoom: 7 },
  { name: "Ladakh", center: [34.2268, 77.5619], zoom: 7 },
  { name: "Lakshadweep", center: [10.5667, 72.6417], zoom: 9 },
  { name: "Puducherry", center: [11.9416, 79.8083], zoom: 11 },
];

// Fallback map view (whole of India) if a state name can't be matched.
export const INDIA_VIEW: { center: [number, number]; zoom: number } = {
  center: [22.5, 79.0],
  zoom: 5,
};

// Centre/zoom for a state name, falling back to the all-India view.
export const getStateView = (stateName: string) =>
  INDIAN_STATES.find((s) => s.name === stateName) ?? {
    name: stateName,
    center: INDIA_VIEW.center,
    zoom: INDIA_VIEW.zoom,
  };

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

// Returns the full City record for a state name, or null if it has no data yet.
export const getCityByState = (stateName: string): City | null =>
  CITIES.find((c) => c.name === stateName) ?? null;

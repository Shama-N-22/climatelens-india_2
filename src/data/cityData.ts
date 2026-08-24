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
    id: "ahmedabad",
    name: "Gujarat",
    state: "Ahmedabad",
    center: [23.0225, 72.5714],
    zoom: 11,
    kpis: [
      {
        key: "pop",
        label: "Population",
        value: 8400000,
        unit: "",
        trend: "up",
        delta: "+1.8%",
        status: "watch",
      },
      {
        key: "temp",
        label: "Temperature",
        value: 41.2,
        unit: "°C",
        decimals: 1,
        trend: "up",
        delta: "+2.1°",
        status: "warn",
      },
      {
        key: "humidity",
        label: "Humidity",
        value: 38,
        unit: "%",
        trend: "down",
        delta: "-4%",
        status: "good",
      },
      {
        key: "rain",
        label: "Rainfall (24h)",
        value: 12.4,
        unit: "mm",
        decimals: 1,
        trend: "up",
        delta: "+12 mm",
        status: "watch",
      },
      {
        key: "flood",
        label: "Flood Risk",
        value: 64,
        unit: "/100",
        trend: "up",
        delta: "+9",
        status: "warn",
      },
      {
        key: "aqi",
        label: "AQI",
        value: 168,
        unit: "",
        trend: "up",
        delta: "+22",
        status: "warn",
      },
      {
        key: "veg",
        label: "Vegetation",
        value: 27,
        unit: "%",
        trend: "down",
        delta: "-1.4%",
        status: "watch",
      },
      {
        key: "reservoir",
        label: "Reservoir",
        value: 58,
        unit: "%",
        trend: "down",
        delta: "-6%",
        status: "watch",
      },
    ],
    alerts: [
      {
        id: "a1",
        title: "Heat Wave Warning",
        message: "Sabarmati corridor expected to cross 43°C by 15:00.",
        severity: "warn",
        time: "11 min ago",
      },
      {
        id: "a2",
        title: "Flood Susceptibility High",
        message: "Low-lying eastern wards flagged after upstream release.",
        severity: "critical",
        time: "38 min ago",
      },
      {
        id: "a3",
        title: "Poor AQI",
        message: "PM2.5 elevated near Naroda industrial belt.",
        severity: "watch",
        time: "1 hr ago",
      },
    ],
    insights: {
      flood: {
        summary:
          "Eastern and riverside wards show critical flood susceptibility driven by poor drainage and low elevation.",
        recommendation:
          "Prioritise stormwater capacity upgrades in 6 eastern wards and deploy early-warning sensors along the Sabarmati.",
        confidence: 88,
        priority: "High",
        budget: "₹42 Cr",
        improvement: "-31% inundation area",
      },
      lst: {
        summary:
          "Dense built-up cores register surface temperatures 6–8°C above vegetated zones.",
        recommendation:
          "Expand tree canopy and cool-roof programs across the western commercial district.",
        confidence: 82,
        priority: "Medium",
        budget: "₹18 Cr",
        improvement: "-2.4°C peak LST",
      },
      ndvi: {
        summary:
          "Vegetation cover has declined steadily along the urban periphery over five years.",
        recommendation:
          "Protect remaining green wedges and target afforestation in low-NDVI wards.",
        confidence: 79,
        priority: "Medium",
        budget: "₹11 Cr",
        improvement: "+4% green cover",
      },
      ndbi: {
        summary:
          "Built-up expansion outpaces planned growth in the north-east quadrant.",
        recommendation:
          "Tighten land-use enforcement and incentivise vertical density over sprawl.",
        confidence: 75,
        priority: "Medium",
        budget: "₹9 Cr",
        improvement: "-18% unplanned spread",
      },
      ndwi: {
        summary:
          "Surface water bodies show shrinking extent versus the 2020 baseline.",
        recommendation:
          "Restore and de-silt key lakes; protect wetland buffers from encroachment.",
        confidence: 80,
        priority: "High",
        budget: "₹14 Cr",
        improvement: "+12% water retention",
      },
    },
  },
  {
    id: "mumbai",
    name: "Maharashtra",
    state: "Mumbai",
    center: [19.076, 72.8777],
    zoom: 11,
    kpis: [
      {
        key: "pop",
        label: "Population",
        value: 20400000,
        unit: "",
        trend: "up",
        delta: "+1.1%",
        status: "watch",
      },
      {
        key: "temp",
        label: "Temperature",
        value: 33.6,
        unit: "°C",
        decimals: 1,
        trend: "flat",
        delta: "+0.3°",
        status: "good",
      },
      {
        key: "humidity",
        label: "Humidity",
        value: 81,
        unit: "%",
        trend: "up",
        delta: "+6%",
        status: "watch",
      },
      {
        key: "rain",
        label: "Rainfall (24h)",
        value: 96.2,
        unit: "mm",
        decimals: 1,
        trend: "up",
        delta: "+64 mm",
        status: "critical",
      },
      {
        key: "flood",
        label: "Flood Risk",
        value: 87,
        unit: "/100",
        trend: "up",
        delta: "+14",
        status: "critical",
      },
      {
        key: "aqi",
        label: "AQI",
        value: 121,
        unit: "",
        trend: "down",
        delta: "-9",
        status: "watch",
      },
      {
        key: "veg",
        label: "Vegetation",
        value: 34,
        unit: "%",
        trend: "flat",
        delta: "0%",
        status: "good",
      },
      {
        key: "reservoir",
        label: "Reservoir",
        value: 73,
        unit: "%",
        trend: "up",
        delta: "+8%",
        status: "good",
      },
    ],
    alerts: [
      {
        id: "a1",
        title: "Heavy Rain Alert",
        message: "Nowcast: 90–110 mm over the next 3 hours across island city.",
        severity: "critical",
        time: "4 min ago",
      },
      {
        id: "a2",
        title: "Flood Warning",
        message: "Hindmata and Sion underpasses at high waterlogging risk.",
        severity: "critical",
        time: "20 min ago",
      },
      {
        id: "a3",
        title: "Wind Warning",
        message: "Coastal gusts up to 55 km/h expected after 18:00.",
        severity: "watch",
        time: "52 min ago",
      },
    ],
    insights: {
      flood: {
        summary:
          "Tidal coupling with intense rainfall makes the central island city highly flood-prone.",
        recommendation:
          "Activate pumping stations pre-emptively and clear major nullahs ahead of high tide.",
        confidence: 91,
        priority: "Critical",
        budget: "₹78 Cr",
        improvement: "-40% peak waterlogging",
      },
      lst: {
        summary:
          "Heat is moderated by coastal exposure but inland pockets still spike.",
        recommendation:
          "Focus cooling interventions on eastern suburbs away from the sea breeze.",
        confidence: 77,
        priority: "Medium",
        budget: "₹22 Cr",
        improvement: "-1.8°C inland LST",
      },
      ndvi: {
        summary:
          "Mangrove and hill greenery hold steady but face encroachment pressure.",
        recommendation:
          "Strengthen mangrove protection and monitor hillslope clearing.",
        confidence: 84,
        priority: "High",
        budget: "₹16 Cr",
        improvement: "+3% protected cover",
      },
      ndbi: {
        summary:
          "Built-up density is among the highest nationally, limiting permeable surface.",
        recommendation:
          "Mandate permeable paving and blue-green infrastructure in redevelopment.",
        confidence: 73,
        priority: "High",
        budget: "₹19 Cr",
        improvement: "+9% permeability",
      },
      ndwi: {
        summary:
          "Creek and wetland water extent fluctuates sharply with tides and runoff.",
        recommendation:
          "Restore creek hydrology and protect remaining wetland buffers.",
        confidence: 81,
        priority: "High",
        budget: "₹21 Cr",
        improvement: "+10% buffer retention",
      },
    },
  },
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

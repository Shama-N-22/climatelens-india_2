// File: src/data/basemaps.ts
//
// Selectable basemaps. CARTO Voyager stays the default (the look you liked).
// "OpenStreetMap" is the real OSM standard tile service.
//
// The "* (Live)" entries stream live Google Earth Engine tiles for the three
// city regions (Ahmedabad, Hyderabad, Mumbai).
// ⚠ These GEE tile URLs contain a token that EXPIRES in ~1–2 days. When a
//   live layer stops loading, re-run the GEE script, copy the fresh
//   urlFormat, and replace the matching url string below.

export interface Basemap {
  id: string;
  label: string;
  url: string;
  attribution: string;
  subdomains?: string;
  maxZoom?: number;
}

export const BASEMAPS: Basemap[] = [
  {
    id: "voyager",
    label: "Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 20,
  },
  {
    id: "osm",
    label: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    subdomains: "abc",
    maxZoom: 19,
  },
  {
    id: "dark",
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 20,
  },
  {
    id: "light",
    label: "Light",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 20,
  },
  {
    id: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },

  // ---- Live Google Earth Engine layers (June 2025) ----
  {
    id: "gee-lst",
    label: "LST (Live)",
    url: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/17d7477ed09010852476bd39621fdd7a-705b1ef67d3069d04237c0c89ed9a0e8/tiles/{z}/{x}/{y}",
    attribution: "Google Earth Engine &middot; Landsat",
    maxZoom: 18,
  },
  {
    id: "gee-ndvi",
    label: "NDVI (Live)",
    url: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/85000db96e504dea9e3e02827f04ff73-024ff2f7b3f9de437eb45b4211b9180b/tiles/{z}/{x}/{y}",
    attribution: "Google Earth Engine &middot; Landsat",
    maxZoom: 18,
  },
  {
    id: "gee-bi",
    label: "Built-up (Live)",
    url: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/e03379828c7f10f3ffcaf140dc09fd67-6d109cda00eb34518659b7ebc561130b/tiles/{z}/{x}/{y}",
    attribution: "Google Earth Engine &middot; Landsat",
    maxZoom: 18,
  },
  {
    id: "gee-wi",
    label: "Water (Live)",
    url: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/2dc3bdbc4aaa7b1b11323983bf1f1be2-567d8b676f6772e49760bb984d5e19a4/tiles/{z}/{x}/{y}",
    attribution: "Google Earth Engine &middot; Landsat",
    maxZoom: 18,
  },
];

export const DEFAULT_BASEMAP = BASEMAPS[0];
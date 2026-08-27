// File: src/data/basemaps.ts
import type { ParamKey } from "./legendRamps";

// Base map styles (chosen from the top-right switcher).
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
];

// CARTO's basemaps.cartocdn.com raster endpoint (used by voyager/dark/light
// above) now requires a paid/free API key that this project doesn't have -
// defaulting to OSM since it needs no key and works immediately. The
// voyager/dark/light options are left in the switcher below but will show
// CARTO's "API KEY REQUIRED" watermark until someone adds a real key from
// carto.com/basemaps/apikey.
export const DEFAULT_BASEMAP =
  BASEMAPS.find((b) => b.id === "osm") ?? BASEMAPS[0];

// ---- Live Google Earth Engine index layers, keyed by the sidebar index ----
// Selecting an index in the sidebar shows the matching layer here, so the map
// and the legend always agree.
// ⚠ These GEE tile URLs carry a token that EXPIRES in ~1–2 days. When a layer
//   stops loading, re-run the GEE script and replace the matching url below.
export const GEE_TILE_URLS: Partial<Record<ParamKey, string>> = {
  lst: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/ae7bbbed6db1f34e70a85ac035c94aea-58e83d3b034aad8455fa65c25be3737f/tiles/{z}/{x}/{y}",
  ndvi: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/9822b8b1762abb6a2b50c29967e0ce36-401380742a813199bc7f1d6481699c9b/tiles/{z}/{x}/{y}",
  ndbi: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/e3f57d79ed211132c8e512d526d60cbd-d6a77d112d3dc33a4dc4f68182f8950a/tiles/{z}/{x}/{y}",
  ndwi: "https://earthengine.googleapis.com/v1/projects/argon-key-461118-u4/maps/cc880c8541e5e095fad935b521c1dbde-8dbbbc30757399aad05384e2de80c78f/tiles/{z}/{x}/{y}",
};

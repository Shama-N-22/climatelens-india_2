// File: src/components/map/MapView.tsx
//
// Map panel. Index tiles + buildings come from the backend. Hospitals and ward
// boundaries are vector overlays from /public/geojson.
// Backward compatible: Heat & Health dashboard passes nothing new.
// New props (used by Flood / Landslide):
//   hotspotLabel  - label for the hotspot opacity slider ("Flood Hotspot" etc.)
//   comingSoon    - true = skip index/hotspot fetch, show "awaiting data" badge
//                   (basemap + buildings/hospitals/wards still work)

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MapLegend from "../dashboard/MapLegend";
import BasemapSwitcher from "./BasemapSwitcher";
import { BASEMAPS, DEFAULT_BASEMAP } from "../../data/basemaps";
import { monthLabel, DEFAULT_TIMELINE } from "../../data/geeTimeline";
import { API_BASE } from "../../config";
import type { ParamKey } from "../../data/legendRamps";

function lookupStat(
  table: Record<string, number> | null,
  name: any,
): number | undefined {
  if (!table || name == null) return undefined;
  const key = String(name);
  if (table[key] != null) return table[key];
  const lower = key.toLowerCase();
  for (const k of Object.keys(table)) {
    if (k.toLowerCase() === lower) return table[k];
  }
  return undefined;
}
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [23.0225, 72.5714];

// ---- ADDED Nov 2026: all-India terrain & environment layers ----------------
// Each one is a single backend call: /api/layer/<key>?state=<cityId>
// They are drawn UNDER the index/UHI tiles so they never hide the heat layer.
// Unlike the index layers these have data for every state in the country, so
// they are deliberately NOT gated behind `comingSoon`.
const EXTRA_KEYS = [
  "dem",
  "slope",
  "lulc",
  "rainfall",
  "water",
  "soil",
  "rivers",
] as const;
type ExtraKey = (typeof EXTRA_KEYS)[number];

const EXTRA_META: Record<
  ExtraKey,
  { label: string; z: number; ramp: string[]; scale: string }
> = {
  dem: {
    label: "Elevation",
    z: 300,
    ramp: ["#1a9850", "#fee08b", "#fdae61", "#8c510a", "#ffffff"],
    scale: "0 - 3000 m",
  },
  slope: {
    label: "Slope",
    z: 310,
    ramp: ["#2c7bb6", "#1a9850", "#ffffbf", "#fdae61", "#d7191c"],
    scale: "0 - 45\u00b0",
  },
  lulc: {
    label: "Land cover",
    z: 320,
    ramp: [
      "#006400",
      "#ffbb22",
      "#ffff4c",
      "#f096ff",
      "#fa0000",
      "#b4b4b4",
      "#0064c8",
    ],
    scale: "tree / shrub / grass / crop / built / bare / water",
  },
  rainfall: {
    label: "Rainfall",
    z: 330,
    ramp: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
    scale: "100 - 3000 mm / yr",
  },
  water: {
    label: "Surface water",
    z: 340,
    ramp: ["#ffffff", "#ffbbbb", "#0000ff"],
    scale: "0 - 100% of the time (1984-2021)",
  },
  soil: {
    label: "Soil texture",
    z: 350,
    ramp: [
      "#d5c36b",
      "#b96947",
      "#ae868f",
      "#368f20",
      "#ffd557",
      "#fff72e",
      "#ff005b",
    ],
    scale: "clay \u2192 loam \u2192 sand (USDA classes)",
  },
  rivers: {
    label: "Rivers & streams",
    z: 460,
    ramp: ["#1d6fb8", "#1d6fb8"],
    scale: "stream network",
  },
};

interface MapViewProps {
  parameter?: string;
  center?: [number, number];
  zoom?: number;
  cityId?: string;
  year?: number;
  month?: number;
  showBuildings?: boolean;
  showHospitals?: boolean;
  showWards?: boolean;
  showUHI?: boolean;
  showIndex?: boolean;
  hotspotLabel?: string;
  comingSoon?: boolean;
  // ---- ADDED Nov 2026: all-India terrain & environment layers ----
  showRivers?: boolean;
  showRainfall?: boolean;
  showLulc?: boolean;
  showDem?: boolean;
  showSlope?: boolean;
  showWater?: boolean;
  showSoil?: boolean;
  onSelectFeature?: (
    f: { type: "hospital" | "ward"; props: Record<string, any> } | null,
  ) => void;
}

function FlyToCity({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

type Status = "loading" | "ok" | "empty" | "error" | "soon";

export default function MapView({
  parameter = "ndvi",
  center = DEFAULT_CENTER,
  zoom = 11,
  cityId = "ahmedabad",
  year = DEFAULT_TIMELINE.year,
  month = DEFAULT_TIMELINE.month,
  showBuildings = false,
  showHospitals = false,
  showWards = false,
  showUHI = false,
  showIndex = true,
  hotspotLabel = "UHI",
  comingSoon = false,
  // ---- ADDED Nov 2026 ----
  showRivers = false,
  showRainfall = false,
  showLulc = false,
  showDem = false,
  showSlope = false,
  showWater = false,
  showSoil = false,
  onSelectFeature,
}: MapViewProps) {
  const [basemapId, setBasemapId] = useState(DEFAULT_BASEMAP.id);
  const [opacity, setOpacity] = useState(0.75);
  const [uhiOpacity, setUhiOpacity] = useState(0.8);
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [buildingsUrl, setBuildingsUrl] = useState<string | null>(null);
  const [uhiUrl, setUhiUrl] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);
  const [districtStats, setDistrictStats] = useState<Record<
    string,
    number
  > | null>(null);
  const [buildingCounts, setBuildingCounts] = useState<Record<
    string,
    number
  > | null>(null);
  const [districtPopulation, setDistrictPopulation] = useState<Record<
    string,
    number
  > | null>(null);
  // ---- ADDED Nov 2026: tile urls + a shared opacity for the extra layers ----
  const [extraUrls, setExtraUrls] = useState<Partial<Record<ExtraKey, string>>>(
    {},
  );
  const [extraOpacity, setExtraOpacity] = useState(0.8);

  const extraOn: Record<ExtraKey, boolean> = {
    dem: showDem,
    slope: showSlope,
    lulc: showLulc,
    rainfall: showRainfall,
    water: showWater,
    soil: showSoil,
    rivers: showRivers,
  };
  const activeExtras = EXTRA_KEYS.filter((k) => extraOn[k]);
  const activeExtrasKey = activeExtras.join(",");

  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? DEFAULT_BASEMAP;

  // index tiles
  useEffect(() => {
    if (comingSoon) {
      setStatus("soon");
      setTileUrl(null);
      return;
    }
    let cancelled = false;
    setStatus("loading");
    setTileUrl(null);
    fetch(
      `${API_BASE}/api/tiles/${parameter}?city=${cityId}&year=${year}&month=${month}`,
    )
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d && d.url) {
          setTileUrl(d.url);
          setStatus("ok");
        } else setStatus("empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [parameter, cityId, year, month, comingSoon]);

  // buildings (backend tile)
  useEffect(() => {
    if (!showBuildings) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/buildings?city=${cityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.url) setBuildingsUrl(d.url);
      })
      .catch(() => {
        if (!cancelled) setBuildingsUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showBuildings, cityId]);

  // hotspot (backend tile) — skipped when comingSoon
  useEffect(() => {
    if (comingSoon || !showUHI) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/uhi?city=${cityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.url) setUhiUrl(d.url);
      })
      .catch(() => {
        if (!cancelled) setUhiUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showUHI, cityId, comingSoon]);

  // hospitals (local geojson)
  useEffect(() => {
    if (!showHospitals) {
      setHospitals(null);
      return;
    }
    let cancelled = false;
    fetch(`/geojson/hospitals-${cityId}.geojson`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setHospitals(d);
      })
      .catch(() => {
        if (!cancelled) setHospitals(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showHospitals, cityId]);

  // wards (local geojson)
  useEffect(() => {
    if (!showWards) {
      setWards(null);
      return;
    }
    let cancelled = false;
    // ADDED Nov 2026: try the existing per-city wards file first (Telangana's
    // carries population + hospital counts, so it must keep winning), then
    // fall back to the all-India district boundaries added from the 2011
    // Census shapefile.
    (async () => {
      let data: any = null;
      try {
        const r1 = await fetch(`/geojson/wards-${cityId}.geojson`);
        if (r1.ok) data = await r1.json();
      } catch {
        /* fall through to the districts file */
      }
      if (!data) {
        try {
          const r2 = await fetch(`/geojson/districts/${cityId}.geojson`);
          if (r2.ok) data = await r2.json();
        } catch {
          data = null;
        }
      }
      if (!cancelled) setWards(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [showWards, cityId]);

  // per-district max LST (Telangana's district popup "Max temperature" stat).
  // Ahmedabad/Mumbai's ward popups don't show this field, so no need to fetch
  // it for them.
  useEffect(() => {
    if (cityId === "ahmedabad" || cityId === "mumbai") {
      setDistrictStats(null);
      return;
    }
    let cancelled = false;
    const url =
      cityId === "telangana"
        ? `${API_BASE}/api/district-stats?city=${cityId}&year=${year}&month=${month}`
        : `${API_BASE}/api/state-district-stats?state=${cityId}&year=${year}&month=${month}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.stats) setDistrictStats(d.stats);
      })
      .catch(() => {
        if (!cancelled) setDistrictStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [cityId, year, month]);

  // per-district building counts (Telangana's "Number of buildings" stat).
  // No year/month dependency - building footprints don't change over time,
  // so this only needs to fetch once per city.
  useEffect(() => {
    if (cityId === "ahmedabad" || cityId === "mumbai") {
      setBuildingCounts(null);
      return;
    }
    let cancelled = false;
    const url =
      cityId === "telangana"
        ? `${API_BASE}/api/district-building-counts?city=${cityId}`
        : `${API_BASE}/api/state-district-building-counts?state=${cityId}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.counts) setBuildingCounts(d.counts);
      })
      .catch(() => {
        if (!cancelled) setBuildingCounts(null);
      });
    return () => {
      cancelled = true;
    };
  }, [cityId]);

  useEffect(() => {
    if (cityId === "ahmedabad" || cityId === "mumbai") {
      setDistrictPopulation(null);
      return;
    }
    let cancelled = false;
    fetch(`${API_BASE}/api/state-district-population?state=${cityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d && d.population) setDistrictPopulation(d.population);
      })
      .catch(() => {
        if (!cancelled) setDistrictPopulation(null);
      });
    return () => {
      cancelled = true;
    };
  }, [cityId]);

  // ---- ADDED Nov 2026: drop cached tile urls whenever the state changes ----
  useEffect(() => {
    setExtraUrls({});
  }, [cityId]);

  // ---- ADDED Nov 2026: fetch a tile url for each switched-on extra layer ----
  // The backend caches these for 24h, so re-requesting one that is already on
  // is effectively free and keeps this effect free of stale-closure bugs.
  useEffect(() => {
    if (activeExtras.length === 0) return;
    let cancelled = false;
    activeExtras.forEach((k) => {
      fetch(`${API_BASE}/api/layer/${k}?state=${cityId}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled && d && d.url)
            setExtraUrls((prev) => ({ ...prev, [k]: d.url }));
        })
        .catch(() => {
          /* layer just stays off */
        });
    });
    return () => {
      cancelled = true;
    };
  }, [activeExtrasKey, cityId]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        preferCanvas={true}
        className="h-full w-full bg-[#0b1220]"
      >
        <TileLayer
          key={basemap.id}
          url={basemap.url}
          attribution={basemap.attribution}
          {...(basemap.subdomains ? { subdomains: basemap.subdomains } : {})}
          maxZoom={basemap.maxZoom ?? 19}
        />

        {/* ---- ADDED Nov 2026: terrain & environment tiles (under the index) ---- */}
        {activeExtras.map((k) =>
          extraUrls[k] ? (
            <TileLayer
              key={`extra-${k}-${cityId}`}
              url={extraUrls[k] as string}
              attribution="Earth Engine"
              opacity={k === "rivers" ? 1 : extraOpacity}
              zIndex={EXTRA_META[k].z}
              maxZoom={18}
            />
          ) : null,
        )}

        {!comingSoon && showIndex && status === "ok" && tileUrl && (
          <TileLayer
            key={`${cityId}-${parameter}-${year}-${month}`}
            url={tileUrl}
            attribution="Google Earth Engine &middot; Landsat"
            opacity={opacity}
            zIndex={400}
            maxZoom={18}
          />
        )}

        {showBuildings && buildingsUrl && (
          <TileLayer
            key={`buildings-${cityId}`}
            url={buildingsUrl}
            attribution="Google Open Buildings"
            zIndex={450}
            maxZoom={20}
          />
        )}

        {!comingSoon && showUHI && uhiUrl && (
          <TileLayer
            key={`uhi-${cityId}`}
            url={uhiUrl}
            attribution="Hotspots &middot; Earth Engine"
            opacity={uhiOpacity}
            zIndex={500}
            maxZoom={18}
          />
        )}

        {showWards && wards && (
          <GeoJSON
            key={`wards-${cityId}`}
            data={wards}
            style={{
              color: "#000000",
              weight: 1.4,
              fillColor: "#000000",
              fillOpacity: 0,
            }}
            onEachFeature={(f, layer) => {
              const p = f.properties || {};
              const label =
                p.district != null
                  ? p.district
                  : p.village != null
                    ? `${p.village}${p.district ? ` (${p.district})` : ""}`
                    : p.ward_no != null
                      ? `Ward ${p.ward_no}`
                      : `Ward ${p.name ?? ""}`;
              layer.bindTooltip(label, { sticky: true, direction: "top" });
              layer.on("click", (e: any) => {
                if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
                const maxLst = lookupStat(districtStats, p.district);
                const buildingCount = lookupStat(buildingCounts, p.district);
                const population = lookupStat(districtPopulation, p.district);
                const enriched = {
                  ...p,
                  ...(maxLst != null ? { max_lst: maxLst } : {}),
                  ...(buildingCount != null
                    ? { building_count: buildingCount }
                    : {}),
                  ...(population != null &&
                  (p.population == null || Number(p.population) <= 0)
                    ? { population }
                    : {}),
                };
                onSelectFeature &&
                  onSelectFeature({ type: "ward", props: enriched });
              });
            }}
          />
        )}

        {showHospitals && hospitals && (
          <GeoJSON
            key={`hosp-${cityId}`}
            data={hospitals}
            pointToLayer={(_f, latlng) =>
              L.marker(latlng, {
                icon: L.divIcon({
                  className: "",
                  html:
                    '<div style="display:flex;align-items:center;justify-content:center;width:16px;height:16px;">' +
                    '<svg width="16" height="16" viewBox="0 0 16 16">' +
                    '<path d="M6.4 1.6h3.2v4.8h4.8v3.2H9.6v4.8H6.4V9.6H1.6V6.4h4.8z" fill="#f97316" stroke="#7c2d12" stroke-width="1"/>' +
                    "</svg></div>",
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                }),
              })
            }
            onEachFeature={(f, layer) => {
              const p = f.properties || {};
              layer.bindTooltip(p.name ?? "Healthcare facility", {
                direction: "top",
              });
              layer.on("click", (e: any) => {
                if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
                onSelectFeature &&
                  onSelectFeature({ type: "hospital", props: p });
              });
            }}
          />
        )}

        <FlyToCity center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* opacity sliders (hidden while coming soon) */}
      {!comingSoon && ((showIndex && status === "ok") || showUHI) && (
        <div className="absolute left-4 top-4 z-[1000] flex w-56 flex-col gap-2">
          {!showUHI && showIndex && status === "ok" && (
            <div className="rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                >
                  Layer opacity
                </span>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[11px] text-slate-300"
                >
                  {Math.round(opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-teal-400"
              />
            </div>
          )}

          {showUHI && (
            <div className="rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                >
                  {hotspotLabel} opacity
                </span>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[11px] text-slate-300"
                >
                  {Math.round(uhiOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(uhiOpacity * 100)}
                onChange={(e) => setUhiOpacity(Number(e.target.value) / 100)}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-orange-400"
              />
            </div>
          )}
        </div>
      )}

      {/* ---- ADDED Nov 2026: one shared opacity slider for the extra layers ---- */}
      {activeExtras.some((k) => k !== "rivers") && (
        <div className="absolute bottom-6 left-4 z-[1000] w-56 rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] uppercase tracking-wider text-slate-400"
            >
              Terrain opacity
            </span>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] text-slate-300"
            >
              {Math.round(extraOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(extraOpacity * 100)}
            onChange={(e) => setExtraOpacity(Number(e.target.value) / 100)}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-sky-400"
          />
          <div className="mt-2.5 space-y-1.5">
            {activeExtras.map((k) => (
              <div key={`lg-${k}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-200">
                    {EXTRA_META[k].label}
                  </span>
                </div>
                <div className="mt-0.5 flex h-1.5 overflow-hidden rounded-full">
                  {EXTRA_META[k].ramp.map((c, i) => (
                    <span
                      key={i}
                      style={{ background: c }}
                      className="h-full flex-1"
                    />
                  ))}
                </div>
                <p
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-0.5 text-[9px] leading-tight text-slate-500"
                >
                  {EXTRA_META[k].scale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* coming soon badge */}
      {/* ADDED Nov 2026: suppressed once a terrain/environment layer is on -
          those have real nationwide data, so the badge would be misleading. */}
      {comingSoon && activeExtras.length === 0 && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0B1220]/85 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium text-slate-100">
            Live data layers coming soon
          </p>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-1 text-[11px] text-slate-400"
          >
            awaiting GEE datasets · map is interactive
          </p>
        </div>
      )}

      {/* index status badge (Heat & Health) */}
      {!comingSoon && showIndex && status !== "ok" && status !== "soon" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0B1220]/85 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium text-slate-100">
            {monthLabel(month)} {year}
          </p>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-1 text-[11px] text-slate-400"
          >
            {status === "loading" && "loading layer…"}
            {status === "empty" && "no cloud-free image for this month"}
            {status === "error" && "backend not reachable"}
          </p>
        </div>
      )}

      <div className="absolute right-4 top-4 z-[1000]">
        <BasemapSwitcher value={basemapId} onChange={setBasemapId} />
      </div>

      {!comingSoon && showIndex && (
        <div className="absolute bottom-6 right-4 z-[1000]">
          <MapLegend parameter={parameter as ParamKey} />
        </div>
      )}
    </div>
  );
}
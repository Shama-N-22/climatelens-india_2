// File: src/pages/Analytics.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LineChart, GitCompare, BookOpen } from "lucide-react";
import { CITIES, getCity } from "../data/cityData";
import AnalyticsCharts from "../components/charts/AnalyticsCharts";
import TimelineScrubber from "../components/analytics/TimelineScrubber";
import CompareCities from "../components/analytics/CompareCities";
import ExportBar from "../components/analytics/ExportBar";
import { Wordmark, CornerLogo } from "../components/common/Brand";

type Tab = "trends" | "compare" | "method";

export default function Analytics() {
  const navigate = useNavigate();
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [year, setYear] = useState(2026);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<Tab>("trends");

  const city = getCity(cityId);

  const TABS: { id: Tab; label: string; icon: typeof LineChart }[] = [
    { id: "trends", label: "Trends", icon: LineChart },
    { id: "compare", label: "Compare", icon: GitCompare },
    { id: "method", label: "Methodology", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-200">
      <CornerLogo />
      {/* header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1220]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </button>
            <span className="hidden sm:flex">
              <Wordmark />
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0b1220] px-3 py-1.5 text-sm text-slate-100 outline-none ring-1 ring-transparent focus:ring-amber-400/40"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0b1220]">
                  {c.name}
                </option>
              ))}
            </select>
            <ExportBar cityId={cityId} year={year} />
          </div>
        </div>

        {/* tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition ${
                tab === t.id
                  ? "border-amber-400 text-amber-200"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
        {tab === "trends" && (
          <>
            <TimelineScrubber
              year={year}
              onYear={setYear}
              playing={playing}
              onPlaying={setPlaying}
            />
            <p className="px-1 text-sm text-slate-400">
              Showing <span className="text-slate-100">{city.name}</span> ·{" "}
              {city.state} for <span className="text-amber-300">{year}</span>.
              Drag the timeline or press play to animate.
            </p>
            <AnalyticsCharts cityId={cityId} year={year} />
          </>
        )}

        {tab === "compare" && <CompareCities />}

        {tab === "method" && (
          <div className="max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-6">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-lg font-semibold text-slate-50"
            >
              Methodology
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              ClimateLens derives each index from multi-temporal satellite
              imagery and ground-station reference data, resampled to a common
              grid and classified into comparable severity bands.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="text-teal-300">Flood</span> — rainfall,
                drainage density, elevation (DEM) and runoff combined into a
                susceptibility surface.
              </li>
              <li>
                <span className="text-amber-300">LST</span> — thermal-band land
                surface temperature highlighting urban heat islands.
              </li>
              <li>
                <span className="text-emerald-300">NDVI</span> — red /
                near-infrared ratio for vegetation health and canopy density.
              </li>
              <li>
                <span className="text-slate-300">NDBI</span> — short-wave
                infrared ratio detecting built-up expansion.
              </li>
              <li>
                <span className="text-sky-300">NDWI</span> — green / NIR ratio
                mapping surface water and moisture.
              </li>
            </ul>
            <p className="rounded-lg border border-amber-300/20 bg-amber-400/5 p-3 text-xs text-amber-200/90">
              Note: figures shown in this build are representative synthetic
              data for demonstration. Production deployment ingests live
              satellite and sensor feeds.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

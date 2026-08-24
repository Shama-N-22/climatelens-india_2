// File: src/pages/Dashboard.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Droplets,
  Thermometer,
  Leaf,
  Building2,
  Waves,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  AlertTriangle,
  Search,
  Flame,
  X,
} from "lucide-react";
import { CITIES, getCity, type Kpi, type Status } from "../data/cityData";
import type { ParamKey } from "../data/legendRamps";
import AnimatedCounter from "../components/common/AnimatedCounter";
import ResizableSplit from "../components/common/ResizableSplit";
import { Wordmark, CornerLogo } from "../components/common/Brand";
import TimelineSelector from "../components/map/TimelineSelector";
import LayersMenu from "../components/map/LayersMenu";
import {
  FeaturePanel,
  FeatureModal,
  type SelectedFeature,
} from "../components/dashboard/FeatureDetail";
import { DEFAULT_TIMELINE } from "../data/geeTimeline";
import MapView from "../components/map/MapView";

const PARAMETERS: {
  key: ParamKey;
  label: string;
  icon: typeof Droplets;
  blurb: string;
}[] = [
  {
    key: "lst",
    label: "Land Surface Temperature",
    icon: Thermometer,
    blurb: "Land surface temperature & urban heat islands.",
  },
  {
    key: "ndvi",
    label: "Vegetation Index",
    icon: Leaf,
    blurb: "Vegetation health and canopy density.",
  },
  {
    key: "ndwi",
    label: "Water Index",
    icon: Waves,
    blurb: "Surface water and moisture detection.",
  },
  {
    key: "ndbi",
    label: "Built-up Index",
    icon: Building2,
    blurb: "Built-up area and urban expansion.",
  },
];

const STATUS_STYLES: Record<
  Status,
  { dot: string; text: string; ring: string }
> = {
  good: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-400/20",
  },
  watch: { dot: "bg-sky-400", text: "text-sky-300", ring: "ring-sky-400/20" },
  warn: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    ring: "ring-amber-400/20",
  },
  critical: {
    dot: "bg-rose-500",
    text: "text-rose-300",
    ring: "ring-rose-500/20",
  },
};

const STATUS_LABEL: Record<Status, string> = {
  good: "Healthy",
  watch: "Watch",
  warn: "Warning",
  critical: "Critical",
};

const KPI_DETAILS: Record<string, string> = {
  pop: "Estimated population living within the city boundary.",
  temp: "Current ambient air temperature across the city.",
  humidity: "Relative humidity in the air right now.",
  rain: "Rainfall accumulated over the last 24 hours.",
  flood: "Composite flood-risk score from rainfall, drainage and elevation.",
  aqi: "Air Quality Index — higher values mean more polluted air.",
  veg: "Share of the area under healthy vegetation cover.",
  reservoir: "Current reservoir storage against full capacity.",
};

function TrendIcon({ trend }: { trend: Kpi["trend"] }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
}

function KpiCard({
  kpi,
  index,
  onOpen,
}: {
  kpi: Kpi;
  index: number;
  onOpen: (k: Kpi) => void;
}) {
  const s = STATUS_STYLES[kpi.status];
  const compact = kpi.value >= 100000;
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={() => onOpen(kpi)}
      className={`rounded-lg border border-white/10 bg-[#0f1a2e]/70 p-2.5 text-left ring-1 ${s.ring} transition hover:border-white/25`}
    >
      <div className="flex items-center justify-between gap-1">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="truncate text-[9px] uppercase tracking-wider text-slate-400"
        >
          {kpi.label}
        </span>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
      </div>
      <div className="mt-1.5">
        <AnimatedCounter
          value={compact ? kpi.value / 1000000 : kpi.value}
          decimals={compact ? 2 : (kpi.decimals ?? 0)}
          suffix={compact ? "M" : kpi.unit}
          className="block truncate whitespace-nowrap text-sm font-bold text-slate-50"
        />
      </div>
    </motion.button>
  );
}

function KpiModal({ kpi, onClose }: { kpi: Kpi; onClose: () => void }) {
  const s = STATUS_STYLES[kpi.status];
  const compact = kpi.value >= 100000;
  const val = (compact ? kpi.value / 1000000 : kpi.value).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: compact ? 2 : (kpi.decimals ?? 0),
      maximumFractionDigits: compact ? 2 : (kpi.decimals ?? 0),
    },
  );
  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-72 rounded-2xl border border-white/10 bg-[#0f1a2e] p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[10px] uppercase tracking-widest text-slate-400"
          >
            {kpi.label}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 text-3xl font-bold text-slate-50">
          {val}
          {compact ? "M" : kpi.unit}
        </div>
        <div className={`mt-2 flex items-center gap-1.5 text-sm ${s.text}`}>
          <TrendIcon trend={kpi.trend} />
          <span style={{ fontFamily: "var(--font-mono)" }}>{kpi.delta}</span>
          <span className="text-slate-500">
            {kpi.trend === "up"
              ? "vs last period ↑"
              : kpi.trend === "down"
                ? "vs last period ↓"
                : "steady"}
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          {KPI_DETAILS[kpi.key] ?? ""}
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
          <span className="text-xs text-slate-300">
            Status: {STATUS_LABEL[kpi.status]}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [parameter, setParameter] = useState<ParamKey>("ndvi");
  const [popupKpi, setPopupKpi] = useState<Kpi | null>(null);
  const [year, setYear] = useState(DEFAULT_TIMELINE.year);
  const [month, setMonth] = useState(DEFAULT_TIMELINE.month);
  const [showBuildings, setShowBuildings] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [selected, setSelected] = useState<SelectedFeature | null>(null);
  const [featureModal, setFeatureModal] = useState<SelectedFeature | null>(
    null,
  );
  const [showUHI, setShowUHI] = useState(false);
  const [showIndex, setShowIndex] = useState(true);

  const city = useMemo(() => getCity(cityId), [cityId]);
  const insight = city.insights[parameter];
  const activeParam = PARAMETERS.find((p) => p.key === parameter)!;
  // Telangana is now district-wise (per Prathyu/Binu sir), other cities use wards
  const wardsLabel =
    cityId === "telangana" ? "District boundaries" : "Ward boundaries";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b1220] text-slate-200">
      <CornerLogo />
      {/* ---------- Sidebar ---------- */}
      <aside className="flex w-72 flex-col border-r border-white/10 bg-[#0d1526]/80">
        <div className="px-5 py-5">
          <Wordmark />
        </div>

        {/* cities */}
        <div className="px-5 pb-3 pt-2">
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mb-2 text-[10px] uppercase tracking-widest text-slate-500"
          >
            States
          </p>
          <div className="space-y-1">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCityId(c.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  c.id === cityId
                    ? "bg-amber-400/10 text-amber-200 ring-1 ring-amber-300/30"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{c.name}</span>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] text-slate-500"
                >
                  {c.state}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* parameters */}
        <div className="px-5 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] uppercase tracking-widest text-slate-500"
            >
              Indices
            </p>
            <button
              onClick={() => setShowIndex((v) => !v)}
              title={showIndex ? "Hide index layer" : "Show index layer"}
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide transition ${
                showIndex
                  ? "bg-teal-400/20 text-teal-200"
                  : "bg-white/10 text-slate-500 hover:text-slate-300"
              }`}
            >
              {showIndex ? "ON" : "OFF"}
            </button>
          </div>
          <div className="space-y-1">
            {PARAMETERS.map((p) => {
              const active = p.key === parameter;
              return (
                <button
                  key={p.key}
                  onClick={() => setParameter(p.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-teal-400/10 text-teal-200 ring-1 ring-teal-300/30"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <p.icon className="h-4 w-4 shrink-0" />
                  <span className="leading-tight">{p.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 px-1 text-xs leading-relaxed text-slate-500">
            {activeParam.blurb}
          </p>
        </div>

        {/* analytics section */}
        <div className="px-5 py-3">
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mb-2 text-[10px] uppercase tracking-widest text-slate-500"
          >
            Analytics
          </p>
          <div className="space-y-1">
            <button
              onClick={() => setShowUHI((v) => !v)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                showUHI
                  ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Flame className="h-4 w-4 shrink-0" />
              UHI Dynamic Hotspot
              {showUHI && (
                <span className="ml-auto text-[10px] font-semibold text-rose-300">
                  ON
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0b1220] px-6 py-3.5">
          <div>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-lg font-semibold text-slate-50"
            >
              {city.name}{" "}
              <span className="text-slate-500">/ {activeParam.label}</span>
            </h1>
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] text-slate-500"
            >
              {city.center[0].toFixed(3)}°N, {city.center[1].toFixed(3)}°E ·
              live
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TimelineSelector
              year={year}
              month={month}
              onYear={setYear}
              onMonth={setMonth}
            />
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-2 rounded-lg bg-teal-400/10 px-3 py-2 text-sm font-medium text-teal-200 ring-1 ring-teal-300/30 transition hover:bg-teal-400/20"
            >
              <BarChart3 className="h-4 w-4" /> Analytics
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-400">
              <Search className="h-4 w-4" />
              <input
                placeholder="Search ward, lake, river…"
                className="w-44 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <LayersMenu
              showBuildings={showBuildings}
              showWards={showWards}
              showHospitals={showHospitals}
              onToggleBuildings={setShowBuildings}
              onToggleWards={setShowWards}
              onToggleHospitals={setShowHospitals}
              wardsLabel={wardsLabel}
            />
          </div>
        </header>

        {/* content: scrolls with the page (left + right together) */}
        <div className="p-4">
          <ResizableSplit
            storageKey="cl-analytics-width"
            minRight={320}
            maxRight={680}
            defaultRight={420}
            left={
              <div className="flex flex-col gap-4 pr-4">
                <div className="grid grid-cols-4 gap-3">
                  {city.kpis.slice(0, 8).map((k, i) => (
                    <KpiCard
                      key={k.key + cityId}
                      kpi={k}
                      index={i}
                      onOpen={setPopupKpi}
                    />
                  ))}
                </div>
                <div className="relative h-[820px] overflow-hidden rounded-2xl border border-white/10">
                  <MapView
                    parameter={parameter}
                    center={city.center}
                    zoom={city.zoom}
                    cityId={city.id}
                    year={year}
                    month={month}
                    showBuildings={showBuildings}
                    showWards={showWards}
                    showHospitals={showHospitals}
                    onSelectFeature={(f) => {
                      setSelected(f);
                      setFeatureModal(f);
                    }}
                    showUHI={showUHI}
                    showIndex={showIndex}
                  />
                </div>
              </div>
            }
            right={
              <div className="flex flex-col gap-4 pl-1">
                {selected && (
                  <FeaturePanel
                    feature={selected}
                    onExpand={() => setFeatureModal(selected)}
                    onClose={() => setSelected(null)}
                  />
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cityId + parameter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-white/10 bg-gradient-to-b from-teal-500/[0.07] to-transparent p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-300" />
                      <span
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-sm font-semibold text-slate-50"
                      >
                        AI Insight
                      </span>
                      <span className="ml-auto rounded-full bg-teal-400/10 px-2 py-0.5 text-[10px] text-teal-200">
                        {insight.confidence}% conf.
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {insight.summary}
                    </p>
                    <div className="mt-3 rounded-lg border border-white/10 bg-[#0b1220]/60 p-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-amber-300/80">
                        Recommendation
                      </p>
                      <p className="mt-1 text-sm text-slate-200">
                        {insight.recommendation}
                      </p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      {[
                        { l: "Priority", v: insight.priority },
                        { l: "Budget", v: insight.budget },
                        { l: "Impact", v: insight.improvement },
                      ].map((x) => (
                        <div key={x.l} className="rounded-lg bg-white/5 p-2">
                          <p
                            style={{ fontFamily: "var(--font-mono)" }}
                            className="text-[9px] uppercase tracking-wider text-slate-500"
                          >
                            {x.l}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-100">
                            {x.v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-300" />
                    <span
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-sm font-semibold text-slate-50"
                    >
                      Live Alerts
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {city.alerts.map((a) => {
                      const s = STATUS_STYLES[a.severity];
                      return (
                        <div
                          key={a.id + cityId}
                          className="rounded-lg border border-white/5 bg-[#0b1220]/50 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`flex items-center gap-2 text-sm font-medium ${s.text}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
                              />
                              {a.title}
                            </span>
                            <span
                              style={{ fontFamily: "var(--font-mono)" }}
                              className="text-[10px] text-slate-500"
                            >
                              {a.time}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            {a.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {popupKpi && (
        <KpiModal kpi={popupKpi} onClose={() => setPopupKpi(null)} />
      )}
      {featureModal && (
        <FeatureModal
          feature={featureModal}
          onClose={() => setFeatureModal(null)}
        />
      )}
    </div>
  );
}

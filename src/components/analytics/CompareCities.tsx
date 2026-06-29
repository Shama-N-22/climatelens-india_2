// File: src/components/analytics/CompareCities.tsx
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from "recharts";
import { CITIES, getCity } from "../../data/cityData";

const tooltipStyle = {
  background: "#0b1220",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  color: "#e2e8f0",
};

// pull a comparable numeric value out of a city's KPI list
function kpiVal(cityId: string, key: string): number {
  const c = getCity(cityId);
  return c.kpis.find((k) => k.key === key)?.value ?? 0;
}

const METRICS = [
  { key: "temp", label: "Temp" },
  { key: "humidity", label: "Humidity" },
  { key: "flood", label: "Flood" },
  { key: "aqi", label: "AQI" },
  { key: "veg", label: "Vegetation" },
  { key: "reservoir", label: "Reservoir" },
];

export default function CompareCities() {
  const [a, setA] = useState(CITIES[0].id);
  const [b, setB] = useState(CITIES[1].id);

  const cityA = getCity(a);
  const cityB = getCity(b);

  const barData = METRICS.map((m) => ({
    metric: m.label,
    [cityA.name]: kpiVal(a, m.key),
    [cityB.name]: kpiVal(b, m.key),
  }));

  // radar wants 0..100-ish; normalise temp/humidity loosely for shape
  const radarData = METRICS.map((m) => ({
    metric: m.label,
    [cityA.name]: kpiVal(a, m.key),
    [cityB.name]: kpiVal(b, m.key),
  }));

  return (
    <div className="space-y-4">
      {/* selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <Picker label="City A" value={a} onChange={setA} accent="amber" />
        <span className="text-slate-500">vs</span>
        <Picker label="City B" value={b} onChange={setB} accent="teal" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-4">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="mb-3 text-sm font-semibold text-slate-100">
            Indicator comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="metric" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Bar dataKey={cityA.name} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey={cityB.name} fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-4">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="mb-3 text-sm font-semibold text-slate-100">
            Profile radar
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Radar name={cityA.name} dataKey={cityA.name} stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                <Radar name={cityB.name} dataKey={cityB.name} stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Picker({
  label, value, onChange, accent,
}: { label: string; value: string; onChange: (v: string) => void; accent: "amber" | "teal" }) {
  const ring = accent === "amber" ? "focus:ring-amber-400/40" : "focus:ring-teal-400/40";
  return (
    <label className="flex items-center gap-2 text-sm">
      <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-lg border border-white/10 bg-[#0b1220] px-3 py-1.5 text-slate-100 outline-none ring-1 ring-transparent ${ring}`}
      >
        {CITIES.map((c) => (
          <option key={c.id} value={c.id} className="bg-[#0b1220]">
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
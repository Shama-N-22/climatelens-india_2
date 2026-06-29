// File: src/components/charts/AnalyticsCharts.tsx
import {
  ComposedChart, Bar, Line, Area, AreaChart, BarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getMonthly, getYearly } from "../../data/timeSeries";

const AXIS = { stroke: "#475569", fontSize: 11, fontFamily: "var(--font-mono)" };
const GRID = "#1e293b";

const tooltipStyle = {
  background: "#0b1220",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  color: "#e2e8f0",
};

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-4">
      <div className="mb-3">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-sm font-semibold text-slate-100">
          {title}
        </h3>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AnalyticsCharts({ cityId, year }: { cityId: string; year: number }) {
  const monthly = getMonthly(cityId, year);
  const yearly = getYearly(cityId);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel title="Rainfall & Temperature" subtitle={`Monthly · ${year}`}>
        <ComposedChart data={monthly} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="month" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis yAxisId="l" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis yAxisId="r" orientation="right" {...AXIS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar yAxisId="l" dataKey="rainfall" name="Rainfall (mm)" fill="#3182bd" radius={[4, 4, 0, 0]} />
          <Line yAxisId="r" dataKey="temp" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </Panel>

      <Panel title="Flood Probability" subtitle="Yearly average · 2020–2026">
        <AreaChart data={yearly} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="flood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="year" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area dataKey="floodProb" name="Flood prob (%)" stroke="#14b8a6" strokeWidth={2} fill="url(#flood)" />
        </AreaChart>
      </Panel>

      <Panel title="Air Quality Index" subtitle={`Monthly · ${year}`}>
        <BarChart data={monthly} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="month" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="aqi" name="AQI" radius={[4, 4, 0, 0]} fill="#fb923c" />
        </BarChart>
      </Panel>

      <Panel title="Vegetation Trend" subtitle={`Monthly NDVI proxy · ${year}`}>
        <AreaChart data={monthly} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="veg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="month" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
          <Area dataKey="vegetation" name="Vegetation (%)" stroke="#22c55e" strokeWidth={2} fill="url(#veg)" />
        </AreaChart>
      </Panel>
    </div>
  );
}
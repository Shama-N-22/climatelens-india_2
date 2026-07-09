// File: src/pages/Platform.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Thermometer,
  Leaf,
  Waves,
  Building2,
  Satellite,
  Layers,
  MapPin,
} from "lucide-react";
import LandingBackground from "../components/landing/LandingBackground";
import { Wordmark } from "../components/common/Brand";

const FEATURES = [
  {
    icon: Flame,
    color: "text-rose-300",
    title: "UHI Dynamic Hotspot",
    body: "Adaptive urban-heat-island mapping from a weighted overlay of vegetation, water, built-up and temperature signals — highlighting the hottest urban cores.",
  },
  {
    icon: Thermometer,
    color: "text-amber-300",
    title: "Land Surface Temperature",
    body: "Thermal-band-derived surface temperature revealing heat distribution across the city.",
  },
  {
    icon: Leaf,
    color: "text-emerald-300",
    title: "Vegetation Index (NDVI)",
    body: "Canopy health and green-cover density, dynamically classified per scene.",
  },
  {
    icon: Waves,
    color: "text-sky-300",
    title: "Water Index (NDWI)",
    body: "Surface water and moisture mapping across wards and water bodies.",
  },
  {
    icon: Building2,
    color: "text-slate-300",
    title: "Built-up Index (NDBI)",
    body: "Urban expansion and impervious-surface footprint.",
  },
  {
    icon: Layers,
    color: "text-teal-300",
    title: "Overlays",
    body: "Building footprints, hospitals and ward boundaries — toggleable, with click-through attributes.",
  },
];

const STACK = [
  { label: "Imagery", value: "Landsat 8 / 9" },
  { label: "Engine", value: "Google Earth Engine" },
  { label: "Cities", value: "Ahmedabad · Mumbai · Hyderabad" },
  { label: "Season", value: "Summer (Feb–May), 2020–2026" },
];

export default function Platform() {
  const navigate = useNavigate();
  return (
    <>
      <LandingBackground imageOpacity={0.28}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Wordmark showLogo />
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </button>
        </header>

        <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-10">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "var(--font-mono)" }}
            className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-teal-200"
          >
            <Satellite className="h-3.5 w-3.5" /> The Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            style={{ fontFamily: "var(--font-display)" }}
            className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
          >
            Satellite-derived climate intelligence,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-teal-300 bg-clip-text text-transparent">
              city by city
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300/90"
          >
            Climatium IND turns Landsat imagery into live, decision-ready
            climate layers — processed on Google Earth Engine and streamed into
            one interactive operations dashboard for India's fastest-growing
            cities.
          </motion.p>

          {/* stack strip */}
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
            {STACK.map((s) => (
              <div key={s.label} className="bg-[#0b1220]/60 p-4">
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                >
                  {s.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-100">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* feature cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <f.icon className={`h-6 w-6 ${f.color}`} />
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="mt-4 text-base font-semibold text-slate-50"
                >
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
            >
              Launch Dashboard
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4 text-teal-300" /> 3 cities · live Earth
              Engine layers
            </span>
          </div>
        </main>
      </LandingBackground>
    </>
  );
}

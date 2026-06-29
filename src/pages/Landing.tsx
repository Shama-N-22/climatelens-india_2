// File: src/pages/Landing.tsx
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Satellite,
  Droplets,
  Thermometer,
  Leaf,
  ChevronDown,
  Activity,
} from "lucide-react";
import LandingBackground from "../components/landing/LandingBackground";
import AnimatedCounter from "../components/common/AnimatedCounter";

const STATS = [
  { value: 3, suffix: "", label: "Cities monitored", decimals: 0 },
  { value: 5, suffix: "", label: "Environmental indices", decimals: 0 },
  { value: 1.2, suffix: "M", label: "Data points / day", decimals: 1 },
  { value: 98.6, suffix: "%", label: "Model confidence", decimals: 1 },
];

const MODULES = [
  { icon: Droplets, title: "Flood Forecast", note: "Drainage · elevation · runoff", color: "text-sky-300" },
  { icon: Thermometer, title: "Urban Heat", note: "Surface temperature islands", color: "text-amber-300" },
  { icon: Leaf, title: "Vegetation", note: "NDVI canopy health", color: "text-emerald-300" },
  { icon: Satellite, title: "Built-up & Water", note: "NDBI · NDWI change", color: "text-teal-300" },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <LandingBackground imageOpacity={0.34}>
      {/* ambient floating glow lights */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl animate-[pulseGlow_4s_ease-in-out_infinite]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl animate-[pulseGlow_5s_ease-in-out_infinite]" />
      </div>

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/15 ring-1 ring-amber-300/30">
            <Activity className="h-5 w-5 text-amber-300" />
          </span>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold tracking-tight text-slate-50">
            ClimateLens <span className="text-amber-300">India</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#modules">Platform</a>
          <a className="transition hover:text-white" href="#stats">Coverage</a>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-white/15 px-4 py-1.5 text-slate-100 transition hover:border-amber-300/50 hover:text-amber-200"
          >
            Launch
          </button>
        </nav>
      </header>

      {/* hero */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-start px-6 pb-24 pt-16 md:pt-24">
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{ fontFamily: "var(--font-mono)" }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-teal-200"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" />
          Geospatial climate intelligence
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{ fontFamily: "var(--font-display)" }}
          className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl"
        >
          See the climate
          <br />
          your city is{" "}
          <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-teal-300 bg-clip-text text-transparent">
            living through
          </span>
          .
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/90"
        >
          Satellite-derived flood, heat, vegetation and water indices for India's
          fastest-growing cities — fused into one decision-ready operations dashboard.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
          >
            Enter Dashboard
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#modules"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-medium text-slate-100 backdrop-blur-sm transition hover:border-white/30"
          >
            Explore modules
          </a>
        </motion.div>

        {/* floating climate cards */}
        <div id="modules" className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.07]"
              style={{ animation: `float ${6 + i}s ease-in-out infinite` }}
            >
              <m.icon className={`h-6 w-6 ${m.color}`} />
              <h3 style={{ fontFamily: "var(--font-display)" }} className="mt-4 text-base font-semibold text-slate-50">
                {m.title}
              </h3>
              <p style={{ fontFamily: "var(--font-mono)" }} className="mt-1 text-xs text-slate-400">
                {m.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* stats */}
        <div id="stats" className="mt-20 grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#0b1220]/60 p-6 backdrop-blur-sm">
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                decimals={s.decimals}
                className="block text-3xl font-bold text-white md:text-4xl"
              />
              <span style={{ fontFamily: "var(--font-mono)" }} className="mt-2 block text-xs uppercase tracking-wider text-slate-400">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <ChevronDown className="h-5 w-5 animate-bounce text-slate-500" />
      </div>
    </LandingBackground>
  );
}
// File: src/pages/Platform.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Satellite,
  Globe,
  Cpu,
  Server,
  LayoutDashboard,
  Thermometer,
  Leaf,
  Waves,
  Building2,
  HeartPulse,
  Users,
  Flame,
  Code,
  Map,
  Cloud,
  Zap,
  GraduationCap,
  Landmark,
  Building,
} from "lucide-react";
import { Wordmark } from "../components/common/Brand";

/* ---------- animated satellite / earth-observation background ---------- */
function SpaceBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0b1220]"
    >
      {/* To use your own satellite image instead, uncomment and drop the file in /src/assets:
         <img src={heroImg} className="absolute inset-0 h-full w-full object-cover opacity-25" /> */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.12),transparent_45%),radial-gradient(circle_at_75%_60%,rgba(20,184,166,0.14),transparent_50%)]" />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* orbit rings */}
      <svg
        className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-30"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="rgba(20,184,166,0.4)"
          strokeWidth="0.5"
        />
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="none"
          stroke="rgba(245,158,11,0.3)"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />
        <circle
          cx="200"
          cy="200"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
        <circle
          cx="320"
          cy="200"
          r="3"
          fill="#14b8a6"
          className="animate-pulse"
        />
        <circle
          cx="200"
          cy="30"
          r="2.5"
          fill="#f59e0b"
          className="animate-pulse"
        />
      </svg>
      {/* glow blobs */}
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl animate-[pulseGlow_5s_ease-in-out_infinite]" />
      <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl animate-[pulseGlow_6s_ease-in-out_infinite]" />
    </div>
  );
}

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, delay: i * 0.06 },
});

const ABOUT = [
  {
    icon: Globe,
    title: "Google Earth Engine",
    body: "Planet-scale satellite processing runs the analysis on Google's servers.",
  },
  {
    icon: Satellite,
    title: "Landsat imagery",
    body: "30 m multispectral & thermal imagery from Landsat 8 and 9.",
  },
  {
    icon: Cpu,
    title: "AI-powered visualization",
    body: "Indices are classified and rendered into decision-ready map layers.",
  },
  {
    icon: Flame,
    title: "Urban Heat Island monitoring",
    body: "Adaptive hotspot mapping across the urban core.",
  },
  {
    icon: Leaf,
    title: "Environmental analytics",
    body: "Vegetation, water and built-up dynamics tracked over time.",
  },
  {
    icon: LayoutDashboard,
    title: "Decision support",
    body: "One operations dashboard for planners and researchers.",
  },
];

const TECH = [
  { icon: Globe, label: "Google Earth Engine" },
  { icon: Satellite, label: "Landsat 8 / 9" },
  { icon: Code, label: "React" },
  { icon: Code, label: "TypeScript" },
  { icon: Map, label: "Leaflet" },
  { icon: Server, label: "Node.js" },
  { icon: Cloud, label: "Render" },
  { icon: Zap, label: "Vercel" },
];

const LAYERS = [
  {
    icon: Thermometer,
    color: "text-amber-300",
    title: "LST",
    body: "Land surface temperature & urban heat.",
  },
  {
    icon: Leaf,
    color: "text-emerald-300",
    title: "NDVI",
    body: "Vegetation health and canopy density.",
  },
  {
    icon: Waves,
    color: "text-sky-300",
    title: "NDWI",
    body: "Surface water and moisture.",
  },
  {
    icon: Building2,
    color: "text-slate-300",
    title: "NDBI",
    body: "Built-up and impervious surfaces.",
  },
  {
    icon: Building,
    color: "text-orange-300",
    title: "Building Footprints",
    body: "Google Open Buildings outlines.",
  },
  {
    icon: HeartPulse,
    color: "text-rose-300",
    title: "Hospitals",
    body: "Healthcare facilities with details.",
  },
  {
    icon: Users,
    color: "text-teal-300",
    title: "Ward Population",
    body: "Ward boundaries with population.",
  },
  {
    icon: Flame,
    color: "text-red-300",
    title: "UHI (Future)",
    body: "Adaptive urban-heat-island hotspots.",
  },
];

const FLOW = [
  { icon: Satellite, label: "Satellite" },
  { icon: Globe, label: "Google Earth Engine" },
  { icon: Cpu, label: "Processing" },
  { icon: Server, label: "Backend API" },
  { icon: LayoutDashboard, label: "Interactive Dashboard" },
];

const WHY = [
  {
    icon: Building,
    title: "Urban Planning",
    body: "Target interventions where heat and density concentrate.",
  },
  {
    icon: Thermometer,
    title: "Climate Monitoring",
    body: "Track seasonal and multi-year environmental change.",
  },
  {
    icon: GraduationCap,
    title: "Researchers",
    body: "Ready-made, reproducible geospatial layers.",
  },
  {
    icon: Landmark,
    title: "Government",
    body: "Evidence for policy and resource allocation.",
  },
  {
    icon: Zap,
    title: "Smart Cities",
    body: "A live foundation for data-driven city operations.",
  },
];

export default function Platform() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen text-slate-200">
      <SpaceBackground />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Wordmark showLogo />
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </button>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
        <motion.span
          {...fade(0)}
          style={{ fontFamily: "var(--font-mono)" }}
          className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-teal-200"
        >
          <Satellite className="h-3.5 w-3.5" /> The Platform
        </motion.span>
        <motion.h1
          {...fade(1)}
          style={{ fontFamily: "var(--font-display)" }}
          className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl"
        >
          Platform
        </motion.h1>
        <motion.p
          {...fade(2)}
          className="mt-4 text-xl font-medium text-amber-200/90"
        >
          AI-Powered Urban Climate Intelligence Platform
        </motion.p>
        <motion.p
          {...fade(3)}
          className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300/90"
        >
          Satellite-derived heat, vegetation, water and urban indices for
          India's fastest-growing cities — fused into one decision-ready
          operations dashboard.
        </motion.p>
        <motion.div
          {...fade(4)}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:brightness-110"
          >
            Launch Dashboard{" "}
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>

      {/* Section 1 — About */}
      <Section title="About the Platform" kicker="Overview">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT.map((a, i) => (
            <motion.div
              key={a.title}
              {...fade(i)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/20"
            >
              <a.icon className="h-6 w-6 text-teal-300" />
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-4 text-base font-semibold text-slate-50"
              >
                {a.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {a.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Technologies */}
      <Section title="Technologies" kicker="Built with">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TECH.map((t, i) => (
            <motion.div
              key={t.label}
              {...fade(i)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-md transition hover:border-teal-300/30"
            >
              <t.icon className="h-7 w-7 text-teal-300" />
              <span className="text-sm font-medium text-slate-200">
                {t.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Section 3 — Available Layers */}
      <Section title="Available Layers" kicker="What you can map">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.title}
              {...fade(i)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/20"
            >
              <l.icon className={`h-6 w-6 ${l.color}`} />
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-3 text-sm font-semibold text-slate-50"
              >
                {l.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {l.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Section 4 — Workflow */}
      <Section title="Workflow" kicker="How data flows">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          {FLOW.map((f, i) => (
            <div
              key={f.label}
              className="flex items-center gap-3 md:flex-col md:text-center"
            >
              <motion.div
                {...fade(i)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md md:flex-col"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-400/10">
                  <f.icon className="h-5 w-5 text-teal-300" />
                </span>
                <span className="text-sm font-medium text-slate-100">
                  {f.label}
                </span>
              </motion.div>
              {i < FLOW.length - 1 && (
                <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-slate-500 md:rotate-0" />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Section 5 — Why */}
      <Section title="Why this Platform" kicker="Who it's for">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              {...fade(i)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-300/30"
            >
              <w.icon className="h-6 w-6 text-amber-300" />
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-4 text-base font-semibold text-slate-50"
              >
                {w.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {w.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* footer CTA */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-md">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-bold text-white md:text-3xl"
          >
            Ready to explore your city's climate?
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:brightness-110"
          >
            Open Dashboard{" "}
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
      <motion.div {...fade(0)} className="mb-6">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-[11px] uppercase tracking-[0.25em] text-teal-300/80"
        >
          {kicker}
        </span>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}

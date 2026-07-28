// File: src/pages/Landing.tsx
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Satellite,
  Thermometer,
  HeartPulse,
  Leaf,
  Waves,
  Mountain,
  ChevronDown,
  Building2,
  Users,
  TrendingUp,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import LandingBackground from "../components/landing/LandingBackground";
import AnimatedCounter from "../components/common/AnimatedCounter";
import { Wordmark } from "../components/common/Brand";
import logo from "../assets/tarutium-logo.png";

const STATS = [
  { value: 3, suffix: "", label: "Cities monitored", decimals: 0 },
  { value: 5, suffix: "", label: "Environmental indices", decimals: 0 },
  { value: 1.2, suffix: "M", label: "Data points / day", decimals: 1 },
  { value: 98.6, suffix: "%", label: "Model confidence", decimals: 1 },
];

const MODULES = [
  {
    icon: Thermometer,
    title: "Urban Heat",
    note: "Surface temperature islands",
    color: "text-amber-300",
    href: "https://www.epa.gov/heatislands",
  },
  {
    icon: HeartPulse,
    title: "Health",
    note: "Climate & public-health risk",
    color: "text-rose-300",
    href: "https://www.who.int/news-room/fact-sheets/detail/climate-change-and-health",
  },
  {
    icon: Leaf,
    title: "Vegetation",
    note: "NDVI canopy health",
    color: "text-emerald-300",
    href: "https://earthobservatory.nasa.gov/features/MeasuringVegetation",
  },
  {
    icon: Satellite,
    title: "Built-up & Water",
    note: "NDBI · NDWI change",
    color: "text-teal-300",
    href: "https://www.usgs.gov/landsat-missions",
  },
  {
    icon: Waves,
    title: "Flood",
    note: "Flood risk & management",
    color: "text-sky-300",
    href: "https://www.floodmanagement.info/",
  },
  {
    icon: Mountain,
    title: "Landslide",
    note: "Landslide hazard & response",
    color: "text-orange-300",
    href: "https://www.gsi.gov.in/webcenter/portal/OCBIS/pageGeoInfo/pageLandslideHazard",
  },
];

// Tarutium consulting practices (links open the official site)
const PRACTICES = [
  {
    icon: Leaf,
    title: "Environment & Planet",
    note: "Climate, disaster and environmental strategies for risk reduction, adaptation and mitigation.",
    href: "https://tarutium.com/environment-planet",
  },
  {
    icon: Building2,
    title: "Infra & Public Services",
    note: "Infrastructure and public-service interventions that enhance benefits for people and society.",
    href: "https://tarutium.com/infra-public-services",
  },
  {
    icon: TrendingUp,
    title: "Economy & Business",
    note: "Building a sustainable, climate-sensitive and inclusive economy and business ecosystem.",
    href: "https://tarutium.com/economy-business",
  },
  {
    icon: Users,
    title: "Social Impact",
    note: "Inclusive growth through education, livelihoods, skilling and CSR advisory.",
    href: "https://tarutium.com/social-impact",
  },
];

const OFFICES = ["Delhi", "Chennai", "Ahmedabad", "Mumbai", "Mbabane"];

const SOCIALS = [
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/tarutium-global-consulting/",
  },
  { label: "X", icon: Twitter, href: "https://x.com/tarutium" },
  {
    label: "YouTube",
    icon: Youtube,
    href: "https://www.youtube.com/@Tarutium",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <LandingBackground imageOpacity={0.34}>
        {/* ambient floating glow lights */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl animate-[pulseGlow_4s_ease-in-out_infinite]" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl animate-[pulseGlow_5s_ease-in-out_infinite]" />
        </div>

        {/* nav */}
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Wordmark showLogo />
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <button
              onClick={() => navigate("/platform")}
              className="transition hover:text-white"
            >
              Platform
            </button>
            <a className="transition hover:text-white" href="#about">
              About
            </a>
            <a
              href="https://mausam.imd.gov.in/imd_latest/contents/satellite.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-1.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:brightness-110"
            >
              Mausam
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
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
            Satellite-derived heat, vegetation and water indices for India's
            fastest-growing cities — fused into one decision-ready operations
            dashboard.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex w-full max-w-xs flex-col gap-3"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center justify-between gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
            >
              Heat &amp; Health
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/flood")}
              className="group inline-flex items-center justify-between gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
            >
              Flood
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/landslide")}
              className="group inline-flex items-center justify-between gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
            >
              Landslide
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* floating climate cards — now clickable, open the dashboard */}
          <div
            id="modules"
            className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {MODULES.map((m, i) => (
              <motion.a
                key={m.title}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className="group relative block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.08]"
                style={{ animation: `float ${6 + i}s ease-in-out infinite` }}
              >
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-500 opacity-0 transition group-hover:text-amber-300 group-hover:opacity-100" />
                <m.icon className={`h-6 w-6 ${m.color}`} />
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="mt-4 text-base font-semibold text-slate-50"
                >
                  {m.title}
                </h3>
                <p
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-1 text-xs text-slate-400"
                >
                  {m.note}
                </p>
              </motion.a>
            ))}
          </div>

          {/* stats */}
          <div
            id="stats"
            className="mt-20 grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:grid-cols-4"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#0b1220]/60 p-6 backdrop-blur-sm"
              >
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={s.decimals}
                  className="block text-3xl font-bold text-white md:text-4xl"
                />
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-2 block text-xs uppercase tracking-wider text-slate-400"
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </main>

        {/* scroll indicator — now scrolls to the About section */}
        <div className="relative z-10 flex justify-center pb-8">
          <a href="#about" aria-label="Scroll to about">
            <ChevronDown className="h-5 w-5 animate-bounce text-slate-400 transition hover:text-amber-300" />
          </a>
        </div>
      </LandingBackground>

      {/* ================= ABOUT TARUTIUM ================= */}
      <section id="about" className="relative bg-[#0b1220] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] uppercase tracking-[0.25em] text-amber-300/80"
            >
              Delivered by
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl"
            >
              Tarutium Global Consulting
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300/90">
              Established in 1996 (formerly Taru Leading Edge), Tarutium
              delivers transformative insights, strategies, and solutions for
              sustainable, resilient, and inclusive global progress — combining
              research, technology, and implementation across climate,
              infrastructure, economy, and social impact.
            </p>
          </motion.div>

          {/* credibility strip */}
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
            {[
              { k: "Since", v: "1996" },
              { k: "Offices", v: "5 cities" },
              { k: "Practices", v: "4 domains" },
              { k: "Reach", v: "Global" },
            ].map((x) => (
              <div key={x.k} className="bg-[#0b1220]/60 p-6">
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-2xl font-bold text-white"
                >
                  {x.v}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-1 text-[11px] uppercase tracking-wider text-slate-400"
                >
                  {x.k}
                </div>
              </div>
            ))}
          </div>

          {/* consulting practices */}
          <h3
            style={{ fontFamily: "var(--font-display)" }}
            className="mt-16 text-2xl font-semibold text-white"
          >
            Consulting Practices
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICES.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-teal-300/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <p.icon className="h-6 w-6 text-teal-300" />
                  <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-teal-300" />
                </div>
                <h4
                  style={{ fontFamily: "var(--font-display)" }}
                  className="mt-4 text-base font-semibold text-slate-50"
                >
                  {p.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {p.note}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#0a0f1a] px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* brand */}
            <div>
              <img
                src={logo}
                alt="Tarutium Global Consulting"
                className="h-9 w-auto"
              />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Transformative insights, strategies, and solutions for
                sustainable, resilient, and inclusive global progress.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {SOCIALS.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:border-amber-300/40 hover:text-amber-200"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* offices */}
            <div>
              <h5
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[11px] uppercase tracking-widest text-slate-500"
              >
                Offices
              </h5>
              <ul className="mt-4 space-y-2">
                {OFFICES.map((o) => (
                  <li
                    key={o}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <MapPin className="h-3.5 w-3.5 text-teal-300/70" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* links */}
            <div>
              <h5
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[11px] uppercase tracking-widest text-slate-500"
              >
                Company
              </h5>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="https://tarutium.com/about-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition hover:text-amber-200"
                  >
                    About Tarutium
                  </a>
                </li>
                <li>
                  <a
                    href="https://tarutium.com/careers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition hover:text-amber-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="https://tarutium.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition hover:text-amber-200"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="https://tarutium.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-amber-200"
                  >
                    <Globe className="h-3.5 w-3.5" /> tarutium.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <span>
              © 2024 Tarutium Global Consulting Private Limited. All rights
              reserved.
            </span>
            <span style={{ fontFamily: "var(--font-mono)" }}>
              Climatium IND · Climate Intelligence Platform
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

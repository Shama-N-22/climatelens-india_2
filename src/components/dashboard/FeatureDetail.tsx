// File: src/components/dashboard/FeatureDetail.tsx
// Two parts:
//  - FeatureDetail: the always-visible INLINE box beside the KPIs (compact table
//    + a "Read more" button).
//  - FeatureModal: the popup that opens when "Read more" is clicked (full view).
import { useState } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Grid3x3,
  MapPin,
  Building2,
  Droplets,
  Thermometer,
  Users,
  X,
  ExternalLink,
  Maximize2,
} from "lucide-react";

export interface SelectedFeature {
  type: "hospital" | "ward";
  props: Record<string, any>;
}

const fmtPop = (v: any) =>
  v != null && v > 0 ? Number(v).toLocaleString("en-IN") : "—";

/* ---------------- inline box (always visible) ---------------- */
export default function FeatureDetail({
  feature,
}: {
  feature: SelectedFeature | null;
}) {
  const [open, setOpen] = useState(false);

  if (!feature) {
    return (
      <div className="flex w-1/2 min-h-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
        <Grid3x3 className="mb-2 h-5 w-5 text-slate-600" />
        <p className="text-xs text-slate-500">
          Click a hospital or ward on the map to see its details here.
        </p>
      </div>
    );
  }

  const p = feature.props || {};
  const isHospital = feature.type === "hospital";

  // compact rows for the inline table
  const rows: [string, React.ReactNode][] = isHospital
    ? [
        ["Type", p.type || "—"],
        ["Emergency", p.emergency || "—"],
        [
          "Address",
          p.address ? <span className="truncate">{p.address}</span> : "—",
        ],
      ]
    : [
        ["Ward no.", p.ward_no ?? p.name ?? "—"],
        ["Population", fmtPop(p.population)],
        ["Hospitals", p.hospital_count ?? 0],
        ["Buildings", "—"],
        ["Water", "—"],
        ["Max LST", "—"],
      ];

  return (
    <>
      <div className="flex w-1/2 flex-col rounded-xl border border-white/10 bg-[#0f1a2e]/70 p-3">
        <div className="mb-2 flex items-center gap-2">
          {isHospital ? (
            <HeartPulse className="h-4 w-4 text-orange-400" />
          ) : (
            <Grid3x3 className="h-4 w-4 text-amber-300" />
          )}
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[9px] uppercase tracking-widest text-slate-400"
          >
            {isHospital ? "Healthcare facility" : `Ward ${p.ward_no ?? ""}`}
          </span>
        </div>
        <h3 className="truncate text-sm font-bold text-slate-50">
          {p.name || (isHospital ? "Facility" : "Ward")}
        </h3>

        {/* compact table */}
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-2 border-b border-white/5 py-0.5"
            >
              <span className="shrink-0 text-slate-400">{k}</span>
              <span className="truncate text-right font-semibold text-slate-100">
                {v}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-teal-400/10 px-3 py-1.5 text-xs font-medium text-teal-200 transition hover:bg-teal-400/20"
        >
          <Maximize2 className="h-3.5 w-3.5" /> Read more
        </button>
      </div>

      {open && (
        <FeatureModal feature={feature} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

/* ---------------- popup (opens on "Read more") ---------------- */
function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
        <Icon className={`h-3.5 w-3.5 ${accent ?? ""}`} /> {label}
      </div>
      <div className="text-base font-bold text-slate-50">{value}</div>
    </div>
  );
}

function FeatureModal({
  feature,
  onClose,
}: {
  feature: SelectedFeature;
  onClose: () => void;
}) {
  const p = feature.props || {};
  const isHospital = feature.type === "hospital";

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2e]/95 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ${isHospital ? "bg-orange-500/15" : "bg-amber-400/15"}`}
            >
              {isHospital ? (
                <HeartPulse className="h-5 w-5 text-orange-400" />
              ) : (
                <Grid3x3 className="h-5 w-5 text-amber-300" />
              )}
            </span>
            <div>
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] uppercase tracking-widest text-slate-400"
              >
                {isHospital ? "Healthcare facility" : `Ward ${p.ward_no ?? ""}`}
              </p>
              <h3 className="text-lg font-bold leading-tight text-slate-50">
                {p.name || (isHospital ? "Facility" : "Ward")}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {isHospital ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Stat
                  icon={HeartPulse}
                  label="Type"
                  value={p.type || "—"}
                  accent="text-orange-400"
                />
                <Stat
                  icon={Thermometer}
                  label="Emergency"
                  value={p.emergency || "—"}
                  accent="text-rose-400"
                />
              </div>
              {p.address && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                    <MapPin className="h-3.5 w-3.5" /> Address
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">
                    {p.address}
                  </p>
                </div>
              )}
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-400/10 px-4 py-2.5 text-sm font-medium text-teal-200 transition hover:bg-teal-400/20"
                >
                  <ExternalLink className="h-4 w-4" /> Visit website
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Stat
                  icon={Grid3x3}
                  label="Ward number"
                  value={p.ward_no ?? p.name ?? "—"}
                  accent="text-amber-300"
                />
                <Stat
                  icon={Users}
                  label="Population"
                  value={fmtPop(p.population)}
                  accent="text-sky-400"
                />
                <Stat
                  icon={HeartPulse}
                  label="Hospital count"
                  value={p.hospital_count ?? 0}
                  accent="text-orange-400"
                />
                <Stat icon={Building2} label="Buildings" value="—" />
                <Stat
                  icon={Droplets}
                  label="Drinking water"
                  value="—"
                  accent="text-sky-400"
                />
                <Stat
                  icon={Thermometer}
                  label="Max LST (Tmax)"
                  value="—"
                  accent="text-rose-400"
                />
                <Stat
                  icon={Grid3x3}
                  label="Zone"
                  value={p.zone || "—"}
                  accent="text-amber-300"
                />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Buildings, drinking-water and max-LST fill in as those datasets
                are added.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

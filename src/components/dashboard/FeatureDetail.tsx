// File: src/components/dashboard/FeatureDetail.tsx
// Exports:
//   FeatureModal  - popup that opens immediately when a ward/hospital is clicked
//   FeaturePanel  - card in the RIGHT panel (above AI Insight) that keeps showing
//                   the selection after the popup is closed
import { motion } from "framer-motion";
import {
  HeartPulse, Grid3x3, MapPin, Building2, Droplets, Thermometer, Users, X, ExternalLink, Maximize2,
} from "lucide-react";

export interface SelectedFeature {
  type: "hospital" | "ward";
  props: Record<string, any>;
}

const fmtPop = (v: any) => (v != null && v > 0 ? Number(v).toLocaleString("en-IN") : "—");

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wide text-slate-400">
        <Icon className={`h-3.5 w-3.5 ${accent ?? ""}`} /> {label}
      </div>
      <div className="truncate text-sm font-bold text-slate-50">{value}</div>
    </div>
  );
}

/* ---------------- RIGHT PANEL CARD ---------------- */
export function FeaturePanel({
  feature,
  onExpand,
  onClose,
}: {
  feature: SelectedFeature;
  onExpand: () => void;
  onClose: () => void;
}) {
  const p = feature.props || {};
  const isHospital = feature.type === "hospital";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isHospital ? <HeartPulse className="h-4 w-4 text-orange-400" /> : <Grid3x3 className="h-4 w-4 text-amber-300" />}
          <div>
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] uppercase tracking-widest text-slate-400">
              {isHospital ? "Healthcare facility" : `Ward ${p.ward_no ?? ""}`}
            </p>
            <h3 className="text-sm font-bold leading-tight text-slate-50">
              {p.name || (isHospital ? "Facility" : "Ward")}
            </h3>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 transition hover:text-slate-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isHospital ? (
          <>
            <Stat icon={HeartPulse} label="Type" value={p.type || "—"} accent="text-orange-400" />
            <Stat icon={Thermometer} label="Emergency" value={p.emergency || "—"} accent="text-rose-400" />
            <div className="col-span-2">
              <Stat icon={MapPin} label="Address" value={p.address || "—"} />
            </div>
          </>
        ) : (
          <>
            <Stat icon={Users} label="Population" value={fmtPop(p.population)} accent="text-sky-400" />
            <Stat icon={HeartPulse} label="Hospitals" value={p.hospital_count ?? 0} accent="text-orange-400" />
            <Stat icon={Building2} label="Buildings" value="—" />
            <Stat icon={Droplets} label="Drinking water" value="—" accent="text-sky-400" />
            <Stat icon={Thermometer} label="Max LST" value="—" accent="text-rose-400" />
            <Stat icon={Grid3x3} label="Zone" value={p.zone || "—"} accent="text-amber-300" />
          </>
        )}
      </div>

      <button
        onClick={onExpand}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-400/10 px-3 py-2 text-xs font-medium text-teal-200 transition hover:bg-teal-400/20"
      >
        <Maximize2 className="h-3.5 w-3.5" /> Read more
      </button>
    </div>
  );
}

/* ---------------- POPUP ---------------- */
export function FeatureModal({ feature, onClose }: { feature: SelectedFeature; onClose: () => void }) {
  const p = feature.props || {};
  const isHospital = feature.type === "hospital";

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2e]/95 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${isHospital ? "bg-orange-500/15" : "bg-amber-400/15"}`}>
              {isHospital ? <HeartPulse className="h-5 w-5 text-orange-400" /> : <Grid3x3 className="h-5 w-5 text-amber-300" />}
            </span>
            <div>
              <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] uppercase tracking-widest text-slate-400">
                {isHospital ? "Healthcare facility" : `Ward ${p.ward_no ?? ""}`}
              </p>
              <h3 className="text-lg font-bold leading-tight text-slate-50">{p.name || (isHospital ? "Facility" : "Ward")}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-5">
          {isHospital ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Stat icon={HeartPulse} label="Type" value={p.type || "—"} accent="text-orange-400" />
                <Stat icon={Thermometer} label="Emergency" value={p.emergency || "—"} accent="text-rose-400" />
              </div>
              {p.address && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                    <MapPin className="h-3.5 w-3.5" /> Address
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">{p.address}</p>
                </div>
              )}
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-400/10 px-4 py-2.5 text-sm font-medium text-teal-200 transition hover:bg-teal-400/20">
                  <ExternalLink className="h-4 w-4" /> Visit website
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Stat icon={Grid3x3} label="Ward number" value={p.ward_no ?? p.name ?? "—"} accent="text-amber-300" />
                <Stat icon={Users} label="Population" value={fmtPop(p.population)} accent="text-sky-400" />
                <Stat icon={HeartPulse} label="Hospital count" value={p.hospital_count ?? 0} accent="text-orange-400" />
                <Stat icon={Building2} label="Number of buildings" value="—" />
                <Stat icon={Droplets} label="Drinking water facility" value="—" accent="text-sky-400" />
                <Stat icon={Thermometer} label="Max temperature (LST)" value="—" accent="text-rose-400" />
                <div className="col-span-2">
                  <Stat icon={Grid3x3} label="Zone" value={p.zone || "—"} accent="text-amber-300" />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Buildings, drinking-water and max-LST fill in as those datasets are added.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
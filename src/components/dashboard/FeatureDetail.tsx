// File: src/components/dashboard/FeatureDetail.tsx
// Clicking a hospital or ward opens a readable popup modal with all its details.
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
} from "lucide-react";

export interface SelectedFeature {
  type: "hospital" | "ward";
  props: Record<string, any>;
}

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

export default function FeatureDetail({
  feature,
  onClose,
}: {
  feature: SelectedFeature | null;
  onClose: () => void;
}) {
  if (!feature) return null;
  const p = feature.props || {};

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2e] shadow-2xl"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            {feature.type === "hospital" ? (
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/15">
                <HeartPulse className="h-5 w-5 text-orange-400" />
              </span>
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/15">
                <Grid3x3 className="h-5 w-5 text-amber-300" />
              </span>
            )}
            <div>
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] uppercase tracking-widest text-slate-400"
              >
                {feature.type === "hospital"
                  ? "Healthcare facility"
                  : `Ward ${p.ward_no ?? ""}`}
              </p>
              <h3 className="text-lg font-bold leading-tight text-slate-50">
                {p.name ||
                  (feature.type === "hospital"
                    ? "Healthcare facility"
                    : "Ward")}
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

        {/* body */}
        <div className="p-5">
          {feature.type === "hospital" ? (
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
                  icon={Users}
                  label="Population"
                  accent="text-sky-400"
                  value={
                    p.population != null && p.population > 0
                      ? Number(p.population).toLocaleString("en-IN")
                      : "—"
                  }
                />
                <Stat
                  icon={HeartPulse}
                  label="Hospitals"
                  value={p.hospital_count ?? 0}
                  accent="text-orange-400"
                />
                <Stat icon={Building2} label="Buildings" value="—" />
                <Stat
                  icon={Droplets}
                  label="Water points"
                  value="—"
                  accent="text-sky-400"
                />
                <Stat
                  icon={Thermometer}
                  label="Max LST"
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
                Buildings, water points and max-LST fill in as those datasets
                are added.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

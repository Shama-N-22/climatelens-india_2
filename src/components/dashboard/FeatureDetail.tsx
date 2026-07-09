// File: src/components/dashboard/FeatureDetail.tsx
// Details for a clicked hospital or ward, shown beside the KPIs. Content is
// clipped inside its own box (no overflow onto other panels); long fields get
// a "Read more" expander.
import { useState } from "react";
import { HeartPulse, Grid3x3, MapPin, Building2, Droplets, Thermometer, Users, X } from "lucide-react";

export interface SelectedFeature {
  type: "hospital" | "ward";
  props: Record<string, any>;
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2">
      <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="truncate text-right text-xs font-semibold text-slate-100">{value}</span>
    </div>
  );
}

export default function FeatureDetail({
  feature,
  onClose,
}: {
  feature: SelectedFeature | null;
  onClose?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!feature) {
    return (
      <div className="flex w-1/2 min-h-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
        <Grid3x3 className="mb-2 h-5 w-5 text-slate-600" />
        <p className="text-xs text-slate-500">Click a hospital or ward on the map to see its details here.</p>
      </div>
    );
  }

  const p = feature.props || {};

  return (
    <div className="relative flex max-h-[220px] w-1/2 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f1a2e]/70 p-4">
      {onClose && (
        <button onClick={onClose} className="absolute right-2 top-2 text-slate-500 transition hover:text-slate-200">
          <X className="h-4 w-4" />
        </button>
      )}

      {feature.type === "hospital" ? (
        <>
          <div className="mb-2 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-orange-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
              Healthcare facility
            </span>
          </div>
          <h3 className="pr-5 text-sm font-bold text-slate-50">{p.name || "Healthcare facility"}</h3>
          <div className="mt-3 space-y-1.5 overflow-y-auto pr-1">
            {p.type && <Row icon={HeartPulse} label="Type" value={p.type} />}
            {p.emergency && <Row icon={Thermometer} label="Emergency" value={p.emergency} />}
            {p.address && (
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5" /> Address
                </div>
                <p className={`text-xs text-slate-200 ${expanded ? "" : "line-clamp-2"}`}>{p.address}</p>
                {p.address.length > 60 && (
                  <button onClick={() => setExpanded((e) => !e)} className="mt-1 text-[11px] text-teal-300 hover:text-teal-200">
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
            {p.url && (
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                className="block rounded-lg bg-teal-400/10 px-3 py-2 text-xs text-teal-200 transition hover:bg-teal-400/20">
                Visit website →
              </a>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2">
            <Grid3x3 className="h-4 w-4 text-amber-300" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
              Ward {p.ward_no ?? ""}
            </span>
          </div>
          <h3 className="pr-5 text-sm font-bold text-slate-50">{p.name || "Ward"}</h3>
          <div className="mt-3 grid grid-cols-2 gap-1.5 overflow-y-auto pr-1">
            <Row icon={Users} label="Population" value={p.population != null && p.population > 0 ? Number(p.population).toLocaleString("en-IN") : "—"} />
            <Row icon={HeartPulse} label="Hospitals" value={p.hospital_count ?? 0} />
            <Row icon={Building2} label="Buildings" value="—" />
            <Row icon={Droplets} label="Water pts" value="—" />
            <Row icon={Thermometer} label="Max LST" value="—" />
            <Row icon={Grid3x3} label="Zone" value={p.zone || "—"} />
          </div>
          <p className="mt-2 shrink-0 text-[10px] text-slate-500">Buildings / water / max-LST fill in as those datasets arrive.</p>
        </>
      )}
    </div>
  );
}
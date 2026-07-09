// File: src/components/dashboard/FeatureDetail.tsx
// Shows details for a clicked hospital or ward in the panel beside the KPIs.
import {
  HeartPulse,
  Grid3x3,
  MapPin,
  Building2,
  Droplets,
  Thermometer,
  Users,
} from "lucide-react";

export interface SelectedFeature {
  type: "hospital" | "ward";
  props: Record<string, any>;
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
      <span className="flex items-center gap-2 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="text-xs font-semibold text-slate-100">{value}</span>
    </div>
  );
}

export default function FeatureDetail({
  feature,
}: {
  feature: SelectedFeature | null;
}) {
  if (!feature) {
    return (
      <div className="flex h-full min-h-[130px] w-1/2 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
        <Grid3x3 className="mb-2 h-5 w-5 text-slate-600" />
        <p className="text-xs text-slate-500">
          Click a hospital or ward on the map to see its details here.
        </p>
      </div>
    );
  }

  const p = feature.props || {};

  if (feature.type === "hospital") {
    return (
      <div className="w-1/2 rounded-xl border border-white/10 bg-[#0f1a2e]/70 p-4">
        <div className="mb-2 flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-orange-400" />
          <span
            className="text-[10px] uppercase tracking-widest text-slate-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Healthcare facility
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-50">
          {p.name || "Healthcare facility"}
        </h3>
        <div className="mt-3 space-y-1.5">
          {p.type && <Row icon={HeartPulse} label="Type" value={p.type} />}
          {p.emergency && (
            <Row icon={Thermometer} label="Emergency" value={p.emergency} />
          )}
          {p.address && (
            <Row
              icon={MapPin}
              label="Address"
              value={
                <span className="max-w-[140px] truncate text-right">
                  {p.address}
                </span>
              }
            />
          )}
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-teal-400/10 px-3 py-2 text-xs text-teal-200 transition hover:bg-teal-400/20"
            >
              Visit website →
            </a>
          )}
        </div>
      </div>
    );
  }

  // ward
  const pop =
    p.population != null && p.population > 0
      ? Number(p.population).toLocaleString("en-IN")
      : "—";
  return (
    <div className="w-1/2 rounded-xl border border-white/10 bg-[#0f1a2e]/70 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Grid3x3 className="h-4 w-4 text-amber-300" />
        <span
          className="text-[10px] uppercase tracking-widest text-slate-400"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Ward {p.ward_no ?? ""}
        </span>
      </div>
      <h3 className="text-sm font-bold text-slate-50">{p.name || "Ward"}</h3>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <Row icon={Users} label="Population" value={pop} />
        <Row
          icon={HeartPulse}
          label="Hospitals"
          value={p.hospital_count ?? 0}
        />
        <Row icon={Building2} label="Buildings" value="—" />
        <Row icon={Droplets} label="Water pts" value="—" />
        <Row icon={Thermometer} label="Max LST" value="—" />
        <Row
          icon={Grid3x3}
          label="Zone"
          value={
            <span className="max-w-[80px] truncate text-right">
              {p.zone || "—"}
            </span>
          }
        />
      </div>
      <p className="mt-2 text-[10px] text-slate-500">
        Buildings / water / max-LST fill in as those datasets arrive.
      </p>
    </div>
  );
}

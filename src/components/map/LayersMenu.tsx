// File: src/components/map/LayersMenu.tsx
// "Layers" dropdown for map overlays: Buildings, Hospitals, Ward boundaries
// (all live). Public water is pending. Multiple can be on at once.
import { useState, useRef, useEffect } from "react";
import {
  Layers,
  Building2,
  HeartPulse,
  Grid3x3,
  Droplets,
  ChevronDown,
  Check,
} from "lucide-react";

interface LayersMenuProps {
  showBuildings: boolean;
  showHospitals: boolean;
  showWards: boolean;
  onToggleBuildings: (v: boolean) => void;
  onToggleHospitals: (v: boolean) => void;
  onToggleWards: (v: boolean) => void;
  wardsLabel?: string;
}

export default function LayersMenu({
  showBuildings,
  showHospitals,
  showWards,
  onToggleBuildings,
  onToggleHospitals,
  onToggleWards,
  wardsLabel = "Ward boundaries",
}: LayersMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = [
    {
      icon: Building2,
      label: "Building footprints",
      on: showBuildings,
      toggle: onToggleBuildings,
    },
    {
      icon: HeartPulse,
      label: "Hospitals",
      on: showHospitals,
      toggle: onToggleHospitals,
    },
    { icon: Grid3x3, label: wardsLabel, on: showWards, toggle: onToggleWards },
  ];
  const activeCount = items.filter((i) => i.on).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/25"
      >
        <Layers className="h-4 w-4 text-teal-300" />
        Layers
        {activeCount > 0 && (
          <span className="rounded bg-teal-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-teal-200">
            {activeCount}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-[1200] mt-2 w-60 rounded-xl border border-white/10 bg-[#0f1a2e] p-2 shadow-2xl">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => it.toggle(!it.on)}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <it.icon className="h-4 w-4 text-slate-300" />
                {it.label}
              </span>
              <span
                className={`grid h-4 w-4 place-items-center rounded border ${it.on ? "border-teal-400 bg-teal-400 text-slate-900" : "border-white/25"}`}
              >
                {it.on && <Check className="h-3 w-3" />}
              </span>
            </button>
          ))}

          <div className="my-1 h-px bg-white/10" />

          <div className="flex cursor-not-allowed items-center justify-between rounded-lg px-2.5 py-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Droplets className="h-4 w-4" /> Public water
            </span>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
              soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

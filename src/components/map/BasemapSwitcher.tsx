// File: src/components/map/BasemapSwitcher.tsx
import { useState } from "react";
import { Layers2, Check } from "lucide-react";
import { BASEMAPS } from "../../data/basemaps";

interface BasemapSwitcherProps {
  value: string;
  onChange: (id: string) => void;
}

export default function BasemapSwitcher({ value, onChange }: BasemapSwitcherProps) {
  const [open, setOpen] = useState(false);
  const active = BASEMAPS.find((b) => b.id === value) ?? BASEMAPS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0B1220]/85 px-3 py-2
          text-[12px] font-medium text-slate-200 shadow-xl backdrop-blur-md transition
          hover:border-amber-300/40 hover:text-amber-200"
      >
        <Layers2 className="h-4 w-4 text-teal-300" />
        {active.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/10
          bg-[#0B1220]/95 p-1 shadow-2xl backdrop-blur-md">
          {BASEMAPS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                onChange(b.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[12px] transition
                ${b.id === value ? "bg-teal-400/10 text-teal-200" : "text-slate-300 hover:bg-white/5"}`}
            >
              {b.label}
              {b.id === value && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// File: src/components/dashboard/controls/OverlayControl.tsx
//
// Small glass control card: toggle the Ahmedabad flood overlay and
// drive its opacity. Lift the state up so both this control and
// <AhmedabadFloodOverlay /> read from the same source.

import { Layers, Eye, EyeOff } from 'lucide-react';

interface OverlayControlProps {
  visible: boolean;
  opacity: number; // 0..1
  onToggle: (v: boolean) => void;
  onOpacity: (v: number) => void;
}

export default function OverlayControl({
  visible,
  opacity,
  onToggle,
  onOpacity,
}: OverlayControlProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1220]/80 p-3 shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-100">
          <Layers className="h-4 w-4 text-teal-300" />
          Flood Overlay
        </span>
        <button
          onClick={() => onToggle(!visible)}
          className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[11px]
            text-slate-200 transition hover:border-amber-400/40 hover:text-amber-300"
        >
          {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {visible ? 'On' : 'Off'}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(opacity * 100)}
          disabled={!visible}
          onChange={(e) => onOpacity(Number(e.target.value) / 100)}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15
            accent-teal-400 disabled:opacity-40"
        />
        <span className="w-9 text-right font-mono text-[11px] text-slate-300">
          {Math.round(opacity * 100)}%
        </span>
      </div>
    </div>
  );
}
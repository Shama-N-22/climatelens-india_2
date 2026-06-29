// File: src/components/dashboard/MapLegend.tsx
//
// Dynamic legend. For "flood"/"ndwi" it renders the bluish Low->High ramp
// the client asked for (matching the reference hotspot-density legend);
// for other parameters it swaps to the correct ramp automatically.

import { motion, AnimatePresence } from 'framer-motion';
import { LEGEND_RAMPS, type ParamKey } from '../../data/legendRamps';

interface MapLegendProps {
  parameter: ParamKey;
  className?: string;
}

export default function MapLegend({ parameter, className = '' }: MapLegendProps) {
  const ramp = LEGEND_RAMPS[parameter];
  // high (max) at top -> low (min) at bottom, like a density legend
  const ordered = [...ramp.classes].reverse();
  const gradient = `linear-gradient(to bottom, ${ordered
    .map((c) => c.color)
    .join(', ')})`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={parameter}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`pointer-events-auto select-none rounded-xl border border-white/10
          bg-[#0B1220]/80 px-3 py-3 shadow-2xl backdrop-blur-md ${className}`}
      >
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="font-[var(--font-display,'Space_Grotesk')] text-[11px] font-semibold uppercase tracking-wider text-slate-100">
            {ramp.title}
          </span>
          {ramp.unit && (
            <span className="font-mono text-[10px] text-teal-300/80">{ramp.unit}</span>
          )}
        </div>

        <div className="flex items-stretch gap-2">
          {/* continuous gradient bar */}
          <div className="flex flex-col items-center">
            <div
              className="h-28 w-3 rounded-full ring-1 ring-white/15"
              style={{ background: gradient }}
            />
          </div>

          {/* High / Low end labels */}
          <div className="flex flex-col justify-between py-0.5">
            <span className="font-mono text-[10px] font-medium text-slate-200">High</span>
            <span className="font-mono text-[10px] font-medium text-slate-400">Low</span>
          </div>

          {/* classified swatches */}
          <div className="ml-1 flex flex-col justify-between">
            {ordered.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-[3px] ring-1 ring-white/10"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-[10px] leading-none text-slate-300">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
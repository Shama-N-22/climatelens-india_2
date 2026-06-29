// File: src/components/analytics/TimelineScrubber.tsx
import { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { YEARS } from "../../data/timeSeries";

interface TimelineScrubberProps {
  year: number;
  onYear: (y: number) => void;
  playing: boolean;
  onPlaying: (p: boolean) => void;
}

export default function TimelineScrubber({ year, onYear, playing, onPlaying }: TimelineScrubberProps) {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timer.current) window.clearInterval(timer.current);
      return;
    }
    timer.current = window.setInterval(() => {
      onYear((() => {
        const idx = YEARS.indexOf(year);
        const next = YEARS[(idx + 1) % YEARS.length];
        return next;
      })());
    }, 1100);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
    // re-arm whenever year changes so it steps forward
  }, [playing, year, onYear]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1a2e]/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span style={{ fontFamily: "var(--font-mono)" }} className="text-[11px] uppercase tracking-widest text-slate-400">
          Timeline
        </span>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-amber-300">
            {year}
          </span>
          <button
            onClick={() => onPlaying(!playing)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:border-amber-300/40 hover:text-amber-200"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={YEARS.length - 1}
        value={YEARS.indexOf(year)}
        onChange={(e) => onYear(YEARS[Number(e.target.value)])}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-amber-400"
      />
      <div className="mt-2 flex justify-between">
        {YEARS.map((y) => (
          <button
            key={y}
            onClick={() => onYear(y)}
            className={`font-mono text-[10px] transition ${
              y === year ? "font-semibold text-amber-300" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
// File: src/components/map/TimelineSelector.tsx
// Year + month dropdowns for the top bar.
import { Calendar } from "lucide-react";
import { TIMELINE_YEARS, TIMELINE_MONTHS } from "../../data/geeTimeline";

interface TimelineSelectorProps {
  year: number;
  month: number;
  onYear: (y: number) => void;
  onMonth: (m: number) => void;
}

export default function TimelineSelector({
  year,
  month,
  onYear,
  onMonth,
}: TimelineSelectorProps) {
  const selectClass =
    "cursor-pointer rounded-md border border-white/10 bg-[#0b1220] px-2 py-1 text-sm text-slate-200 outline-none transition focus:ring-1 focus:ring-amber-400/40";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
      <Calendar className="h-4 w-4 shrink-0 text-amber-300" />
      <select
        value={year}
        onChange={(e) => onYear(Number(e.target.value))}
        className={selectClass}
      >
        {TIMELINE_YEARS.map((y) => (
          <option key={y} value={y} className="bg-[#0b1220]">
            {y}
          </option>
        ))}
      </select>
      <select
        value={month}
        onChange={(e) => onMonth(Number(e.target.value))}
        className={selectClass}
      >
        {TIMELINE_MONTHS.map((m) => (
          <option key={m.num} value={m.num} className="bg-[#0b1220]">
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}

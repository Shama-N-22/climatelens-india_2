// File: src/components/analytics/ExportBar.tsx
import { Download, Printer } from "lucide-react";
import { toCsvRows } from "../../data/timeSeries";
import { getCity } from "../../data/cityData";

interface ExportBarProps {
  cityId: string;
  year: number;
}

export default function ExportBar({ cityId, year }: ExportBarProps) {
  const city = getCity(cityId);

  const downloadCsv = () => {
    const rows = toCsvRows(cityId, year);
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const body = rows.map((r) => headers.map((h) => (r as Record<string, unknown>)[h]).join(","));
    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `climatelens_${city.name.toLowerCase()}_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print dialog -> user can "Save as PDF" (zero dependencies)
  const printReport = () => window.print();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={downloadCsv}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-slate-200 transition hover:border-teal-300/40 hover:text-teal-200"
      >
        <Download className="h-4 w-4" /> CSV
      </button>
      <button
        onClick={printReport}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-slate-200 transition hover:border-amber-300/40 hover:text-amber-200"
      >
        <Printer className="h-4 w-4" /> Print / PDF
      </button>
    </div>
  );
}
// File: src/data/geeTimeline.ts
// Timeline config for the year/month selector. URLs now come from the backend,
// so there is no URL table here anymore.

export const TIMELINE_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

// Summer season only (Feb–May), per Prathyu.
export const TIMELINE_MONTHS = [
  { num: 2, label: "Feb" },
  { num: 3, label: "Mar" },
  { num: 4, label: "Apr" },
  { num: 5, label: "May" },
];

export function monthLabel(month: number): string {
  return TIMELINE_MONTHS.find((m) => m.num === month)?.label ?? String(month);
}

export const DEFAULT_TIMELINE = { year: 2025, month: 5 };

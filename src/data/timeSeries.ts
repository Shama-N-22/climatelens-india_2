// File: src/data/timeSeries.ts
//
// Deterministic synthetic time series per city. Values are stable across
// reloads (seeded), differ per city, and carry a realistic monsoon shape.
// Drives the charts and the 2020–2026 timeline.

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export interface MonthlyPoint {
  month: string;
  rainfall: number;
  temp: number;
  aqi: number;
  floodProb: number;
  vegetation: number;
}

export interface YearlyPoint {
  year: number;
  rainfall: number;
  floodProb: number;
  aqi: number;
  vegetation: number;
}

interface Profile {
  // 12 monthly multipliers / bases
  rainBase: number[]; // mm
  tempBase: number[]; // °C
  aqiBase: number;
  vegBase: number; // %
  floodSensitivity: number; // how strongly rain -> flood prob
}

const PROFILES: Record<string, Profile> = {
  ahmedabad: {
    rainBase: [2, 1, 1, 2, 6, 95, 260, 240, 130, 22, 6, 2],
    tempBase: [27, 30, 35, 40, 42, 39, 33, 32, 33, 36, 32, 28],
    aqiBase: 165,
    vegBase: 27,
    floodSensitivity: 0.34,
  },
  mumbai: {
    rainBase: [1, 1, 1, 2, 12, 520, 840, 620, 340, 90, 18, 4],
    tempBase: [28, 28, 30, 32, 33, 31, 29, 29, 30, 32, 32, 30],
    aqiBase: 118,
    vegBase: 34,
    floodSensitivity: 0.18,
  },
  hyderabad: {
    rainBase: [5, 7, 12, 22, 38, 110, 165, 175, 165, 95, 30, 8],
    tempBase: [28, 31, 35, 38, 39, 33, 30, 29, 29, 30, 28, 27],
    aqiBase: 96,
    vegBase: 41,
    floodSensitivity: 0.26,
  },
};

// tiny deterministic hash -> [0,1)
function rand(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function getMonthly(cityId: string, year: number): MonthlyPoint[] {
  const p = PROFILES[cityId] ?? PROFILES.ahmedabad;
  // slow year trend: warming + slightly worse AQI + slight veg loss
  const yi = year - 2020;
  return MONTHS.map((m, i) => {
    const jr = (rand(`${cityId}-${year}-r${i}`) - 0.5) * 0.3;
    const jt = (rand(`${cityId}-${year}-t${i}`) - 0.5) * 1.6;
    const ja = (rand(`${cityId}-${year}-a${i}`) - 0.5) * 24;

    const rainfall = Math.round(clamp(p.rainBase[i] * (1 + jr) * (1 + yi * 0.012), 0, 1200));
    const temp = +(p.tempBase[i] + jt + yi * 0.18).toFixed(1);
    const aqi = Math.round(clamp(p.aqiBase + ja + yi * 3 - (rainfall > 150 ? 35 : 0), 30, 320));
    const floodProb = Math.round(clamp(rainfall * p.floodSensitivity + (rand(`${cityId}-${year}-f${i}`) * 10), 0, 100));
    const vegetation = +clamp(p.vegBase - yi * 0.6 + (rainfall > 120 ? 4 : 0) + (rand(`${cityId}-${year}-v${i}`) - 0.5) * 3, 5, 70).toFixed(1);

    return { month: m, rainfall, temp, aqi, floodProb, vegetation };
  });
}

export function getYearly(cityId: string): YearlyPoint[] {
  return YEARS.map((year) => {
    const mm = getMonthly(cityId, year);
    const sum = (k: keyof MonthlyPoint) => mm.reduce((a, b) => a + (b[k] as number), 0);
    const avg = (k: keyof MonthlyPoint) => +(sum(k) / 12).toFixed(1);
    return {
      year,
      rainfall: Math.round(sum("rainfall")),
      floodProb: Math.round(avg("floodProb")),
      aqi: Math.round(avg("aqi")),
      vegetation: avg("vegetation"),
    };
  });
}

// flat rows for CSV export
export function toCsvRows(cityId: string, year: number) {
  const rows = getMonthly(cityId, year).map((m) => ({
    city: cityId,
    year,
    ...m,
  }));
  return rows;
}
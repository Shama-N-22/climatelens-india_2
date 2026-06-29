// File: src/data/legendRamps.ts
//
// Single source of truth for legend + overlay classification.
// The 6 "flood" colors below are the SAME ColorBrewer "Blues" classes
// baked into ahmedabad-flood-overlay.png, so the legend and the map
// overlay always agree (light = low / min, dark = high / max).

export type ParamKey = 'flood' | 'lst' | 'ndvi' | 'ndbi' | 'ndwi';

export interface LegendClass {
  label: string;
  color: string;
}

export interface LegendRamp {
  title: string;
  unit?: string;
  // ordered LOW (min) -> HIGH (max). The legend renders high at the top.
  classes: LegendClass[];
}

export const LEGEND_RAMPS: Record<ParamKey, LegendRamp> = {
  flood: {
    title: 'Flood Susceptibility',
    classes: [
      { label: 'Very Low', color: '#eff3ff' },
      { label: 'Low', color: '#c6dbef' },
      { label: 'Moderate', color: '#9ecae1' },
      { label: 'High', color: '#6baed6' },
      { label: 'Very High', color: '#3182bd' },
      { label: 'Critical', color: '#08519c' },
    ],
  },
  ndwi: {
    title: 'Surface Water (NDWI)',
    classes: [
      { label: 'Dry', color: '#deebf7' },
      { label: 'Low Moisture', color: '#9ecae1' },
      { label: 'Moderate', color: '#4292c6' },
      { label: 'Wet', color: '#2171b5' },
      { label: 'Water Body', color: '#08519c' },
      { label: 'Deep Water', color: '#08306b' },
    ],
  },
  lst: {
    title: 'Land Surface Temp',
    unit: '°C',
    classes: [
      { label: 'Cool', color: '#ffffcc' },
      { label: 'Mild', color: '#fed976' },
      { label: 'Warm', color: '#feb24c' },
      { label: 'Hot', color: '#fd8d3c' },
      { label: 'Very Hot', color: '#f03b20' },
      { label: 'Extreme', color: '#bd0026' },
    ],
  },
  ndvi: {
    title: 'Vegetation (NDVI)',
    classes: [
      { label: 'Barren', color: '#ffffe5' },
      { label: 'Sparse', color: '#d9f0a3' },
      { label: 'Light', color: '#addd8e' },
      { label: 'Moderate', color: '#41ab5d' },
      { label: 'Dense', color: '#238443' },
      { label: 'Very Dense', color: '#005a32' },
    ],
  },
  ndbi: {
    title: 'Built-up (NDBI)',
    classes: [
      { label: 'Open', color: '#f7f7f7' },
      { label: 'Sparse', color: '#cccccc' },
      { label: 'Low Density', color: '#969696' },
      { label: 'Medium', color: '#636363' },
      { label: 'Dense', color: '#373737' },
      { label: 'Core Urban', color: '#1a1a1a' },
    ],
  },
};
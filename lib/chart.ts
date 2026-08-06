export const CHART_W = 1000;
export const CHART_H = 260;
export const PLOT_LEFT = 30;
export const PLOT_RIGHT = 985;
export const PLOT_TOP = 10;
export const PLOT_BOTTOM = 220;

export function yFor(value: number, max: number) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return PLOT_BOTTOM - ratio * (PLOT_BOTTOM - PLOT_TOP);
}

export function xPositions(count: number) {
  const usable = PLOT_RIGHT - PLOT_LEFT;
  const step = usable / count;
  return Array.from({ length: count }, (_, i) => PLOT_LEFT + step * i + step / 2);
}

export function niceMax(max: number) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const normalized = max / magnitude;
  let niced;
  if (normalized <= 1) niced = 1;
  else if (normalized <= 2) niced = 2;
  else if (normalized <= 4) niced = 4;
  else if (normalized <= 5) niced = 5;
  else niced = 10;
  return niced * magnitude;
}

export function gridLines(max: number, steps = 4) {
  return Array.from({ length: steps + 1 }, (_, i) => (max / steps) * i);
}

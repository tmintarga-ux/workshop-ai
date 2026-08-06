"use client";

export function Sparkline({ aktual, forecast }: { aktual: number[]; forecast: number[] }) {
  const w = 240;
  const h = 56;
  const max = Math.max(...aktual, ...forecast) * 1.1;
  const n = aktual.length;
  const step = (w - 12) / (n - 1);
  const toPoints = (arr: number[]) =>
    arr.map((v, i) => `${6 + i * step},${h - 6 - (v / max) * (h - 12)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      <polyline points={toPoints(aktual)} fill="none" stroke="var(--color-accent-2-500)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={toPoints(forecast)} fill="none" stroke="var(--color-accent-600)" strokeWidth={2.5} strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

"use client";

import { CHART_H, CHART_W, PLOT_BOTTOM, PLOT_LEFT, PLOT_RIGHT, PLOT_TOP, gridLines, niceMax, xPositions, yFor } from "@/lib/chart";

export type ForecastPoint = { label: string; actual: number | null; forecast: number | null };

function fmtAxisTon(v: number) {
  if (v === 0) return "0";
  return `${Math.round(v / 1000)}rb`;
}

export function ForecastChart({ points }: { points: ForecastPoint[] }) {
  const maxVal = niceMax(Math.max(...points.map((p) => Math.max(p.actual ?? 0, p.forecast ?? 0))) * 1.12);
  const grid = gridLines(maxVal);
  const xs = xPositions(points.length);

  const actualPts = points
    .map((p, i) => (p.actual != null ? { x: xs[i], y: yFor(p.actual, maxVal) } : null))
    .filter(Boolean) as { x: number; y: number }[];

  const forecastIdxs = points.map((p, i) => (p.forecast != null ? i : -1)).filter((i) => i !== -1);
  const forecastPts = forecastIdxs.map((i) => ({ x: xs[i], y: yFor(points[i].forecast as number, maxVal) }));

  const bandTop = forecastIdxs.map((i) => ({ x: xs[i], y: yFor((points[i].forecast as number) * 1.08, maxVal) }));
  const bandBottom = forecastIdxs.map((i) => ({ x: xs[i], y: yFor((points[i].forecast as number) * 0.92, maxVal) }));
  const bandPolygon = [...bandTop, ...[...bandBottom].reverse()].map((p) => `${p.x},${p.y}`).join(" ");

  const forecastStartX = forecastIdxs.length ? xs[forecastIdxs[0]] : null;

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} style={{ width: "100%", flex: 1 }} preserveAspectRatio="none">
      <g stroke="var(--chart-grid)" strokeWidth={1}>
        {grid.map((g) => (
          <line key={g} x1={PLOT_LEFT} y1={yFor(g, maxVal)} x2={PLOT_RIGHT} y2={yFor(g, maxVal)} />
        ))}
      </g>
      <g fill="var(--chart-axis-label)" fontSize="11" fontFamily="Figtree">
        {grid.map((g) => (
          <text key={g} x={0} y={yFor(g, maxVal) + 4}>
            {fmtAxisTon(g)}
          </text>
        ))}
      </g>

      {forecastStartX != null && (
        <rect x={forecastStartX} y={PLOT_TOP} width={PLOT_RIGHT - forecastStartX} height={PLOT_BOTTOM - PLOT_TOP} fill="var(--color-neutral-200)" opacity={0.6} />
      )}

      {bandPolygon && <polygon points={bandPolygon} fill="var(--color-accent-300)" opacity={0.35} />}

      <polyline
        points={actualPts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="var(--color-accent-2-600)"
        strokeWidth={3.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={forecastPts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="var(--color-accent-600)"
        strokeWidth={3.5}
        strokeDasharray="9 7"
        strokeLinecap="round"
      />

      <g fill="var(--color-accent-2-600)">
        {actualPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === actualPts.length - 1 ? 5 : 4} />
        ))}
      </g>

      {forecastStartX != null && (
        <>
          <line x1={forecastStartX} y1={PLOT_TOP} x2={forecastStartX} y2={PLOT_BOTTOM} stroke="var(--color-neutral-500)" strokeWidth={1.5} strokeDasharray="4 4" />
          <text x={forecastStartX + 12} y={24} fill="var(--chart-tick-label)" fontSize="12" fontFamily="Figtree" fontWeight={700}>
            mulai proyeksi
          </text>
        </>
      )}

      <g fill="var(--chart-tick-label)" fontSize="11.5" fontFamily="Figtree" textAnchor="middle">
        {points.map((p, i) => (
          <text key={p.label + i} x={xs[i]} y={240}>
            {p.label}
          </text>
        ))}
      </g>

      <text x={30} y={256} fill="var(--chart-axis-label)" fontSize="11" fontFamily="Figtree">
        Sumbu Y: Ton TBS · tidak dipotong
      </text>
    </svg>
  );
}

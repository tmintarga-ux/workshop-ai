"use client";

import type { BulanTrend } from "@/lib/data";
import { CHART_H, CHART_W, PLOT_BOTTOM, PLOT_LEFT, PLOT_RIGHT, gridLines, niceMax, xPositions, yFor } from "@/lib/chart";
import { fmtInt } from "@/lib/format";

function fmtAxisTon(v: number) {
  if (v === 0) return "0";
  return `${Math.round(v / 1000)}rb`;
}

export function TrendChart({ data }: { data: BulanTrend[] }) {
  const maxVal = niceMax(Math.max(...data.map((d) => Math.max(d.budget, d.forecast ?? 0, d.aktual ?? 0))) * 1.05);
  const grid = gridLines(maxVal);
  const xs = xPositions(data.length);
  const barWidth = ((PLOT_RIGHT - PLOT_LEFT) / data.length) * 0.42;

  const budgetPoints = data.map((d, i) => `${xs[i]},${yFor(d.budget, maxVal)}`).join(" ");

  const forecastPts = data
    .map((d, i) => (d.forecast != null ? `${xs[i]},${yFor(d.forecast, maxVal)}` : null))
    .filter(Boolean) as string[];

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

      {data.map((d, i) =>
        d.aktual != null ? (
          <rect
            key={`a-${i}`}
            x={xs[i] - barWidth / 2}
            y={yFor(d.aktual, maxVal)}
            width={barWidth}
            height={PLOT_BOTTOM - yFor(d.aktual, maxVal)}
            rx={4}
            fill="var(--color-accent-2-500)"
          />
        ) : (
          <rect
            key={`f-${i}`}
            x={xs[i] - barWidth / 2}
            y={yFor(d.forecast ?? 0, maxVal)}
            width={barWidth}
            height={PLOT_BOTTOM - yFor(d.forecast ?? 0, maxVal)}
            rx={4}
            fill="var(--color-neutral-300)"
          />
        )
      )}

      <polyline points={budgetPoints} fill="none" stroke="var(--color-accent-600)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={forecastPts.join(" ")} fill="none" stroke="var(--color-neutral-600)" strokeWidth={3} strokeDasharray="8 7" strokeLinecap="round" />

      <g fill="var(--chart-tick-label)" fontSize="11.5" fontFamily="Figtree" textAnchor="middle">
        {data.map((d, i) => (
          <text key={d.bulan} x={xs[i]} y={240}>
            {d.bulan}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function trendLegendLabel(v: number) {
  return fmtInt(v);
}

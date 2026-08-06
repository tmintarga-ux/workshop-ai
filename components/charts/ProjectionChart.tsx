"use client";

import { CHART_H, CHART_W, PLOT_BOTTOM, PLOT_LEFT, PLOT_RIGHT, gridLines, niceMax, xPositions, yFor } from "@/lib/chart";
import { fmtInt } from "@/lib/format";

export function ProjectionChart({
  bulan,
  kebutuhan,
  tersedia,
}: {
  bulan: string[];
  kebutuhan: number[];
  tersedia: number[];
}) {
  const maxVal = niceMax(Math.max(...kebutuhan, ...tersedia) * 1.1);
  const grid = gridLines(maxVal);
  const xs = xPositions(bulan.length);
  const barWidth = ((PLOT_RIGHT - PLOT_LEFT) / bulan.length) * 0.42;

  const linePoints = tersedia.map((v, i) => `${xs[i]},${yFor(v, maxVal)}`).join(" ");

  // area silang: bagian bulan di mana kebutuhan > tersedia
  const crossIdx = kebutuhan.map((k, i) => k > tersedia[i]);
  let peakIdx = 0;
  let peakGap = -Infinity;
  kebutuhan.forEach((k, i) => {
    const gap = k - tersedia[i];
    if (gap > peakGap) {
      peakGap = gap;
      peakIdx = i;
    }
  });
  const hasGap = peakGap > 0;

  // polygon area mengikuti kebutuhan di atas, tersedia di bawah, dibatasi bulan yang menyilang
  const firstCross = crossIdx.indexOf(true);
  const lastCross = crossIdx.lastIndexOf(true);
  let areaPoints = "";
  if (firstCross !== -1) {
    const top = [];
    for (let i = firstCross; i <= lastCross; i++) top.push(`${xs[i]},${yFor(kebutuhan[i], maxVal)}`);
    const bottom = [];
    for (let i = lastCross; i >= firstCross; i--) bottom.push(`${xs[i]},${yFor(tersedia[i], maxVal)}`);
    areaPoints = [...top, ...bottom].join(" ");
  }

  const labelY = yFor(kebutuhan[peakIdx], maxVal) + (yFor(tersedia[peakIdx], maxVal) - yFor(kebutuhan[peakIdx], maxVal)) / 2;
  const labelX = xs[peakIdx];

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} style={{ width: "100%", flex: 1 }} preserveAspectRatio="none">
      <defs>
        <pattern id="hatch-kec" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="var(--color-hatch)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--color-red)" strokeWidth="2.5" />
        </pattern>
      </defs>
      <g stroke="var(--chart-grid)" strokeWidth={1}>
        {grid.map((g) => (
          <line key={g} x1={PLOT_LEFT} y1={yFor(g, maxVal)} x2={PLOT_RIGHT} y2={yFor(g, maxVal)} />
        ))}
      </g>
      <g fill="var(--chart-axis-label)" fontSize="11" fontFamily="Figtree">
        {grid.map((g) => (
          <text key={g} x={0} y={yFor(g, maxVal) + 4}>
            {fmtInt(g)}
          </text>
        ))}
      </g>

      {kebutuhan.map((v, i) => (
        <rect
          key={i}
          x={xs[i] - barWidth / 2}
          y={yFor(v, maxVal)}
          width={barWidth}
          height={PLOT_BOTTOM - yFor(v, maxVal)}
          rx={4}
          fill="var(--color-accent-2-500)"
        />
      ))}

      {areaPoints && <polygon points={areaPoints} fill="url(#hatch-kec)" opacity={0.85} />}

      <polyline points={linePoints} fill="none" stroke="var(--color-accent-600)" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />

      <g fill="var(--chart-tick-label)" fontSize="11.5" fontFamily="Figtree" textAnchor="middle">
        {bulan.map((b, i) => (
          <text key={b} x={xs[i]} y={240}>
            {b}
          </text>
        ))}
      </g>

      {hasGap && (
        <>
          <rect x={labelX - 165} y={labelY - 15} width={330} height={30} rx={15} fill="var(--color-red)" />
          <text x={labelX} y={labelY + 5} fill="#ffffff" fontSize="15" fontFamily="Figtree" fontWeight={700} textAnchor="middle">
            panen puncak — kurang {fmtInt(peakGap)} orang ({bulan[peakIdx]})
          </text>
        </>
      )}

      <text x={30} y={256} fill="var(--chart-axis-label)" fontSize="11" fontFamily="Figtree">
        Sumbu Y: orang · tidak dipotong
      </text>
    </svg>
  );
}
